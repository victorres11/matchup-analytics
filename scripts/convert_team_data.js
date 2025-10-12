const fs = require('fs');
const path = require('path');
const teamConfigs = require('./team_config');

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            data.push(row);
        }
    }
    
    return data;
}

// Convert position to position group
function getPositionGroup(position) {
    const pos = position.toUpperCase();
    
    // Position group mappings
    const positionGroups = {
        // Offense
        qb: ['QB'],
        rb: ['HB', 'RB', 'FB'],
        wr: ['WR', 'SLWR', 'SRWR', 'LWR', 'RWR'],
        te: ['TE', 'TEL', 'TER'],
        ol: ['C', 'LG', 'RG', 'LT', 'RT', 'T', 'G'],
        
        // Defense
        dl: ['DRT', 'DLT', 'DRE', 'DLE', 'NT', 'DT', 'DE', 'DI', 'ED'],
        lb: ['LOLB', 'ROLB', 'MLB', 'WLB', 'LB'],
        db: ['SCB', 'RCB', 'LCB', 'SS', 'FS', 'S', 'CB', 'DB']
    };
    
    // Find the position group
    for (const [group, positions] of Object.entries(positionGroups)) {
        if (positions.includes(pos)) {
            return group;
        }
    }
    
    return 'unknown';
}

// Function to get player year from roster
function getPlayerYear(playerName, jerseyNumber, rosterData) {
    if (!rosterData) return 'Unknown';
    
    // Handle defensive players with D prefix (e.g., D08 -> 8)
    let cleanJerseyNumber = jerseyNumber;
    if (jerseyNumber.startsWith('D')) {
        cleanJerseyNumber = jerseyNumber.substring(1);
    }
    
    const player = rosterData.roster.find(p => 
        p.name === playerName && p.number === parseInt(cleanJerseyNumber)
    );
    return player ? player.class : 'Unknown';
}

// Convert player data (offense/defense)
function convertPlayerData(csvData, side, teamName, rosterData) {
    const weeks = [];
    
    // Get week columns dynamically
    const weekColumns = Object.keys(csvData[0] || {}).filter(key => 
        key.includes('Week') && (key.includes('_Snaps') || key.includes('_Started'))
    );
    
    const weekNumbers = [...new Set(weekColumns.map(col => 
        col.match(/Week(\d+)/)?.[1]
    ).filter(Boolean))].map(Number).sort((a, b) => a - b);
    
    weekNumbers.forEach(weekNum => {
        const weekData = {
            offense: {},
            defense: {}
        };
        
        const positionGroups = {
            quarterbacks: [],
            running_backs: [],
            wide_receivers: [],
            tight_ends: [],
            offensive_line: [],
            defensive_line: [],
            linebackers: [],
            defensive_backs: []
        };
        
        csvData.forEach(player => {
            const snaps = parseInt(player[`Week${weekNum}_Snaps`]) || 0;
            const started = player[`Week${weekNum}_Started`] === 'true' || player[`Week${weekNum}_Started`] === 'TRUE';
            const position = player.POS;
            const positionGroup = getPositionGroup(position);
            
            const playerData = {
                name: player.Player,
                jersey: player['#'],
                position: position,
                year: getPlayerYear(player.Player, player['#'], rosterData),
                snaps: snaps,
                started: started
            };
            
            // Categorize by side and position group
            if (side === 'offense') {
                const groupMap = {
                    qb: 'quarterbacks',
                    rb: 'running_backs',
                    wr: 'wide_receivers',
                    te: 'tight_ends',
                    ol: 'offensive_line'
                };
                const groupName = groupMap[positionGroup] || 'unknown';
                if (!positionGroups[groupName]) positionGroups[groupName] = [];
                positionGroups[groupName].push(playerData);
            } else {
                const groupMap = {
                    dl: 'defensive_line',
                    lb: 'linebackers',
                    db: 'defensive_backs'
                };
                const groupName = groupMap[positionGroup] || 'unknown';
                if (!positionGroups[groupName]) positionGroups[groupName] = [];
                positionGroups[groupName].push(playerData);
            }
        });
        
        weekData[side] = positionGroups;
        weekData.week = weekNum; // Store the week number
        weeks.push(weekData);
    });
    
    return weeks;
}

