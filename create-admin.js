const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('❌ Error: Missing arguments');
  console.log('Usage: node create-admin.js <username> <password>');
  console.log('Example: node create-admin.js root supersecret123');
  process.exit(1);
}

const username = args[0];
const password = args[1];

const dbPath = path.join(process.cwd(), 'prim_uslugi.db');
const db = new Database(dbPath);

// Ensure users table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

async function run() {
  try {
    console.log(`📡 Connecting to database at: ${dbPath}`);
    
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Insert or Replace user
    const upsert = db.prepare(`
      INSERT INTO users (username, password_hash) 
      VALUES (?, ?)
      ON CONFLICT(username) DO UPDATE SET password_hash=excluded.password_hash
    `);

    upsert.run(username, hash);

    console.log(`✅ Success! Admin user '${username}' has been created/updated.`);
    console.log(`🔑 Login: ${username}`);
    console.log(`🔑 Password: ${password}`);

  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    db.close();
  }
}

run();
