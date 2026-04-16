import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'prim_uslugi.db');
console.log(`📡 Connecting to database at: ${dbPath}`);
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    header_description TEXT,
    details_json TEXT,
    icon_name TEXT,
    image_url TEXT,
    bg_image_url TEXT,
    is_service INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'update',
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT UNIQUE PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Runtime migration: add missing columns if they don't exist
const pagesInfo = db.prepare('PRAGMA table_info(pages)').all();
const pagesColumns = pagesInfo.map(c => c.name);

const newPagesColumns = [
  { name: 'header_description', type: 'TEXT' },
  { name: 'details_json', type: 'TEXT' },
  { name: 'icon_name', type: 'TEXT' },
  { name: 'image_url', type: 'TEXT' },
  { name: 'bg_image_url', type: 'TEXT' },
  { name: 'is_service', type: 'INTEGER DEFAULT 0' }
];

for (const col of newPagesColumns) {
  if (!pagesColumns.includes(col.name)) {
    try {
      db.exec(`ALTER TABLE pages ADD COLUMN ${col.name} ${col.type}`);
    } catch (e) {
      // Column already exists
    }
  }
}

// Initial Seeding for Users and Settings
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  console.log('👤 Seeding default admin user...');
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
    .run('admin', '$2b$10$OCjVEpiYC1h674lgLa3MOexUX3lx8ilFCqjNHvXTOHxue/5gmFI26');
}

const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
if (settingsCount === 0) {
  console.log('⚙️ Seeding default settings...');
  const initialSettings = [
    { key: 'social_vk', value: '#' },
    { key: 'social_telegram', value: '#' },
    { key: 'social_whatsapp', value: '#' },
    { key: 'contact_phone', value: '+7-967-388-88-89' },
    { key: 'contact_email', value: 'prim-uslugi@internet.ru' }
  ];
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  db.transaction(() => {
    for (const s of initialSettings) {
      insertSetting.run(s.key, s.value);
    }
  })();
}

// Automated Seeding Logic
const servicesCount = db.prepare('SELECT COUNT(*) as count FROM pages').get().count;

