const express = require('express');
const axios = require('axios');
const Website = require('../models/Website');
const router = express.Router();

// ✅ GET all websites (Fixed)
router.get('/', async (req, res) => {
    try {
        const websites = await Website.find();
        res.json(websites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Check website uptime
router.get('/:id/check', async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);
        if (!website) return res.status(404).json({ error: "Website not found" });

        const response = await axios.get(website.url);
        website.status = response.status === 200 ? 'UP' : 'DOWN';
        website.lastChecked = new Date();
        await website.save();

        res.json({ status: website.status, lastChecked: website.lastChecked });
    } catch (error) {
        res.json({ status: "DOWN", error: "Website is not reachable" });
    }
});

// ✅ POST - Add a new website
router.post('/', async (req, res) => {
    try {
        const { name, url } = req.body;
        const newWebsite = new Website({ name, url });
        await newWebsite.save();
        res.json(newWebsite);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ PUT - Update website status
router.put('/:id', async (req, res) => {
    try {
        const updatedWebsite = await Website.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        );
        res.json(updatedWebsite);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE - Remove a website
router.delete('/:id', async (req, res) => {
    try {
        await Website.findByIdAndDelete(req.params.id);
        res.json({ message: "Website deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
