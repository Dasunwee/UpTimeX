require('dotenv').config();

console.log('MongoDB URI:', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require("./routes/api"); // Import API routes

const cron = require('node-cron');
const axios = require('axios');
const Website = require('./models/Website');
const connectDB = require("./config/db");
connectDB();


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json()); // Enable JSON parsing

// Routes
app.use("/", apiRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({ message: "UpTimeX API is running 🚀" });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

const websiteRoutes = require('./routes/websiteRoutes');
app.use('/api/websites', websiteRoutes);

const helmet = require('helmet');

app.use(helmet());

// Function to check website uptime
const checkWebsites = async () => {
    console.log("🔍 Checking website uptime...");
    const websites = await Website.find();
    
    for (const site of websites) {
        try {
            const response = await axios.get(site.url, { timeout: 5000 });
            site.status = response.status === 200 ? "UP" : "DOWN";
        } catch (error) {
            site.status = "DOWN"; // If request fails, mark as DOWN
        }
        site.lastChecked = new Date();
        await site.save();
    }
    console.log("✅ Uptime check completed.");
};

// Run uptime checks every 5 minutes
cron.schedule('*/5 * * * *', checkWebsites);


