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
  password: '@Adams#17',       // Replace with your MySQL password
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

// LOGIN route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error('Database error during login:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
    }
  );
});

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
  const { username, date, reps, comment } = req.body;

  if (!username || !date || !reps) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert comment as-is (blank or filled)
  db.query(
    `INSERT INTO pullups (username, date, reps, comment) VALUES (?, ?, ?, ?)`,
    [username, date, reps, comment || ''], // send empty string if comment is undefined/null
    (err, result) => {
      if (err) {
        console.error('Error saving workout:', err.message);
        return res.status(500).json({ error: 'Neizdevās saglabāt treniņu' });
      }
      res.json({ message: 'Treniņš pievienots' });
    }
  );
});



// ado dipus
app.post('/adddips', (req, res) => {
  const { username, date, reps, comment } = req.body;

  if (!username || !date || !reps) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert comment as-is (empty or filled)
  db.query(
    `INSERT INTO dips (username, date, reps, comment) VALUES (?, ?, ?, ?)`,
    [username, date, reps, comment || ''], // use empty string if no comment
    (err, result) => {
      if (err) {
        console.error('Error saving dips workout:', err.message);
        return res.status(500).json({ error: 'Neizdevās saglabāt treniņu' });
      }
      res.json({ message: 'Treniņš pievienots' });
    }
  );
});


// ado squats
app.post('/addsquats', (req, res) => {
  console.log('Received request body:', req.body);
  
  const { username, date, reps, comment } = req.body;

  console.log('Parsed values - username:', username, 'date:', date, 'reps:', reps, 'comment:', comment);

  if (!username || !date || reps === undefined || reps === null) {
    console.log('Missing or invalid fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Ensure reps is a number
  const repsNumber = parseInt(reps, 10);
  if (isNaN(repsNumber)) {
    console.log('Reps is not a valid number:', reps);
    return res.status(400).json({ error: 'Reps must be a number' });
  }

  db.query(
    `INSERT INTO squats (username, date, reps, comment) VALUES (?, ?, ?, ?)`,
    [username, date, repsNumber, comment || ''],
    (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        console.error('Error Code:', err.code);
        console.error('Error SQL:', err.sql);
        return res.status(500).json({ error: 'Failed to save', details: err.message });
      }
      console.log('Successfully inserted squat record');
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

app.get('/allreviews', (req, res) => {
  db.query('SELECT review, email FROM reviews', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
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

app.put('/edit-username', (req, res) => {
  const { oldUsername, newUsername } = req.body;
  if (!oldUsername || !newUsername) {
    return res.status(400).json({ error: 'Both old and new username are required' });
  }
  const tables = ['users', 'pullups', 'dips', 'squats'];
  let completed = 0;
  let hasError = false;

  tables.forEach(table => {
    db.query('UPDATE ' + table + ' SET username = ? WHERE username = ?', [newUsername, oldUsername], (err, result) => {
      if (err) {
        if (!hasError) {
          hasError = true;
          return res.status(500).json({ error: `Failed to update username in ${table}` });
        }
        return;
      }
      completed++;
      if (completed === tables.length && !hasError) {
        res.json({ message: 'Username updated in all tables' });
      }
    });
  });
});
// === GYM EXERCISES ===

function addGymExerciseRoute(route, table) {
  app.post(route, (req, res) => {
    const { username, date, oneRepMax, comment } = req.body;

    if (!username || !date || oneRepMax === undefined || oneRepMax === null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    db.query(
      `INSERT INTO ${table} (username, date, oneRepMax, comment) VALUES (?, ?, ?, ?)`,
      [username, date, oneRepMax, comment || ''], // save blank comment as empty string
      (err) => {
        if (err) {
          console.error(`Error saving ${table}:`, err.message);
          return res.status(500).json({ error: `Error saving ${table}` });
        }
        res.json({ message: `${table} saved successfully!` });
      }
    );
  });
}

// Add all 5 gym exercise routes
addGymExerciseRoute('/addbenchpress', 'benchpress');
addGymExerciseRoute('/adddeadlift', 'deadlift');
addGymExerciseRoute('/addgymsquat', 'gymsquat');
addGymExerciseRoute('/addoverheadpress', 'overheadpress');
addGymExerciseRoute('/addlatpulldown', 'latpulldown');


// === RUNNING ROUTES ===

// Middleware
app.use(express.json());
app.use(cors());

// === GET routes for fetching results ===
app.get('/run_1km', (req, res) => {
  db.query('SELECT * FROM run_1km', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/run_5km', (req, res) => {
  db.query('SELECT * FROM run_5km', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/run_10km', (req, res) => {
  db.query('SELECT * FROM run_10km', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/run_halfmarathon', (req, res) => {
  db.query('SELECT * FROM run_halfmarathon', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/run_marathon', (req, res) => {
  db.query('SELECT * FROM run_marathon', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === POST routes for adding results ===
function addRunRoute(route, table) {
  app.post(route, (req, res) => {
    const { username, date, runtime } = req.body;

    if (!username || !date || !runtime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    db.query(
      `INSERT INTO ${table} (username, date, runtime) VALUES (?, ?, ?)`,
      [username, date, runtime],
      (err) => {
        if (err) {
          console.error(`❌ Error saving ${table}:`, err.message);
          return res.status(500).json({ error: `Error saving ${table}` });
        }
        res.json({ message: `✅ ${table} time saved!` });
      }
    );
  });
}

// === Define POST endpoints ===
addRunRoute('/addrun_1km', 'run_1km');
addRunRoute('/addrun_5km', 'run_5km');
addRunRoute('/addrun_10km', 'run_10km');
addRunRoute('/addrun_halfmarathon', 'run_halfmarathon');
addRunRoute('/addrun_marathon', 'run_marathon');



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});