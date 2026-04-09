import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/news.json');

export function getNews() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('DB Read Error:', error);
    return [];
  }
}

export function addNews(item) {
  try {
    const news = getNews();
    const newItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...item
    };
    news.unshift(newItem); // Newest first
    
    // Keep only last 20 items
    const limitedNews = news.slice(0, 20);
    
    if (!fs.existsSync(path.dirname(DB_PATH))) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    
    fs.writeFileSync(DB_PATH, JSON.stringify(limitedNews, null, 2));
    return newItem;
  } catch (error) {
    console.error('DB Write Error:', error);
    return null;
  }
}
