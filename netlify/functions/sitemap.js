// Netlify Function to proxy sitemap.xml from backend
exports.handler = async (_event, _context) => {
    try {
        const response = await fetch('https://le-focus-backend.onrender.com/sitemap.xml');
        
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: 'Error fetching sitemap from backend'
            };
        }
        
        const xml = await response.text();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            },
            body: xml
        };
    } catch (error) {
        console.error('Sitemap proxy error:', error);
        return {
            statusCode: 500,
            body: 'Error generating sitemap'
        };
    }
};
