const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // This should come before any routes are defined

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Mock database
const users = {};

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = hashedPassword;
    res.send('Registered successfully');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!users[username]) {
        return res.status(404).send('Cannot find user');
    }
    const isMatch = await bcrypt.compare(password, users[username]);
    if (isMatch) {
        req.session.username = username; // Create session
        res.redirect('/dashboard.html');
    } else {
        res.status(401).send('Login failed');
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.username) {
        res.sendFile(__dirname + '/public/dashboard.html'); // Adjust based on your actual file structure
    } else {
        res.redirect('/login.html');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


