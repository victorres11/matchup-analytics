const fs = require('fs');
const path = require('path');

// Position grouping function (same as before)
function getPositionGroup(position) {
    const pos = position.toUpperCase();
    
    // Offense
    if (pos.includes('WR') || pos.includes('RECEIVER')) return 'wide_receivers';
    if (pos.includes('TE') || pos.includes('TIGHT')) return 'tight_ends';
    if (pos.includes('RB') || pos.includes('HB') || pos.includes('RUNNING') || pos.includes('BACK')) return 'running_backs';
    if (pos.includes('OL') || pos.includes('TACKLE') || pos.includes('GUARD') || pos.includes('CENTER') || 
        pos.includes('LT') || pos.includes('RT') || pos.includes('LG') || pos.includes('RG') || pos.includes('C')) return 'offensive_line';
    if (pos.includes('QB') || pos.includes('QUARTERBACK')) return 'quarterbacks';
    
    // Defense
    if (pos.includes('DRT') || pos.includes('DLT') || pos.includes('DLE') || pos.includes('DRE') || 
        pos.includes('DE') || pos.includes('NT') || pos.includes('DT')) return 'defensive_line';
    if (pos.includes('LB') || pos.includes('LINEBACKER') || pos.includes('RLB') || pos.includes('MLB') || 
        pos.includes('ROLB') || pos.includes('LOLB')) return 'linebackers';
    if (pos.includes('DB') || pos.includes('CB') || pos.includes('S') || pos.includes('SAFETY') || 
        pos.includes('CORNER') || pos.includes('FS') || pos.includes('SS')) return 'defensive_backs';
    
    // Special Teams
    if (pos.includes('K') || pos.includes('KICKER')) return 'kickers';
    if (pos.includes('P') || pos.includes('PUNTER')) return 'punters';
    if (pos.includes('LS') || pos.includes('LONG SNAPPER')) return 'long_snappers';
    if (pos.includes('ST') || pos.includes('SPECIAL')) return 'special_teams';
    
    return 'other';
}

