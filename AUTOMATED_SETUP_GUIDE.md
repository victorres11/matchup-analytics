# 🚀 Automated Team Setup System

## Quick Start (90% Automated)

### **1. Setup New Team**
```bash
# Basic setup
node scripts/setup_new_team.js michigan

# With custom colors and matchup
node scripts/setup_new_team.js michigan "#00274C" "#FFCB05" "ohio-state"
```

### **2. Add Your Data**
- Place CSV files in `data/csv/team_data/michigan/`
- Add team logo as `assets/images/michigan_logo.png`
- Add roster data as `data/csv/team_data/michigan/michigan_number_roster.json` (optional)

### **3. Process Data**
```bash
node scripts/convert_team_data.js michigan
```

### **4. Done!** 
- Page automatically created at `pages/michigan.html`
- Main index updated with team link
- All functionality working out of the box

---

## 📋 What's Automated

✅ **File Structure Creation** - Automatic directory setup  
✅ **CSV Templates** - Pre-formatted data files  
✅ **Page Generation** - Complete HTML page from template  
✅ **CSS Theme Application** - Team colors automatically applied  
✅ **JavaScript Integration** - All functions included  
✅ **Data Processing Pipeline** - Automated CSV to JSON conversion  
✅ **Position Grouping Logic** - Automatic player categorization  
✅ **Year Filtering System** - Roster data integration  
✅ **Main Index Updates** - Team links automatically added  

---

## 🔧 Available Commands

### **Setup New Team**
```bash
node scripts/setup_new_team.js <team_name> [primary_color] [secondary_color] [matchup_team]
```

**Examples:**
```bash
# Basic setup
node scripts/setup_new_team.js michigan

# With custom colors
node scripts/setup_new_team.js michigan "#00274C" "#FFCB05"

# With matchup team
node scripts/setup_new_team.js michigan "#00274C" "#FFCB05" "ohio-state"
```

### **Convert Team Data**
```bash
node scripts/convert_team_data.js <team_name>
```

### **Generate Team Page**
```bash
node scripts/generate_team_page.js <team_name>
```

---

## 📁 Generated File Structure

```
project/
├── data/
│   ├── csv/team_data/{team_name}/
│   │   ├── {team}_offense.csv (template)
│   │   ├── {team}_defense.csv (template)
│   │   ├── {team}_kicking_specialists.csv (template)
│   │   ├── {team}_special_teams_season.csv (template)
│   │   ├── {team}_summary.csv (template)
│   │   └── {team}_number_roster.json (template)
│   └── json/
│       └── {team}_multiweek.json (generated)
├── assets/images/
│   └── {team}_logo.png (you add this)
├── pages/
│   └── {team}.html (generated)
└── scripts/
    ├── team_config.js (updated)
    └── convert_{team}_data.js (if needed)
```

---

## 📊 Required CSV Format

### **Offense/Defense CSV**
```csv
Player,#,S,POS,Week1_Snaps,Week1_Started,Week2_Snaps,Week2_Started,...
Dylan Raiola,15,*,QB,78,true,54,true,...
```

### **Roster JSON**
```json
{
  "roster": [
    {"number": 88, "name": "Jackson Carpenter", "class": "Fr.", "height": "6-1", "weight": 200}
  ]
}
```

### **Summary CSV**
```csv
Week,Opponent,Date,Final_Score_Team,Final_Score_Opponent,Home_Away,Offense_Snaps,Defense_Snaps
1,Akron,Sat Sep 6th,40,7,Away,73,63
```

---

## 🎨 Team Colors Reference

```javascript
// Common Big Ten teams
Nebraska:    #d32f2f, #ffffff
Michigan:    #00274C, #FFCB05  
Ohio State:  #BB0000, #666666
Penn State:  #041E42, #FFFFFF
Maryland:    #E03A3E, #FFD520
```

---

## ⚡ Time Estimate

- **Setup**: 2 minutes (run setup command)
- **Data Addition**: 5-10 minutes (add your CSV files)
- **Data Processing**: 1 minute (run conversion)
- **Testing**: 2 minutes (verify functionality)
- **Total**: ~10-15 minutes per team

---

## 🐛 Troubleshooting

### **Setup Errors**
```bash
# Check if team already exists
ls data/csv/team_data/

# Verify team configuration
node -e "console.log(require('./scripts/team_config.js'))"
```

### **Conversion Errors**
```bash
# Check file paths
ls -la data/csv/team_data/{team}/

# Verify CSV format  
head data/csv/team_data/{team}/{team}_offense.csv

# Test JSON output
cat data/json/{team}_multiweek.json | head -50
```

### **Page Not Loading**
1. Check browser console for errors
2. Verify JSON file exists and is valid
3. Check data path in HTML
4. Clear browser cache

---

## 💡 Pro Tips

1. **Standardize CSV Format**: Keep the same column structure across all teams
2. **Use Roster Data**: Always include roster JSON for proper year information
3. **Test Position Grouping**: Verify all positions are correctly categorized
4. **Handle Edge Cases**: Check for special position codes (D prefix, etc.)
5. **Version Control**: Commit after each successful team addition

---

## 📞 Support

If you encounter issues:
1. Check existing team implementations (Nebraska, Maryland)
2. Review conversion script output for errors
3. Verify CSV format matches template
4. Test with sample data first

---

## 🎯 Next Steps After Setup

1. **Add your CSV data files** to the created directory
2. **Add team logo** to assets/images/
3. **Update roster data** if you have year information
4. **Run data conversion**: `node scripts/convert_team_data.js {team}`
5. **Test the page**: `http://localhost:8001/pages/{team}.html`
6. **Update main index.html** if needed
7. **Commit changes** to Git
8. **Deploy** to production
