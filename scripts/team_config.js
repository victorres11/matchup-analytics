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
            offense: "nebraska_offense_corrected.csv",
            defense: "nebraska_2025_defense_corrected.csv", 
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
