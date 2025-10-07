const fs = require('fs');
const path = require('path');
const teamConfigs = require('./team_config');

function generateTeamPage(teamName) {
    const config = teamConfigs[teamName];
    if (!config) {
        throw new Error(`Team configuration not found: ${teamName}`);
    }

    console.log(`Generating page for ${config.name}...`);

    // Read Nebraska template
    const templatePath = path.join(__dirname, '../pages/nebraska.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders
    const pageContent = template
        .replace(/Nebraska Cornhuskers/g, config.name)
        .replace(/nebraska/g, config.shortName)
        .replace(/#d32f2f/g, config.primaryColor)
        .replace(/#ffffff/g, config.secondaryColor)
        .replace(/nebraska_cornhuskers_logo\.jpg/g, config.logoPath)
        .replace(/washington\.html/g, `${config.matchupTeam}.html`)
        .replace(/View Washington/g, config.matchupText)
        .replace(/nebraska_multiweek\.json/g, `${config.shortName}_multiweek.json`);
    
    // Write page
    const outputPath = path.join(__dirname, `../pages/${teamName}.html`);
    fs.writeFileSync(outputPath, pageContent);
    
    console.log(`✓ Generated team page: ${outputPath}`);
}

// Command line usage
if (require.main === module) {
    const teamName = process.argv[2];
    if (!teamName) {
        console.error('Usage: node generate_team_page.js <team_name>');
        console.error('Available teams:', Object.keys(teamConfigs).filter(t => t !== 'template'));
        process.exit(1);
    }
    generateTeamPage(teamName);
}

module.exports = { generateTeamPage };
