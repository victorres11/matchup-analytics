// Data processing script for multi-week team analytics
// Converts CSV data into unified JSON structure for stacked bar charts

const fs = require('fs');
const path = require('path');

// Color mapping for opposing teams
const opposingTeamColors = {
  'Buffalo': { primary: '#003366', secondary: '#FFFFFF', accent: '#FFD700' },
  'NWSTATE': { primary: '#4B0082', secondary: '#FFD700', accent: '#FFFFFF' },
  'Cal': { primary: '#003262', secondary: '#FDB515', accent: '#C4820E' },
  'Ohio': { primary: '#006633', secondary: '#FFFFFF', accent: '#FFD700' },
  'Miami OH': { primary: '#C8102E', secondary: '#FFFFFF', accent: '#FFD700' },
  'Norfolk State': { primary: '#006633', secondary: '#FFD700', accent: '#FFFFFF' },
  'Iowa': { primary: '#000000', secondary: '#FFD700', accent: '#FFFFFF' }
};

// Position grouping logic
function getPositionGroup(position) {
  const pos = position.toUpperCase();
  
  // Linebackers
  if (pos.includes('LB')) return 'linebackers';
  
  // Defensive Backs
  if (pos.includes('CB') || pos.includes('SS') || pos.includes('FS') || pos === 'S') return 'defensive_backs';
  
  // Defensive Line
  if (pos.includes('DRT') || pos.includes('DLT') || pos.includes('DE') || pos.includes('NT')) return 'defensive_line';
  
  // Offensive positions
  if (pos.includes('WR') || pos === 'LWR' || pos === 'RWR' || pos === 'SLWR' || pos === 'SRWR') return 'wide_receivers';
  if (pos.includes('TE') || pos === 'TEL' || pos === 'TER') return 'tight_ends';
  if (pos === 'QB') return 'quarterbacks';
  if (pos === 'HB' || pos === 'RB') return 'running_backs';
  if (pos.includes('OL') || pos === 'LT' || pos === 'RT' || pos === 'LG' || pos === 'RG' || pos === 'C') return 'offensive_line';
  
  return 'other';
}

// Parse CSV content
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
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

// Process team data
function processTeamData(teamName) {
  const teamDir = path.join('team_data', teamName.toLowerCase());
  const result = {
    metadata: {
      team: teamName,
      conference: 'Big Ten',
      weeks: 4,
      source: 'PFF Premium Stats'
    },
    offense: {
      wide_receivers: [],
      tight_ends: [],
      quarterbacks: [],
      running_backs: [],
      offensive_line: []
    },
    defense: {
      defensive_line: [],
      linebackers: [],
      defensive_backs: []
    },
    special_teams: {
      special_teams: []
    },
    weeks: []
  };
  
  // Process each week
  for (let week = 1; week <= 4; week++) {
    const weekData = {
      week: week,
      offense: { wide_receivers: [], tight_ends: [], quarterbacks: [], running_backs: [], offensive_line: [] },
      defense: { defensive_line: [], linebackers: [], defensive_backs: [] },
      special_teams: { special_teams: [] },
      summary: {}
    };
    
    try {
      // Read summary data
      const summaryFile = path.join(teamDir, `week${week}_summary.csv`);
      const summaryContent = fs.readFileSync(summaryFile, 'utf8');
      const summaryData = parseCSV(summaryContent)[0];
      
      weekData.summary = {
        opponent: summaryData.Opponent,
        date: summaryData.Date,
        finalScore: `${summaryData.Final_Score_Team}-${summaryData.Final_Score_Opponent}`,
        homeAway: summaryData.Home_Away,
        offensiveSnaps: parseInt(summaryData.Offense_Snaps),
        defensiveSnaps: parseInt(summaryData.Defense_Snaps),
        specialTeamsSnaps: parseInt(summaryData.Special_Teams_Snaps)
      };
      
      // Read offense data
      const offenseFile = path.join(teamDir, `week${week}_offense.csv`);
      const offenseContent = fs.readFileSync(offenseFile, 'utf8');
      const offenseData = parseCSV(offenseContent);
      
      offenseData.forEach(player => {
        const playerData = {
          name: player.Player,
          jersey: player['#'],
          position: player.POS,
          snaps: parseInt(player.TOT),
          started: player.S === '*',
          week: week,
          opponent: summaryData.Opponent
        };
        
        const positionGroup = getPositionGroup(player.POS);
        if (weekData.offense[positionGroup]) {
          weekData.offense[positionGroup].push(playerData);
        }
      });
      
      // Read defense data
      const defenseFile = path.join(teamDir, `week${week}_defense.csv`);
      const defenseContent = fs.readFileSync(defenseFile, 'utf8');
      const defenseData = parseCSV(defenseContent);
      
      defenseData.forEach(player => {
        const playerData = {
          name: player.Player,
          jersey: player['#'],
          position: player.POS,
          snaps: parseInt(player.TOT),
          started: player.S === '*',
          week: week,
          opponent: summaryData.Opponent
        };
        
        const positionGroup = getPositionGroup(player.POS);
        if (weekData.defense[positionGroup]) {
          weekData.defense[positionGroup].push(playerData);
        }
      });
      
      // Read special teams data
      const specialTeamsFile = path.join(teamDir, `week${week}_special_teams.csv`);
      const specialTeamsContent = fs.readFileSync(specialTeamsFile, 'utf8');
      const specialTeamsData = parseCSV(specialTeamsContent);
      
      specialTeamsData.forEach(player => {
        const playerData = {
          name: player.Player,
          jersey: player['#'],
          position: player.POS,
          totalSnaps: parseInt(player.TOT),
          kret: parseInt(player.KRET) || 0,
          kcov: parseInt(player.KCOV) || 0,
          pret: parseInt(player.PRET) || 0,
          pcov: parseInt(player.PCOV) || 0,
          fgblk: parseInt(player.FGBLK) || 0,
          fgk: parseInt(player.FGK) || 0,
          week: week,
          opponent: summaryData.Opponent
        };
        
        weekData.special_teams.special_teams.push(playerData);
      });
      
    } catch (error) {
      console.error(`Error processing ${teamName} Week ${week}:`, error.message);
    }
    
    result.weeks.push(weekData);
  }
  
  return result;
}

// Main processing
console.log('Processing team data...');

const minnesotaData = processTeamData('Minnesota');
const rutgersData = processTeamData('Rutgers');

// Write processed data
fs.writeFileSync('minnesota_multiweek.json', JSON.stringify(minnesotaData, null, 2));
fs.writeFileSync('rutgers_multiweek.json', JSON.stringify(rutgersData, null, 2));

console.log('Data processing complete!');
console.log('Generated files:');
console.log('- minnesota_multiweek.json');
console.log('- rutgers_multiweek.json');
