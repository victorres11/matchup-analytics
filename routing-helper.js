// Routing Helper for Weekly Matchup Analytics
// This utility helps handle client-side routing for different matchups

class MatchupRouter {
    constructor() {
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Check if we have a route from the URL or localStorage
        this.currentRoute = window.matchupRoute || this.getRouteFromUrl();
        
        if (this.currentRoute) {
            console.log('Current matchup route:', this.currentRoute);
            this.handleRoute(this.currentRoute);
        }
        
        // Listen for popstate events (back/forward buttons)
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.route) {
                this.currentRoute = event.state.route;
                this.handleRoute(this.currentRoute);
            }
        });
    }

    getRouteFromUrl() {
        const path = window.location.pathname;
        // Remove the base path for GitHub Pages
        const basePath = '/matchup-analytics';
        let cleanPath = path;
        
        if (path.startsWith(basePath)) {
            cleanPath = path.substring(basePath.length);
        }
        
        if (cleanPath.startsWith('/weekly-matchups/')) {
            return cleanPath.replace('/weekly-matchups/', '');
        }
        return null;
    }

    handleRoute(route) {
        // Parse the route to extract team and week information
        const parts = route.split('-');
        if (parts.length >= 3) {
            const team = parts.slice(0, -2).join('-'); // Everything except last 2 parts
            const week = parts.slice(-2).join('-'); // Last 2 parts
            
            console.log(`Team: ${team}, Week: ${week}`);
            
            // You can dispatch a custom event or call a function to update your app
            this.dispatchMatchupEvent(team, week, route);
        }
    }

    dispatchMatchupEvent(team, week, fullRoute) {
        // Create a custom event that your app can listen to
        const event = new CustomEvent('matchupRouteChange', {
            detail: {
                team: team,
                week: week,
                route: fullRoute,
                timestamp: Date.now()
            }
        });
        
        window.dispatchEvent(event);
    }

    // Navigate to a specific matchup
    navigateToMatchup(team, week) {
        const route = `${team}-${week}`;
        const basePath = '/matchup-analytics';
        const url = `${basePath}/weekly-matchups/${route}`;
        
        // Update the URL
        window.history.pushState({ route }, '', url);
        
        // Update the current route
        this.currentRoute = route;
        
        // Handle the route change
        this.handleRoute(route);
        
        return url;
    }

    // Get current matchup info
    getCurrentMatchup() {
        if (!this.currentRoute) return null;
        
        const parts = this.currentRoute.split('-');
        if (parts.length >= 3) {
            const team = parts.slice(0, -2).join('-');
            const week = parts.slice(-2).join('-');
            
            return {
                team: team,
                week: week,
                route: this.currentRoute
            };
        }
        
        return null;
    }

    // Create a navigation link
    createMatchupLink(team, week, text = null) {
        const route = `${team}-${week}`;
        const basePath = '/matchup-analytics';
        const url = `${basePath}/weekly-matchups/${route}`;
        const linkText = text || `${team} Week ${week}`;
        
        return `<a href="${url}" onclick="window.matchupRouter.navigateToMatchup('${team}', '${week}'); return false;">${linkText}</a>`;
    }
}

// Initialize the router when the page loads
window.matchupRouter = new MatchupRouter();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatchupRouter;
}
