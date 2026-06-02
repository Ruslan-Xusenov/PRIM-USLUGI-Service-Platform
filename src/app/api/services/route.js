import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = db.prepare('SELECT * FROM pages WHERE is_service = 1 ORDER BY created_at DESC').all();
    return NextResponse.json(services);
  } catch (error) {
    console.error('API Services GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
