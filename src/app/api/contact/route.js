import { NextResponse } from 'next/server';
import { sendNotifications } from '@/lib/notifications';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, service, comment } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const results = await sendNotifications({ name, phone, service, comment });

    return NextResponse.json({ 
      success: true, 
      message: 'Заявка успешно отправлена',
      details: results 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
