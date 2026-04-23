import { Telegraf } from 'telegraf';
import { addNews } from '@/lib/db';
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

export async function POST(request) {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const bot = new Telegraf(BOT_TOKEN);

    // Filter by admin ID
    if (ADMIN_CHAT_ID && body.message) {
      const adminIds = ADMIN_CHAT_ID.split(',').map(id => id.trim());
      if (!adminIds.includes(body.message.chat.id.toString())) {
        return NextResponse.json({ ok: true }); // Ignore non-admin messages
      }
    }

    if (body.message && body.message.text) {
      const text = body.message.text;
      
      // Basic logic: if message starts with "NEWS:" or just any text
      // We'll treat every message from admin as a potential news post
      addNews({
        title: text.split('\n')[0].substring(0, 100),
        content: text.split('\n').slice(1).join('\n') || text,
        type: 'bot_update'
      });

      // Confirm back to admin
      await bot.telegram.sendMessage(body.message.chat.id, '✅ Сообщение опубликовано в разделе "Новости" на сайте!');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ ok: true }); // Always return OK to TG
  }
}
