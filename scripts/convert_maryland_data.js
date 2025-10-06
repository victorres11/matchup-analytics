const fs = require('fs');
const path = require('path');

// Helper function to parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
    }
    
    return data;
}

// Convert player data (offense/defense) to weekly format
function convertPlayerData(csvData, side) {
    const weeks = [];
    const weekNumbers = [1, 2, 3, 4, 5]; // Updated to include Week 5
    
    weekNumbers.forEach(weekNum => {
        const weekData = {
            week: weekNum,
            [side]: {}
        };
        
        // Group players by position
        const positionGroups = {};
        
        csvData.forEach(player => {
            const position = player.POS;
            const positionGroup = getPositionGroup(position, side);
            
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
                    snaps: snaps,
                    started: started
                });
            }
        });
        
        weekData[side] = positionGroups;
        weeks.push(weekData);
    });
    
    return weeks;
}

// Get position group from position
function getPositionGroup(position, side) {
    if (side === 'offense') {
        if (position.includes('QB')) return 'quarterbacks';
        if (position.includes('RB') || position.includes('HB') || position.includes('FB')) return 'running_backs';
        if (position.includes('WR')) return 'wide_receivers';
        if (position.includes('TE')) return 'tight_ends';
        if (position.includes('OL') || position.includes('C') || position.includes('G') || position.includes('T')) return 'offensive_line';
        return 'other';
    } else {
        if (position.includes('DL') || position.includes('DE') || position.includes('DT') || position.includes('NT')) return 'defensive_line';
        if (position.includes('LB') || position.includes('MLB') || position.includes('OLB')) return 'linebackers';
        if (position.includes('DB') || position.includes('CB') || position.includes('S') || position.includes('FS') || position.includes('SS')) return 'defensive_backs';
        return 'other';
    }
}

// Convert summary data
function convertSummaryData(csvData) {
    return csvData.map(row => ({
        week: parseInt(row.Week),
        opponent: row.Opponent,
        date: row.Date,
        final_score_team: row.Final_Score_Team,
        final_score_opponent: row.Final_Score_Opponent,
        home_away: row.Home_Away,
        offense_snaps: parseInt(row.Offense_Snaps) || 0,
        defense_snaps: parseInt(row.Defense_Snaps) || 0,
        special_teams_snaps: parseInt(row.Special_Teams_Snaps) || 0
    }));
}

// Convert special teams season data for bar chart
function convertSpecialTeamsSeasonData(csvData) {
    const data = parseCSV(csvData);
    const specialTeams = {};
    
    data.forEach(player => {
        const playerName = player.Player;
        const jersey = player['#'].replace('D', '').replace('S', '');
        
        // Process each category that has a value > 0
        const categories = [
            { key: 'KRET', name: 'Kick_Returns' },
            { key: 'KCOV', name: 'Kick_Coverage' },
            { key: 'PRET', name: 'Punt_Returns' },
            { key: 'PCOV', name: 'Punt_Coverage' },
            { key: 'FGBLK', name: 'Field_Goal_Block' },
            { key: 'FGK', name: 'Field_Goals' }
        ];
        
        categories.forEach(category => {
            const value = parseInt(player[category.key]) || 0;
            if (value > 0) {
                if (!specialTeams[category.name]) {
                    specialTeams[category.name] = [];
                }
                
                specialTeams[category.name].push({
                    jersey: jersey,
                    playerName: playerName,
                    attempts: value
                });
            }
        });
    });
    
    return specialTeams;
}

// Convert kicking specialists data properly
function convertKickingSpecialistsData(csvData) {
    const data = parseCSV(csvData);
    const kickingSpecialists = [];
    
    data.forEach(row => {
        if (row.Player_Name && row.Category) {
            kickingSpecialists.push({
                playerName: row.Player_Name,
                jersey: row.Jersey.replace('S', ''),
                category: row.Category,
                attempts: parseInt(row.Attempts) || 0,
                returns: parseInt(row.Returns) || 0,
                yards: parseInt(row.Yards) || 0,
                ypa: parseFloat(row.YPA) || 0,
                td: parseInt(row.TDs) || 0
            });
        }
    });
    
    return kickingSpecialists;
}

// Main conversion function
async function convertMarylandData() {
    try {
        console.log('Starting Maryland data conversion...');
        
        // Read CSV files
        const offenseData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/maryland-v2/maryland_offense_updated.csv'), 'utf8');
        const defenseData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/maryland-v2/maryland_defense_updated.csv'), 'utf8');
        const specialTeamsData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/maryland-v2/maryland_kicking_specialists_complete.csv'), 'utf8');
        const specialTeamsSeasonData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/maryland-v2/maryland_special_teams_season_week5.csv'), 'utf8');
        const summaryData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/maryland-v2/maryland_summary_updated.csv'), 'utf8');
        
        console.log('CSV files read successfully');
        
        // Parse all data
        const offenseCSV = parseCSV(offenseData);
        const defenseCSV = parseCSV(defenseData);
        const specialTeamsCSV = parseCSV(specialTeamsData);
        const specialTeamsSeasonCSV = parseCSV(specialTeamsSeasonData);
        const summaryCSV = parseCSV(summaryData);

        // Convert to JSON structure
        const offenseWeeks = convertPlayerData(offenseCSV, 'offense');
        const defenseWeeks = convertPlayerData(defenseCSV, 'defense');
        const specialTeams = convertSpecialTeamsSeasonData(specialTeamsSeasonData);
        const kickingSpecialists = convertKickingSpecialistsData(specialTeamsData);
        const summary = convertSummaryData(summaryCSV);

        // Combine weeks
        const weeks = [];
        for (let i = 0; i < offenseWeeks.length; i++) {
            const week = {
                week: offenseWeeks[i].week,
                offense: offenseWeeks[i].offense,
                defense: defenseWeeks[i].defense
            };
            weeks.push(week);
        }

        // Create final JSON structure
        const marylandData = {
            team: "maryland",
            weeks: weeks,
            summary: summary,
            special_teams: specialTeams,
            kicking_specialists: kickingSpecialists
        };

        // Write to JSON file
        const outputPath = path.join(__dirname, '../data/json/maryland_multiweek.json');
        fs.writeFileSync(outputPath, JSON.stringify(marylandData, null, 2));
        
        console.log('Maryland data conversion completed successfully!');
        console.log(`Output written to: ${outputPath}`);
        console.log(`Total weeks: ${weeks.length}`);
        console.log(`Summary entries: ${summary.length}`);
        console.log(`Special teams categories: ${Object.keys(specialTeams).length}`);
        console.log(`Kicking specialists: ${kickingSpecialists.length}`);
        
    } catch (error) {
        console.error('Error converting Maryland data:', error);
    }
}

// Run the conversion
convertMarylandData();
