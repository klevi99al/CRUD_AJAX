const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: '1234',    
  database: 'crud_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }
  console.log('MySQL Connected...');
});

// Get all products
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      res.status(500).json({ error: 'Error fetching products', message: err.message });
      return;
    }
    res.json(results);
  });
});

// Get a single product by ID
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE id = ?';

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Error fetching product:', err.message);
      res.status(500).json({ error: 'Error fetching product', message: err.message });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(result[0]);
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const { emertimi, njesia, data_skadences, cmimi, lloj, ka_tvsh, tipi, barkod_kod } = req.body;
  const sql = 'INSERT INTO products (emertimi, njesia, data_skadences, cmimi, lloj, ka_tvsh, tipi, barkod_kod) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [emertimi, njesia, data_skadences, cmimi, lloj, ka_tvsh, tipi, barkod_kod];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Duplicate barkod_kod', message: 'Barkod code already exists in the database' });
        return;
      }

      console.error('Error adding product:', err.message);
      res.status(500).json({ error: 'Error adding product', message: err.message });
      return;
    }
    res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
  });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err.message);
      res.status(500).json({ error: 'Error deleting product', message: err.message });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  });
});

// Example route for updating a product
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { emertimi, njesia, data_skadences, cmimi, lloj, ka_tvsh, tipi, barkod_kod } = req.body;
  
  const sql = `
    UPDATE products
    SET emertimi = ?, njesia = ?, data_skadences = ?, cmimi = ?, lloj = ?, ka_tvsh = ?, tipi = ?, barkod_kod = ?
    WHERE id = ?
  `;
  const values = [emertimi, njesia, data_skadences, cmimi, lloj, ka_tvsh, tipi, barkod_kod, productId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating product:', err.message);
      res.status(500).json({ error: 'Error updating product', message: err.message });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product updated successfully' });
  });
});


// Serve static files from the project root (if needed)
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
