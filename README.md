# Weekly Matchup Analytics

A web application for analyzing weekly sports matchups, featuring Big Ten Conference analytics with client-side routing for different matchups.

## Features

- Interactive matchup analysis
- Big Ten Conference statistics
- Modern, responsive web interface
- Real-time data visualization
- **Client-side routing for matchup URLs** (e.g., `/weekly-matchups/penn-state-week-2`)

## URL Structure

The application supports URLs in the format:
```
/weekly-matchups/{team}-{week}
```

### Examples:
- `/weekly-matchups/penn-state-week-2` - Penn State Week 2 matchup
- `/weekly-matchups/michigan-week-1` - Michigan Week 1 matchup
- `/weekly-matchups/ohio-state-week-3` - Ohio State Week 3 matchup

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. Triggers on pushes to the main branch
2. Builds and deploys the application from the `dist/` folder
3. Makes the site available at: https://victorres11.github.io/matchup-analytics/

## Local Development

To run this project locally:

1. Clone the repository
2. Navigate to the project directory
3. Open `dist/index.html` in your web browser
4. Test routing by navigating to `dist/weekly-matchups/penn-state-week-2.html`

## Routing System

The application uses a client-side routing system that works with GitHub Pages:

### How It Works:
1. **404.html**: Catches all routes and redirects to the main app
2. **Routing Helper**: JavaScript utility for handling matchup routes
3. **URL Parsing**: Automatically extracts team and week information from URLs

### Using the Router in Your App:

```javascript
// Listen for route changes
window.addEventListener('matchupRouteChange', function(event) {
    const { team, week, route } = event.detail;
    console.log(`Navigated to: ${team} Week ${week}`);
    // Update your app UI here
});

// Get current matchup
const current = window.matchupRouter.getCurrentMatchup();
if (current) {
    console.log(`Current: ${current.team} Week ${current.week}`);
}

// Navigate programmatically
window.matchupRouter.navigateToMatchup('penn-state', 'week-2');
```

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- SVG graphics for logos and icons
- Client-side routing for SPA functionality

## Repository Structure

```
weekly-matchup-analytics/
├── dist/                           # Built application files
│   ├── assets/                     # CSS and JavaScript bundles
│   ├── weekly-matchups/            # Individual matchup pages
│   │   ├── penn-state-week-2.html # Penn State Week 2
│   │   └── michigan-week-1.html   # Michigan Week 1
│   ├── index.html                  # Main HTML file
│   ├── 404.html                    # 404 handler for routing
│   ├── demo-routes.html            # Routing demonstration page
│   ├── routing-helper.js           # Routing utility
│   ├── favicon.ico                 # Site favicon
│   └── *.svg                      # Logo and icon files
├── .github/workflows/              # GitHub Actions workflows
└── README.md                       # This file
```

## Testing the Routing

1. **Demo Page**: Visit `/demo-routes.html` to see the routing system in action
2. **Direct URLs**: Navigate directly to `/weekly-matchups/penn-state-week-2`
3. **Programmatic Navigation**: Use the router API in your JavaScript code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
