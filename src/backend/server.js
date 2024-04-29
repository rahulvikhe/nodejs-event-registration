const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mypassword@123',
  database: 'event_registration'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
});

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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/registrations', (req, res) => {
  const sql = 'SELECT * FROM registrations';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch registrations' });
    }
    res.json(results);
  });
});

app.get('/registrations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM registrations WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch registration' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json(result[0]);
  });
});

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

app.put('/registrations/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const sql = 'UPDATE registrations SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(sql, [name, email, phone, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update registration' });
    }
    res.json({ message: 'Registration updated successfully' });
  });
});

app.delete('/registrations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM registrations WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete registration' });
    }
    res.json({ message: 'Registration deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
