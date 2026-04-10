import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'prim_uslugi.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'update',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Export helper functions for existing APIs
export function getNews() {
  return db.prepare('SELECT * FROM news ORDER BY created_at DESC LIMIT 10').all();
}

export function addNews({ title, content, type }) {
  return db.prepare('INSERT INTO news (title, content, type) VALUES (?, ?, ?)')
    .run(title, content, type);
}

export default db;