import { Telegraf } from 'telegraf';
import nodemailer from 'nodemailer';

// These should be environment variables in a real project
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

export async function sendNotifications(data) {
  const { name, phone, service, comment } = data;
  const message = `
🚀 **Новая заявка с сайта Prim-Uslugi**
👤 **Имя:** ${name}
📞 **Телефон:** ${phone}
🛠 **Услуга:** ${service || 'Не выбрана'}
💬 **Комментарий:** ${comment || 'Нет'}
  `;

  const results = { telegram: false, email: false };

  // 1. Send to Telegram
  if (BOT_TOKEN && ADMIN_CHAT_ID) {
    const adminIds = ADMIN_CHAT_ID.split(',').map(id => id.trim());
    const bot = new Telegraf(BOT_TOKEN);
    
    for (const id of adminIds) {
      try {
        await bot.telegram.sendMessage(id, message, { parse_mode: 'Markdown' });
        results.telegram = true;
      } catch (error) {
        console.error(`Telegram notification error for ID ${id}:`, error);
      }
    }
  }

  // 2. Send to Email
  if (SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT == 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Prim-Uslugi Website" <${SMTP_USER}>`,
        to: SMTP_USER, // Admin email
        subject: `Новая заявка: ${service || 'Общая'}`,
        text: message.replace(/\*\*/g, ''),
        html: `
          <h3>Новая заявка с сайта Prim-Uslugi</h3>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Услуга:</strong> ${service || 'Не выбрана'}</p>
          <p><strong>Комментарий:</strong> ${comment || 'Нет'}</p>
        `,
      });
      results.email = true;
    } catch (error) {
      console.error('Email notification error:', error);
    }
  }

  return results;
}
