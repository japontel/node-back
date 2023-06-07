'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.json());

const secretKey = '123456';

const users = [
  { id: 1, username: 'john', password: '$2b$10$ufuA2d0zSRn2C7r5IyqHs.1J8y1EG0yJg.5hZprDo0N52VR7/0xlu' } // password: 'password'
];


app.get('/', (req, res) => {
  res.send('Hello World');
});

// Create a login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

    // Return the token to the client
    res.json({ token });
  });
});

app.get('/protected', (req, res) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Token is valid, return protected data
    res.json({ message: 'Protected data', user: decoded });
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});