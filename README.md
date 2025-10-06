# Weekly Matchup Analytics

A comprehensive web application for analyzing college football snap count analytics, featuring multi-week data visualization, interactive charts, and team-specific analytics pages.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3 (for local server)
- Git

### 1. Clone and Setup
```bash
git clone https://github.com/victorres11/weekly-matchup-analytics.git
cd weekly-matchup-analytics
```

### 2. Install Dependencies
```bash
# No npm dependencies required - uses CDN for libraries
# Just ensure you have Node.js for data processing scripts
```

### 3. Run Local Server
```bash
# Start local development server
python3 -m http.server 8000

# Or if you have Python 2
python -m SimpleHTTPServer 8000

# Access at: http://localhost:8000
```

## 📁 Project Structure

```
weekly-matchup-analytics/
├── index.html                          # Main landing page
├── pages/                              # Team analytics pages
│   ├── maryland.html                   # Maryland Terrapins
│   ├── nebraska.html                   # Nebraska Cornhuskers
│   ├── minnesota.html                  # Minnesota Golden Gophers
│   ├── rutgers.html                    # Rutgers Scarlet Knights
│   ├── washington.html                 # Washington Huskies
│   ├── penn-state.html                 # Penn State Nittany Lions
│   └── fiu.html                        # FIU Panthers
├── data/                               # Data files
│   ├── json/                           # Processed JSON data
│   │   ├── maryland_multiweek.json
│   │   ├── nebraska_multiweek.json
│   │   └── ...
│   └── csv/                            # Raw CSV data
│       └── team_data/
│           ├── maryland/
│           ├── nebraska/
│           └── ...
├── assets/                             # Static assets
│   ├── images/                         # Team logos
│   └── logos/                          # Conference logos
├── scripts/                            # Data processing scripts
│   ├── convert_nebraska_data.js        # Nebraska data converter
│   ├── add_year_data.js                # Year data enricher
│   └── ...
└── README.md
```

## 🏈 Features

### Team Analytics Pages
- **Multi-week snap count visualization** with interactive charts
- **Position group analysis** (Offense, Defense, Special Teams)
- **Aggregate data tables** with sorting capabilities
- **Year filtering** for player classification (Fr., So., Jr., Sr., etc.)
- **Special teams unit filtering** with "Only" buttons
- **Weekly snap count summaries**
- **Player details** on chart interaction

### Data Visualization
- **Stacked bar charts** for snap counts by week
- **Horizontal bar charts** for special teams units
- **Color-coded position groups**
- **Interactive tooltips** with player information
- **Responsive design** for mobile and desktop

### Data Processing
- **CSV to JSON conversion** scripts
- **Player data enrichment** with year information
- **Special teams data integration**
- **Automatic data validation**

## 🔧 Adding New Teams

### 1. Prepare Data Files
Create CSV files in `data/csv/team_data/{team_name}/`:
- `{team}_offense.csv` - Offensive snap counts
- `{team}_defense.csv` - Defensive snap counts  
- `{team}_special_teams_season.csv` - Special teams data
- `{team}_kicking_specialists.csv` - Kicking/returning data
- `{team}_summary.csv` - Game summaries

### 2. Create Conversion Script
```bash
# Copy and modify existing script
cp scripts/convert_nebraska_data.js scripts/convert_{team}_data.js

# Edit the script for your team's data structure
# Update file paths and team name
```

### 3. Run Data Conversion
```bash
node scripts/convert_{team}_data.js
```

### 4. Create Team Page
```bash
# Copy existing team page as template
cp pages/maryland.html pages/{team}.html

# Update team-specific content:
# - Team name and colors
# - Logo paths
# - Data file paths
# - Navigation links
```

### 5. Update Main Page
Add team link to `index.html`:
```html
<a href="./pages/{team}.html" class="team-link">
    🏈 {Team Name}
</a>
```

## 📊 Data Format Requirements

### Offense/Defense CSV Format
```csv
Week,Player,Jersey,Position,Snaps
1,John Doe,15,QB,45
1,Jane Smith,23,RB,32
```

### Special Teams Season CSV Format
```csv
Player,#,POS,Games,TOT,KRET,KCOV,PRET,PCOV,FGBLK,FGK
John Doe,15,QB,5,25,0,0,0,0,0,0
Jane Smith,23,RB,5,15,5,10,0,0,0,0
```

### Kicking Specialists CSV Format
```csv
Category,Jersey,Player_Name,Attempts,Returns,Yards,YPA,TDs
Punting,S83,Archie Wilson,12,,,,
Kick_Returns,02,Jacory Barney Jr.,3,3,23,7.7,0
```

## 🎨 Customization

### Team Colors
Update CSS variables in team page:
```css
:root {
    --primary-color: #E31B23;    /* Team primary color */
    --secondary-color: #FFFFFF;  /* Team secondary color */
    --accent-color: #000000;     /* Team accent color */
}
```

### Team Logo
1. Add logo to `assets/images/`
2. Update logo path in team page:
```html
<img src="../assets/images/{team}_logo.png" alt="{Team Name}" class="team-logo">
```

## 🚀 Deployment

### GitHub Pages
1. Push to `main` branch
2. Enable GitHub Pages in repository settings
3. Source: Deploy from branch `main`
4. Site will be available at: `https://{username}.github.io/weekly-matchup-analytics/`

### Custom Domain
1. Add `CNAME` file with your domain
2. Configure DNS settings
3. Update GitHub Pages settings

## 🛠️ Development

### Local Development Server
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you prefer)
npx http-server -p 8000
```

### Data Processing
```bash
# Convert Nebraska data
node scripts/convert_nebraska_data.js

# Add year data to Maryland
node scripts/add_year_data.js
```

### Testing
1. Open `http://localhost:8000` in browser
2. Navigate to team pages
3. Test filtering and chart interactions
4. Verify data accuracy

## 📝 Troubleshooting

### Common Issues

**Charts not displaying:**
- Check browser console for JavaScript errors
- Verify data files are accessible
- Ensure Chart.js is loading from CDN

**Data not loading:**
- Check file paths in team pages
- Verify JSON files are valid
- Run data conversion scripts

**Styling issues:**
- Clear browser cache
- Check CSS file paths
- Verify responsive design breakpoints

**Special teams filtering not working:**
- Check unit names match between HTML and JavaScript
- Verify data structure in JSON files
- Test filter button event listeners

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-team`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🏆 Teams Supported

- ✅ Maryland Terrapins
- ✅ Nebraska Cornhuskers  
- ✅ Minnesota Golden Gophers
- ✅ Rutgers Scarlet Knights
- ✅ Washington Huskies
- ✅ Penn State Nittany Lions
- ✅ FIU Panthers

## 📞 Support

For questions or issues:
1. Check this README
2. Review existing team implementations
3. Open an issue on GitHub
4. Contact the development team