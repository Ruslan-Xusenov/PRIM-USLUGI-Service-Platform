import { NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';
import nodemailer from 'nodemailer';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, service, comment, email, arrivalTime } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
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

    // 2. Save to database (only if available, skipped on Vercel)
    try {
      const { addOrder } = await import('@/lib/db');
      if (addOrder) {
        addOrder({ name, phone, email, service, comment, arrival_time: arrivalTime });
      }
    } catch (dbError) {
      console.warn('Database not available, order not saved locally:', dbError.message);
    }

    // 3. Send email notifications
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
          to: SMTP_USER,
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
                    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Услуга:</strong></td><td style="padding: 8px 0;">${service || 'Общая заявка'}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Телефон:</strong></td><td style="padding: 8px 0;">${phone}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Время приезда:</strong></td><td style="padding: 8px 0;">${arrivalTime || 'Как можно скорее'}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Статус:</strong></td><td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">В обработке</td></tr>
                  </table>
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                  <p>Наш диспетчер свяжется с вами по указанному телефону в ближайшее время.</p>
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
