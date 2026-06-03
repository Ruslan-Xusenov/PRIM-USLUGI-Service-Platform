import { NextResponse } from 'next/server';
import { addPushSubscriptionKV } from '@/lib/pushStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // First try env var, then fallback to DB
    let publicKey = process.env.VAPID_PUBLIC_KEY;
    
    if (!publicKey) {
      try {
        const { default: db } = await import('@/lib/db');
        const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('vapid_public_key');
        publicKey = row?.value;
      } catch (e) {
        console.warn('DB not available for VAPID key lookup');
      }
    }

    if (!publicKey) {
      return NextResponse.json({ error: 'VAPID public key not configured' }, { status: 404 });
    }
    return NextResponse.json({ publicKey });
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

    // Try Redis (Vercel), fallback to SQLite (local)
    try {
      await addPushSubscriptionKV(subscriptionJson);
      return NextResponse.json({ success: true });
    } catch (redisErr) {
      console.warn('Redis not available, trying SQLite:', redisErr.message);
      try {
        const { addPushSubscription } = await import('@/lib/db');
        addPushSubscription(subscriptionJson);
        return NextResponse.json({ success: true });
      } catch (dbErr) {
        console.error('Both Redis and SQLite failed:', dbErr.message);
        return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 });
      }
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
