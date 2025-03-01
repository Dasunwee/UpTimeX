const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
    name: String,
    url: String,
    status: { type: String, default: "active" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Website', WebsiteSchema);
