const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');



const app = express();

app.use(cors());
app.use(express.json());

// Configure PostgreSQL connection
let pool;

if (process.env.DATABASE_URL) {
  // Use Render's DATABASE_URL in production
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Render's free PostgreSQL
    }
  });
} else {
  // Fallback to local development config
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sow-mini-app',
    password: '123',
    port: 5433,
  });
}

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-post och lösenord krävs.' });
  }

  try {
    const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Ogiltig e-post eller lösenord. Försök igen.' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: 'Ogiltig e-post eller lösenord. Försök igen.' });
    }

    res.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Serverfel. Försök igen senare.' });
  }
});

// GET /api/products – fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    const products = result.rows.map(row => ({
      id: row.id,
      articleNo: row.article_no,
      product: row.product,
      inPrice: Math.round(row.in_price * 100).toString(),
      price: Math.round(row.price * 100).toString(),
      unit: row.unit,
      description: row.description
    }));
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});