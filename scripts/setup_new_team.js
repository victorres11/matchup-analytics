const fs = require('fs');
const path = require('path');
const { convertTeamData } = require('./convert_team_data');
const { generateTeamPage } = require('./generate_team_page');
const teamConfigs = require('./team_config');

function setupNewTeam(teamName, teamConfig) {
    console.log(`🚀 Setting up new team: ${teamName}`);
    console.log(`📋 Team: ${teamConfig.name}`);
    console.log(`🎨 Colors: ${teamConfig.primaryColor}, ${teamConfig.secondaryColor}`);
    console.log(`🔗 Matchup: ${teamConfig.matchupText}`);
    
    // 1. Add team configuration
    teamConfigs[teamName] = teamConfig;
    
    // 2. Create data directory structure
    const dataDir = path.join(__dirname, `../data/csv/team_data/${teamName}`);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log(`✓ Created data directory: ${dataDir}`);
    } else {
        console.log(`✓ Data directory already exists: ${dataDir}`);
    }
    
    // 3. Create CSV file templates
    const csvTemplates = [
        'offense.csv',
        'defense.csv', 
        'kicking_specialists.csv',
        'special_teams_season.csv',
        'summary.csv'
    ];
    
    console.log(`📄 Creating CSV templates...`);
    csvTemplates.forEach(template => {
        const templatePath = path.join(__dirname, `../templates/${template}`);
        const outputPath = path.join(dataDir, `${teamName}_${template}`);
        
        if (fs.existsSync(templatePath)) {
            fs.copyFileSync(templatePath, outputPath);
            console.log(`  ✓ Created: ${outputPath}`);
        } else {
            // Create basic template
            const basicTemplate = createBasicCSVTemplate(template);
            fs.writeFileSync(outputPath, basicTemplate);
            console.log(`  ✓ Created basic template: ${outputPath}`);
        }
    });
    
    // 4. Create roster template
    const rosterTemplate = {
        "roster": [
            {"number": 1, "name": "Example Player", "class": "Fr.", "height": "6-0", "weight": 200, "hometown": "Example, ST"}
        ]
    };
    const rosterPath = path.join(dataDir, `${teamName}_number_roster.json`);
    fs.writeFileSync(rosterPath, JSON.stringify(rosterTemplate, null, 2));
    console.log(`  ✓ Created roster template: ${rosterPath}`);
    
    // 5. Generate team page
    console.log(`📄 Generating team page...`);
    generateTeamPage(teamName);
    
    // 6. Update main index.html
    console.log(`🔗 Updating main index...`);
    updateMainIndex(teamName, teamConfig);
    
    console.log(`\n✅ Team setup complete!`);
    console.log(`\n📁 Next steps:`);
    console.log(`   1. Add your CSV data files to: ${dataDir}`);
    console.log(`   2. Add team logo to: assets/images/${teamConfig.logoPath}`);
    console.log(`   3. Update roster data in: ${rosterPath}`);
    console.log(`   4. Run: node scripts/convert_team_data.js ${teamName}`);
    console.log(`   5. Test: http://localhost:8001/pages/${teamName}.html`);
}

function createBasicCSVTemplate(templateType) {
    const templates = {
        'offense.csv': 'Player,#,S,POS,Week1_Snaps,Week1_Started,Week2_Snaps,Week2_Started,Week3_Snaps,Week3_Started,Week4_Snaps,Week4_Started,Week5_Snaps,Week5_Started\nExample Player,1,*,QB,0,false,0,false,0,false,0,false,0,false',
        'defense.csv': 'Player,#,S,POS,Week1_Snaps,Week1_Started,Week2_Snaps,Week2_Started,Week3_Snaps,Week3_Started,Week4_Snaps,Week4_Started,Week5_Snaps,Week5_Started\nExample Player,D01,*,SS,0,FALSE,0,FALSE,0,FALSE,0,FALSE,0,FALSE',
        'kicking_specialists.csv': 'Player,Unit,Attempts\nExample Player,Kickoff,0',
        'special_teams_season.csv': 'Player,Unit,Attempts\nExample Player,Kickoff,0',
        'summary.csv': 'Week,Opponent,Date,Final_Score_Team,Final_Score_Opponent,Home_Away,Offense_Snaps,Defense_Snaps\n1,Example Team,MM/DD/YYYY,0,0,Home,0,0'
    };
    return templates[templateType] || '';
}

function updateMainIndex(teamName, config) {
    const indexPath = path.join(__dirname, '../index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add team link to index
    const teamLink = `
    <div class="team-card">
        <a href="pages/${teamName}.html">
            <img src="assets/images/${config.logoPath}" alt="${config.name}">
            <h3>${config.name}</h3>
        </a>
    </div>`;
    
    // Insert before closing teams grid
    indexContent = indexContent.replace(
        '</div>\s*<!-- Teams Grid -->',
        `${teamLink}\n    </div>\n    <!-- Teams Grid -->`
    );
    
    fs.writeFileSync(indexPath, indexContent);
    console.log(`  ✓ Updated main index.html with ${config.name}`);
}

// Command line usage
if (require.main === module) {
    const teamName = process.argv[2];
    const primaryColor = process.argv[3] || '#d32f2f';
    const secondaryColor = process.argv[4] || '#ffffff';
    const matchupTeam = process.argv[5] || 'nebraska';
    
    if (!teamName) {
        console.error('Usage: node setup_new_team.js <team_name> [primary_color] [secondary_color] [matchup_team]');
        console.error('Example: node setup_new_team.js michigan "#00274C" "#FFCB05" "ohio-state"');
        process.exit(1);
    }
    
    const teamConfig = {
        name: teamName.charAt(0).toUpperCase() + teamName.slice(1),
        shortName: teamName,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        logoPath: `${teamName}_logo.png`,
        matchupTeam: matchupTeam,
        matchupText: `View ${matchupTeam.charAt(0).toUpperCase() + matchupTeam.slice(1)}`,
        dataFiles: {
            offense: `${teamName}_offense.csv`,
            defense: `${teamName}_defense.csv`,
            kicking: `${teamName}_kicking_specialists.csv`,
            specialTeams: `${teamName}_special_teams_season.csv`,
            summary: `${teamName}_summary.csv`,
            roster: `${teamName}_number_roster.json`
        }
    };
    
    setupNewTeam(teamName, teamConfig);
}

module.exports = { setupNewTeam };
