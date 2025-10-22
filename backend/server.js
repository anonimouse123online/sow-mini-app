const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false 
    }
  });
} else {
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sow-mini-app',
    password: '123',
    port: 5433,
  });
}


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


app.patch('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;


  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }


  const allowedFields = ['articleNo', 'product', 'inPrice', 'price', 'unit', 'description'];
  const dbFieldMap = {
    articleNo: 'article_no',
    product: 'product',
    inPrice: 'in_price',
    price: 'price',
    unit: 'unit',
    description: 'description'
  };

  const validUpdates = {};
  for (const key of Object.keys(updates)) {
    if (!allowedFields.includes(key)) {
      return res.status(400).json({ message: `Field "${key}" cannot be updated` });
    }
    validUpdates[dbFieldMap[key]] = updates[key];
  }

  if (Object.keys(validUpdates).length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }


  if ('in_price' in validUpdates) {
    const num = parseFloat(validUpdates.in_price);
    if (isNaN(num)) {
      return res.status(400).json({ message: 'inPrice must be a valid number' });
    }
    validUpdates.in_price = num / 100;
  }
  if ('price' in validUpdates) {
    const num = parseFloat(validUpdates.price);
    if (isNaN(num)) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }
    validUpdates.price = num / 100;
  }

 
  const fields = Object.keys(validUpdates);
  const values = fields.map(field => validUpdates[field]);
  const setClause = fields.map((field, i) => `"${field}" = $${i + 2}`).join(', ');

  try {
    const query = `
      UPDATE products
      SET ${setClause}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [productId, ...values]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      articleNo: row.article_no,
      product: row.product,
      inPrice: Math.round(row.in_price * 100).toString(),
      price: Math.round(row.price * 100).toString(),
      unit: row.unit,
      description: row.description
    });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/translations/:lang', async (req, res) => {
  const { lang } = req.params;
  if (!['sv', 'en'].includes(lang)) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  try {
    const result = await pool.query(
      `SELECT key, ${lang} AS text FROM translations`
    );
    const translations = {};
    result.rows.forEach(row => {
      translations[row.key] = row.text;
    });
    res.json(translations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load translations' });
  }
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});