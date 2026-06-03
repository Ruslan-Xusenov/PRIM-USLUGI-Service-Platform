import { NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

let dbFunctions = null;

async function getDb() {
  if (dbFunctions) return dbFunctions;
  try {
    const mod = await import('@/lib/db');
    dbFunctions = { addChatMessage: mod.addChatMessage, getChatMessages: mod.getChatMessages };
    return dbFunctions;
  } catch (e) {
    console.warn('Database not available:', e.message);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }
  try {
    const db = await getDb();
    if (!db) return NextResponse.json([]);
    const messages = db.getChatMessages(sessionId);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { sessionId, message, sender } = await request.json();
    if (!sessionId || !message) {
      return NextResponse.json({ error: 'Session ID and message are required' }, { status: 400 });
    }

    const db = await getDb();
    if (db) {
      db.addChatMessage({ session_id: sessionId, sender: sender || 'user', message });
    }

    // If the user sent a message, alert the admin in Telegram
    if (sender !== 'admin' && BOT_TOKEN && ADMIN_CHAT_ID) {
      const bot = new Telegraf(BOT_TOKEN);
      const adminIds = ADMIN_CHAT_ID.split(',').map(id => id.trim());
      const alertMsg = `💬 **Новое сообщение в чате поддержки!**\nID Сессии: \`${sessionId}\`\nСообщение: ${message}`;
      for (const id of adminIds) {
        try {
          await bot.telegram.sendMessage(id, alertMsg, { parse_mode: 'Markdown' });
        } catch (err) {
          console.error('Failed to notify admin about chat message:', err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
