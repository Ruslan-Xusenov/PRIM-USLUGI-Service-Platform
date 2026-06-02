import { NextResponse } from 'next/server';
import webpush from 'web-push';
import db, { getPushSubscriptions, deletePushSubscription } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const subscriptions = getPushSubscriptions();
    return NextResponse.json({ count: subscriptions.length });
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

    const vapidPublicKey = db.prepare('SELECT value FROM settings WHERE key = ?').get('vapid_public_key')?.value;
    const vapidPrivateKey = db.prepare('SELECT value FROM settings WHERE key = ?').get('vapid_private_key')?.value;
    const contactEmail = db.prepare('SELECT value FROM settings WHERE key = ?').get('contact_email')?.value || 'admin@prim-uslugi.ru';

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ error: 'VAPID keys not configured in settings' }, { status: 500 });
    }

    webpush.setVapidDetails(
      contactEmail.startsWith('mailto:') ? contactEmail : `mailto:${contactEmail}`,
      vapidPublicKey,
      vapidPrivateKey
    );

    const subscriptions = getPushSubscriptions();
    const payload = JSON.stringify({ title, body, url: '/' });

    let successCount = 0;
    let failureCount = 0;

    const promises = subscriptions.map(async (subStr) => {
      try {
        const sub = JSON.parse(subStr);
        await webpush.sendNotification(sub, payload);
        successCount++;
      } catch (error) {
        console.error('Failed to send push:', error.statusCode);
        failureCount++;
        if (error.statusCode === 404 || error.statusCode === 410) {
          try {
            deletePushSubscription(subStr);
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
