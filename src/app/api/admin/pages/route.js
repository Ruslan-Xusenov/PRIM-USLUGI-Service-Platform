import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const pages = db.prepare('SELECT * FROM pages ORDER BY created_at DESC').all();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { url, title, content, seo_title, seo_description, seo_keywords } = data;

    // Check if URL exists
    const existing = db.prepare('SELECT id FROM pages WHERE url = ?').get(url);
    if (existing) {
      return NextResponse.json({ error: 'Bu URL allaqachon mavjud' }, { status: 400 });
    }

    const info = db.prepare(`
      INSERT INTO pages (url, title, content, seo_title, seo_description, seo_keywords)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(url, title, content, seo_title, seo_description, seo_keywords);

    return NextResponse.json({ id: info.lastInsertRowid, ...data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
