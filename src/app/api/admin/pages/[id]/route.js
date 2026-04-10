import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(params.id);
    if (!page) return NextResponse.json({ error: 'Sahifa topilmadi' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const { url, title, content, seo_title, seo_description, seo_keywords } = data;

    // Check if new URL conflicts with other pages
    const conflict = db.prepare('SELECT id FROM pages WHERE url = ? AND id != ?').get(url, params.id);
    if (conflict) {
      return NextResponse.json({ error: 'Bu URL boshqa sahifa uchun band' }, { status: 400 });
    }

    db.prepare(`
      UPDATE pages 
      SET url = ?, title = ?, content = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(url, title, content, seo_title, seo_description, seo_keywords, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    db.prepare('DELETE FROM pages WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
