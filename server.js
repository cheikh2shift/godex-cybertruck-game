const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve OBJ files with correct MIME type
app.use((req, res, next) => {
    if (req.url.endsWith('.obj') || req.url.endsWith('.mtl')) {
        res.setHeader('Content-Type', 'model/obj');
    }
    if (req.url.endsWith('.mtl')) {
        res.setHeader('Content-Type', 'model/mtl');
    }
    next();
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 Cybertruck Infinite Run`);
    console.log(`   Server running at: http://localhost:${PORT}`);
    console.log(`   Open this URL in your browser to play!\n`);
});
