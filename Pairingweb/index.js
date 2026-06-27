const express = require('express');
const path = require('path');
const { startBot } = require('./pair');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// API endpoint to trigger pairing code
app.get('/api/pair', async (req, res) => {
    const phone = req.query.phone;
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }
    
    try {
        const code = await startBot(phone);
        res.json({ code: code });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate pairing code. Try again." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

