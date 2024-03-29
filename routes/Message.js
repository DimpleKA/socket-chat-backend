const express = require('express');
const router = express.Router();
const Message = require('../models/messageSchema');
const fs = require('fs');

// Middleware to log IP addresses, email, and time
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const email = req.body.fromemail || ''; // Extract email from request body
    const timestamp = new Date().toISOString();
    const log = `IP: ${ip} | Email: ${email} | Time: ${timestamp} | ${req.method} ${req.originalUrl}\n`;

    // Append log to a text file
    fs.appendFile('access.log', log, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });

    next();
});

// Route to create a new message
router.post('/create', async (req, res) => {
    const { name, fromemail, toemail, message } = req.body;
    try {
        const newMessage = new Message({ name, fromemail, toemail, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a specific message by ID
router.get('/:id', getMessage, (req, res) => {
    res.json(res.message);
});

// Route to update a specific message by ID
router.patch('/:id', getMessage, async (req, res) => {
    if (req.body.name != null) {
        res.message.name = req.body.name;
    }
    if (req.body.fromemail != null) {
        res.message.fromemail = req.body.fromemail;
    }
    if (req.body.toemail != null) {
        res.message.toemail = req.body.toemail;
    }
    if (req.body.message != null) {
        res.message.message = req.body.message;
    }
    try {
        const updatedMessage = await res.message.save();
        res.json(updatedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a specific message by ID
router.delete('/:id', getMessage, async (req, res) => {
    try {
        await res.message.remove();
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware function to get message by ID
async function getMessage(req, res, next) {
    try {
        const message = await Message.findById(req.params.id);
        if (message == null) {
            return res.status(404).json({ message: 'Cannot find message' });
        }
        res.message = message;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Export the router
module.exports = router;
