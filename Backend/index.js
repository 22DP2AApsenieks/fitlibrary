// Tie pie data no servera

console.log("Server is starting...");

// Use import instead of require
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow Vue frontend
  credentials: true
}));
app.use(express.json());

// Datubāzes savienošana
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',       // mans MySQL lietotājvārds
  password: '@Adams#17',       // parole
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
    return res.status(400).json({ error: 'Lietotājvārds un parole ir obligāti' });
  }

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) {
        console.error('Database error during login:', err.message);
        return res.status(500).json({ error: 'Datubāzes kļūda' });
      }

      if (results.length > 0) {
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
          res.json({ success: true, user: user });
        } else {
          res.status(401).json({ success: false, error: 'Nepareizs lietotājvārds vai parole' });
        }
      } else {
        res.status(401).json({ success: false, error: 'Nepareizs lietotājvārds vai parole' });
      }
    }
  );
});

app.post('/register', async (req, res) => {
  const { username, password, email, role = 'user' } = req.body;

  // Check if username exists
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Datubāzes kļūda' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Lietotājvārds jau ir aizņemts' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with hashed password
    db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email || null, role || null],
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
    return res.status(400).json({ error: 'Trūkst obligāto lauku' });
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
    return res.status(400).json({ error: 'Trūkst obligāto lauku' });
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
    return res.status(400).json({ error: 'Trūkst obligāto lauku' });
  }

  // Ensure reps is a number
  const repsNumber = parseInt(reps, 10);
  if (isNaN(repsNumber)) {
    console.log('Reps is not a valid number:', reps);
    return res.status(400).json({ error: 'Atkārtojumi jābūt skaitlim' });
  }

  db.query(
    `INSERT INTO squats (username, date, reps, comment) VALUES (?, ?, ?, ?)`,
    [username, date, repsNumber, comment || ''],
    (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        console.error('Error Code:', err.code);
        console.error('Error SQL:', err.sql);
        return res.status(500).json({ error: 'Neizdevās saglabāt', details: err.message });
      }
      console.log('Successfully inserted squat record');
      res.json({ message: 'Treniņš pievienots' });
    }
  );
});


