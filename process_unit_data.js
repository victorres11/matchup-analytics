const fs = require('fs');
const path = require('path');

// Position grouping function
function getPositionGroup(position) {
    const pos = position.toUpperCase();
    
    // Defense (check first to avoid conflicts with offensive positions)
    if (pos.includes('DRT') || pos.includes('DLT') || pos.includes('DLE') || pos.includes('DRE') || 
        pos.includes('DE') || pos.includes('RE') || pos.includes('LE') || pos.includes('NT') || pos.includes('DT')) return 'defensive_line';
    if (pos.includes('LB') || pos.includes('LINEBACKER') || pos.includes('RLB') || pos.includes('MLB') || 
        pos.includes('ROLB') || pos.includes('LOLB')) return 'linebackers';
    if (pos.includes('DB') || pos.includes('CB') || pos.includes('S') || pos.includes('SAFETY') || 
        pos.includes('CORNER') || pos.includes('FS') || pos.includes('SS')) return 'defensive_backs';
    
    // Offense
    if (pos.includes('WR') || pos.includes('RECEIVER')) return 'wide_receivers';
    if (pos.includes('TE') || pos.includes('TIGHT')) return 'tight_ends';
    if (pos.includes('RB') || pos.includes('HB') || pos.includes('FB') || pos.includes('RUNNING') || pos.includes('BACK')) return 'running_backs';
    if (pos.includes('OL') || pos.includes('TACKLE') || pos.includes('GUARD') || pos.includes('CENTER') || 
        pos.includes('LT') || pos.includes('RT') || pos.includes('LG') || pos.includes('RG') || pos.includes('C')) return 'offensive_line';
    if (pos.includes('QB') || pos.includes('QUARTERBACK')) return 'quarterbacks';
    
    // Special Teams
    if (pos.includes('K') || pos.includes('KICKER')) return 'kickers';
    if (pos.includes('P') || pos.includes('PUNTER')) return 'punters';
    if (pos.includes('LS') || pos.includes('LONG SNAPPER')) return 'long_snappers';
    if (pos.includes('ST') || pos.includes('SPECIAL')) return 'special_teams';
    
    return 'other';
}

