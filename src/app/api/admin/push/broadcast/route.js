import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getSession } from '@/lib/auth';
import { getPushSubscriptionsKV, getPushSubscriptionCountKV, deletePushSubscriptionKV } from '@/lib/pushStore';

export const dynamic = 'force-dynamic';

async function getVapidKeys() {
  // First try env vars (Vercel)
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
      email: process.env.VAPID_EMAIL || 'admin@prim-uslugi.ru',
    };
  }
  // Fallback to DB (local dev)
  try {
    const { default: db } = await import('@/lib/db');
    const pub = db.prepare('SELECT value FROM settings WHERE key = ?').get('vapid_public_key')?.value;
    const priv = db.prepare('SELECT value FROM settings WHERE key = ?').get('vapid_private_key')?.value;
    const email = db.prepare('SELECT value FROM settings WHERE key = ?').get('contact_email')?.value || 'admin@prim-uslugi.ru';
    if (pub && priv) return { publicKey: pub, privateKey: priv, email };
  } catch (e) {
    console.warn('DB not available for VAPID keys');
  }
  return null;
}

async function getSubscriptions() {
  // Try Redis first (Vercel)
  try {
    const subs = await getPushSubscriptionsKV();
    if (subs && subs.length > 0) return subs;
  } catch (e) {
    console.warn('Redis not available for subscriptions');
  }
  // Fallback to SQLite (local dev)
  try {
    const { getPushSubscriptions } = await import('@/lib/db');
    return getPushSubscriptions();
  } catch (e) {
    console.warn('DB not available for subscriptions');
  }
  return [];
}

async function getSubCount() {
  try {
    const count = await getPushSubscriptionCountKV();
    if (count > 0) return count;
  } catch (e) {}
  try {
    const { getPushSubscriptions } = await import('@/lib/db');
    return getPushSubscriptions().length;
  } catch (e) {}
  return 0;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const count = await getSubCount();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, body } = await request.json();
    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const vapid = await getVapidKeys();
    if (!vapid) {
      return NextResponse.json({ error: 'VAPID keys not configured. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY env vars.' }, { status: 500 });
    }

    webpush.setVapidDetails(
      vapid.email.startsWith('mailto:') ? vapid.email : `mailto:${vapid.email}`,
      vapid.publicKey,
      vapid.privateKey
    );

    const subscriptions = await getSubscriptions();
    const payload = JSON.stringify({ title, body, url: '/' });

    let successCount = 0;
    let failureCount = 0;

    const promises = subscriptions.map(async (subStr) => {
      try {
        const sub = typeof subStr === 'string' ? JSON.parse(subStr) : subStr;
        await webpush.sendNotification(sub, payload);
        successCount++;
      } catch (error) {
        console.error('Failed to send push:', error.statusCode);
        failureCount++;
        if (error.statusCode === 404 || error.statusCode === 410) {
          try {
            const key = typeof subStr === 'string' ? subStr : JSON.stringify(subStr);
            await deletePushSubscriptionKV(key);
          } catch (dbErr) {
            console.error('Failed to delete defunct subscription:', dbErr);
          }
        }
      }
    });

    await Promise.all(promises);

    return NextResponse.json({ 
      success: true, 
      summary: `Рассылка завершена. Успешно отправлено: ${successCount}, не удалось: ${failureCount}` 
    });
  } catch (error) {
    console.error('Broadcast Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
