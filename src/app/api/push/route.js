import { NextResponse } from 'next/server';
import db, { addPushSubscription } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const vapidPublic = db.prepare('SELECT value FROM settings WHERE key = ?').get('vapid_public_key');
    if (!vapidPublic) {
      return NextResponse.json({ error: 'VAPID public key not found' }, { status: 404 });
    }
    return NextResponse.json({ publicKey: vapidPublic.value });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { subscription } = await request.json();
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription details are required' }, { status: 400 });
    }
    const subscriptionJson = typeof subscription === 'string' ? subscription : JSON.stringify(subscription);
    addPushSubscription(subscriptionJson);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