if (servicesCount === 0) {
  console.log('🌱 Database is empty. Seeding initial services...');
  const initialServices = [
    {
      url: 'services/commissioner',
      title: 'Аварийный комиссар',
      header_description: 'Оперативная защита ваших интересов и грамотное оформление документов при ДТП. Наши специалисты на связи 24/7 по всему Приморскому краю.',
      icon_name: 'Shield',
      image_url: '/images/IMG_0460.jpg',
      bg_image_url: '/images/IMG_0460.jpg',
      details: [
        { title: 'Оперативный выезд', text: 'Прибытие на место ДТП в течение 15-20 минут по всему краю.' },
        { title: 'Оформление европротокола', text: 'Грамотное заполнение всех документов без вызова сотрудников ГИБДД.' },
        { title: 'Юридическая помощь', text: 'Консультации по вопросам ответственности и получения выплат.' },
        { title: 'Фотофиксация', text: 'Профессиональная съемка места происшествия для страховых компаний.' }
      ],
      content: `
        <h1 class="text-3xl font-bold mb-6 text-primary">Вызов аварийного комиссара во Владивостоке и Приморском крае</h1>
        <p class="mb-6 leading-relaxed">
          Попали в дорожно-транспортное происшествие? Сохраняйте спокойствие — наша скорая автопомощь Приморья уже в пути! Опытный <strong>аварийный комиссар во Владивостоке</strong> оперативно прибудет на место.
        </p>
        
        <h2 class="text-2xl font-bold mb-4 text-primary">Наши услуги:</h2>
        <ul class="list-disc pl-6 mb-8 space-y-3">
          <li>Быстрый <strong>вызов аварийного комиссара</strong> по всему Приморскому краю.</li>
          <li>Грамотное <strong>оформление ДТП комиссаром</strong> и <strong>оформление европротокола</strong>.</li>
          <li>Выезд специалиста за 30 минут — <strong>аварийный комиссар работает 24/7</strong>.</li>
          <li><strong>Помощь при мелком ДТП</strong> с обязательной фотофиксацией места происшествия.</li>
          <li><strong>Юридическая помощь при ДТП</strong> и привлечение комиссара для урегулирования споров со страховой компанией.</li>
        </ul>
  
        <div class="bg-accent/5 p-6 rounded-2xl flex items-center gap-4">
          <span class="text-2xl">🔗</span>
          <p class="text-lg font-medium text-primary">
            Если ваш автомобиль не на ходу, мы организуем <strong>срочную эвакуацию авто</strong>.
          </p>
        </div>
      `
    },
    {
      url: 'services/loaders',
      title: 'Услуги грузчиков',
      header_description: 'Комплексные решения для квартирных, офисных и промышленных переездов. Наша команда работает быстро, слаженно и с полной ответственностью за результат.',
      icon_name: 'Hammer',
      image_url: '/images/IMG_0511.jpg',
      bg_image_url: '/images/IMG_0511.jpg',
      details: [
        { title: 'Квартирные переезды', text: 'Аккуратная упаковка, погрузка и расстановка мебели на новом месте.' },
        { title: 'Офисные переезды', text: 'Быстрый переезд вашего бизнеса with minimal downtime.' },
        { title: 'Складские работы', text: 'Разгрузка фур, контейнеров и организация хранения.' },
        { title: 'Такелажные работы', text: 'Перенос пианино, сейфов и тяжелого оборудования.' }
      ],
      content: `
        <h1 class="text-3xl font-bold mb-6 text-primary">Услуги грузчиков во Владивостоке</h1>
        <p class="mb-6 leading-relaxed">
          Требуется физическая помощь? Предоставляем опытные бригады: <strong>грузчики во Владивостоке</strong> и Приморском крае готовы выехать к вам за 30 минут.
        </p>
        
        <h2 class="text-2xl font-bold mb-4 text-primary">Что мы предлагаем:</h2>
        <ul class="list-disc pl-6 mb-8 space-y-3">
          <li>Оперативные <strong>грузчики на час</strong>.</li>
          <li><strong>Быстрый переезд с грузчиками</strong> под ключ.</li>
          <li>Аккуратная <strong>погрузка/разгрузка</strong>.</li>
          <li><strong>Сбор и разборка мебели</strong>.</li>
          <li>Сloжные <strong>такелажные работы</strong>.</li>
        </ul>
      `
    },
    {
      url: 'services/freight',
      title: 'Грузоперевозки',
      header_description: 'Интеллектуальная логистика для ваших грузов. Мы обеспечиваем полную прозрачность, безопасность и своевременную доставку.',
      icon_name: 'Truck',
      image_url: '/images/IMG_0512.jpg',
      bg_image_url: '/images/IMG_0512.jpg',
      details: [
        { title: 'Городские перевозки', text: 'Оперативная доставка грузов по городу.' },
        { title: 'Межгород', text: 'Перевозки по всему краю с гарантией сроков.' },
        { title: 'Разнообразие транспорта', text: 'Машины под любые задачи.' },
        { title: 'Страхование грузов', text: 'Полная материальная ответственность.' }
      ],
      content: `
        <h1 class="text-3xl font-bold mb-6 text-primary">Грузоперевозки в Приморском крае</h1>
        <p class="mb-6 leading-relaxed">
          Ищете надежный способ доставить вещи? Сервис «Prim‑Uslugi» осуществляет <strong>грузоперевозки во Владивостоке</strong>.
        </p>
      `
    },
    {
      url: 'services/evacuator',
      title: 'Эвакуатор',
      header_description: 'Круглосуточная эвакуация транспорта любой сложности. Мы приедем на помощь в любую погоду.',
      icon_name: 'AlertTriangle',
      image_url: '/images/banner_evacuator.png',
      bg_image_url: '/images/evacuator_bg.jpg',
      details: [
        { title: 'Любая сложность', text: 'Эвакуация всех видов транспорта.' },
        { title: 'Круглосуточно 24/7', text: 'Мы на связи днем и ночью.' },
        { title: 'Бережная погрузка', text: 'Современное оборудование.' },
        { title: 'Доступные цены', text: 'Прозрачное ценообразование.' }
      ],
      content: `
        <h1 class="text-3xl font-bold mb-6 text-primary">Срочный эвакуатор 24/7</h1>
        <p class="mb-6 leading-relaxed">
          Неожиданная поломка? Надежный <strong>эвакуатор</strong> от «Prim‑Uslugi» решит проблему.
        </p>
      `
    }
  ];

  const insert = db.prepare(`
    INSERT OR REPLACE INTO pages (
      url, title, content, header_description, details_json, icon_name, image_url, bg_image_url, is_service
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  db.transaction(() => {
    for (const s of initialServices) {
      insert.run(
        s.url,
        s.title,
        s.content.trim(),
        s.header_description,
        JSON.stringify(s.details),
        s.icon_name,
        s.image_url,
        s.bg_image_url
      );
    }
  })();
  console.log('✅ Seeding completed.');
}

export function getNews() {
  return db.prepare('SELECT * FROM news ORDER BY created_at DESC LIMIT 10').all();
}

export function addNews({ title, content, type, image_url }) {
  return db.prepare('INSERT INTO news (title, content, type, image_url) VALUES (?, ?, ?, ?)')
    .run(title, content, type, image_url);
}

export function getNewsById(id) {
  return db.prepare('SELECT * FROM news WHERE id = ?').get(id);
}

export function updateNews(id, { title, content, type, image_url }) {
  return db.prepare('UPDATE news SET title=?, content=?, type=?, image_url=? WHERE id=?')
    .run(title, content, type || 'update', image_url, id);
}

export function deleteNews(id) {
  return db.prepare('DELETE FROM news WHERE id = ?').run(id);
}

// Settings helpers
export function getSettings() {
  const rows = db.prepare('SELECT * FROM settings').all();
  return rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export function updateSetting(key, value) {
  return db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
    .run(key, value);
}

// User helpers
export function getUserByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

export function updateUserPassword(id, passwordHash) {
  return db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);
}

export default db;
