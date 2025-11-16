require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_replace');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'; // front-end url for redirects

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Helpers
function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({error:'missing auth'});
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch(e){
    return res.status(401).json({error:'invalid token'});
  }
}

function centsToPrice(cents){ return (cents/100).toFixed(2); }

// Public routes
app.get('/api/menu', (req, res) => {
  db.all("SELECT id, name, description, price_cents, image FROM menu", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({...r, price: centsToPrice(r.price_cents)})));
  });
});

// Auth
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({error:'email+password required'});
  const hash = await bcrypt.hash(password, 10);
  db.run("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)", [email, hash, name||''], function(err){
    if (err) return res.status(400).json({error: err.message});
    const user = { id: this.lastID, email, name: name||'', points:0 };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(400).json({error:'invalid credentials'});
    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) return res.status(400).json({error:'invalid credentials'});
    const user = { id: row.id, email: row.email, name: row.name, points: row.points };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user });
  });
});

// Me (profile)
app.get('/api/me', authMiddleware, (req, res) => {
  const id = req.user.id;
  db.get("SELECT id, email, name, points FROM users WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(row);
  });
});

// Create checkout session (Stripe Checkout)
app.post('/api/create-checkout-session', authMiddleware, async (req, res) => {
  const { items } = req.body;
  if (!items || !items.length) return res.status(400).json({error:'no items'});

  // build line_items for stripe
  const placeholders = items.map(() => '?').join(',');
  const ids = items.map(i => i.id);
  db.all(`SELECT id, name, price_cents FROM menu WHERE id IN (${placeholders})`, ids, async (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    const priceMap = {};
    rows.forEach(r => priceMap[r.id] = r);

    const line_items = items.map(it => {
      const menu = priceMap[it.id];
      return {
        price_data: {
          currency: 'gbp',
          product_data: { name: menu.name },
          unit_amount: menu.price_cents
        },
        quantity: it.quantity || 1
      };
    });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items,
        success_url: process.env.SUCCESS_URL || (BASE_URL + '/?session_id={CHECKOUT_SESSION_ID}'),
        cancel_url: process.env.CANCEL_URL || (BASE_URL + '/'),
        metadata: { user_id: req.user.id.toString() }
      });

      // create a pending order in DB
      const total = line_items.reduce((s,li)=> s + li.price_data.unit_amount * li.quantity, 0);
      db.run("INSERT INTO orders (user_id, stripe_session_id, total_cents, paid) VALUES (?, ?, ?, 0)", [req.user.id, session.id, total], function(err){
        if (err) console.error('order insert err', err);
        res.json({ url: session.url, sessionId: session.id });
      });

    } catch(e){
      console.error(e);
      res.status(500).json({error: e.message});
    }
  });
});

// Webhook to capture successful payments and award points
app.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const sessionId = session.id;
    const userId = session.metadata?.user_id;

    // mark order paid and award points
    db.run("UPDATE orders SET paid = 1 WHERE stripe_session_id = ?", [sessionId], function(err){
      if (err) console.error(err);
      // award points: e.g., 1 point per £1 spent (100 cents)
      db.get("SELECT id, total_cents FROM orders WHERE stripe_session_id = ?", [sessionId], (err, ord) => {
        if (err || !ord) return;
        const points = Math.floor(ord.total_cents / 100);
        db.run("UPDATE users SET points = points + ? WHERE id = ?", [points, userId], (err) => {
          if (err) console.error(err);
        });
      });
    });
  }

  res.json({received: true});
});

// Simple admin orders list
app.get('/api/orders', (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
