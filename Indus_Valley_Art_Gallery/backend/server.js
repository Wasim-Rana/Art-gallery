const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JWT for token-based authentication
const app = express();

// Load environment variables if using dotenv
require('dotenv').config();

// Path to JSON file for arts (still using this for arts data)
const path = './data/db.json';

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '7881',
    database: 'art_gallery_db',
    port: 3306,
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        return;
    }
    console.log('MySQL connected as id ' + db.threadId);
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Secret key for JWT (you should keep this secret and secure)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/* ------- User Authentication (using JWT) ------- */

// User Registration with Password Hashing
app.post('/register', async (req, res) => {
    const { uname, email, u_password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(u_password, 10);

        const query = 'INSERT INTO users (uname, email, u_password) VALUES (?, ?, ?)';
        db.query(query, [uname, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).json({ message: 'Registration failed.', error: err });
            }
            res.json({ message: 'User registered successfully!', userId: result.insertId });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Registration failed.' });
    }
});

// User Login with JWT Generation
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE uname = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error logging in user:', err);
            return res.status(500).json({ message: 'Login failed.', error: err });
        }

        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.u_password);

            if (match) {
                // Generate JWT token
                const token = jwt.sign(
                    { user_id: user.user_id, uname: user.uname, email: user.email }, // Payload
                    JWT_SECRET, // Secret key
                    { expiresIn: '1h' } // Token expiration time
                );

                res.json({ message: 'Login successful!', token });
            } else {
                res.status(401).json({ message: 'Invalid username or password.' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password.' });
        }
    });
});

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Attach user data from token to request object
        req.user = user;
        next();
    });
};


// Get current logged-in user profile data (Protected route)
app.get('/api/get-current-user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id; // Get user ID from the token (attached in middleware)
        
        // Query both 'users' and 'profile' tables
        const userQuery = `SELECT uname AS name, email FROM users WHERE user_id = ?`;
        const profileQuery = `SELECT phone, address, gender, pincode FROM profile WHERE uid = ?`;
        
        const [user] = await db.query(userQuery, [userId]);
        const [profile] = await db.query(profileQuery, [userId]);

        if (user && profile) {
            // Merge user and profile data and send it back
            const userData = { ...user, ...profile };
            return res.status(200).json(userData);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// API to update profile (Protected route)
app.put('/api/update-profile', authenticateJWT, (req, res) => {
    const { phone, address, gender, pincode } = req.body;

    // Log the incoming request data
    console.log('Update profile request for user:', req.user.user_id, { phone, address, gender, pincode });

    const query = 'UPDATE profile SET phone = ?, address = ?, gender = ?, pincode = ? WHERE uid = ?';
    db.query(query, [phone, address, gender, pincode, req.user.user_id], (err, result) => {
        if (err) {
            console.error('Error updating profile:', err.sqlMessage || err);
            return res.status(500).json({ message: 'Error updating profile' });
        }

        // Log result to debug
        console.log('Update result:', result);

        if (result.affectedRows === 0) {
            // If no rows were updated, insert new profile
            const insertQuery = 'INSERT INTO profile (uid, phone, address, gender, pincode) VALUES (?, ?, ?, ?, ?)';
            db.query(insertQuery, [req.user.user_id, phone, address, gender, pincode], (err, insertResult) => {
                if (err) {
                    console.error('Error inserting profile:', err.sqlMessage || err);
                    return res.status(500).json({ message: 'Error inserting profile' });
                }
                console.log('Profile created:', insertResult);
                res.json({ message: 'Profile created successfully' });
            });
        } else {
            console.log('Profile updated:', result);
            res.json({ message: 'Profile updated successfully' });
        }
    });
});


// Route to handle contact submission
app.post('/submit-contact', (req, res) => {
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

// Protected route to get contacts
app.get('/admin/contacts', authenticateJWT, (req, res) => {
    const sql = 'SELECT * FROM contacts';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching contacts:', err);
            return res.status(500).send('Internal server error');
        }

        res.json(results);
    });
});

// Other routes for art gallery management...

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
