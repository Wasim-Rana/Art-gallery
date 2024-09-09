const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = './data/db.json';
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

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
app.get('/arts/:id', (req, res) => {
	fs.readFile(path, (err, data) => {
		if (err) {
			res.status(500).send('Internal Server Error');
			return;
		}
		let items = JSON.parse(data);
		const itemId = req.params.reference;
		const item = items.find(item => item.reference === itemId);
		if(item) {
			res.json(item);
		} else {
			res.status(404).send('Art not found');
		}
	});
});

// Create new Art
app.post('/arts', (req, res) => {
	fs.readFile(path, (err, data) => {
		if(err) {
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

// Update Art Listing (For Enquiries)
app.put('/arts/:id', (req,res) => {
	fs.readFile(path, (err, data) => {
		if (err) {
			res.status(500).send('Internal Server Error');
			return;
		}
		let items = JSON.parse(data);
		const itemId = req.params.reference;
		items = items.map(item => item.reference === itemId ? req.body : item );
		fs.writeFile(path, JSON.stringify(items, null, 2), (err) => {
			if(err) {
				res.status(500).send('Internal Server Error');
				return;
			}
			res.json(req.body);
		});
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Art Gallery Server running on port ${PORT}`);
});

