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

// ado dipus
app.post('/adddips', (req, res) => {
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
    `INSERT INTO dips (username, date, reps) VALUES (?, ?, ?)`,
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

// ado squats
app.post('/addsquats', (req, res) => {
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
    `INSERT INTO squats (username, date, reps) VALUES (?, ?, ?)`,
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

app.post('/reviews', (req, res) => {
  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({ error: 'Missing username or review text' });
  }

  // First, get the user's email from the users table
  db.query(
    'SELECT email FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error('Error fetching user email:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const email = results[0].email;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      // Now insert the review using the email
      db.query(
        'INSERT INTO reviews (email, review, date) VALUES (?, ?, ?)',
        [email, review, today],
        (err, result) => {
          if (err) {
            console.error('Error inserting review:', err.message);
            return res.status(500).json({ error: 'Neizdevās pievienot atsauksmi' });
          }
          console.log(`Review by ${email} added`);
          res.json({ message: 'Atsauksme veiksmīgi pievienota' });
        }
      );
    }
  );
});


app.delete('/delete-account/:username', (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Delete from all workout tables and then the users table
  const tables = ['pullups', 'dips', 'squats', 'users'];
  let completed = 0;
  let hasError = false;

  tables.forEach(table => {
    db.query(`DELETE FROM ${table} WHERE username = ?`, [username], (err, result) => {
      if (err) {
        console.error(`Error deleting from ${table}:`, err.message);
        if (!hasError) {
          hasError = true;
          return res.status(500).json({ error: `Failed to delete from ${table}` });
        }
        return;
      }

      completed++;
      if (completed === tables.length && !hasError) {
        console.log(`All data for ${username} deleted`);
        res.json({ message: 'User and all related data deleted successfully' });
      }
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

