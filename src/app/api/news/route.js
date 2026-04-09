import { NextResponse } from 'next/server';
import { getNews } from '@/lib/db';

export async function GET() {
  try {
    const news = getNews();
    return NextResponse.json(news);
  } catch (error) {
    console.error('API News Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
