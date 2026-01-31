const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Helper to get file path
const getFilePath = (filename) => path.join(DATA_DIR, `${filename}.json`);

// Generic GET for data
router.get('/:filename', async (req, res) => {
    const { filename } = req.params;
    const validFiles = ['courses', 'testimonials', 'gallery', 'events', 'general'];

    if (!validFiles.includes(filename)) {
        return res.status(400).json({ error: 'Invalid data file' });
    }

    try {
        const data = await fs.readFile(getFilePath(filename), 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Error reading data' });
    }
});

// Generic POST to update data (Admin)
router.post('/:filename', async (req, res) => {
    const { filename } = req.params;
    const validFiles = ['courses', 'testimonials', 'gallery', 'events', 'general'];

    if (!validFiles.includes(filename)) {
        return res.status(400).json({ error: 'Invalid data file' });
    }

    try {
        await fs.writeFile(getFilePath(filename), JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error writing data' });
    }
});

module.exports = router;
