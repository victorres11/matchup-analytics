const fs = require('fs');
const path = require('path');
const teamConfigs = require('./team_config');

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
    
    // Offense
    if (pos === 'QB') return 'quarterbacks';
    if (pos.includes('HB') || pos.includes('RB')) return 'running_backs';
    if (pos.includes('WR') || pos.includes('SLWR') || pos.includes('SRWR')) return 'wide_receivers';
    if (pos.includes('TE') || pos.includes('TEL') || pos.includes('TER')) return 'tight_ends';
    if (pos.includes('C') || pos.includes('G') || pos.includes('T') || pos.includes('LG') || pos.includes('RG') || pos.includes('LT') || pos.includes('RT')) return 'offensive_line';
    
    // Defense - Updated with specific position mappings
    if (pos.includes('DL') || pos.includes('DT') || pos.includes('DE') || pos.includes('NT') || pos === 'DRT' || pos === 'DLT' || pos.includes('DLE') || pos.includes('DRE')) return 'defensive_line';
    if (pos.includes('LB') || pos.includes('MLB') || pos.includes('WLB') || pos === 'ROLB' || pos === 'LOLB') return 'linebackers';
    if (pos.includes('CB') || pos.includes('S') || pos.includes('FS') || pos.includes('SS') || pos === 'RCB' || pos === 'LCB' || pos === 'SCB') return 'defensive_backs';
    
    return 'other';
}

// Convert player data
function convertPlayerData(csvData, side, teamName, rosterData) {
    const weeks = [];
    const weekNumbers = [1, 2, 3, 4, 5];
    
    weekNumbers.forEach(weekNum => {
        const weekData = {
            week: weekNum,
            [side]: {}
        };
        
        // Group players by position
        const positionGroups = {};
        
        csvData.forEach(player => {
            const position = player.POS;
            const positionGroup = getPositionGroup(position);
            
            if (!positionGroups[positionGroup]) {
                positionGroups[positionGroup] = [];
            }
            
            const snaps = parseInt(player[`Week${weekNum}_Snaps`]) || 0;
            const started = player[`Week${weekNum}_Started`] === 'true';
            
            if (snaps > 0 || started) {
                positionGroups[positionGroup].push({
                    name: player.Player,
                    jersey: player['#'],
                    position: position,
                    year: getPlayerYear(player.Player, player['#'], rosterData),
                    snaps: snaps,
                    started: started
                });
            }
        });
        
        // Add position groups to week data
        Object.keys(positionGroups).forEach(group => {
            if (positionGroups[group].length > 0) {
                weekData[side][group] = positionGroups[group];
            }
        });
        
        weeks.push(weekData);
    });
    
    return weeks;
}

// Convert summary data
function convertSummaryData(csvData) {
    return csvData.map(row => ({
        week: parseInt(row.Week),
        opponent: row.Opponent,
        date: row.Date,
        final_score_team: parseInt(row.Final_Score_Team) || 0,
        final_score_opponent: parseInt(row.Final_Score_Opponent) || 0,
        home_away: row.Home_Away,
        offense_snaps: parseInt(row.Offense_Snaps) || 0,
        defense_snaps: parseInt(row.Defense_Snaps) || 0
    }));
}

// Convert special teams data
function convertSpecialTeamsData(csvData) {
    const specialTeams = {};
    const kickingSpecialists = [];
    
    csvData.forEach(row => {
        const playerName = row.Player;
        const unit = row.Unit;
        const attempts = parseInt(row.Attempts) || 0;
        
        if (!specialTeams[unit]) {
            specialTeams[unit] = [];
        }
        
        if (attempts > 0) {
            specialTeams[unit].push({
                playerName: playerName,
                attempts: attempts
            });
        }
        
        // Add to kicking specialists if they have attempts
        if (attempts > 0) {
            kickingSpecialists.push({
                playerName: playerName,
                unit: unit,
                attempts: attempts
            });
        }
    });
    
    return { specialTeams, kickingSpecialists };
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
        const { specialTeams, kickingSpecialists } = convertSpecialTeamsData(specialTeamsSeasonCSV);

        // Combine weeks data
        const weeks = [];
        for (let i = 0; i < 5; i++) {
            const weekData = {
                week: i + 1,
                offense: offenseWeeks[i].offense,
                defense: defenseWeeks[i].defense
            };
            weeks.push(weekData);
        }

        // Create final data structure
        const teamData = {
            team: teamName,
            weeks: weeks,
            summary: summary,
            special_teams: specialTeams,
            kicking_specialists: kickingSpecialists
        };

        // Write to JSON file
        const outputPath = path.join(outputDir, `${teamName}_multiweek.json`);
        fs.writeFileSync(outputPath, JSON.stringify(teamData, null, 2));
        
        console.log(`${config.name} data converted successfully!`);
        console.log(`Output: ${outputPath}`);
        console.log(`Weeks: ${weeks.length}`);
        console.log(`Summary entries: ${summary.length}`);
        console.log(`Special teams categories: ${Object.keys(specialTeams).length}`);
        console.log(`Kicking specialists entries: ${kickingSpecialists.length}`);
        
    } catch (error) {
        console.error(`Error converting ${config.name} data:`, error.message);
        throw error;
    }
}

// Command line usage
if (require.main === module) {
    const teamName = process.argv[2];
    if (!teamName) {
        console.error('Usage: node convert_team_data.js <team_name>');
        console.error('Available teams:', Object.keys(teamConfigs).filter(t => t !== 'template'));
        process.exit(1);
    }
    convertTeamData(teamName);
}

module.exports = { convertTeamData };