// Convert team data from old format to new format
function convertTeamData(teamName) {
    console.log(`Converting ${teamName} data...`);
    
    const teamDir = path.join(__dirname, 'team_data', teamName);
    const outputDir = path.join(__dirname, 'team_data', `${teamName}_new`);
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Read all week files
    const weeks = [];
    let weekNum = 1;
    
    while (true) {
        const offenseFile = path.join(teamDir, `week${weekNum}_offense.csv`);
        const defenseFile = path.join(teamDir, `week${weekNum}_defense.csv`);
        const stFile = path.join(teamDir, `week${weekNum}_special_teams.csv`);
        const summaryFile = path.join(teamDir, `week${weekNum}_summary.csv`);
        
        if (!fs.existsSync(offenseFile) && !fs.existsSync(defenseFile)) {
            break; // No more weeks
        }
        
        const weekData = {
            week: weekNum,
            offense: {},
            defense: {},
            special_teams: {},
            summary: null
        };
        
        // Read offense data
        if (fs.existsSync(offenseFile)) {
            const offenseContent = fs.readFileSync(offenseFile, 'utf8');
            const offenseLines = offenseContent.trim().split('\n');
            const offenseHeaders = offenseLines[0].split(',');
            
            for (let i = 1; i < offenseLines.length; i++) {
                const line = offenseLines[i].trim();
                if (!line) continue;
                
                const values = line.split(',');
                const player = {
                    name: values[0],
                    jersey: values[1],
                    started: values[2] === '*' ? 'true' : 'false',
                    position: values[3],
                    snaps: parseInt(values[4]) || 0
                };
                
                const positionGroup = getPositionGroup(player.position);
                if (!weekData.offense[positionGroup]) {
                    weekData.offense[positionGroup] = [];
                }
                weekData.offense[positionGroup].push(player);
            }
        }
        
        // Read defense data
        if (fs.existsSync(defenseFile)) {
            const defenseContent = fs.readFileSync(defenseFile, 'utf8');
            const defenseLines = defenseContent.trim().split('\n');
            
            for (let i = 1; i < defenseLines.length; i++) {
                const line = defenseLines[i].trim();
                if (!line) continue;
                
                const values = line.split(',');
                const player = {
                    name: values[0],
                    jersey: values[1],
                    started: values[2] === '*' ? 'true' : 'false',
                    position: values[3],
                    snaps: parseInt(values[4]) || 0
                };
                
                const positionGroup = getPositionGroup(player.position);
                if (!weekData.defense[positionGroup]) {
                    weekData.defense[positionGroup] = [];
                }
                weekData.defense[positionGroup].push(player);
            }
        }
        
        // Read special teams data
        if (fs.existsSync(stFile)) {
            const stContent = fs.readFileSync(stFile, 'utf8');
            const stLines = stContent.trim().split('\n');
            
            for (let i = 1; i < stLines.length; i++) {
                const line = stLines[i].trim();
                if (!line) continue;
                
                const values = line.split(',');
                const player = {
                    name: values[0],
                    jersey: values[1],
                    started: values[2] === '*' ? 'true' : 'false',
                    position: values[3],
                    kret: parseInt(values[4]) || 0,
                    kcov: parseInt(values[5]) || 0,
                    pret: parseInt(values[6]) || 0,
                    pcov: parseInt(values[7]) || 0,
                    fgblk: parseInt(values[8]) || 0,
                    fgk: parseInt(values[9]) || 0
                };
                
                const positionGroup = getPositionGroup(player.position);
                if (!weekData.special_teams[positionGroup]) {
                    weekData.special_teams[positionGroup] = [];
                }
                weekData.special_teams[positionGroup].push(player);
            }
        }
        
        // Read summary data
        if (fs.existsSync(summaryFile)) {
            const summaryContent = fs.readFileSync(summaryFile, 'utf8');
            const summaryLines = summaryContent.trim().split('\n');
            if (summaryLines.length > 1) {
                const values = summaryLines[1].split(',');
                weekData.summary = {
                    opponent: values[0],
                    date: values[1],
                    final_score_team: values[2],
                    final_score_opponent: values[3],
                    home_away: values[4],
                    offense_snaps: parseInt(values[5]) || 0,
                    defense_snaps: parseInt(values[6]) || 0,
                    special_teams_snaps: parseInt(values[7]) || 0
                };
            }
        }
        
        weeks.push(weekData);
        weekNum++;
    }
    
    // Now convert to new format
    const allPlayers = {
        offense: {},
        defense: {},
        special_teams: {}
    };
    
    // Collect all unique players across all weeks
    weeks.forEach(week => {
        // Offense players
        Object.keys(week.offense).forEach(positionGroup => {
            if (!allPlayers.offense[positionGroup]) {
                allPlayers.offense[positionGroup] = new Map();
            }
            
            week.offense[positionGroup].forEach(player => {
                const key = `${player.name}_${player.jersey}`;
                if (!allPlayers.offense[positionGroup].has(key)) {
                    allPlayers.offense[positionGroup].set(key, {
                        name: player.name,
                        jersey: player.jersey,
                        position: player.position,
                        weeks: {}
                    });
                }
                
                allPlayers.offense[positionGroup].get(key).weeks[week.week] = {
                    snaps: player.snaps,
                    started: player.started === 'true'
                };
            });
        });
        
        // Defense players
        Object.keys(week.defense).forEach(positionGroup => {
            if (!allPlayers.defense[positionGroup]) {
                allPlayers.defense[positionGroup] = new Map();
            }
            
            week.defense[positionGroup].forEach(player => {
                const key = `${player.name}_${player.jersey}`;
                if (!allPlayers.defense[positionGroup].has(key)) {
                    allPlayers.defense[positionGroup].set(key, {
                        name: player.name,
                        jersey: player.jersey,
                        position: player.position,
                        weeks: {}
                    });
                }
                
                allPlayers.defense[positionGroup].get(key).weeks[week.week] = {
                    snaps: player.snaps,
                    started: player.started === 'true'
                };
            });
        });
        
        // Special teams players
        Object.keys(week.special_teams).forEach(positionGroup => {
            if (!allPlayers.special_teams[positionGroup]) {
                allPlayers.special_teams[positionGroup] = new Map();
            }
            
            week.special_teams[positionGroup].forEach(player => {
                const key = `${player.name}_${player.jersey}`;
                if (!allPlayers.special_teams[positionGroup].has(key)) {
                    allPlayers.special_teams[positionGroup].set(key, {
                        name: player.name,
                        jersey: player.jersey,
                        position: player.position,
                        weeks: {}
                    });
                }
                
                allPlayers.special_teams[positionGroup].get(key).weeks[week.week] = {
                    kret: player.kret,
                    kcov: player.kcov,
                    pret: player.pret,
                    pcov: player.pcov,
                    fgblk: player.fgblk,
                    fgk: player.fgk,
                    started: player.started === 'true'
                };
            });
        });
    });
    
    // Generate offense CSV
    const offenseRows = ['Player,#,S,POS'];
    const maxWeeks = weeks.length;
    
    // Add week headers
    for (let w = 1; w <= maxWeeks; w++) {
        offenseRows[0] += `,Week${w}_Snaps,Week${w}_Started`;
    }
    
    Object.keys(allPlayers.offense).forEach(positionGroup => {
        allPlayers.offense[positionGroup].forEach(player => {
            let row = `${player.name},${player.jersey},${player.position}`;
            
            for (let w = 1; w <= maxWeeks; w++) {
                const weekData = player.weeks[w];
                if (weekData) {
                    row += `,${weekData.snaps},${weekData.started}`;
                } else {
                    row += `,,false`;
                }
            }
            
            offenseRows.push(row);
        });
    });
    
    // Generate defense CSV
    const defenseRows = ['Player,#,S,POS'];
    for (let w = 1; w <= maxWeeks; w++) {
        defenseRows[0] += `,Week${w}_Snaps,Week${w}_Started`;
    }
    
    Object.keys(allPlayers.defense).forEach(positionGroup => {
        allPlayers.defense[positionGroup].forEach(player => {
            let row = `${player.name},${player.jersey},${player.position}`;
            
            for (let w = 1; w <= maxWeeks; w++) {
                const weekData = player.weeks[w];
                if (weekData) {
                    row += `,${weekData.snaps},${weekData.started}`;
                } else {
                    row += `,,false`;
                }
            }
            
            defenseRows.push(row);
        });
    });
    
    // Generate special teams CSV
    const stRows = ['Player,#,S,POS'];
    for (let w = 1; w <= maxWeeks; w++) {
        stRows[0] += `,Week${w}_KRET,Week${w}_KCOV,Week${w}_PRET,Week${w}_PCOV,Week${w}_FGBLK,Week${w}_FGK`;
    }
    
    Object.keys(allPlayers.special_teams).forEach(positionGroup => {
        allPlayers.special_teams[positionGroup].forEach(player => {
            let row = `${player.name},${player.jersey},${player.position}`;
            
            for (let w = 1; w <= maxWeeks; w++) {
                const weekData = player.weeks[w];
                if (weekData) {
                    row += `,${weekData.kret},${weekData.kcov},${weekData.pret},${weekData.pcov},${weekData.fgblk},${weekData.fgk}`;
                } else {
                    row += `,0,0,0,0,0,0`;
                }
            }
            
            stRows.push(row);
        });
    });
    
    // Generate summary CSV
    const summaryRows = ['Week,Opponent,Date,Final_Score_Team,Final_Score_Opponent,Home_Away,Offense_Snaps,Defense_Snaps,Special_Teams_Snaps'];
    weeks.forEach(week => {
        if (week.summary) {
            summaryRows.push(`${week.week},${week.summary.opponent},${week.summary.date},${week.summary.final_score_team},${week.summary.final_score_opponent},${week.summary.home_away},${week.summary.offense_snaps},${week.summary.defense_snaps},${week.summary.special_teams_snaps}`);
        } else {
            summaryRows.push(`${week.week},,,,,,,,`);
        }
    });
    
    // Write files
    fs.writeFileSync(path.join(outputDir, `${teamName}_offense_final.csv`), offenseRows.join('\n'));
    fs.writeFileSync(path.join(outputDir, `${teamName}_defense_final.csv`), defenseRows.join('\n'));
    fs.writeFileSync(path.join(outputDir, `${teamName}_special_teams_final.csv`), stRows.join('\n'));
    fs.writeFileSync(path.join(outputDir, `${teamName}_summary_final.csv`), summaryRows.join('\n'));
    
    console.log(`✅ Converted ${teamName}: ${maxWeeks} weeks, ${offenseRows.length-1} offense players, ${defenseRows.length-1} defense players, ${stRows.length-1} special teams players`);
}

// Convert both teams
convertTeamData('minnesota');
convertTeamData('rutgers');

console.log('🎉 Conversion complete! Check the _new folders for converted data.');
