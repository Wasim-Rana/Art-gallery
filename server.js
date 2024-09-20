const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

// Path to JSON file for arts (still using this for arts data)
const path = './data/db.json';

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',  // Replace with your MySQL host
    user: 'root',       // Replace with your MySQL username
    password: '047881',       // Replace with your MySQL password
    database: 'Art-galleryDB' // Replace with your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.stack);
        return;
    }
    console.log('MySQL connected as id ' + db.threadId);
});

app.use(bodyParser.json());
app.use(cors());

/* ------- User Authentication (using MySQL) ------- */

// User Registration
app.post('/register', (req, res) => {
    const { uname, email, u_password } = req.body;

    console.log('Received registration data:', req.body); // Log incoming data

    const query = 'INSERT INTO users (uname, email, u_password) VALUES (?, ?, ?)';
    db.query(query, [uname, email, u_password], (err, result) => {
        if (err) {
            console.error('Error registering user:', err); // Log error
            return res.status(500).json({ message: 'Registration failed.', error: err });
        }
        console.log('User registered with ID:', result.insertId); // Log success
        res.json({ message: 'User registered successfully!', userId: result.insertId });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Received login data:', req.body); // Log incoming data

    const query = 'SELECT * FROM users WHERE uname = ? AND u_password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error logging in user:', err); // Log error
            return res.status(500).json({ message: 'Login failed.', error: err });
        }

        if (results.length > 0) {
            console.log('User logged in:', results[0].uname); // Log success
            res.json({ message: 'Login successful!', username: results[0].uname });
        } else {
            console.log('Invalid login attempt for username:', username); // Log invalid attempt
            res.status(401).json({ message: 'Invalid username or password.' });
        }
    });
});

/* ------- Art Gallery Management (using JSON file) ------- */

// List all available Arts
app.get('/arts', (req, res) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Get an Art by Reference Number
app.get('/arts/:reference', (req, res) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        let items = JSON.parse(data);
        const itemReference = req.params.reference;
        const item = items.find(item => item.reference === itemReference);
        if (item) {
            res.json(item);
        } else {
            res.status(404).send('Art not found');
        }
    });
});

// Create new Art
app.post('/arts', (req, res) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        const items = JSON.parse(data);
        const newItem = req.body;
        items.push(newItem);
        fs.writeFile(path, JSON.stringify(items, null, 2), (err) => {
            if (err) {
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).json(newItem);
        });
    });
});

// Update Art Listing
app.put('/arts/:reference', (req, res) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        let items = JSON.parse(data);
        const itemReference = req.params.reference;
        items = items.map(item => item.reference === itemReference ? req.body : item);
        fs.writeFile(path, JSON.stringify(items, null, 2), (err) => {
            if (err) {
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(req.body);
        });
    });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Art Gallery Server running on port ${PORT}`);
});