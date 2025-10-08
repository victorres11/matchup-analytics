# 📊 Team Data Format Guide

## 📁 Required Files for Each Team

Each team needs the following files in their `data/csv/team_data/{team_name}/` directory:

### **1. Offense Data** - `{team}_offense.csv`
- **Purpose**: Player snap counts and starts for offensive players
- **Required**: Yes
- **Format**: CSV with weekly snap data

### **2. Defense Data** - `{team}_defense.csv`  
- **Purpose**: Player snap counts and starts for defensive players
- **Required**: Yes
- **Format**: CSV with weekly snap data

### **3. Kicking Specialists** - `{team}_kicking_specialists.csv`
- **Purpose**: Kicking and punting statistics (simple format)
- **Required**: Yes
- **Format**: CSV with Player, Unit, Attempts
- **Used for**: Kicking specialists display

### **4. Special Teams Season** - `{team}_special_teams_season.csv`
- **Purpose**: Detailed special teams participation by unit (complex format)
- **Required**: Yes
- **Format**: CSV with detailed snap counts by unit
- **Used for**: Special teams charts and filtering

### **5. Game Summary** - `{team}_summary.csv`
- **Purpose**: Game results and team statistics
- **Required**: Yes
- **Format**: CSV with game-by-game data

### **6. Roster Data** - `{team}_number_roster.json`
- **Purpose**: Player year/class information for filtering
- **Required**: Optional (but recommended)
- **Format**: JSON with player details

### **7. Team Logo** - `assets/images/{team}_logo.png`
- **Purpose**: Team branding on the page
- **Required**: Optional (shows placeholder if missing)
- **Format**: PNG image file

---

## 🔄 Two Special Teams Formats

The system uses **TWO different special teams CSV files** for different purposes:

### **Simple Format** (`{team}_kicking_specialists.csv`)
- **Purpose**: Basic kicking/punting statistics
- **Used for**: Kicking specialists display
- **Format**: `Category,Jersey,Player_Name,Attempts,Returns,Yards,YPA,TDs`
- **Example**: `Kickoffs,S91,Kyle Cunanan,18,,,,`

### **Complex Format** (`{team}_special_teams_season.csv`)
- **Purpose**: Detailed special teams participation
- **Used for**: Special teams charts and filtering
- **Format**: `Player,#,POS,Games,TOT,KRET,KCOV,PRET,PCOV,FGBLK,FGK`
- **Example**: `Riley Van Poppel,D05,DI,3,10,0,0,0,0,10,0`

**Both files are required** for full functionality!

---

## 📋 CSV Format Specifications

### **1. Offense CSV Format**

**File**: `{team}_offense.csv`

**Headers**:
```csv
Player,#,S,POS,Week1_Snaps,Week1_Started,Week2_Snaps,Week2_Started,Week3_Snaps,Week3_Started,Week4_Snaps,Week4_Started,Week5_Snaps,Week5_Started
```

**Example Data**:
```csv
Player,#,S,POS,Week1_Snaps,Week1_Started,Week2_Snaps,Week2_Started,Week3_Snaps,Week3_Started,Week4_Snaps,Week4_Started,Week5_Snaps,Week5_Started
Dylan Raiola,15,*,QB,78,true,54,true,67,true,72,true,0,false
Emmett Johnson,6,*,RB,45,false,38,false,52,true,41,false,0,false
Malachi Coleman,10,*,WR,62,true,58,true,71,true,69,true,0,false
```

**Column Descriptions**:
- `Player`: Full player name
- `#`: Jersey number (no D prefix for offense)
- `S`: Year indicator (* = Jr., empty = Unknown)
- `POS`: Position code (QB, RB, WR, TE, C, LG, RG, LT, RT, etc.)
- `Week1_Snaps`: Number of snaps played in Week 1
- `Week1_Started`: true/false if player started Week 1
- `Week2_Snaps`: Number of snaps played in Week 2
- `Week2_Started`: true/false if player started Week 2
- (Continue pattern for all weeks)

---

### **2. Defense CSV Format**

**File**: `{team}_defense.csv`

**Headers**:
```csv
Player,#,S,POS,Week1_Snaps,Week1_Started,Week2_Snaps,Week2_Started,Week3_Snaps,Week3_Started,Week4_Snaps,Week4_Started,Week5_Snaps,Week5_Started
```

