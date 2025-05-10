// Tie pie data no servera

console.log("Server is starting...");

// Use import instead of require
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


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

// Routes
app.get('/users', (req, res) => { 
  db.query('SELECT * FROM users', (err, results) => { //visam sim butu jasalecto tu nezini ar kuru pa
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

// Start server
const PORT = 5000; 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});