// Process team data from unit-based CSV files
function processTeamData(teamName) {
    console.log(`Processing ${teamName} data...`);
    
    const teamDir = path.join(__dirname, 'team_data', teamName);
    
    // Read offense data
    const offenseFile = path.join(teamDir, `${teamName}_offense_final.csv`);
    const defenseFile = path.join(teamDir, `${teamName}_defense_final.csv`);
    const stFile = path.join(teamDir, `${teamName}_special_teams_season.csv`);
    const kickingFile = path.join(teamDir, `${teamName}_kicking_specialists.csv`);
    const summaryFile = path.join(teamDir, `${teamName}_summary_final.csv`);
    
    // For converted teams, use the original team name in file names
    let actualTeamName = teamName;
    if (teamName.endsWith('_new')) {
        actualTeamName = teamName.replace('_new', '');
    }
    
    // Try different file naming conventions
    let actualOffenseFile = path.join(teamDir, `${actualTeamName}_offense_final.csv`);
    let actualDefenseFile = path.join(teamDir, `${actualTeamName}_defense_final.csv`);
    let actualStFile = path.join(teamDir, `${actualTeamName}_special_teams_season.csv`);
    let actualKickingFile = path.join(teamDir, `${actualTeamName}_kicking_specialists.csv`);
    let actualSummaryFile = path.join(teamDir, `${actualTeamName}_summary_final.csv`);
    
    // If _final files don't exist, try without _final
    if (!fs.existsSync(actualOffenseFile)) {
        actualOffenseFile = path.join(teamDir, `${actualTeamName}_offense.csv`);
    }
    if (!fs.existsSync(actualDefenseFile)) {
        actualDefenseFile = path.join(teamDir, `${actualTeamName}_defense.csv`);
    }
    if (!fs.existsSync(actualStFile)) {
        actualStFile = path.join(teamDir, `${actualTeamName}_special_teams_final.csv`);
    }
    if (!fs.existsSync(actualStFile)) {
        actualStFile = path.join(teamDir, `${actualTeamName}_special_teams.csv`);
    }
    if (!fs.existsSync(actualSummaryFile)) {
        actualSummaryFile = path.join(teamDir, `${actualTeamName}_summary.csv`);
    }
    
    if (!fs.existsSync(actualOffenseFile)) {
        console.log(`❌ Offense file not found: ${actualOffenseFile}`);
        return null;
    }
    
    const offenseContent = fs.readFileSync(actualOffenseFile, 'utf8');
    const offenseLines = offenseContent.trim().split('\n');
    const offenseHeaders = offenseLines[0].split(',');
    
    // Extract week numbers from headers
    const weeks = [];
    for (let i = 4; i < offenseHeaders.length; i += 2) { // Skip Player, #, S, POS
        const header = offenseHeaders[i];
        if (header.startsWith('Week') && header.includes('_Snaps')) {
            const weekNum = parseInt(header.replace('Week', '').replace('_Snaps', ''));
            weeks.push(weekNum);
        }
    }
    
    console.log(`Found ${weeks.length} weeks: ${weeks.join(', ')}`);
    
    // Process offense data
    const offenseData = {};
    for (let i = 1; i < offenseLines.length; i++) {
        const line = offenseLines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const player = {
            name: values[0],
            jersey: values[1],
            position: values[3], // Position is in 4th column (index 3)
            weeks: {}
        };
        
        // Parse week data
        for (let w = 0; w < weeks.length; w++) {
            const weekNum = weeks[w];
            const snapsIndex = 4 + (w * 2); // Week data starts at column 5 (index 4)
            const startedIndex = 5 + (w * 2);
            
            const snaps = values[snapsIndex] ? parseInt(values[snapsIndex]) : 0;
            const started = values[startedIndex] === 'true';
            
            // Always include the week data, even if 0 snaps
            player.weeks[weekNum] = {
                snaps: snaps,
                started: started
            };
        }
        
        const positionGroup = getPositionGroup(player.position);
        if (!offenseData[positionGroup]) {
            offenseData[positionGroup] = [];
        }
        offenseData[positionGroup].push(player);
    }
    
    // Process defense data
    const defenseData = {};
    if (fs.existsSync(actualDefenseFile)) {
        const defenseContent = fs.readFileSync(actualDefenseFile, 'utf8');
        const defenseLines = defenseContent.trim().split('\n');
        
        for (let i = 1; i < defenseLines.length; i++) {
            const line = defenseLines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            const player = {
                name: values[0],
                jersey: values[1],
                position: values[3], // Position is in 4th column (index 3)
                weeks: {}
            };
            
            // Parse week data
            for (let w = 0; w < weeks.length; w++) {
                const weekNum = weeks[w];
                const snapsIndex = 4 + (w * 2); // Week data starts at column 5 (index 4)
                const startedIndex = 5 + (w * 2);
                
                const snaps = values[snapsIndex] ? parseInt(values[snapsIndex]) : 0;
                const started = values[startedIndex] === 'true';
                
            // Always include the week data, even if 0 snaps
            player.weeks[weekNum] = {
                snaps: snaps,
                started: started
            };
            }
            
            const positionGroup = getPositionGroup(player.position);
            if (!defenseData[positionGroup]) {
                defenseData[positionGroup] = [];
            }
            defenseData[positionGroup].push(player);
        }
    }
    
    // Process special teams data (aggregate totals from season CSV)
    const specialTeamsData = {};
    if (fs.existsSync(actualStFile)) {
        const stContent = fs.readFileSync(actualStFile, 'utf8');
        const stLines = stContent.trim().split('\n');
        
        for (let i = 1; i < stLines.length; i++) {
            const line = stLines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            const player = {
                name: values[0],
                jersey: values[1],
                position: values[2], // Position is in 3rd column (index 2)
                totals: {
                    kret: values[5] ? parseInt(values[5]) : 0, // Season_KRET
                    kcov: values[6] ? parseInt(values[6]) : 0, // Season_KCOV
                    pret: values[7] ? parseInt(values[7]) : 0, // Season_PRET
                    pcov: values[8] ? parseInt(values[8]) : 0, // Season_PCOV
                    fgblk: values[9] ? parseInt(values[9]) : 0, // Season_FGBLK
                    fgk: values[10] ? parseInt(values[10]) : 0  // Season_FGK
                },
                returnerInfo: {
                    kickReturns: values[11] ? parseInt(values[11]) : 0, // Season_KRETURNS
                    kickReturnYards: values[12] ? parseInt(values[12]) : 0, // Season_KRETURN_YARDS
                    kickReturnYPA: values[13] ? parseFloat(values[13]) : 0.0, // Season_KRETURN_YPA
                    puntReturns: values[14] ? parseInt(values[14]) : 0, // Season_PRETURNS
                    puntReturnYards: values[15] ? parseInt(values[15]) : 0, // Season_PRETURN_YARDS
                    puntReturnYPA: values[16] ? parseFloat(values[16]) : 0.0, // Season_PRETURN_YPA
                    isKRReturner: (values[11] ? parseInt(values[11]) : 0) > 0,
                    isPRReturner: (values[14] ? parseInt(values[14]) : 0) > 0
                }
            };
            
            // For special teams, group all players under 'special_teams' regardless of their regular position
            const positionGroup = 'special_teams';
            if (!specialTeamsData[positionGroup]) {
                specialTeamsData[positionGroup] = [];
            }
            specialTeamsData[positionGroup].push(player);
        }
    }
    
    // Process kicking specialists data
    const kickingSpecialistsData = [];
    if (fs.existsSync(actualKickingFile)) {
        const kickingContent = fs.readFileSync(actualKickingFile, 'utf8');
        const kickingLines = kickingContent.trim().split('\n');
        
        for (let i = 1; i < kickingLines.length; i++) {
            const line = kickingLines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            const specialist = {
                category: values[0],
                jersey: values[1],
                playerName: values[2],
                attempts: values[3] ? parseInt(values[3]) : 0,
                returns: values[4] ? parseInt(values[4]) : 0,
                yards: values[5] ? parseInt(values[5]) : 0,
                ypa: values[6] ? parseFloat(values[6]) : 0.0,
                td: values[7] ? parseInt(values[7]) : 0
            };
            
            kickingSpecialistsData.push(specialist);
        }
    }
    
    // Process summary data
    const summaryData = [];
    if (fs.existsSync(actualSummaryFile)) {
        const summaryContent = fs.readFileSync(actualSummaryFile, 'utf8');
        const summaryLines = summaryContent.trim().split('\n');
        
        for (let i = 1; i < summaryLines.length; i++) {
            const line = summaryLines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            if (values.length >= 9) {
                summaryData.push({
                    week: parseInt(values[0]),
                    opponent: values[1],
                    date: values[2],
                    final_score_team: values[3],
                    final_score_opponent: values[4],
                    home_away: values[5],
                    offense_snaps: parseInt(values[6]) || 0,
                    defense_snaps: parseInt(values[7]) || 0,
                    special_teams_snaps: parseInt(values[8]) || 0
                });
            }
        }
    }
    
    // Create the final data structure
    const teamData = {
        team: teamName,
        weeks: weeks.map(weekNum => {
            const weekData = {
                week: weekNum,
                offense: {},
                defense: {},
                special_teams: {}
            };
            
            // Populate offense data for this week
            Object.keys(offenseData).forEach(positionGroup => {
                weekData.offense[positionGroup] = offenseData[positionGroup]
                    .map(player => ({
                        name: player.name,
                        jersey: player.jersey,
                        position: player.position,
                        snaps: player.weeks[weekNum] ? player.weeks[weekNum].snaps : 0,
                        started: player.weeks[weekNum] ? player.weeks[weekNum].started : false
                    }));
            });
            
            // Populate defense data for this week
            Object.keys(defenseData).forEach(positionGroup => {
                weekData.defense[positionGroup] = defenseData[positionGroup]
                    .map(player => ({
                        name: player.name,
                        jersey: player.jersey,
                        position: player.position,
                        snaps: player.weeks[weekNum] ? player.weeks[weekNum].snaps : 0,
                        started: player.weeks[weekNum] ? player.weeks[weekNum].started : false
                    }));
            });
            
            return weekData;
        }),
        // Special teams data as aggregate totals (not week-specific)
        special_teams: Object.keys(specialTeamsData).reduce((acc, positionGroup) => {
            acc[positionGroup] = specialTeamsData[positionGroup].map(player => ({
                name: player.name,
                jersey: player.jersey,
                position: player.position,
                ...player.totals,
                returnerInfo: player.returnerInfo
            }));
            return acc;
        }, {}),
        // Kicking specialists data
        kicking_specialists: kickingSpecialistsData,
        summary: summaryData,
        metadata: {
            weeks: weeks.length,
            last_updated: new Date().toISOString()
        }
    };
    
    // Write the JSON file
    const outputFile = path.join(__dirname, `${teamName}_multiweek.json`);
    fs.writeFileSync(outputFile, JSON.stringify(teamData, null, 2));
    
    console.log(`✅ Processed ${teamName}: ${weeks.length} weeks, ${Object.keys(offenseData).length} offense groups, ${Object.keys(defenseData).length} defense groups, ${Object.keys(specialTeamsData).length} special teams groups`);
    
    return teamData;
}

// Process all teams
const teams = [
    { folder: 'minnesota_new', output: 'minnesota' },
    { folder: 'rutgers_new', output: 'rutgers' },
    { folder: 'washington', output: 'washington' },
    { folder: 'maryland', output: 'maryland' }
];

teams.forEach(({ folder, output }) => {
    try {
        const teamData = processTeamData(folder);
        if (teamData) {
            // Rename the output file
            const oldFile = path.join(__dirname, `${folder}_multiweek.json`);
            const newFile = path.join(__dirname, `${output}_multiweek.json`);
            if (fs.existsSync(oldFile)) {
                fs.renameSync(oldFile, newFile);
                console.log(`📁 Renamed ${folder}_multiweek.json to ${output}_multiweek.json`);
            }
        }
    } catch (error) {
        console.error(`❌ Error processing ${folder}:`, error.message);
    }
});

console.log('🎉 All teams processed!');
