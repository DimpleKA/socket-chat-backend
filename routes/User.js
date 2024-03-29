const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const fs = require('fs');

// Middleware to log IP addresses, email, and time
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const email = req.body.email || ''; // Extract email from request body
    const timestamp = new Date().toISOString();
    const log = `IP: ${ip} | Email: ${email} | Time: ${timestamp} | ${req.method} ${req.originalUrl}\n`;

    // Append log to a text file
    fs.appendFile('access.log', log, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });

    next();
});

// Route to create a new user
router.post('/register', async (req, res) => {
    const { name, email, password, gender, age, dpurl } = req.body;
    try {
        const newUser = new User({ name, email, password, gender, age, dpurl });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a specific user by ID
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// Route to update a specific user by ID
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    if (req.body.gender != null) {
        res.user.gender = req.body.gender;
    }
    if (req.body.age != null) {
        res.user.age = req.body.age;
    }
    if (req.body.dpurl != null) {
        res.user.dpurl = req.body.dpurl;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a specific user by ID
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware function to get user by ID
async function getUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        res.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = router;
