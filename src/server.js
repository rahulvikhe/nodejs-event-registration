// server.js

const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'event_registration'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
});

// Create registration table if not exists
db.query(`CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(15)
)`, (err) => {
  if (err) {
    throw err;
  }
  console.log('Registrations table created');
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.post('/register', (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'INSERT INTO registrations (name, email, phone) VALUES (?, ?, ?)';
  db.query(sql, [name, email, phone], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to register' });
    }
    res.json({ message: 'Registration successful' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});