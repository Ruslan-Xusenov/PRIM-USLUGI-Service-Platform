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
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Migration: Add image_url if it doesn't exist
  PRAGMA table_info(news);

`);

export function getNews() {
  return db.prepare('SELECT * FROM news ORDER BY created_at DESC LIMIT 10').all();
}

export function addNews({ title, content, type, image_url }) {
  return db.prepare('INSERT INTO news (title, content, type, image_url) VALUES (?, ?, ?, ?)')
    .run(title, content, type, image_url);
}

export function getNewsById(id) {
  return db.prepare('SELECT * FROM news WHERE id = ?').get(id);
}

export function updateNews(id, { title, content, type, image_url }) {
  return db.prepare('UPDATE news SET title=?, content=?, type=?, image_url=? WHERE id=?')
    .run(title, content, type || 'update', image_url, id);
}

export function deleteNews(id) {
  return db.prepare('DELETE FROM news WHERE id = ?').run(id);
}

export default db;
