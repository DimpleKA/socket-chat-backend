const express = require('express');
const cors = require('cors');
const app = express();
const dbConnect = require('./db');

// Call the dbConnect function to establish a connection with the MongoDB database
dbConnect();

// Middleware to parse JSON bodies of incoming requests
app.use(express.json());

// Enable CORS
app.use(cors());

// Define routes or other middleware as needed
// For example:
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the Express server
const PORT = process.env.PORT || 5000; // Set the port to either the environment port or 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
