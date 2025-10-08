const fs = require('fs');
const path = require('path');
const teamConfigs = require('./team_config');

function generateTeamPage(teamName) {
    const config = teamConfigs[teamName];
    if (!config) {
        throw new Error(`Team configuration not found: ${teamName}`);
    }

    console.log(`Generating page for ${config.name}...`);

    // Read team template
    const templatePath = path.join(__dirname, '../templates/team_page_template.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders
    const pageContent = template
        .replace(/{TEAM_NAME}/g, config.name)
        .replace(/{team_name}/g, config.shortName)
        .replace(/{primary_color}/g, config.primaryColor)
        .replace(/{secondary_color}/g, config.secondaryColor)
        .replace(/{logo_path}/g, config.logoPath)
        .replace(/{matchup_team}/g, config.matchupTeam)
        .replace(/{matchup_text}/g, config.matchupText);
    
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
