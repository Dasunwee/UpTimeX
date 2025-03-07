const express = require("express");
const router = express.Router();
const User = require("../models/User");

// API Status Check
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



// Delete a user by ID
router.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});

    // Update user by ID
router.put("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
});

module.exports = router;

