export default function AdminManualPage() {
  return (
    <div style={{ padding: '8rem 0', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          Инструкция по управлению сайтом
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Prim-Uslugi — краткое руководство для администраторов</p>

        {[
          {
            title: '1. Добавление и редактирование услуг',
            items: [
              'Войдите в административную панель: /admin',
              'Перейдите в раздел «Страницы услуг»',
              'Нажмите «Добавить страницу» или выберите существующую',
              'Заполните: Заголовок, URL (slug), Описание, SEO-заголовок, SEO-описание, Ключевые слова',
              'Добавьте 4 пункта «Подробности» (преимущества)',
              'Загрузите изображение и фоновую картинку',
              'Нажмите «Сохранить»',
            ]
          },
          {
            title: '2. SEO-оптимизация страниц',
            items: [
              'SEO Title — до 60 символов, содержит ключевое слово и город',
              'SEO Description — 120–160 символов, призыв к действию',
              'Keywords — через запятую, 5–10 фраз',
              'URL (slug) — короткий, на латинице: plumber, electrician, legal',
              'H1 заголовок = Title поля в форме редактора',
              'Изображения: заполняйте поле Alt при загрузке',
            ]
          },
          {
            title: '3. Обновление контента',
            items: [
              'Тексты услуг редактируются в поле «Контент» (поддерживает HTML)',
              'Новости добавляются в разделе «Новости» административной панели',
              'Настройки телефона, email, соцсетей — в разделе «Настройки»',
              'После сохранения изменения применяются немедленно',
            ]
          },
          {
            title: '4. Аналитика и метрики',
            items: [
              'Яндекс Метрика: войдите на metrika.yandex.ru',
              'Основные метрики: Посещаемость → Посетители, Сеансы',
              'Конверсия по услугам: Отчёты → Конверсии (настройте цели — отправка формы)',
              'Яндекс Вебмастер: webmaster.yandex.ru — проверка индексации',
              'Sitemap доступен по адресу /sitemap.xml',
              'Robots.txt: /robots.txt',
            ]
          },
          {
            title: '5. Подключение Яндекс Метрики',
            items: [
              'Зарегистрируйтесь на metrika.yandex.ru',
              'Создайте счётчик, укажите домен сайта',
              'Скопируйте номер счётчика (например: 98765432)',
              'В layout.js замените 99999999 на ваш номер',
              'Для Яндекс Вебмастера: добавьте мета-тег верификации в layout.js',
            ]
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '2.5rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem' }}>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>{section.title}</h2>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', paddingLeft: '1.25rem' }}>
              {section.items.map((item, j) => (
                <li key={j} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item}</li>
              ))}
            </ol>
          </div>
        ))}

        <div style={{ padding: '1.5rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '1.25rem' }}>
          <p style={{ color: 'var(--accent-bright)', fontWeight: 700, marginBottom: '0.5rem' }}>Техническая поддержка</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>По вопросам настройки и обновления обращайтесь к разработчику. Sitemap обновляется автоматически при добавлении новых услуг.</p>
        </div>
      </div>
    </div>
  );
}
