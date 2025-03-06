require('dotenv').config();

console.log('MongoDB URI:', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require("./routes/api"); // Import API routes

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




