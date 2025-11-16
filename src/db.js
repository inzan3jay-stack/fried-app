const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const SCHEMA = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

const db = new sqlite3.Database(DB_PATH);

function run(sql, params=[]) {
  return new Promise((res, rej) => {
    db.run(sql, params, function(err) {
      if (err) rej(err); else res(this);
    });
  });
}

async function init() {
  try {
    await run("PRAGMA foreign_keys = ON;");
    await new Promise((resolve, reject) => {
      db.exec(SCHEMA, (err) => err ? reject(err) : resolve());
    });

    const menuItems = [
      ["Furious Classic (thigh)", "Crispy thigh burger", 699, "/assets/chicken1.jpg"],
      ["Spicy Blaze Burger", "Double spice", 759, "/assets/chicken2.jpg"],
      ["Wing Box (6)", "Mixed wings", 599, "/assets/wings.jpg"],
      ["Loaded Fries", "Fries + toppings", 399, "/assets/fries.jpg"],
      ["Plant Power (vegan)", "Vegan patty", 649, "/assets/vegan.jpg"]
    ];

    let stmt = db.prepare("INSERT INTO menu (name, description, price_cents, image) VALUES (?, ?, ?, ?)");
    for (const item of menuItems) stmt.run(item);
    stmt.finalize();

    console.log("Database initialized.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  if (process.argv.includes('--init')) init();
}

module.exports = db;