// Convert summary data
function convertSummaryData(csvData) {
    return csvData.map(row => ({
        week: parseInt(row.Week) || 0,
        opponent: row.Opponent || '',
        date: row.Date || '',
        final_score_team: parseInt(row.Final_Score_Team) || 0,
        final_score_opponent: parseInt(row.Final_Score_Opponent) || 0,
        home_away: row.Home_Away || '',
        offense_snaps: parseInt(row.Offense_Snaps) || 0,
        defense_snaps: parseInt(row.Defense_Snaps) || 0
    }));
}

// Convert special teams data
function convertSpecialTeamsData(csvData) {
    const specialTeams = {};
    const kickingSpecialists = [];
    
    // Column mappings for complex special teams format
    const columnMappings = {
        'KRET': 'Kick_Returns',
        'KCOV': 'Kick_Coverage',
        'PRET': 'Punt_Returns',
        'PCOV': 'Punt_Coverage',
        'FGBLK': 'Field_Goal_Block',
        'FGK': 'Field_Goals'
    };
    
    csvData.forEach(row => {
        const playerName = row.Player;
        const jersey = row['#'] || row.jersey || '';
        
        // Process each special teams activity column
        Object.keys(columnMappings).forEach(column => {
            const attempts = parseInt(row[column]) || 0;
            const category = columnMappings[column];
            
            if (attempts > 0) {
                // Initialize category if it doesn't exist
                if (!specialTeams[category]) {
                    specialTeams[category] = [];
                }
                
                // Add player to special teams category
                specialTeams[category].push({
                    jersey: jersey,
                    playerName: playerName,
                    attempts: attempts
                });
                
                // Add to kicking specialists for return activities
                if (column === 'KRET' || column === 'PRET') {
                    kickingSpecialists.push({
                        jersey: jersey,
                        playerName: playerName,
                        category: category,
                        returns: attempts,
                        yards: 0 // Yards data not available in this format
                    });
                }
            }
        });
    });
    
    return { specialTeams, kickingSpecialists };
}

// Convert simple kicking specialists data (for aggregate tables)
function convertKickingSpecialistsData(csvData) {
    const kickingSpecialists = [];
    
    csvData.forEach(row => {
        const category = row.Category;
        const jersey = row.Jersey;
        const playerName = row.Player_Name;
        const attempts = parseInt(row.Attempts) || 0;
        const returns = parseInt(row.Returns) || 0;
        const yards = parseInt(row.Yards) || 0;
        const ypa = parseFloat(row.YPA) || 0;
        const tds = parseInt(row.TDs) || 0;
        
        if (attempts > 0 || returns > 0) {
            kickingSpecialists.push({
                category: category,
                jersey: jersey,
                playerName: playerName,
                attempts: attempts,
                returns: returns,
                yards: yards,
                ypa: ypa,
                td: tds
            });
        }
    });
    
    return kickingSpecialists;
}

// Calculate total snaps from player data
function calculateTotalSnaps(summary, offenseWeeks, defenseWeeks) {
    return summary.map(summaryWeek => {
        // If summary already has non-zero snaps, use those
        if (summaryWeek.offense_snaps > 0 || summaryWeek.defense_snaps > 0) {
            return summaryWeek;
        }
        
        // Calculate from player data
        const offenseWeek = offenseWeeks.find(w => w.week === summaryWeek.week);
        const defenseWeek = defenseWeeks.find(w => w.week === summaryWeek.week);
        
        let totalOffenseSnaps = 0;
        let totalDefenseSnaps = 0;
        
        if (offenseWeek && offenseWeek.offense) {
            Object.values(offenseWeek.offense).forEach(positionGroup => {
                if (Array.isArray(positionGroup)) {
                    positionGroup.forEach(player => {
                        totalOffenseSnaps += player.snaps || 0;
                    });
                }
            });
        }
        
        if (defenseWeek && defenseWeek.defense) {
            Object.values(defenseWeek.defense).forEach(positionGroup => {
                if (Array.isArray(positionGroup)) {
                    positionGroup.forEach(player => {
                        totalDefenseSnaps += player.snaps || 0;
                    });
                }
            });
        }
        
        return {
            ...summaryWeek,
            offense_snaps: totalOffenseSnaps,
            defense_snaps: totalDefenseSnaps
        };
    });
}

