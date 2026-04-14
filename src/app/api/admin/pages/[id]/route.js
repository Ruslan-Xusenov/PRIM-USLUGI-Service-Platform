import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);
    if (!page) return NextResponse.json({ error: 'Sahifa topilmadi' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { 
      url, title, content, seo_title, seo_description, seo_keywords,
      header_description, details_json, icon_name, image_url, bg_image_url, is_service
    } = data;

    // Check if new URL conflicts with other pages
    const conflict = db.prepare('SELECT id FROM pages WHERE url = ? AND id != ?').get(url, id);
    if (conflict) {
      return NextResponse.json({ error: 'Этот URL уже занят другой страницей. Выберите другой.' }, { status: 400 });
    }

    db.prepare(`
      UPDATE pages 
      SET 
        url = ?, title = ?, content = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, 
        header_description = ?, details_json = ?, icon_name = ?, image_url = ?, bg_image_url = ?, is_service = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      url, title, content, seo_title, seo_description, seo_keywords,
      header_description, details_json, icon_name, image_url, bg_image_url, is_service,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    db.prepare('DELETE FROM pages WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
