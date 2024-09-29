const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed
const app = express();

// Load environment variables if using dotenv
require('dotenv').config();

// Path to JSON file for arts (still using this for arts data)
const path = './data/db.json';

// MySQL connection setup using the updated parameters
const db = mysql.createConnection({
    host: 'localhost',              // Corrected host
    user: 'root',                   // Your MySQL username
    password: '7881',               // Your MySQL password
    database: 'art_gallery_db',     // Ensure this matches your database name
    port: 3306,                     // Default MySQL port
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:');
        console.error(`Error Code: ${err.code}`);
        console.error(`Error Message: ${err.message}`);
        console.error(`Error Stack: ${err.stack}`);
        return;
    }
    console.log('MySQL connected as id ' + db.threadId);
});

app.use(bodyParser.json());
app.use(cors());

/* ------- User Authentication (using MySQL) ------- */

// User Registration with Password Hashing
app.post('/register', async (req, res) => {
    const { uname, email, u_password } = req.body;

    console.log('Received registration data:', req.body); // Logging

    try {
        const hashedPassword = await bcrypt.hash(u_password, 10); // Hash the password with salt rounds = 10

        const query = 'INSERT INTO users (uname, email, u_password) VALUES (?, ?, ?)';
        db.query(query, [uname, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user:', err); // Log error
                return res.status(500).json({ message: 'Registration failed.', error: err });
            }
            console.log('User registered with ID:', result.insertId); // Log success
            res.json({ message: 'User registered successfully!', userId: result.insertId });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Registration failed.' });
    }
});

// User Login with Password Verification
    app.post('/login', (req, res) => {
        const { username, password } = req.body;

        console.log('Received login data:', req.body); // Logging

        const query = 'SELECT * FROM users WHERE uname = ?';
        db.query(query, [username], async (err, results) => {
            if (err) {
                console.error('Error logging in user:', err); // Log error
                return res.status(500).json({ message: 'Login failed.', error: err });
            }

            if (results.length > 0) {
                const user = results[0];
                const match = await bcrypt.compare(password, user.u_password); // Compare hashed passwords

                if (match) {
                    console.log('User logged in:', user.uname); // Log success
                    res.json({ message: 'Login successful!', username: user.uname });
                } else {
                    console.log('Invalid password for username:', username); // Log invalid attempt
                    res.status(401).json({ message: 'Invalid username or password.' });
                }
            } else {
                console.log('Invalid login attempt for username:', username); // Log invalid attempt
                res.status(401).json({ message: 'Invalid username or password.' });
            }
        });
    });


    //route to handle contact submission
    app.post('/submit-contact', (req, res) => {
        console.log('Contact form data received:', req.body);

        const { name, email, phone, message } = req.body;
        
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        const sql = 'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, email, phone, message], (err, result) => {
            if (err) {
                console.error('Error inserting contact into database:', err);
                return res.status(500).json({ error: 'Failed to save message. Please try again.' });
            }
            
            res.status(200).json({ message: 'Message submitted successfully!' });
        });
    });

    app.get('/admin/contacts', (req, res) => {
        const sql = 'SELECT * FROM contacts';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching contacts:', err);
                return res.status(500).send('Internal server error');
            }
    
            res.json(results);
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


// Server setup using environment variables
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Art Gallery Server running on port ${PORT}`);
});
