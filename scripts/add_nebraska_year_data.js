const fs = require('fs');
const path = require('path');

// Load the roster data
const rosterPath = path.join(__dirname, '../data/csv/team_data/nebraska/nebraska_number_roster.json');
const rosterData = JSON.parse(fs.readFileSync(rosterPath, 'utf8'));

// Load the game data
const gameDataPath = path.join(__dirname, '../data/json/nebraska_multiweek.json');
const gameData = JSON.parse(fs.readFileSync(gameDataPath, 'utf8'));

// Class mapping from roster format to our format
const classMapping = {
    'Fr.': 'Fr.',
    'R-Fr.': 'R-Fr.', 
    'So.': 'So.',
    'R-So.': 'R-So.',
    'Jr.': 'Jr.',
    'R-Jr.': 'R-Jr.',
    'Sr.': 'Sr.',
    'R-Sr.': 'R-Sr.',
    'Gr.': 'Gr.'
};

// Convert roster number to game data format
function convertJerseyNumber(rosterNumber) {
    return rosterNumber.toString().padStart(2, '0');
}

// Create a lookup map from roster data
const rosterLookup = new Map();
rosterData.roster.forEach(player => {
    const gameJersey = convertJerseyNumber(player.number);
    const key = `${player.name}-${gameJersey}`;
    rosterLookup.set(key, {
        name: player.name,
        jersey: gameJersey,
        year: classMapping[player.class] || 'Unknown',
        height: player.height,
        weight: player.weight,
        hometown: player.hometown
    });
});

console.log(`Created lookup for ${rosterLookup.size} players from roster`);

// Function to add year data to a player object
function addYearData(player) {
    const key = `${player.name}-${player.jersey}`;
    const rosterInfo = rosterLookup.get(key);
    
    if (rosterInfo) {
        player.year = rosterInfo.year;
        return true; // Successfully matched
    }
    
    // Try alternative matching strategies
    // 1. Try without padding (e.g., "1" instead of "01")
    const altKey = `${player.name}-${parseInt(player.jersey)}`;
    const altRosterInfo = rosterLookup.get(altKey);
    if (altRosterInfo) {
        player.year = altRosterInfo.year;
        return true;
    }
    
    // 2. Try name-only matching (in case of jersey discrepancies)
    for (const [rosterKey, rosterInfo] of rosterLookup.entries()) {
        if (rosterKey.startsWith(player.name + '-')) {
            player.year = rosterInfo.year;
            console.log(`Matched ${player.name} by name only (jersey: ${player.jersey} -> ${rosterInfo.jersey})`);
            return true;
        }
    }
    
    return false; // No match found
}

// Process all weeks and add year data
let totalPlayers = 0;
let matchedPlayers = 0;

gameData.weeks.forEach(week => {
    // Process offense
    if (week.offense) {
        Object.keys(week.offense).forEach(positionGroup => {
            if (Array.isArray(week.offense[positionGroup])) {
                week.offense[positionGroup].forEach(player => {
                    totalPlayers++;
                    if (addYearData(player)) {
                        matchedPlayers++;
                    }
                });
            }
        });
    }
    
    // Process defense
    if (week.defense) {
        Object.keys(week.defense).forEach(positionGroup => {
            if (Array.isArray(week.defense[positionGroup])) {
                week.defense[positionGroup].forEach(player => {
                    totalPlayers++;
                    if (addYearData(player)) {
                        matchedPlayers++;
                    }
                });
            }
        });
    }
});

// Process special teams if it exists
if (gameData.special_teams) {
    Object.keys(gameData.special_teams).forEach(unit => {
        if (Array.isArray(gameData.special_teams[unit])) {
            gameData.special_teams[unit].forEach(player => {
                totalPlayers++;
                if (addYearData(player)) {
                    matchedPlayers++;
                }
            });
        }
    });
}

// Process kicking specialists if it exists
if (gameData.kicking_specialists) {
    gameData.kicking_specialists.forEach(player => {
        totalPlayers++;
        if (addYearData(player)) {
            matchedPlayers++;
        }
    });
}

console.log(`\nYear Data Addition Results:`);
console.log(`Total players processed: ${totalPlayers}`);
console.log(`Successfully matched: ${matchedPlayers}`);
console.log(`Match rate: ${((matchedPlayers / totalPlayers) * 100).toFixed(1)}%`);

// Show unmatched players for debugging
const unmatchedPlayers = new Set();
gameData.weeks.forEach(week => {
    if (week.offense) {
        Object.keys(week.offense).forEach(positionGroup => {
            if (Array.isArray(week.offense[positionGroup])) {
                week.offense[positionGroup].forEach(player => {
                    if (!player.year) {
                        unmatchedPlayers.add(`${player.name} #${player.jersey}`);
                    }
                });
            }
        });
    }
    if (week.defense) {
        Object.keys(week.defense).forEach(positionGroup => {
            if (Array.isArray(week.defense[positionGroup])) {
                week.defense[positionGroup].forEach(player => {
                    if (!player.year) {
                        unmatchedPlayers.add(`${player.name} #${player.jersey}`);
                    }
                });
            }
        });
    }
});

if (unmatchedPlayers.size > 0) {
    console.log(`\nUnmatched players (${unmatchedPlayers.size}):`);
    Array.from(unmatchedPlayers).slice(0, 10).forEach(player => {
        console.log(`  - ${player}`);
    });
    if (unmatchedPlayers.size > 10) {
        console.log(`  ... and ${unmatchedPlayers.size - 10} more`);
    }
}

// Save the updated game data
fs.writeFileSync(gameDataPath, JSON.stringify(gameData, null, 2));
console.log(`\nUpdated game data saved to ${gameDataPath}`);
