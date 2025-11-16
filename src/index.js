const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

function centsToPrice(cents) { return (cents/100).toFixed(2); }

app.get('/api/menu', (req, res) => {
  db.all("SELECT * FROM menu", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, price: centsToPrice(r.price_cents) })));
  });
});

app.post('/api/orders', (req, res) => {
  const { customer_name, phone, address, items } = req.body;
  if (!items?.length) return res.status(400).json({ error: 'No items' });

  const ids = items.map(i => i.id);
  const placeholders = ids.map(() => '?').join(',');

  db.all(`SELECT id, price_cents FROM menu WHERE id IN (${placeholders})`, ids, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const priceMap = {};
    rows.forEach(r => priceMap[r.id] = r.price_cents);

    let total = 0;
    for (const it of items) total += priceMap[it.id] * it.quantity;

    db.run("INSERT INTO orders (customer_name, phone, address, total_cents) VALUES (?, ?, ?, ?)",
      [customer_name, phone, address, total],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });

        const orderId = this.lastID;
        const stmt = db.prepare("INSERT INTO order_items (order_id, menu_id, quantity, price_cents) VALUES (?, ?, ?, ?)");

        for (const it of items) stmt.run(orderId, it.id, it.quantity, priceMap[it.id]);
        stmt.finalize(() => res.json({ order_id: orderId, total: (total/100).toFixed(2) }));
      });
  });
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));