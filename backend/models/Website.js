const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: String, enum: ["UP", "DOWN", "UNKNOWN"], default: "UNKNOWN" },
    lastChecked: { type: Date, default: null }
});

module.exports = mongoose.model('Website', WebsiteSchema);