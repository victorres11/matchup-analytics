        // Color mapping for opposing teams - each week gets a distinct color
        const opposingTeamColors = {
            'Ohio': { primary: '#006633', secondary: '#FFFFFF', accent: '#FFD700' },
            'Miami OH': { primary: '#C8102E', secondary: '#FFD700', accent: '#FFFFFF' },
            'Norfolk State': { primary: '#8B4513', secondary: '#FFD700', accent: '#FFFFFF' },
            'Iowa': { primary: '#000000', secondary: '#FFD700', accent: '#FFFFFF' }
        };

        // Week-specific colors for stacked bars
        const weekColors = {
            1: '#006633', // Green for Week 1 vs Ohio
            2: '#C8102E', // Red for Week 2 vs Miami OH  
            3: '#8B4513', // Brown for Week 3 vs Norfolk State
            4: '#000000'  // Black for Week 4 vs Iowa
        };

        let teamData = null;
        let returnerData = null;
        let currentWeek = 'all';

        // Load returner data
        async function loadReturnerData() {
            try {
                console.log('Loading Rutgers returner data...');
                const response = await fetch('./team_data/rutgers/rutgers_pr_kr_up_to_week_4.csv');
                const csvText = await response.text();
                console.log('CSV data loaded:', csvText);
                const lines = csvText.split('\n');
                const headers = lines[0].split(',');
                
                returnerData = new Map();
                
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        const values = lines[i].split(',');
                        const jersey = values[0];
                        const player = values[1];
                        const puntReturns = parseInt(values[2]) || 0;
                        const puntReturnYards = parseInt(values[3]) || 0;
                        const puntReturnYPA = parseFloat(values[4]) || 0;
                        const kickReturns = parseInt(values[5]) || 0;
                        const kickReturnYards = parseInt(values[6]) || 0;
                        const kickReturnYPA = parseFloat(values[7]) || 0;
                        
                        if (jersey && player) {
                            returnerData.set(jersey, {
                                name: player,
                                jersey: jersey,
                                puntReturns: puntReturns,
                                puntReturnYards: puntReturnYards,
                                puntReturnYPA: puntReturnYPA,
                                kickReturns: kickReturns,
                                kickReturnYards: kickReturnYards,
                                kickReturnYPA: kickReturnYPA,
                                isPRReturner: puntReturns > 0,
                                isKRReturner: kickReturns > 0
                            });
                            console.log(`Added returner: ${player} #${jersey} - PR: ${puntReturns}, KR: ${kickReturns}`);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading returner data:', error);
                returnerData = new Map();
            }
        }

        // Populate aggregate tables on page load
        console.log('Defining populateAggregateTables function');
        function populateAggregateTables() {
            if (!teamData) return;
            
            populateOffenseAggregateTable();
            populateDefenseAggregateTable();
        }
        
        function populateOffenseAggregateTable() {
            const tableBody = document.getElementById('offense-aggregate-body');
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            
            const allPlayers = [];
            const playerMap = new Map();
            
            // Collect all offense players
            const offenseGroups = ['wide_receivers', 'tight_ends', 'running_backs', 'offensive_line'];
            
            teamData.weeks.forEach(week => {
                offenseGroups.forEach(group => {
                    if (week.offense && week.offense[group]) {
                        week.offense[group].forEach(player => {
                            const key = `${player.name}_${player.jersey}`;
                            if (!playerMap.has(key)) {
                                playerMap.set(key, {
                                    name: player.name,
                                    jersey: player.jersey,
                                    position: player.position,
                                    positionGroup: group,
                                    weeks: {}
                                });
                            }
                            
                            const weekData = playerMap.get(key);
                            weekData.weeks[week.week] = {
                                snaps: player.snaps,
                                started: player.started
                            };
                        });
                    }
                });
            });
            
            // Convert to array and sort by position group, then by total snaps
            allPlayers.push(...playerMap.values());
            allPlayers.sort((a, b) => {
                // First sort by position group
                const groupOrder = ['wide_receivers', 'tight_ends', 'running_backs', 'offensive_line'];
                const aGroupIndex = groupOrder.indexOf(a.positionGroup);
                const bGroupIndex = groupOrder.indexOf(b.positionGroup);
                
                if (aGroupIndex !== bGroupIndex) {
                    return aGroupIndex - bGroupIndex;
                }
                
                // Then sort by total snaps within group
                const aTotal = Object.values(a.weeks).reduce((sum, week) => sum + week.snaps, 0);
                const bTotal = Object.values(b.weeks).reduce((sum, week) => sum + week.snaps, 0);
                return bTotal - aTotal;
            });
            
            // Populate table rows
            allPlayers.forEach(player => {
                const row = document.createElement('tr');
                
                const week1Snaps = player.weeks[1]?.snaps || 0;
                const week2Snaps = player.weeks[2]?.snaps || 0;
                const week3Snaps = player.weeks[3]?.snaps || 0;
                const week4Snaps = player.weeks[4]?.snaps || 0;
                const totalSnaps = week1Snaps + week2Snaps + week3Snaps + week4Snaps;
                
                // Add position group class for styling
                let groupClass = '';
                if (player.positionGroup === 'wide_receivers') groupClass = 'position-group-wr';
                else if (player.positionGroup === 'tight_ends') groupClass = 'position-group-te';
                else if (player.positionGroup === 'running_backs') groupClass = 'position-group-rb';
                else if (player.positionGroup === 'offensive_line') groupClass = 'position-group-ol';
                
                row.className = groupClass;
                
                row.innerHTML = `
                    <td class="jersey">#${player.jersey}</td>
                    <td class="player-name">${player.name}</td>
                    <td class="position">${player.position}</td>
                    <td class="snap-count">${week1Snaps}</td>
                    <td class="snap-count">${week2Snaps}</td>
                    <td class="snap-count">${week3Snaps}</td>
                    <td class="snap-count">${week4Snaps}</td>
                    <td class="total">${totalSnaps}</td>
                `;
                
                tableBody.appendChild(row);
            });
        }
        
        function populateDefenseAggregateTable() {
            const tableBody = document.getElementById('defense-aggregate-body');
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            
            const allPlayers = [];
            const playerMap = new Map();
            
            // Collect all defense players
            const defenseGroups = ['defensive_line', 'linebackers', 'defensive_backs'];
            
            teamData.weeks.forEach(week => {
                defenseGroups.forEach(group => {
                    if (week.defense && week.defense[group]) {
                        week.defense[group].forEach(player => {
                            const key = `${player.name}_${player.jersey}`;
                            if (!playerMap.has(key)) {
                                playerMap.set(key, {
                                    name: player.name,
                                    jersey: player.jersey,
                                    position: player.position,
                                    positionGroup: group,
                                    weeks: {}
                                });
                            }
                            
                            const weekData = playerMap.get(key);
                            weekData.weeks[week.week] = {
                                snaps: player.snaps,
                                started: player.started
                            };
                        });
                    }
                });
            });
            
            // Convert to array and sort by position group, then by total snaps
            allPlayers.push(...playerMap.values());
            allPlayers.sort((a, b) => {
                // First sort by position group
                const groupOrder = ['defensive_line', 'linebackers', 'defensive_backs'];
                const aGroupIndex = groupOrder.indexOf(a.positionGroup);
                const bGroupIndex = groupOrder.indexOf(b.positionGroup);
                
                if (aGroupIndex !== bGroupIndex) {
                    return aGroupIndex - bGroupIndex;
                }
                
                // Then sort by total snaps within group
                const aTotal = Object.values(a.weeks).reduce((sum, week) => sum + week.snaps, 0);
                const bTotal = Object.values(b.weeks).reduce((sum, week) => sum + week.snaps, 0);
                return bTotal - aTotal;
            });
            
            // Populate table rows
            allPlayers.forEach(player => {
                const row = document.createElement('tr');
                
                const week1Snaps = player.weeks[1]?.snaps || 0;
                const week2Snaps = player.weeks[2]?.snaps || 0;
                const week3Snaps = player.weeks[3]?.snaps || 0;
                const week4Snaps = player.weeks[4]?.snaps || 0;
                const totalSnaps = week1Snaps + week2Snaps + week3Snaps + week4Snaps;
                
                // Add position group class for styling
                let groupClass = '';
                if (player.positionGroup === 'defensive_line') groupClass = 'position-group-dl';
                else if (player.positionGroup === 'linebackers') groupClass = 'position-group-lb';
                else if (player.positionGroup === 'defensive_backs') groupClass = 'position-group-db';
                
                row.className = groupClass;
                
                row.innerHTML = `
                    <td class="jersey">#${player.jersey}</td>
                    <td class="player-name">${player.name}</td>
                    <td class="position">${player.position}</td>
                    <td class="snap-count">${week1Snaps}</td>
                    <td class="snap-count">${week2Snaps}</td>
                    <td class="snap-count">${week3Snaps}</td>
                    <td class="snap-count">${week4Snaps}</td>
                    <td class="total">${totalSnaps}</td>
                `;
                
                tableBody.appendChild(row);
            });
        }

        // Load team data
        async function loadTeamData() {
            try {
                console.log('Starting loadTeamData...');
                const response = await fetch('./rutgers_multiweek.json');
                teamData = await response.json();
                console.log('Team data loaded:', teamData);
                await loadReturnerData();
                updateStats();
                populateWeeklySummary();
                console.log('About to initialize charts...');
                initializeCharts();
                setupEventListeners();
                console.log('About to call populateAggregateTables, function exists:', typeof populateAggregateTables);
                populateAggregateTables(); // Populate aggregate tables
                console.log('loadTeamData completed successfully');
            } catch (error) {
                console.error('Error loading team data:', error);
            }
        }

        // Update stats summary
        function updateStats() {
            if (!teamData) return;

            let totalOffensiveSnaps = 0;
            let totalDefensiveSnaps = 0;
            let weekCount = teamData.weeks.length;

            teamData.weeks.forEach(week => {
                totalOffensiveSnaps += week.summary.offensiveSnaps;
                totalDefensiveSnaps += week.summary.defensiveSnaps;
            });

            document.getElementById('total-offensive-snaps').textContent = totalOffensiveSnaps;
            document.getElementById('total-defensive-snaps').textContent = totalDefensiveSnaps;
            document.getElementById('avg-offensive-snaps').textContent = Math.round(totalOffensiveSnaps / weekCount);
            document.getElementById('avg-defensive-snaps').textContent = Math.round(totalDefensiveSnaps / weekCount);

            // Update timestamp
            document.getElementById('update-time').textContent = new Date().toLocaleString();
        }

        // Populate weekly summary table
        function populateWeeklySummary() {
            if (!teamData) return;

            const tbody = document.getElementById('weekly-summary-data');
            tbody.innerHTML = '';

            teamData.weeks.forEach(week => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>Week ${week.week}</td>
                    <td>${week.summary.opponent}</td>
                    <td>${week.summary.date}</td>
                    <td>${week.summary.finalScore}</td>
                    <td>${week.summary.homeAway}</td>
                    <td class="snap-count">${week.summary.offensiveSnaps}</td>
                    <td class="snap-count">${week.summary.defensiveSnaps}</td>
                `;
                tbody.appendChild(row);
            });
        }

        // Initialize all charts
        function initializeCharts() {
            console.log('initializeCharts called, teamData exists:', !!teamData);
            if (!teamData) {
                console.log('No teamData, returning early');
                return;
            }

            console.log('Creating offense charts...');
            // Offense charts
            createStackedChart('wr-chart', 'wide_receivers', 'offense');
            createStackedChart('te-chart', 'tight_ends', 'offense');
            createStackedChart('rb-chart', 'running_backs', 'offense');
            createStackedChart('ol-chart', 'offensive_line', 'offense');

            // Defense charts
            createStackedChart('dl-chart', 'defensive_line', 'defense');
            createStackedChart('lb-chart', 'linebackers', 'defense');
            createStackedChart('db-chart', 'defensive_backs', 'defense');

            // Special Teams chart
            createSpecialTeamsChart('st-chart', 'special_teams', 'special_teams');
        }

        // Create stacked bar chart
        function createStackedChart(canvasId, positionGroup, side) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            
            // Get all players for this position group across all weeks
            const allPlayers = [];
            const playerMap = new Map();

            teamData.weeks.forEach(week => {
                if (week[side] && week[side][positionGroup]) {
                    week[side][positionGroup].forEach(player => {
                        const key = `${player.name}_${player.jersey}`;
                        if (!playerMap.has(key)) {
                            playerMap.set(key, {
                                name: player.name,
                                jersey: player.jersey,
                                position: player.position,
                                weeks: {}
                            });
                        }
                        playerMap.get(key).weeks[week.week] = {
                            snaps: player.snaps,
                            opponent: player.opponent,
                            started: player.started
                        };
                    });
                }
            });

            // Convert to array and sort by total snaps
            allPlayers.push(...Array.from(playerMap.values()));
            allPlayers.sort((a, b) => {
                const aTotal = Object.values(a.weeks).reduce((sum, week) => sum + week.snaps, 0);
                const bTotal = Object.values(b.weeks).reduce((sum, week) => sum + week.snaps, 0);
                return bTotal - aTotal;
            });

            // Prepare data for Chart.js
            const labels = allPlayers.map(player => {
                const nameParts = player.name.split(' ');
                let lastName = nameParts[nameParts.length - 1];
                
                // Handle name suffixes
                if (lastName === 'Jr.' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' Jr.';
                } else if (lastName === 'JR' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' JR';
                } else if (lastName === 'II' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' II';
                } else if (lastName === 'III' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' III';
                } else if (lastName === 'Sr.' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' Sr.';
                } else if (lastName === 'SR' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' SR';
                } else if (lastName === 'I' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' I';
                }
                
                return `${lastName} #${player.jersey}`;
            });

            // Create datasets for each week
            const datasets = [];
            const weekOrder = [1, 2, 3, 4];
            
            weekOrder.forEach(weekNum => {
                const weekData = allPlayers.map(player => {
                    return player.weeks[weekNum] ? player.weeks[weekNum].snaps : 0;
                });

                const weekInfo = teamData.weeks.find(w => w.week === weekNum);
                const opponent = weekInfo ? weekInfo.summary.opponent : 'Unknown';
                const color = weekColors[weekNum] || '#666666';

                datasets.push({
                    label: `Week ${weekNum} vs ${opponent}`,
                    data: weekData,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1,
                    borderRadius: 4,
                    players: allPlayers
                });
            });

            // Create Chart.js chart
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: false
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#333',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#CC0000',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                                title: function(context) {
                                    // Title callback receives an array, need to access first item
                                    if (!context || !context[0]) {
                                        return 'Player #Unknown';
                                    }
                                    
                                    const firstContext = context[0];
                                    
                                    // Access player data from the first context item
                                    if (firstContext.dataset && firstContext.dataset.players) {
                                        const player = firstContext.dataset.players[firstContext.dataIndex];
                                        if (player) {
                                            return `${player.name} #${player.jersey}`;
                                        }
                                    }
                                    return 'Player #Unknown';
                                },
                                label: function(context) {
                                    // Safe access to avoid errors
                                    if (!context || !context.dataset) {
                                        return 'Data not available';
                                    }
                                    
                                    const player = context.dataset.players[context.dataIndex];
                                    
                                    if (player) {
                                        const week = context.dataset.label.split(' ')[1];
                                        const weekData = player.weeks[parseInt(week)];
                                        
                                        // Get total snaps for this specific week
                                        const weekInfo = teamData.weeks.find(w => w.week === parseInt(week));
                                        const isOffensiveChart = canvasId.includes('wr') || canvasId.includes('te') || canvasId.includes('rb') || canvasId.includes('ol') || canvasId.includes('qb');
                                        const totalSnaps = weekInfo ? (isOffensiveChart ? weekInfo.summary.offensiveSnaps : weekInfo.summary.defensiveSnaps) : 0;
                                        
                                        const percentage = totalSnaps > 0 ? ((context.parsed.y / totalSnaps) * 100).toFixed(1) : 0;
                                        const started = weekData && weekData.started ? ' *' : '';
                                        return `Week ${week}: ${context.parsed.y} snaps (${percentage}%) • ${player.position}${started}`;
                                    }
                                    return 'Data not available';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 11
                                }
                            }
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
        }

        // Create special teams chart
        function createSpecialTeamsChart(canvasId, positionGroup, side) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            
            // Get active filter units
            const getActiveUnits = () => {
                const checkboxes = document.querySelectorAll('.unit-filters input[type="checkbox"]:checked');
                return Array.from(checkboxes).map(cb => cb.dataset.unit);
            };
            
            // Get all special teams players across all weeks
            const allPlayers = [];
            const playerMap = new Map();

            teamData.weeks.forEach(week => {
                if (week[side] && week[side][positionGroup]) {
                    week[side][positionGroup].forEach(player => {
                        const key = `${player.name}_${player.jersey}`;
                        if (!playerMap.has(key)) {
                            playerMap.set(key, {
                                name: player.name,
                                jersey: player.jersey,
                                position: player.position,
                                weeks: {}
                            });
                        }
                        playerMap.get(key).weeks[week.week] = {
                            totalSnaps: player.totalSnaps,
                            kret: player.kret,
                            kcov: player.kcov,
                            pret: player.pret,
                            pcov: player.pcov,
                            fgblk: player.fgblk,
                            fgk: player.fgk,
                            opponent: player.opponent
                        };
                    });
                }
            });

            // Convert to array and filter by active units
            const activeUnits = getActiveUnits();
            allPlayers.push(...Array.from(playerMap.values()));
            
            // Add returner data to players
            allPlayers.forEach(player => {
                const returnerInfo = returnerData ? returnerData.get(player.jersey) : null;
                if (returnerInfo) {
                    player.returnerInfo = returnerInfo;
                    console.log(`Player ${player.name} #${player.jersey} is a returner:`, returnerInfo);
                }
            });
            
            // Filter players who have snaps in active units
            const filteredPlayers = allPlayers.filter(player => {
                return activeUnits.some(unit => {
                    return Object.values(player.weeks).some(week => week[unit] > 0);
                });
            });
            
            // Sort by total snaps for the active units (most to least)
            filteredPlayers.sort((a, b) => {
                const aTotal = activeUnits.reduce((sum, unit) => {
                    return sum + Object.values(a.weeks).reduce((weekSum, week) => weekSum + week[unit], 0);
                }, 0);
                const bTotal = activeUnits.reduce((sum, unit) => {
                    return sum + Object.values(b.weeks).reduce((weekSum, week) => weekSum + week[unit], 0);
                }, 0);
                return bTotal - aTotal;
            });

            // Prepare data for Chart.js
            const labels = filteredPlayers.map(player => {
                const nameParts = player.name.split(' ');
                let lastName = nameParts[nameParts.length - 1];
                
                // Handle name suffixes
                if (lastName === 'Jr.' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' Jr.';
                } else if (lastName === 'JR' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' JR';
                } else if (lastName === 'II' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' II';
                } else if (lastName === 'III' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' III';
                } else if (lastName === 'Sr.' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' Sr.';
                } else if (lastName === 'SR' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' SR';
                } else if (lastName === 'I' && nameParts.length > 1) {
                    lastName = nameParts[nameParts.length - 2] + ' I';
                }
                
                let label = `${lastName} #${player.jersey}`;
                
                // Add returner badges based on active units
                if (player.returnerInfo) {
                    const badges = [];
                    if (activeUnits.includes('pret') && player.returnerInfo.isPRReturner) {
                        badges.push('PR');
                    }
                    if (activeUnits.includes('kret') && player.returnerInfo.isKRReturner) {
                        badges.push('KR');
                    }
                    if (badges.length > 0) {
                        label += ` [${badges.join(', ')}]`;
                    }
                }
                
                return label;
            });

            // Create datasets for each special teams unit (only active ones)
            const datasets = [];
            const unitConfigs = [
                { key: 'kret', label: 'Kick Return', color: '#FF6B6B' },
                { key: 'kcov', label: 'Kick Coverage', color: '#4ECDC4' },
                { key: 'pret', label: 'Punt Return', color: '#45B7D1' },
                { key: 'pcov', label: 'Punt Coverage', color: '#96CEB4' },
                { key: 'fgblk', label: 'Field Goal Block', color: '#FFEAA7' },
                { key: 'fgk', label: 'Field Goal Kick', color: '#DDA0DD' }
            ];

            unitConfigs.forEach(unit => {
                if (activeUnits.includes(unit.key)) {
                    datasets.push({
                        label: unit.label,
                        data: filteredPlayers.map(player => {
                            return Object.values(player.weeks).reduce((sum, week) => sum + week[unit.key], 0);
                        }),
                        backgroundColor: filteredPlayers.map(player => {
                            // Make returner bars stand out with different styling
                            if (player.returnerInfo) {
                                if ((unit.key === 'pret' && player.returnerInfo.isPRReturner) || 
                                    (unit.key === 'kret' && player.returnerInfo.isKRReturner)) {
                                    return unit.color; // Keep original color but we'll add border
                                }
                            }
                            return unit.color;
                        }),
                        borderColor: filteredPlayers.map(player => {
                            // Add distinctive border for returners
                            if (player.returnerInfo) {
                                if ((unit.key === 'pret' && player.returnerInfo.isPRReturner) || 
                                    (unit.key === 'kret' && player.returnerInfo.isKRReturner)) {
                                    return '#FFD700'; // Gold border for returners
                                }
                            }
                            return unit.color;
                        }),
                        borderWidth: filteredPlayers.map(player => {
                            // Thicker border for returners
                            if (player.returnerInfo) {
                                if ((unit.key === 'pret' && player.returnerInfo.isPRReturner) || 
                                    (unit.key === 'kret' && player.returnerInfo.isKRReturner)) {
                                    return 3; // Thick gold border
                                }
                            }
                            return 1;
                        }),
                        borderRadius: 4
                    });
                }
            });

            // Destroy existing chart if it exists
            if (window.stChart) {
                window.stChart.destroy();
            }

            // Create Chart.js chart
            window.stChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: false
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#333',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#CC0000',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                                title: function(context) {
                                    // Safe access to avoid errors
                                    if (!context || !context[0]) {
                                        return 'Player #Unknown';
                                    }
                                    
                                    const player = filteredPlayers[context[0].dataIndex];
                                    
                                    if (player) {
                                        let title = `${player.name} #${player.jersey}`;
                                        
                                        // Add returner badges to title
                                        if (player.returnerInfo) {
                                            const badges = [];
                                            if (player.returnerInfo.isPRReturner) {
                                                badges.push('PR');
                                            }
                                            if (player.returnerInfo.isKRReturner) {
                                                badges.push('KR');
                                            }
                                            if (badges.length > 0) {
                                                title += ` [${badges.join(', ')}]`;
                                            }
                                        }
                                        return title;
                                    }
                                    return 'Player #Unknown';
                                },
                                label: function(context) {
                                    const player = filteredPlayers[context.dataIndex];
                                    const unitSnaps = context.parsed.y;
                                    
                                    let label = `${context.dataset.label}: ${unitSnaps} snaps`;
                                    
                                    // Add return statistics if player is a returner for this unit
                                    if (player.returnerInfo) {
                                        const unit = context.dataset.label.toLowerCase();
                                        if (unit.includes('punt return') && player.returnerInfo.isPRReturner) {
                                            label += `\nPunt Returns: ${player.returnerInfo.puntReturns} (${player.returnerInfo.puntReturnYards} yards, ${player.returnerInfo.puntReturnYPA} YPA)`;
                                        } else if (unit.includes('kick return') && player.returnerInfo.isKRReturner) {
                                            label += `\nKick Returns: ${player.returnerInfo.kickReturns} (${player.returnerInfo.kickReturnYards} yards, ${player.returnerInfo.kickReturnYPA} YPA)`;
                                        }
                                    }
                                    
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 11
                                }
                            }
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

        }

        // Setup event listeners
        function setupEventListeners() {
            // Tab switching
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    const targetTab = this.getAttribute('data-tab');
                    
                    // Update tab states
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                    
                    this.classList.add('active');
                    document.getElementById(targetTab).classList.add('active');
                });
            });

            // Special teams filter checkboxes
            document.querySelectorAll('.unit-filters input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    createSpecialTeamsChart('st-chart', 'special_teams', 'special_teams');
                });
            });

            // Special teams Only buttons
            document.querySelectorAll('.only-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const targetUnit = this.dataset.unit;
                    
                    // Uncheck all checkboxes first
                    document.querySelectorAll('.unit-filters input[type="checkbox"]').forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    
                    // Check only the target unit checkbox
                    const targetCheckbox = document.querySelector(`input[data-unit="${targetUnit}"]`);
                    if (targetCheckbox) {
                        targetCheckbox.checked = true;
                    }
                    
                    // Refresh the chart
                    createSpecialTeamsChart('st-chart', 'special_teams', 'special_teams');
                });
            });

        }
        // Populate data table for a specific section
        function populateDataTable(section) {
            console.log('Populating data table for section:', section);
            if (!teamData) {
                console.log('No team data available');
                return;
            }
            
            const tableBody = document.getElementById(`${section}-table-body`);
            if (!tableBody) {
                console.log('Table body not found for section:', section);
                return;
            }
            
            // Clear existing content
            tableBody.innerHTML = '';
            
            // Get players for this section
            let side, positionGroup;
            
            if (section === 'st') {
                // Special teams data
                side = 'special_teams';
                positionGroup = 'special_teams';
            } else {
                // Offense/Defense data
                side = section.includes('wr') || section.includes('te') || section.includes('rb') || section.includes('ol') || section.includes('qb') ? 'offense' : 'defense';
                
                // Map section names to actual data structure keys
                if (section === 'wr') positionGroup = 'wide_receivers';
                else if (section === 'te') positionGroup = 'tight_ends';
                else if (section === 'rb') positionGroup = 'running_backs';
                else if (section === 'ol') positionGroup = 'offensive_line';
                else if (section === 'qb') positionGroup = 'quarterbacks';
                else if (section === 'dl') positionGroup = 'defensive_line';
                else if (section === 'lb') positionGroup = 'linebackers';
                else if (section === 'db') positionGroup = 'defensive_backs';
                else positionGroup = section.replace(/^(off|def)-/, '');
            }
            
            console.log('Looking for data in:', side, positionGroup);
            console.log('Available weeks:', teamData.weeks.map(w => w.week));
            
            const allPlayers = [];
            const playerMap = new Map();
            
            teamData.weeks.forEach(week => {
                console.log('Processing week:', week.week);
                if (week[side] && week[side][positionGroup]) {
                    console.log('Found data for week', week.week, ':', week[side][positionGroup].length, 'players');
                    week[side][positionGroup].forEach(player => {
                        const key = `${player.name}_${player.jersey}`;
                        if (!playerMap.has(key)) {
                            playerMap.set(key, {
                                name: player.name,
                                jersey: player.jersey,
                                position: player.position,
                                weeks: {}
                            });
                        }
                        
                        const weekData = playerMap.get(key);
                        if (section === 'st') {
                            // Special teams data - sum all unit snaps
                            const totalSnaps = (player.kret || 0) + (player.kcov || 0) + (player.pret || 0) + (player.pcov || 0) + (player.fgblk || 0) + (player.fgk || 0);
                            weekData.weeks[week.week] = {
                                snaps: totalSnaps,
                                started: false // Special teams doesn't have "started" concept
                            };
                        } else {
                            // Regular offense/defense data
                            weekData.weeks[week.week] = {
                                snaps: player.snaps,
                                started: player.started
                            };
                        }
                    });
                } else {
                    console.log('No data found for week', week.week, 'in', side, positionGroup);
                }
            });
            
            console.log('Total players found:', playerMap.size);
            
            // Convert to array and sort by total snaps
            allPlayers.push(...playerMap.values());
            allPlayers.sort((a, b) => {
                const aTotal = Object.values(a.weeks).reduce((sum, week) => sum + week.snaps, 0);
                const bTotal = Object.values(b.weeks).reduce((sum, week) => sum + week.snaps, 0);
                return bTotal - aTotal;
            });
            
            console.log('Players to display:', allPlayers.length);
            
            // Populate table rows
            allPlayers.forEach(player => {
                const row = document.createElement('tr');
                
                const week1Snaps = player.weeks[1]?.snaps || 0;
                const week2Snaps = player.weeks[2]?.snaps || 0;
                const week3Snaps = player.weeks[3]?.snaps || 0;
                const week4Snaps = player.weeks[4]?.snaps || 0;
                const totalSnaps = week1Snaps + week2Snaps + week3Snaps + week4Snaps;
                
                row.innerHTML = `
                    <td class="player-name">${player.name}</td>
                    <td class="jersey">#${player.jersey}</td>
                    <td>${player.position}</td>
                    <td class="snap-count">${week1Snaps}</td>
                    <td class="snap-count">${week2Snaps}</td>
                    <td class="snap-count">${week3Snaps}</td>
                    <td class="snap-count">${week4Snaps}</td>
                    <td class="total">${totalSnaps}</td>
                `;
                
                tableBody.appendChild(row);
            });
            
            console.log('Table populated with', allPlayers.length, 'rows');
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', loadTeamData);
    </script>
