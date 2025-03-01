require('dotenv').config();

console.log('MongoDB URI:', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Default route
app.get('/', (req, res) => {
    res.send('UpTimeX API is running 🚀');
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
