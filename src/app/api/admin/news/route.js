import { NextResponse } from 'next/server';
import { getNews, addNews } from '@/lib/db';

export async function GET() {
  try {
    const news = getNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, content, type, image_url } = data;
    if (!title || !content) {
      return NextResponse.json({ error: 'Заголовок и содержание обязательны' }, { status: 400 });
    }
    const info = addNews({ title, content, type: type || 'update', image_url });
    return NextResponse.json({ id: info.lastInsertRowid, title, content, type, image_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}