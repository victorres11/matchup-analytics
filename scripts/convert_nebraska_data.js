const fs = require('fs');
const path = require('path');

// Read CSV files
const offenseData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/nebraska/nebraska_offense_corrected.csv'), 'utf8');
const defenseData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/nebraska/nebraska_2025_defense_corrected.csv'), 'utf8');
const specialTeamsData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/nebraska/nebraska_kicking_specialists.csv'), 'utf8');
const specialTeamsSeasonData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/nebraska/nebraska_special_teams_season.csv'), 'utf8');
const summaryData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/nebraska/nebraska_summary.csv'), 'utf8');

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
    
    // Defense
    if (pos.includes('DL') || pos.includes('DT') || pos.includes('DE') || pos.includes('NT') || pos.includes('DRT') || pos.includes('DLE') || pos.includes('DRE') || pos.includes('DLT')) return 'defensive_line';
    if (pos.includes('LB') || pos.includes('MLB') || pos.includes('WLB') || pos.includes('ROLB') || pos.includes('LOLB')) return 'linebackers';
    if (pos.includes('CB') || pos.includes('S') || pos.includes('FS') || pos.includes('SS') || pos.includes('RCB') || pos.includes('LCB') || pos.includes('SCB')) return 'defensive_backs';
    
    return 'other';
}

// Convert player data
function convertPlayerData(csvData, side) {
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

// Convert special teams data
function convertSpecialTeamsData(csvData) {
    const specialTeams = {};
    
    csvData.forEach(row => {
        const category = row.Category;
        const jersey = row.Jersey;
        const playerName = row.Player_Name;
        
        if (!specialTeams[category]) {
            specialTeams[category] = [];
        }
        
        specialTeams[category].push({
            jersey: jersey,
            playerName: playerName,
            attempts: parseInt(row.Attempts) || 0,
            returns: parseInt(row.Returns) || 0,
            yards: parseInt(row.Yards) || 0,
            ypa: parseFloat(row.YPA) || 0,
            tds: parseInt(row.TDs) || 0
        });
    });
    
    return specialTeams;
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

// Convert special teams season data to kicking_specialists format
function convertSpecialTeamsSeasonToKickingSpecialists(csvData) {
    const data = parseCSV(csvData);
    const kickingSpecialists = [];
    
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
                kickingSpecialists.push({
                    playerName: playerName,
                    jersey: jersey,
                    category: category.name,
                    attempts: value,
                    returns: category.key.includes('RET') ? value : 0,
                    yards: 0, // Not available in this data
                    ypa: 0,   // Not available in this data
                    td: 0     // Not available in this data
                });
            }
        });
    });
    
    return kickingSpecialists;
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

// Convert summary data
function convertSummaryData(csvData) {
    return csvData.map(row => ({
        week: parseInt(row.Week),
        opponent: row.Opponent,
        date: row.Date,
        final_score_team: row.Final_Score_Team,
        final_score_opponent: row.Final_Score_Opponent,
        home_away: row.Home_Away,
        offense_snaps: parseInt(row.Offense_Snaps),
        defense_snaps: parseInt(row.Defense_Snaps),
        special_teams_snaps: parseInt(row.Special_Teams_Snaps)
    }));
}

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

// Create final JSON structure
const nebraskaData = {
    team: "nebraska",
    weeks: weeks,
    summary: summary,
    special_teams: specialTeams,
    kicking_specialists: kickingSpecialists
};

// Write to JSON file
const outputPath = path.join(__dirname, '../data/json/nebraska_multiweek.json');
fs.writeFileSync(outputPath, JSON.stringify(nebraskaData, null, 2));

console.log('Nebraska data converted successfully!');
console.log(`Output: ${outputPath}`);
console.log(`Weeks: ${weeks.length}`);
console.log(`Summary entries: ${summary.length}`);
console.log(`Special teams categories: ${Object.keys(specialTeams).length}`);
console.log(`Kicking specialists entries: ${kickingSpecialists.length}`);
