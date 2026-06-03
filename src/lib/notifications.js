import { Telegraf } from 'telegraf';
import nodemailer from 'nodemailer';

let addOrder;
try {
  const dbModule = await import('@/lib/db');
  addOrder = dbModule.addOrder;
} catch (e) {
  console.warn('Database module not available (Vercel serverless), skipping DB operations');
  addOrder = null;
}

// These should be environment variables in a real project
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

export async function sendNotifications(data) {
  const { name, phone, service, comment, email, arrivalTime } = data;

  // Save order to SQLite Database (skipped on Vercel serverless)
  if (addOrder) {
    try {
      addOrder({
        name,
        phone,
        email,
        service,
        comment,
        arrival_time: arrivalTime
      });
    } catch (error) {
      console.error('Error saving order to database:', error);
    }
  }

  const message = `
🚀 **Новая заявка с сайта Prim-Uslugi**
👤 **Имя:** ${name}
📞 **Телефон:** ${phone}
📧 **E-mail:** ${email || 'Нет'}
🛠 **Услуга:** ${service || 'Не выбрана'}
⏱ **Время приезда:** ${arrivalTime || 'Как можно скорее'}
💬 **Комментарий:** ${comment || 'Нет'}
  `;

  const results = { telegram: false, email: false, customerEmail: false };

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

      // Send to Admin
      await transporter.sendMail({
        from: `"Prim-Uslugi Website" <${SMTP_USER}>`,
        to: SMTP_USER, // Admin email
        subject: `Новая заявка: ${service || 'Общая'}`,
        text: message.replace(/\*\*/g, ''),
        html: `
          <h3>Новая заявка с сайта Prim-Uslugi</h3>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>E-mail:</strong> ${email || 'Нет'}</p>
          <p><strong>Услуга:</strong> ${service || 'Не выбрана'}</p>
          <p><strong>Время приезда:</strong> ${arrivalTime || 'Как можно скорее'}</p>
          <p><strong>Комментарий:</strong> ${comment || 'Нет'}</p>
        `,
      });
      results.email = true;

      // Send confirmation to customer
      if (email) {
        try {
          await transporter.sendMail({
            from: `"Prim-Uslugi Support" <${SMTP_USER}>`,
            to: email,
            subject: `Ваш заказ на Prim-Uslugi принят!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #0f172a;">Здравствуйте, ${name}!</h2>
                <p>Спасибо за ваш заказ на платформе <strong>Prim-Uslugi</strong>. Мы получили вашу заявку и уже приступили к её обработке.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <h3 style="color: #3b82f6;">Детали вашего заказа:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Услуга:</strong></td>
                    <td style="padding: 8px 0; color: #0f172a;">${service || 'Общая заявка'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;"><strong>Телефон:</strong></td>
                    <td style="padding: 8px 0; color: #0f172a;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;"><strong>Время приезда:</strong></td>
                    <td style="padding: 8px 0; color: #0f172a;">${arrivalTime || 'Как можно скорее'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;"><strong>Статус:</strong></td>
                    <td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">В обработке (Ожидание)</td>
                  </tr>
                </table>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p>Наш диспетчер свяжется с вами по указанному телефону в ближайшее время для подтверждения и уточнения деталей.</p>
                <p style="color: #64748b; font-size: 12px; margin-top: 30px;">Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
              </div>
            `,
          });
          results.customerEmail = true;
        } catch (eError) {
          console.error('Customer confirmation email error:', eError);
        }
      }
    } catch (error) {
      console.error('Email notification error:', error);
    }
  }

  return results;
}
