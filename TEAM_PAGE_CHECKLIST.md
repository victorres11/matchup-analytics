# Team Page Creation Checklist

## 📋 Pre-Creation Setup
- [ ] Gather CSV data files (offense, defense, special teams, summary)
- [ ] Download team logo (PNG format)
- [ ] Determine team theme colors (primary, secondary)
- [ ] Choose matchup opponent team
- [ ] Create data conversion script

## 🏗️ File Structure Setup
- [ ] Create `data/csv/team_data/{team_name}/` directory
- [ ] Add CSV files: `{team_name}_offense.csv`, `{team_name}_defense.csv`, `{team_name}_kicking_specialists.csv`, `{team_name}_special_teams_season.csv`, `{team_name}_summary.csv`
- [ ] Save logo as `assets/images/{team_name}_logo.png`
- [ ] Run conversion script to create `data/json/{team_name}_multiweek.json`

## 📄 HTML Page Creation
- [ ] Copy `pages/nebraska.html` to `pages/{team_name}.html`
- [ ] Update page title: `{Team Name} - Multi-Week Snap Count Analytics`
- [ ] Update favicon path: `../assets/logos/Big_Ten_Conference_logo.svg`
- [ ] Update team name in header: `<h1>{Team Name}</h1>`
- [ ] Update logo path: `../assets/images/{team_name}_logo.png`
- [ ] Update matchup link: `href="{opponent_team}.html"`
- [ ] Update matchup text: `View {Opponent Team}`

## 🎨 CSS Theme Updates
- [ ] Update CSS variables with team colors:
  ```css
  --primary-color: #{team_primary_color};
  --secondary-color: #{team_secondary_color};
  --background-gradient: linear-gradient(135deg, {primary} 0%, {secondary} 100%);
  ```
- [ ] Update gradient references in CSS
- [ ] Verify all team-specific styling uses CSS variables

## 📊 Data Integration
- [ ] Update JSON data path: `../data/json/{team_name}_multiweek.json`
- [ ] Verify all data loading functions work
- [ ] Test data population in all sections

## 🧩 Required Sections (Verify All Present)
- [ ] **Header Section**: Logos, title, subtitle, timestamp, matchup link
- [ ] **Stats Grid**: 4 cards (Total Offensive, Total Defensive, Avg Offensive, Avg Defensive)
- [ ] **Weekly Summary Table**: Game-by-game snap counts
- [ ] **Tab Navigation**: OFFENSIVE, DEFENSIVE, SPECIAL TEAMS
- [ ] **Offense Tab**: Position charts + aggregate table at bottom
- [ ] **Defense Tab**: Position charts + aggregate table at bottom
- [ ] **Special Teams Tab**: Special teams charts

## 🎯 Aggregate Tables (Critical)
- [ ] **Location**: In OFFENSE and DEFENSE tabs (NOT separate tab)
- [ ] **Sorting Buttons**: "Sort by Total Snaps", "Sort by Jersey #", "Sort by Position Group"
- [ ] **Default Sort**: Position group, then high to low snaps
- [ ] **Color Coding**: Position group background colors applied
- [ ] **Data Population**: All players with snap counts across weeks

## 🔧 JavaScript Functions (Must Include)
- [ ] `loadTeamData()` - Loads team data
- [ ] `updateStats()` - Updates summary stats
- [ ] `populateWeeklySummary()` - Weekly summary table
- [ ] `populateAggregateTables()` - Aggregate table population
- [ ] `populateOffenseAggregateTable()` - Offense aggregate data
- [ ] `populateDefenseAggregateTable()` - Defense aggregate data
- [ ] `sortAggregateTable(side, sortBy)` - Table sorting
- [ ] `getRowData(row)` - Row data extraction
- [ ] `getPositionGroupFromPosition(position)` - Position mapping
- [ ] `setupEventListeners()` - Event handling

## ✅ Testing Checklist
- [ ] **Images**: All logos load correctly
- [ ] **Data**: All charts and tables populate
- [ ] **Tabs**: Tab switching works smoothly
- [ ] **Sorting**: All sort buttons function correctly
- [ ] **Responsive**: Page works on mobile devices
- [ ] **Links**: Matchup link works correctly
- [ ] **Performance**: Page loads quickly

## 🚫 Common Mistakes to Avoid
- [ ] ❌ Don't create separate AGGREGATE tab
- [ ] ❌ Don't include "Last Updated" stat card
- [ ] ❌ Don't forget position group color coding
- [ ] ❌ Don't use incorrect file paths
- [ ] ❌ Don't miss required JavaScript functions
- [ ] ❌ Don't forget to update main index.html

## 🔗 Final Steps
- [ ] Update `index.html` with new team link
- [ ] Test entire site functionality
- [ ] Commit and push changes
- [ ] Verify production deployment

---

**Template**: Use `pages/nebraska.html` as the base template
**Reference**: See `TEAM_PAGE_GUIDELINES.md` for detailed specifications
