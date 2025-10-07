# 🚀 Streamlined Team Setup Guide

## Quick Setup (90% Automated)

This guide provides a streamlined process to add new teams with minimal manual work.

---

## 📋 Prerequisites

1. **Data Files** in standardized CSV format
2. **Team Logo** (PNG or JPG format)
3. **Team Roster JSON** (optional, for year data)
4. **Team Colors** (primary & secondary hex codes)

---

## 🎯 Streamlined Process (4 Steps)

### **Step 1: Prepare Data Files**

Create folder: `data/csv/team_data/{team_name}/`

Required files:
```
{team}_offense.csv
{team}_defense.csv  
{team}_kicking_specialists.csv
{team}_special_teams_season.csv
{team}_summary.csv
{team}_number_roster.json (optional)
```

**CSV Format Example** (`nebraska_offense.csv`):
```csv
Player,#,S,POS,Week1_Snaps,Week1_Started,Week2_Snaps,Week2_Started,...
Dylan Raiola,15,*,QB,78,true,54,true,...
```

**Roster JSON Format** (`nebraska_number_roster.json`):
```json
{
  "roster": [
    {"number": 88, "name": "Jackson Carpenter", "class": "Fr.", "height": "6-1", "weight": 200}
  ]
}
```

### **Step 2: Copy & Modify Conversion Script**

```bash
# Copy Nebraska script as template
cp scripts/convert_nebraska_data.js scripts/convert_{team}_data.js

# Edit the new script:
# 1. Replace "nebraska" with your team name (lowercase)
# 2. Update CSV file paths
# 3. Verify position grouping logic
```

**Key sections to update**:
```javascript
// Line 5-9: Update file paths
const offenseData = fs.readFileSync(path.join(__dirname, '../data/csv/team_data/{team_name}/{team}_offense.csv'), 'utf8');

// Line 12: Update roster path
const rosterData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/csv/team_data/{team_name}/{team}_number_roster.json'), 'utf8'));

// Line 280: Update team name
team: "{team_name}",

// Line 288: Update output path
const outputPath = path.join(__dirname, '../data/json/{team_name}_multiweek.json');
```

### **Step 3: Copy & Modify HTML Page**

```bash
# Copy Nebraska page as template
cp pages/nebraska.html pages/{team}.html
```

**Find & Replace** (use your code editor):
```
Find: "nebraska"          → Replace: "{team_name}"
Find: "Nebraska"          → Replace: "{Team Name}"
Find: "#d32f2f"          → Replace: "{primary_color}"
Find: "washington"       → Replace: "{matchup_team}"
Find: "View Washington"  → Replace: "View {Matchup Team}"
```

**Update logo path** (around line 745):
```html
<img src="../assets/images/{team_name}_logo.png" alt="{Team Name}" class="logo">
```

**Update data path** (around line 1083):
```javascript
const response = await fetch('../data/json/{team_name}_multiweek.json');
```

### **Step 4: Process & Test**

```bash
# 1. Run conversion script
node scripts/convert_{team}_data.js

# 2. Add team logo
# Place logo in: assets/images/{team}_logo.png

# 3. Start local server
python3 -m http.server 8001

# 4. Test page
# Open: http://localhost:8001/pages/{team}.html
```

---

## ✅ Verification Checklist

### Data Processing
- [ ] JSON file created successfully in `data/json/`
- [ ] All weeks data present
- [ ] Position groups properly categorized
- [ ] Year data populated (if roster provided)

### Page Functionality  
- [ ] Page loads without errors
- [ ] Team logo displays correctly
- [ ] Team colors applied correctly
- [ ] All charts render properly
- [ ] Aggregate tables populate
- [ ] Year filtering works
- [ ] Special teams filters work
- [ ] Tab switching works

### Position Grouping Verification
- [ ] **Offense**: QB, RB, WR, TE, OL
- [ ] **Defense**: DL, LB, DB (check specific positions like DRT, SCB, LOLB)
- [ ] Defensive players with D prefix handled correctly