**Example Data**:
```csv
Player,#,S,POS,Week1_Snaps,Week1_Started,Week2_Snaps,Week2_Started,Week3_Snaps,Week3_Started,Week4_Snaps,Week4_Started,Week5_Snaps,Week5_Started
Nash Hutmacher,D0,*,NT,45,true,38,true,52,true,41,true,0,false
Ty Robinson,D99,*,DRT,62,true,58,true,71,true,69,true,0,false
Jimari Butler,D11,*,DRE,55,true,49,true,63,true,58,true,0,false
```

**Column Descriptions**:
- `Player`: Full player name
- `#`: Jersey number with D prefix (D0, D99, D11, etc.)
- `S`: Year indicator (* = Jr., empty = Unknown)
- `POS`: Position code (NT, DRT, DLT, DRE, DLE, LOLB, ROLB, SCB, LCB, RCB, SS, FS, etc.)
- `Week1_Snaps`: Number of snaps played in Week 1
- `Week1_Started`: TRUE/FALSE if player started Week 1
- (Continue pattern for all weeks)

**Important Notes**:
- Defense players use D prefix in jersey numbers
- Position codes are specific: DRT, DLT, DRE, DLE, NT, LOLB, ROLB, SCB, LCB, RCB, SS, FS
- Started values are TRUE/FALSE (uppercase)

---

### **3. Kicking Specialists CSV Format**

**File**: `{team}_kicking_specialists.csv`

**Headers**:
```csv
Category,Jersey,Player_Name,Attempts,Returns,Yards,YPA,TDs
```

**Example Data**:
```csv
Category,Jersey,Player_Name,Attempts,Returns,Yards,YPA,TDs
Kickoffs,S91,Kyle Cunanan,18,,,,
Punting,S83,Archie Wilson,12,,,,
Field_Goals,S91,Kyle Cunanan,9,,,,
Kick_Returns,02,Jacory Barney Jr.,3,3,23,7.7,0
Punt_Returns,02,Jacory Barney Jr.,9,9,111,12.3,0
```

**Column Descriptions**:
- `Category`: Special teams unit (Kickoffs, Punting, Field_Goals, Kick_Returns, Punt_Returns)
- `Jersey`: Jersey number (with S prefix for specialists)
- `Player_Name`: Full player name
- `Attempts`: Number of attempts for that unit
- `Returns`: Number of returns (for return units only)
- `Yards`: Total yards (for return units only)
- `YPA`: Yards per attempt (for return units only)
- `TDs`: Touchdowns (for return units only)

**Available Categories**:
- `Kickoffs`: Kickoff attempts
- `Punting`: Punt attempts
- `Field_Goals`: Field goal attempts
- `Kick_Returns`: Kickoff return attempts
- `Punt_Returns`: Punt return attempts

---

### **4. Special Teams CSV Format**

**File**: `{team}_special_teams_season.csv`

**Headers**:
```csv
Player,#,POS,Games,TOT,KRET,KCOV,PRET,PCOV,FGBLK,FGK
```

**Example Data**:
```csv
Player,#,POS,Games,TOT,KRET,KCOV,PRET,PCOV,FGBLK,FGK
Riley Van Poppel,D05,DI,3,10,0,0,0,0,10,0
Kahmir Prescott,D19,CB,2,15,6,0,15,0,0,0
Caleb Benning,D28,S,3,42,8,17,16,0,1,0
Derek Wacker,D42,LB,4,38,11,27,0,0,0,0
Mekhi Nelson,35,HB,2,10,0,10,0,0,0,0
```

**Column Descriptions**:
- `Player`: Full player name
- `#`: Jersey number (with D prefix for defense players)
- `POS`: Position code (DI, CB, S, LB, HB, TE, T, G, ED, WR, LS, K, P)
- `Games`: Number of games played
- `TOT`: Total special teams snaps
- `KRET`: Kickoff return snaps
- `KCOV`: Kickoff coverage snaps
- `PRET`: Punt return snaps
- `PCOV`: Punt coverage snaps
- `FGBLK`: Field goal block snaps
- `FGK`: Field goal kick snaps

**Position Codes**:
- `DI`: Defensive Interior (Defensive Line)
- `CB`: Cornerback
- `S`: Safety
- `LB`: Linebacker
- `HB`: Halfback/Running Back
- `TE`: Tight End
- `T`: Tackle
- `G`: Guard
- `ED`: Edge Defender
- `WR`: Wide Receiver
- `LS`: Long Snapper
- `K`: Kicker
- `P`: Punter

