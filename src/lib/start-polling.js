const { Telegraf } = require('telegraf');
const { addNews } = require('./db');
require('dotenv').config({ path: '.env.local' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

if (!BOT_TOKEN) {
  console.error('❌ ERROR: TELEGRAM_BOT_TOKEN is not set in .env.local');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

console.log('🤖 Starting Telegram Bot in polling mode...');

bot.on('text', async (ctx) => {
  const chatId = ctx.message.chat.id.toString();
  
  // Filter by admin ID if configured
  if (ADMIN_CHAT_ID && chatId !== ADMIN_CHAT_ID.toString()) {
    console.log(`⚠️ Received message from non-admin chat: ${chatId}. Ignoring.`);
    return;
  }

  const text = ctx.message.text;
  console.log(`📝 Received new post from Admin: ${text.split('\n')[0]}`);

  try {
    addNews({
      title: text.split('\n')[0].substring(0, 100),
      content: text.split('\n').slice(1).join('\n') || text,
      type: 'bot_update'
    });

    await ctx.reply('✅ Ваше сообщение опубликовано в разделе "Новости" на сайте!');
  } catch (err) {
    console.error('❌ Error saving news:', err);
    await ctx.reply('❌ Произошла ошибка при сохранении новости.');
  }
});

bot.launch()
  .then(() => console.log('✅ Bot is running and listening for messages...'))
  .catch((err) => console.error('❌ Bot launch failed:', err));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