---

## 🔧 Position Grouping Logic

### Standard Position Mappings

**Offense:**
```
QB: QB
RB: HB, RB, FB
WR: WR, SLWR, SRWR, LWR, RWR
TE: TE, TEL, TER
OL: C, LG, RG, LT, RT, T, G
```

**Defense:**
```
DL: DRT, DLT, DRE, DLE, NT, DT, DE
LB: LOLB, ROLB, MLB, WLB, LB  
DB: SCB, RCB, LCB, SS, FS, S, CB, DB
```

**Important Note**: Defensive players may have "D" prefix in jersey numbers (D08, D01). The roster lookup automatically handles this by stripping the prefix.

---

## 📊 Common Data Issues & Solutions

### Issue 1: Players showing as "Unknown" year
**Solution**: Add `{team}_number_roster.json` with proper year data

### Issue 2: Defensive players miscategorized
**Solution**: Verify position codes match the grouping logic. Check for D prefix in jersey numbers.

### Issue 3: Missing player data
**Solution**: Check CSV format - ensure Player, #, POS columns exist

### Issue 4: Chart not rendering
**Solution**: Verify JSON conversion completed successfully

---

## 🎨 Team Colors Reference

Common Big Ten teams:
```
Nebraska:    #d32f2f, #ffffff
Michigan:    #00274C, #FFCB05  
Ohio State:  #BB0000, #666666
Penn State:  #041E42, #FFFFFF
Maryland:    #E03A3E, #FFD520
```

---

## 📁 Complete File Structure

```
project/
├── data/
│   ├── csv/team_data/{team_name}/
│   │   ├── {team}_offense.csv
│   │   ├── {team}_defense.csv
│   │   ├── {team}_kicking_specialists.csv
│   │   ├── {team}_special_teams_season.csv
│   │   ├── {team}_summary.csv
│   │   └── {team}_number_roster.json
│   └── json/
│       └── {team}_multiweek.json (generated)
├── assets/images/
│   └── {team}_logo.png
├── pages/
│   └── {team}.html
└── scripts/
    └── convert_{team}_data.js
```

---

## ⚡ Time Estimate

- **Setup**: 10 minutes (copy & modify scripts)
- **Data Processing**: 2 minutes (run conversion)
- **Testing**: 5 minutes (verify functionality)
- **Total**: ~15-20 minutes per team

---

## 🐛 Troubleshooting

### Conversion Errors
```bash
# Check file paths
ls -la data/csv/team_data/{team}/

# Verify CSV format  
head data/csv/team_data/{team}/{team}_offense.csv

# Test JSON output
cat data/json/{team}_multiweek.json | head -50
```

### Page Not Loading
1. Check browser console for errors
2. Verify JSON file exists and is valid
3. Check data path in HTML (line ~1083)
4. Clear browser cache

### Position Grouping Issues
1. Review position codes in CSV
2. Check `getPositionGroup` function in conversion script
3. Verify `getPositionGroupFromPosition` in HTML
4. Test with console logging

---

## 📝 Next Steps After Setup

1. **Update main index.html** with team link
2. **Test all functionality** thoroughly  
3. **Commit changes** to Git
4. **Deploy** to production
5. **Document any team-specific quirks**

---

## 💡 Pro Tips

1. **Standardize CSV Format**: Keep the same column structure across all teams
2. **Use Roster Data**: Always include roster JSON for proper year information
3. **Test Position Grouping**: Verify all positions are correctly categorized
4. **Handle Edge Cases**: Check for special position codes (D prefix, etc.)
5. **Version Control**: Commit after each successful team addition

---

## 📞 Support

If you encounter issues not covered here:
1. Check existing team implementations (Nebraska, Maryland)
2. Review conversion script output for errors
3. Verify CSV format matches template
4. Test with sample data first