app.post('/reviews', (req, res) => {
  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({ error: 'Trūkst lietotājvārda vai atsauksmes teksta' });
  }

  // First, get the user's email from the users table
  db.query(
    'SELECT email FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error('Error fetching user email:', err.message);
        return res.status(500).json({ error: 'Datubāzes kļūda' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Lietotājs nav atrasts' });
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
  db.query('SELECT review, email FROM reviews LIMIT 50', (err, results) => {
    if (err) { 
      console.error('Reviews table error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Reviews found:', results.length);
    res.json(results);
  });
});

app.delete('/delete-review', (req, res) => {
  const { email, review } = req.body;
  if (!email || !review) {
    return res.status(400).json({ error: 'E-pasts un atsauksme ir obligāti' });
  }
  db.query('DELETE FROM reviews WHERE email = ? AND review = ?', [email, review], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Atsauksme dzēsta' });
  });
});

app.post('/ai/workout-tips', async (req, res) => {
  const { username, selectedTable, currentType, tableData, monthlyProgress } = req.body;

  if (!username || !selectedTable || !Array.isArray(tableData)) {
    return res.status(400).json({ error: 'Trūkst obligāto lauku' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY nav konfigurēta backend' });
  }

  const tableName = selectedTable.replace(/_/g, ' ');
  const items = tableData.map((row, index) => {
    const value = row.reps ?? row.oneRepMax ?? row.time ?? row.runtime ?? '';
    const comment = row.comment ? `Comment: ${row.comment}` : 'No comment';
    return `${index + 1}. ${row.date}: ${value} ${currentType === 'runtime' ? 'min' : ''} — ${comment}`;
  });

  const prompt = `You are a friendly and practical workout coach. A user logged ${tableName} history with ${tableData.length} sessions. Their metric type is ${currentType}. Their monthly progress is ${monthlyProgress.toFixed(2)}. Here are the recent records:\n\n${items.join('\n')}\n\nProvide 4 short, useful tips in plain language. Mention any trend you see, how to improve safely, and encourage the user to use comments for recovery or technical notes. Do not mention you are an AI.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You provide friendly workout advice based on logged workout data and comments.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.75,
    });

    const aiText = response.choices?.[0]?.message?.content?.trim() || 'Nav atbildes no AI.';
    return res.json({ message: aiText });
  } catch (error) {
    console.error('AI route error:', error);
    return res.status(500).json({ error: 'AI serviss neizdarbojās', details: error.message });
  }
});


app.delete('/delete-account/:username', (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ error: 'Lietotājvārds ir obligāts' });
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
    return res.status(400).json({ error: 'Veci un jauni lietotājvārdi ir obligāti' });
  }
  
  // All tables that store username - bodyweight, gym, and running exercises
  // Note: running tables use 'run_X' prefix in frontend but actual table names are different
  const tables = [
    'users', 'pullups', 'dips', 'squats',
    'benchpress', 'deadlift', 'gymsquat', 'overheadpress', 'latpulldown',
    '1krun', '5krun', '10krun', 'halfmarathon', 'marathon'
  ];
  
  // Also try alternative table names for running
  const runningTables = ['run_1km', 'run_5km', 'run_10km', 'run_halfmarathon', 'run_marathon'];
  
  let completed = 0;
  let hasError = false;
  const allTables = [...tables, ...runningTables];

  // Trim and lowercase for consistent matching
  const oldUser = oldUsername.trim();
  const newUser = newUsername.trim();

  console.log(`Changing username from "${oldUser}" to "${newUser}"`);
  console.log(`Tables to update:`, allTables);

  allTables.forEach(table => {
    db.query('UPDATE `' + table + '` SET username = ? WHERE LOWER(TRIM(username)) = ?', [newUser, oldUser.toLowerCase()], (err, result) => {
      if (err) {
        console.error(`Error updating ${table}:`, err.message);
        // Continue even if error - table might not exist
        completed++;
        if (completed === allTables.length) {
          res.json({ message: 'Username updated (some tables may not exist)' });
        }
        return;
      }
      console.log(`Updated ${table}: ${result.affectedRows} rows affected`);
      completed++;
      if (completed === allTables.length && !hasError) {
        res.json({ message: 'Username updated in all tables' });
      }
    });
  });
});
// === GYM EXERCISES ===

const gymExerciseNames = {
  benchpress: 'Spiešana guļus',
  deadlift: 'Vilkšana no zemes',
  gymsquat: 'Pietupieni ar svaru',
  overheadpress: 'Spiešana virs galvas',
  latpulldown: 'Lat pulldown'
};

function addGymExerciseRoute(route, table) {
  app.post(route, (req, res) => {
    const { username, date, oneRepMax, comment } = req.body;

    if (!username || !date || oneRepMax === undefined || oneRepMax === null) {
      return res.status(400).json({ error: 'Trūkst obligāto lauku' });
    }

    const exerciseName = gymExerciseNames[table] || 'Treniņš';

    db.query(
      `INSERT INTO ${table} (username, date, oneRepMax, comments) VALUES (?, ?, ?, ?)`,
      [username, date, oneRepMax, comment || ''], // Note: comments (plural)
      (err) => {
        if (err) {
          console.error(`Kļūda saglabājot ${table}:`, err.message);
          return res.status(500).json({ error: `Kļūda saglabājot ${exerciseName}`, details: err.message });
        }
        res.json({ message: `${exerciseName} veiksmīgi saglabāts!` });
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

// === GET routes for gym exercises ===
app.get('/benchpress', (req, res) => {
  db.query('SELECT * FROM benchpress', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/deadlift', (req, res) => {
  db.query('SELECT * FROM deadlift', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/gymsquat', (req, res) => {
  db.query('SELECT * FROM gymsquat', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/overheadpress', (req, res) => {
  db.query('SELECT * FROM overheadpress', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/latpulldown', (req, res) => {
  db.query('SELECT * FROM latpulldown', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === RUNNING ROUTES ===

// === GET routes for fetching results ===
app.get('/run_1km', (req, res) => {
  db.query('SELECT * FROM `1krun`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/run_5km', (req, res) => {
  db.query('SELECT * FROM `5krun`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/run_10km', (req, res) => {
  db.query('SELECT * FROM `10krun`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/run_halfmarathon', (req, res) => {
  db.query('SELECT * FROM `halfmarathon`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/run_marathon', (req, res) => {
  db.query('SELECT * FROM `marathon`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Keep old routes for backward compatibility
app.get('/1krun', (req, res) => {
  db.query('SELECT * FROM `1krun`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/5krun', (req, res) => {
  db.query('SELECT * FROM `5krun`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/10krun', (req, res) => {
  db.query('SELECT * FROM `10krun`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/halfmarathon', (req, res) => {
  db.query('SELECT * FROM `halfmarathon`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/marathon', (req, res) => {
  db.query('SELECT * FROM `marathon`', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// === POST routes for adding results ===
const runExerciseNames = {
  '1krun': '1 km skrējiens',
  '5krun': '5 km skrējiens',
  '10krun': '10 km skrējiens',
  halfmarathon: 'Pusmaratons',
  marathon: 'Maratons'
};

function addRunRoute(route, table) {
  app.post(route, (req, res) => {
    const { username, date, time, comment } = req.body;

    if (!username || !date || time === undefined || time === null) {
      return res.status(400).json({ error: 'Trūkst obligāto lauku' });
    }

    const exerciseName = runExerciseNames[table] || 'Skrējiens';

    db.query(
      `INSERT INTO ${table} (username, date, time, comment) VALUES (?, ?, ?, ?)`,
      [username, date, time, comment || ''],
      (err) => {
        if (err) {
          console.error(`Kļūda saglabājot ${table}:`, err.message);
          return res.status(500).json({ error: `Kļūda saglabājot ${exerciseName}`, details: err.message });
        }
        res.json({ message: `${exerciseName} laiks veiksmīgi saglabāts!` });
      }
    );
  });
}

// === Define POST endpoints with new table names ===
addRunRoute('/add1krun', '1krun');
addRunRoute('/add5krun', '5krun');
addRunRoute('/add10krun', '10krun');
addRunRoute('/addhalfmarathon', 'halfmarathon');
addRunRoute('/addmarathon', 'marathon');



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});