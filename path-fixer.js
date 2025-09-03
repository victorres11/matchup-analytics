// Path Fixer for GitHub Pages
// This script fixes absolute image paths to work with GitHub Pages

(function() {
    console.log('Path fixer initialized...');
    
    // Function to fix image paths
    function fixImagePaths() {
        // Find all img elements with absolute paths
        const images = document.querySelectorAll('img[src^="/"]');
        
        images.forEach(img => {
            const oldSrc = img.src;
            // Convert absolute paths to relative paths
            const newSrc = oldSrc.replace(/^\//, './');
            
            if (oldSrc !== newSrc) {
                console.log(`Fixing image path: ${oldSrc} → ${newSrc}`);
                img.src = newSrc;
            }
        });
        
        // Also fix any background images in CSS
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const backgroundImage = style.backgroundImage;
            
            if (backgroundImage && backgroundImage.includes('url("/')) {
                console.log('Found background image with absolute path:', backgroundImage);
                // Note: CSS background images are harder to fix dynamically
            }
        });
    }
    
    // Function to fix paths in dynamically created content
    function createPathFixer() {
        // Create a MutationObserver to watch for new DOM elements
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // New elements added, fix their paths
                    setTimeout(fixImagePaths, 100);
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('Path fixer observer started');
    }
    
    // Fix paths when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(fixImagePaths, 500);
            createPathFixer();
        });
    } else {
        setTimeout(fixImagePaths, 500);
        createPathFixer();
    }
    
    // Also fix paths periodically (in case content loads dynamically)
    setInterval(fixImagePaths, 2000);
    
    // Override the Image constructor to catch dynamically created images
    const OriginalImage = window.Image;
    window.Image = function() {
        const img = new OriginalImage(...arguments);
        
        // Fix the src if it's an absolute path
        if (img.src && img.src.startsWith(window.location.origin + '/')) {
            const newSrc = img.src.replace(window.location.origin + '/', './');
            console.log(`Fixing dynamic image: ${img.src} → ${newSrc}`);
            img.src = newSrc;
        }
        
        return img;
    };
    
    console.log('Path fixer setup complete');
})();