---

### **5. Game Summary CSV Format**

**File**: `{team}_summary.csv`

**Headers**:
```csv
Week,Opponent,Date,Final_Score_Team,Final_Score_Opponent,Home_Away,Offense_Snaps,Defense_Snaps
```

**Example Data**:
```csv
Week,Opponent,Date,Final_Score_Team,Final_Score_Opponent,Home_Away,Offense_Snaps,Defense_Snaps
1,Akron,Sat Sep 6th,40,7,Away,73,63
2,Colorado,Sat Sep 13th,28,21,Home,68,71
3,Northern Illinois,Sat Sep 20th,35,14,Home,72,58
4,Illinois,Sat Sep 27th,31,24,Away,69,66
5,Bye Week,Bye Week,0,0,Bye,0,0
```

**Column Descriptions**:
- `Week`: Week number (1, 2, 3, etc.)
- `Opponent`: Opposing team name
- `Date`: Game date (format: "Day Month DDth")
- `Final_Score_Team`: Your team's final score
- `Final_Score_Opponent`: Opponent's final score
- `Home_Away`: Home, Away, or Bye
- `Offense_Snaps`: Total offensive snaps for the game
- `Defense_Snaps`: Total defensive snaps for the game

### 🚫 **BYE Week Handling**
**Important**: The system now automatically handles BYE weeks properly:

- **✅ DO**: Skip BYE weeks in your CSV files
  - If Week 5 is a BYE, go from Week 4 to Week 6
  - Don't include Week 5 rows in summary.csv
  - Don't include Week5_Snaps/Week5_Started columns in player CSV files

- **❌ DON'T**: Include BYE week data
  - Don't add rows with "Bye Week" as opponent
  - Don't add columns for BYE weeks in player data

- **🎯 Example**: Purdue's schedule (Week 5 is BYE)
  ```
  Week,Opponent,Date,Final_Score_Team,Final_Score_Opponent,Home_Away,Offense_Snaps,Defense_Snaps
  1,BALLST,Sat Aug 30,31,0,Home,60,53
  2,SOUILL,Sat Sep 06,34,17,Home,79,60
  3,USCTRO,Sat Sep 13,17,33,Home,71,70
  4,NOTRED,Sat Sep 20,30,56,Away,71,64
  6,ILLINO,Sat Oct 04,27,43,Home,77,65
  ```

- **🔧 The conversion script automatically**:
  - Detects which weeks exist in your data
  - Only processes weeks that have actual games
  - Skips missing weeks (BYE weeks)
  - Creates charts and tables for actual games only

---

### **6. Roster JSON Format**

**File**: `{team}_number_roster.json`

**Structure**:
```json
{
  "roster": [
    {
      "number": 88,
      "name": "Jackson Carpenter",
      "class": "Fr.",
      "height": "6-1",
      "weight": 200
    },
    {
      "number": 15,
      "name": "Dylan Raiola",
      "class": "Fr.",
      "height": "6-3",
      "weight": 220
    }
  ]
}
```

**Field Descriptions**:
- `number`: Jersey number (integer, no D prefix)
- `name`: Full player name (must match CSV exactly)
- `class`: Academic year (Fr., So., Jr., Sr., Gr.)
- `height`: Player height (format: "6-1")
- `weight`: Player weight (integer)

**Important Notes**:
- Jersey numbers in roster are integers (88, 15) not strings
- Names must match exactly between roster and CSV files
- For defense players, use the number without D prefix (D88 → 88)

---

## 🎯 Position Code Reference

### **Offensive Positions**
- `QB`: Quarterback
- `RB`, `HB`, `FB`: Running Back, Halfback, Fullback
- `WR`, `SLWR`, `SRWR`, `LWR`, `RWR`: Wide Receiver variations
- `TE`, `TEL`, `TER`: Tight End variations
- `C`: Center
- `LG`, `RG`: Left/Right Guard
- `LT`, `RT`: Left/Right Tackle
- `T`, `G`: Generic Tackle/Guard

