// Team Configuration System
const teamConfigs = {
    nebraska: {
        name: "Nebraska Cornhuskers",
        shortName: "nebraska",
        primaryColor: "#d32f2f",
        secondaryColor: "#ffffff", 
        logoPath: "nebraska_cornhuskers_logo.jpg",
        matchupTeam: "washington",
        matchupText: "View Washington",
        dataFiles: {
            offense: "nebraska_offense.csv",
            defense: "nebraska_defense.csv", 
            kicking: "nebraska_kicking_specialists.csv",
            specialTeams: "nebraska_special_teams_season.csv",
            summary: "nebraska_summary.csv",
            roster: "nebraska_number_roster.json"
        }
    },
    maryland: {
        name: "Maryland Terrapins",
        shortName: "maryland",
        primaryColor: "#E03A3E",
        secondaryColor: "#FFD520", 
        logoPath: "maryland_logo.png",
        matchupTeam: "nebraska",
        matchupText: "View Nebraska",
        dataFiles: {
            offense: "maryland_offense.csv",
            defense: "maryland_defense.csv", 
            kicking: "maryland_kicking_specialists.csv",
            specialTeams: "maryland_special_teams_season.csv",
            summary: "maryland_summary.csv",
            roster: "maryland_number_roster.json"
        }
    },
    washington: {
        name: "Washington Huskies",
        shortName: "washington",
        primaryColor: "#4B2E83",
        secondaryColor: "#B7A57A", 
        logoPath: "washington_logo.png",
        matchupTeam: "nebraska",
        matchupText: "View Nebraska",
        dataFiles: {
            offense: "washington_offense.csv",
            defense: "washington_defense.csv", 
            kicking: "washington_kicking_specialists.csv",
            specialTeams: "washington_special_teams_season.csv",
            summary: "washington_summary.csv",
            roster: "washington_number_roster.json"
        }
    },
    purdue: {
        name: "Purdue",
        shortName: "purdue",
        primaryColor: "#CEB888",
        secondaryColor: "#000000", 
        logoPath: "purdue_logo.png",
        matchupTeam: "nebraska",
        matchupText: "View Nebraska",
        dataFiles: {
            offense: "purdue_offense.csv",
            defense: "purdue_defense.csv", 
            kicking: "purdue_kicking_specialists.csv",
            specialTeams: "purdue_special_teams_season.csv",
            summary: "purdue_summary.csv",
            roster: "purdue_number_roster.json"
        }
    },
    purdue: {
        name: "Purdue",
        shortName: "purdue",
        primaryColor: "#CEB888",
        secondaryColor: "#000000", 
        logoPath: "purdue_logo.webp",
        matchupTeam: "northwestern",
        matchupText: "View Northwestern",
        dataFiles: {
            offense: "purdue_offense.csv",
            defense: "purdue_defense.csv", 
            kicking: "purdue_kicking_specialists.csv",
            specialTeams: "purdue_special_teams_season.csv",
            summary: "purdue_summary.csv",
            roster: "purdue_number_roster.json"
        }
    },
    "test-team": {
        name: "Test-team",
        shortName: "test-team",
        primaryColor: "#FF0000",
        secondaryColor: "#FFFFFF", 
        logoPath: "test-team_logo.png",
        matchupTeam: "nebraska",
        matchupText: "View Nebraska",
        dataFiles: {
            offense: "test-team_offense.csv",
            defense: "test-team_defense.csv", 
            kicking: "test-team_kicking_specialists.csv",
            specialTeams: "test-team_special_teams_season.csv",
            summary: "test-team_summary.csv",
            roster: "test-team_number_roster.json"
        }
    },
    northwestern: {
        name: "Northwestern",
        shortName: "northwestern",
        primaryColor: "#4E2A84",
        secondaryColor: "#FFFFFF", 
        logoPath: "northwestern_logo.png",
        matchupTeam: "purdue",
        matchupText: "View Purdue",
        dataFiles: {
            offense: "northwestern_offense.csv",
            defense: "northwestern_defense.csv", 
            kicking: "northwestern_kicking_specialists.csv",
            specialTeams: "northwestern_special_teams_season.csv",
            summary: "northwestern_summary.csv",
            roster: "northwestern_number_roster.json"
        }
    },
    oregon: {
        name: "Oregon Ducks",
        shortName: "oregon",
        primaryColor: "#154733",
        secondaryColor: "#FEE11A", 
        logoPath: "oregon_logo.png",
        matchupTeam: "washington",
        matchupText: "View Washington",
        dataFiles: {
            offense: "oregon_offense.csv",
            defense: "oregon_defense.csv", 
            kicking: "oregon_kicking_specialists.csv",
            specialTeams: "oregon_special_teams_season.csv",
            summary: "oregon_summary.csv",
            roster: "oregon_roster.json"
        }
    },
    // Template for new teams
    template: {
        name: "{Team Name}",
        shortName: "{team_name}",
        primaryColor: "#{primary_color}",
        secondaryColor: "#{secondary_color}",
        logoPath: "{team_name}_logo.png",
        matchupTeam: "{opponent_team}",
        matchupText: "View {Opponent Team}",
        dataFiles: {
            offense: "{team_name}_offense.csv",
            defense: "{team_name}_defense.csv",
            kicking: "{team_name}_kicking_specialists.csv", 
            specialTeams: "{team_name}_special_teams_season.csv",
            summary: "{team_name}_summary.csv",
            roster: "{team_name}_number_roster.json"
        }
    }
};

module.exports = teamConfigs;
