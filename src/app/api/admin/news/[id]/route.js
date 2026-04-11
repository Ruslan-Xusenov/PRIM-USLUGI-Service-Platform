import { NextResponse } from 'next/server';
import { getNewsById, updateNews, deleteNews } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Next.js 15 requires awaiting params
    const news = getNewsById(id);
    if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(news);
  } catch (error) {
    console.error('GET News Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, content, type, image_url } = await request.json();
    updateNews(id, { title, content, type, image_url });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    deleteNews(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