// Main conversion function
function convertTeamData(teamName) {
    const config = teamConfigs[teamName];
    if (!config) {
        throw new Error(`Team configuration not found: ${teamName}`);
    }

    const dataDir = path.join(__dirname, `../data/csv/team_data/${teamName}`);
    const outputDir = path.join(__dirname, '../data/json');
    
    console.log(`Converting data for ${config.name}...`);
    
    try {
        // Read CSV files
        const offenseData = fs.readFileSync(path.join(dataDir, config.dataFiles.offense), 'utf8');
        const defenseData = fs.readFileSync(path.join(dataDir, config.dataFiles.defense), 'utf8');
        const specialTeamsData = fs.readFileSync(path.join(dataDir, config.dataFiles.kicking), 'utf8');
        const specialTeamsSeasonData = fs.readFileSync(path.join(dataDir, config.dataFiles.specialTeams), 'utf8');
        const summaryData = fs.readFileSync(path.join(dataDir, config.dataFiles.summary), 'utf8');
        
        // Read roster data if exists
        let rosterData = null;
        try {
            rosterData = JSON.parse(fs.readFileSync(path.join(dataDir, config.dataFiles.roster), 'utf8'));
            console.log(`✓ Roster data loaded for ${config.name}`);
        } catch (e) {
            console.log(`⚠ No roster data found for ${config.name}, using CSV year data`);
        }

        // Parse CSV data
        const offenseCSV = parseCSV(offenseData);
        const defenseCSV = parseCSV(defenseData);
        const specialTeamsCSV = parseCSV(specialTeamsData);
        const specialTeamsSeasonCSV = parseCSV(specialTeamsSeasonData);
        const summaryCSV = parseCSV(summaryData);

        // Convert data
        const offenseWeeks = convertPlayerData(offenseCSV, 'offense', teamName, rosterData);
        const defenseWeeks = convertPlayerData(defenseCSV, 'defense', teamName, rosterData);
        const summary = convertSummaryData(summaryCSV);
        const { specialTeams, kickingSpecialists: complexKickingSpecialists } = convertSpecialTeamsData(specialTeamsSeasonCSV);
        const simpleKickingSpecialists = convertKickingSpecialistsData(specialTeamsCSV);
        
        // Calculate total snaps from player data if summary has zeros
        const calculatedSummary = calculateTotalSnaps(summary, offenseWeeks, defenseWeeks);

        // Combine weeks data - only create weeks that exist in summary
        const weeks = [];
        const existingWeeks = new Set(calculatedSummary.map(s => s.week));
        
        // Only create weeks that exist in summary data
        Array.from(existingWeeks).sort((a, b) => a - b).forEach(weekNum => {
            // Find the correct week data by matching week numbers
            const offenseWeekData = offenseWeeks.find(w => w.week === weekNum);
            const defenseWeekData = defenseWeeks.find(w => w.week === weekNum);
            
            const weekData = {
                week: weekNum,
                offense: offenseWeekData?.offense || {},
                defense: defenseWeekData?.defense || {}
            };
            weeks.push(weekData);
        });

        // Create final data structure
        const teamData = {
            team: teamName,
            weeks: weeks,
            summary: calculatedSummary,
            special_teams: specialTeams,
            kicking_specialists: simpleKickingSpecialists, // Use simple format for aggregate tables
            complex_kicking_specialists: complexKickingSpecialists // Keep complex data for charts
        };

        // Write to JSON file
        const outputPath = path.join(outputDir, `${teamName}_multiweek.json`);
        fs.writeFileSync(outputPath, JSON.stringify(teamData, null, 2));
        
        console.log(`${config.name} data converted successfully!`);
        console.log(`Output: ${outputPath}`);
        console.log(`Weeks: ${weeks.length}`);
        console.log(`Summary entries: ${summary.length}`);
        console.log(`Special teams categories: ${Object.keys(specialTeams).length}`);
        console.log(`Simple kicking specialists entries: ${simpleKickingSpecialists.length}`);
        console.log(`Complex kicking specialists entries: ${complexKickingSpecialists.length}`);
        
    } catch (error) {
        console.error(`Error converting data for ${teamName}:`, error.message);
        throw error;
    }
}

// Command line usage
if (require.main === module) {
    const teamName = process.argv[2];
    
    if (!teamName) {
        console.error('Usage: node convert_team_data.js <team_name>');
        console.error('Example: node convert_team_data.js nebraska');
        process.exit(1);
    }
    
    try {
        convertTeamData(teamName);
    } catch (error) {
        console.error('Conversion failed:', error.message);
        process.exit(1);
    }
}

module.exports = { convertTeamData };