### **Defensive Positions**
- `NT`: Nose Tackle
- `DRT`, `DLT`: Defensive Right/Left Tackle
- `DRE`, `DLE`: Defensive Right/Left End
- `DT`, `DE`: Generic Defensive Tackle/End
- `LOLB`, `ROLB`: Left/Right Outside Linebacker
- `MLB`, `WLB`: Middle/Weakside Linebacker
- `LB`: Generic Linebacker
- `SCB`, `LCB`, `RCB`: Slot/Left/Right Cornerback
- `SS`, `FS`: Strong/Free Safety
- `S`, `CB`, `DB`: Generic Safety/Cornerback/Defensive Back

---

## 📋 Aggregate Table Organization

The system automatically organizes players in the aggregate tables in this specific order:

### **Offense Aggregate Table Order:**
1. **Wide Receivers** (WR, SLWR, SRWR, LWR, RWR)
2. **Tight Ends** (TE, TEL, TER)
3. **Running Backs** (HB, RB, FB)
4. **Offensive Line** (C, LG, RG, LT, RT, T, G)
5. **Quarterbacks** (QB)
6. **All Others** (defensive players taking offensive snaps, specialists, etc.)

### **Defense Aggregate Table Order:**
1. **Defensive Line** (DRT, DLT, DRE, DLE, NT, DT, DE)
2. **Linebackers** (LOLB, ROLB, MLB, WLB, LB)
3. **Defensive Backs** (SCB, RCB, LCB, SS, FS, S, CB, DB)
4. **Any Others** (specialists, etc.)

**Note**: Within each position group, players are sorted by total snaps (highest to lowest).

---

## 📊 Data Quality Checklist

### **Before Processing Data**:
- [ ] All CSV files have correct headers
- [ ] Player names match exactly between files
- [ ] Jersey numbers are consistent (D prefix for defense)
- [ ] Position codes use standard abbreviations
- [ ] Snap counts are integers (0 for no snaps)
- [ ] Started values are true/false (offense) or TRUE/FALSE (defense)
- [ ] Roster JSON is valid and matches CSV names
- [ ] Game summary has all required weeks

### **Common Issues to Avoid**:
- ❌ Inconsistent player name spelling
- ❌ Missing D prefix on defense jersey numbers
- ❌ Wrong position codes (e.g., "Cornerback" instead of "CB")
- ❌ Mixed case in started values
- ❌ Missing weeks in game summary
- ❌ Invalid JSON in roster file

---

## 🔧 File Naming Convention

### **Required Pattern**:
```
{team_name}_{data_type}.csv
```

### **Examples**:
- `nebraska_offense.csv`
- `michigan_defense.csv`
- `ohio-state_kicking_specialists.csv`
- `penn-state_special_teams_season.csv`
- `maryland_summary.csv`
- `rutgers_number_roster.json`

### **Team Name Rules**:
- Use lowercase
- Use hyphens for spaces (ohio-state, penn-state)
- No special characters
- Keep consistent across all files

---

## 📞 Support

If you encounter issues with data formatting:

1. **Check existing teams** (Nebraska, Maryland) for reference
2. **Validate CSV headers** match the examples exactly
3. **Test with sample data** before processing full dataset
4. **Check browser console** for JavaScript errors
5. **Verify JSON syntax** for roster files

---

## 🎯 Quick Start Template

Use this template to get started:

```bash
# 1. Setup team structure
node scripts/setup_new_team.js your-team

# 2. Replace template files with your data
# 3. Follow the CSV formats above
# 4. Process the data
node scripts/convert_team_data.js your-team

# 5. Test the page
# Open: http://localhost:8001/pages/your-team.html
```

## Missing Game Indicators

The analytics system includes a visual indicator for players who miss games due to injury or other reasons:

### How It Works
- **Trigger**: When a player has 10% or more of team snaps in the previous week but gets 0 snaps in the current week
- **Visual**: A small bar (5 snaps height) with diagonal stripe pattern appears in the chart
- **Purpose**: Helps identify injured or absent players visually

### Example Scenario
- Player has 15 snaps out of 60 total team snaps (25%) in Week 2
- Player gets 0 snaps in Week 3
- Result: Small diagonal-patterned bar appears in Week 3 chart

### Technical Details
- Uses `createDiagonalPattern()` function to generate the visual pattern
- Calculates 10% threshold dynamically based on team's total snaps for each week
- Applied to both offense and defense position-specific charts
- Does not appear for BYE weeks
