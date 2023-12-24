const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

app.use(cors());

// Połączenie z bazą danych
const db = new sqlite3.Database(':memory:'); // Tworzenie bazy danych w pamięci

// Utworzenie tabeli `products`
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL
  )`);

  // Wstawienie przykładowych danych
  const productsData = [
    { name: 'buty', price: 650 },
    { name: 'koszulka', price: 198 },
    { name: 'spodenki', price: 124 },
    { name: 'Zegarek Garmin', price: 3100 },
    { name: 'Opaska HRV', price: 555 }
  ];

  const insertProducts = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
  productsData.forEach(product => {
    insertProducts.run(product.name, product.price);
  });
  insertProducts.finalize();
});

// Endpoint dla produktów z określonej kategorii
app.get('/products/:category', (req, res) => {
  const category = req.params.category;
  let query = '';
  
  switch (category) {
    case 'Ciuchy':
      query = "SELECT * FROM products WHERE name IN ('buty', 'koszulka', 'spodenki')";
      break;
    case 'Akcesoria':
      query = "SELECT * FROM products WHERE name IN ('Zegarek Garmin', 'Opaska HRV')";
      break;
    case 'Wszystkie kategorie':
      query = 'SELECT * FROM products';
    default:
      query = 'SELECT * FROM products';
      break;
  }

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint dla wszystkich kategorii
app.get('/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Ciuchy' },
    { id: 2, name: 'Akcesoria' },
    { id: 3, name: 'Wszystkie kategorie' },
  ];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});