// Tie pie data no servera

console.log("Server is starting...");

// Use import instead of require
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow Vue frontend
  credentials: true
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',       // Replace with your MySQL username
  password: '@AdamsSaf',       // Replace with your MySQL password
  database: 'fitlib'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Tavi GET maršruti (nekas netika mainīts)
app.get('/users', (req, res) => { 
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/dips', (req, res) => {
  db.query('SELECT * FROM dips', (err, results1) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results1);
  });
});

app.get('/squat', (req, res) => {
  db.query('SELECT * FROM squats', (err, results2) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results2);
  });
});

app.get('/pullups', (req, res) => {
  db.query('SELECT * FROM pullups', (err, results3) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results3);
  });
});

// Tavi POST maršruti (nekas netika mainīts)
app.post('/register', (req, res) => {
  const { username, password, email, role = 'user' } = req.body;

  // Check if username exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Datubāzes kļūda' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Lietotājvārds jau ir aizņemts' });
    }

    // Insert new user (handling NULL values for email and role)
    db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, password, email || null, role || null],
      (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Neizdevās izveidot lietotāju' });
        }
        res.json({ message: 'Lietotājs veiksmīgi reģistrēts' });
      }
    );
  });
});

// Šeit ir tavs oriģinālais POST /addpullups, nekas nemainīts, tikai ar komentāriem
app.post('/addpullups', (req, res) => {
  const { username, date, reps } = req.body;
  console.log('Received data:', { username, date, reps });  // Log incoming data

  // Check for missing fields
  if (!username || !date || !reps) {
    console.error('Missing required fields:', { username, date, reps });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Ensure date is in correct format (ISO 8601 format)
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date format:', date);
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Insert the data into the database
  db.query(
    `INSERT INTO pullups (username, date, reps) VALUES (?, ?, ?)`,
    [username, date, reps],
    (err, result) => {
      if (err) {
        console.error('Error saving workout:', err.message);
        return res.status(500).json({ error: 'Neizdevās saglabāt treniņu' });
      }
      console.log('Treniņš pievienots:', result);
      res.json({ message: 'Treniņš pievienots' });
    }
  );
});

// Ja vēl vajag citus POST maršrutus - šeit vari tos pievienot

// Server start
const PORT = 5000; 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
