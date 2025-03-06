const express = require('express');
const router = express.Router();
const User = require("../models/User");

// Base API route
router.get("/", (req, res) => {
    res.json({ message: "UpTimeX API is running 🚀" });
});

// Create a new user
router.post("/user", async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = new User({ name, email });
        await newUser.save();
        res.status(201).json({ message: "User created!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error saving user", error });
    }
});

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

module.exports = router; // ✅ Export router at the end
