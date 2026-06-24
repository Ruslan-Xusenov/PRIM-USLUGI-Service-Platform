import Database from 'better-sqlite3';
import path from 'path';
import webpush from 'web-push';

const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel 
  ? path.join('/tmp', 'prim_uslugi.db') 
  : path.join(process.cwd(), 'prim_uslugi.db');

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
    category TEXT DEFAULT 'general',
    price_from INTEGER DEFAULT 0,
    price_to INTEGER DEFAULT 0,
    duration TEXT,
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

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT,
    comment TEXT,
    arrival_time TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_json TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  { name: 'is_service', type: 'INTEGER DEFAULT 0' },
  { name: 'category', type: "TEXT DEFAULT 'general'" },
  { name: 'price_from', type: 'INTEGER DEFAULT 0' },
  { name: 'price_to', type: 'INTEGER DEFAULT 0' },
  { name: 'duration', type: 'TEXT' },
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
  db.prepare('INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)')
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
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  db.transaction(() => {
    for (const s of initialSettings) {
      insertSetting.run(s.key, s.value);
    }
  })();
}

// Generate VAPID keys if not present
try {
  const hasVapidPublic = db.prepare('SELECT value FROM settings WHERE key = ?').get('vapid_public_key');
  if (!hasVapidPublic) {
    console.log('🔑 Generating VAPID keys for Push Notifications...');
    const keys = webpush.generateVAPIDKeys();
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('vapid_public_key', keys.publicKey);
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('vapid_private_key', keys.privateKey);
  }
} catch (e) {
  console.error('Error generating VAPID keys:', e);
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

// Always seed new services using INSERT OR IGNORE
const newServices = [
  {
    url: 'services/plumber',
    title: 'Сантехник',
    seo_title: 'Сантехник во Владивостоке — вызов на дом, срочно 24/7 | Prim-Uslugi',
    seo_description: 'Профессиональный сантехник во Владивостоке. Устранение протечек, замена труб, установка сантехники. Выезд за 30 мин. Звоните!',
    seo_keywords: 'сантехник Владивосток, вызов сантехника, срочный сантехник, замена труб, устранение протечки, установка унитаза',
    header_description: 'Быстрый выезд профессионального сантехника во Владивостоке и Приморском крае. Устраним любую протечку, установим оборудование, проведём замену труб. Работаем 24/7.',
    icon_name: 'Wrench',
    category: 'home',
    price_from: 1500,
    price_to: 15000,
    duration: 'от 1 часа',
    details: [
      { title: 'Устранение протечек', text: 'Быстрая диагностика и ликвидация любых протечек труб и соединений.' },
      { title: 'Замена труб', text: 'Полная замена водопроводных и канализационных труб из любых материалов.' },
      { title: 'Установка сантехники', text: 'Монтаж унитазов, раковин, ванн, душевых кабин, смесителей.' },
      { title: 'Прочистка канализации', text: 'Устранение засоров любой сложности профессиональным оборудованием.' }
    ],
    content: `<h2 class="text-2xl font-bold mb-4 text-primary">Услуги сантехника во Владивостоке</h2>
<p class="mb-6 leading-relaxed">Нужен <strong>срочный сантехник во Владивостоке</strong>? Команда Prim-Uslugi готова выехать к вам в течение 30 минут. Мы устраняем протечки, прочищаем канализацию и устанавливаем любую сантехнику.</p>
<h3 class="text-xl font-bold mb-3 text-primary">Что мы делаем:</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li>Устранение <strong>протечек кранов и труб</strong></li>
  <li><strong>Замена водопроводных труб</strong> (полипропилен, металлопластик, сталь)</li>
  <li>Установка <strong>унитазов, раковин, ванн</strong> и душевых кабин</li>
  <li><strong>Прочистка засоров</strong> канализации</li>
  <li>Монтаж <strong>водосчётчиков</strong></li>
</ul>
<h3 class="text-xl font-bold mb-3 text-primary">Стоимость работ:</h3>
<p class="mb-4">Вызов мастера — <strong>от 1 500 ₽</strong>. Устранение протечки — <strong>от 2 000 ₽</strong>. Замена трубы — <strong>от 3 500 ₽</strong>.</p>`
  },
  {
    url: 'services/electrician',
    title: 'Электрик',
    seo_title: 'Электрик на дом во Владивостоке — вызов 24/7 | Prim-Uslugi',
    seo_description: 'Профессиональный электрик во Владивостоке. Ремонт проводки, установка розеток, монтаж щитков. Выезд за 30 мин. Гарантия качества.',
    seo_keywords: 'электрик Владивосток, вызов электрика, ремонт проводки, замена розеток, монтаж электрики',
    header_description: 'Квалифицированный электрик с допуском. Ремонт и монтаж электропроводки, установка розеток, выключателей, щитков. Безопасно и с гарантией.',
    icon_name: 'Zap',
    category: 'home',
    price_from: 1500,
    price_to: 20000,
    duration: 'от 1 часа',
    details: [
      { title: 'Ремонт проводки', text: 'Диагностика и устранение любых неисправностей электропроводки.' },
      { title: 'Монтаж розеток', text: 'Установка и замена розеток, выключателей, светильников.' },
      { title: 'Электрощитки', text: 'Монтаж и замена электрических щитков, автоматов, УЗО.' },
      { title: 'Новая проводка', text: 'Прокладка кабелей при ремонте и строительстве.' }
    ],
    content: `<h2 class="text-2xl font-bold mb-4 text-primary">Услуги электрика во Владивостоке</h2>
<p class="mb-6 leading-relaxed">Вызвать <strong>электрика во Владивостоке</strong> — просто! Наши мастера с допуском работают быстро и безопасно. Устраним короткое замыкание, установим розетки и автоматы.</p>
<h3 class="text-xl font-bold mb-3 text-primary">Наши услуги:</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Ремонт электропроводки</strong> и устранение замыканий</li>
  <li>Установка <strong>розеток и выключателей</strong></li>
  <li>Монтаж <strong>электрощитков</strong> и автоматических выключателей</li>
  <li><strong>Подключение электроплит</strong>, стиральных машин</li>
  <li>Прокладка <strong>новой проводки</strong> при ремонте</li>
</ul>
<h3 class="text-xl font-bold mb-3 text-primary">Цены:</h3>
<p class="mb-4">Вызов электрика — <strong>от 1 500 ₽</strong>. Замена розетки — <strong>от 500 ₽</strong>. Монтаж щитка — <strong>от 5 000 ₽</strong>.</p>`
  },
  {
    url: 'services/legal',
    title: 'Юридические услуги',
    seo_title: 'Юридические услуги во Владивостоке — составление договоров, исков | Prim-Uslugi',
    seo_description: 'Профессиональные юридические услуги во Владивостоке. Составление договоров, исковых заявлений, жалоб, претензий. Консультация юриста.',
    seo_keywords: 'юридические услуги Владивосток, составление договоров, исковое заявление, жалоба, претензия, юрист',
    header_description: 'Профессиональная юридическая помощь в Приморском крае. Составление договоров, исковых заявлений, претензий и жалоб. Защита ваших интересов.',
    icon_name: 'Scale',
    category: 'legal',
    price_from: 2000,
    price_to: 30000,
    duration: '1–3 дня',
    details: [
      { title: 'Составление договоров', text: 'Договоры купли-продажи, аренды, подряда, услуг и другие.' },
      { title: 'Исковые заявления', text: 'Подготовка исков в суд с учетом всех процессуальных требований.' },
      { title: 'Жалобы и претензии', text: 'Составление жалоб в надзорные органы и претензий к контрагентам.' },
      { title: 'Юридическая консультация', text: 'Устные и письменные консультации по всем правовым вопросам.' }
    ],
    content: `<h2 class="text-2xl font-bold mb-4 text-primary">Юридические услуги во Владивостоке</h2>
<p class="mb-6 leading-relaxed">Нужна <strong>помощь юриста во Владивостоке</strong>? Наши специалисты помогут составить любые правовые документы, защитят ваши интересы в суде и государственных органах.</p>
<h3 class="text-xl font-bold mb-3 text-primary">Что мы делаем:</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Составление договоров</strong> (аренда, купля-продажа, подряд)</li>
  <li>Подготовка <strong>исковых заявлений</strong> в суд</li>
  <li>Написание <strong>претензий</strong> к застройщикам, продавцам, работодателям</li>
  <li>Составление <strong>жалоб</strong> в прокуратуру, Роспотребнадзор, ГЖИ</li>
  <li><strong>Юридическая консультация</strong> онлайн и офлайн</li>
</ul>
<h3 class="text-xl font-bold mb-3 text-primary">Стоимость:</h3>
<p class="mb-4">Консультация — <strong>от 2 000 ₽</strong>. Составление договора — <strong>от 3 000 ₽</strong>. Исковое заявление — <strong>от 5 000 ₽</strong>.</p>`
  },
  {
    url: 'services/renovation',
    title: 'Ремонт помещений',
    seo_title: 'Ремонт квартир и помещений во Владивостоке под ключ | Prim-Uslugi',
    seo_description: 'Ремонт квартир, офисов и помещений во Владивостоке. Косметический и капитальный ремонт под ключ. Качественная отделка. Звоните!',
    seo_keywords: 'ремонт квартир Владивосток, ремонт под ключ, отделка, косметический ремонт, капитальный ремонт помещений',
    header_description: 'Полный спектр ремонтных работ во Владивостоке: от косметического до капитального ремонта под ключ. Опытные мастера, качественные материалы.',
    icon_name: 'PaintBucket',
    category: 'home',
    price_from: 3000,
    price_to: 100000,
    duration: 'от 3 дней',
    details: [
      { title: 'Косметический ремонт', text: 'Поклейка обоев, покраска стен, замена напольных покрытий.' },
      { title: 'Капитальный ремонт', text: 'Полная перепланировка и отделка помещений под ключ.' },
      { title: 'Санузел под ключ', text: 'Укладка плитки, монтаж сантехники, водоотведение.' },
      { title: 'Коммерческие помещения', text: 'Ремонт офисов, магазинов, кафе и производственных помещений.' }
    ],
    content: `<h2 class="text-2xl font-bold mb-4 text-primary">Ремонт квартир и помещений во Владивостоке</h2>
<p class="mb-6 leading-relaxed">Ищете надёжную бригаду для <strong>ремонта квартиры во Владивостоке</strong>? Prim-Uslugi предлагает полный цикл ремонтных работ — от косметического обновления до капитального ремонта под ключ.</p>
<h3 class="text-xl font-bold mb-3 text-primary">Виды работ:</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Косметический ремонт</strong>: обои, покраска, пол</li>
  <li><strong>Капитальный ремонт</strong> под ключ с перепланировкой</li>
  <li>Отделка <strong>санузлов</strong> и кухонь</li>
  <li>Шпаклёвка, <strong>выравнивание стен</strong> и потолков</li>
  <li>Укладка <strong>ламината, плитки, паркета</strong></li>
</ul>
<h3 class="text-xl font-bold mb-3 text-primary">Стоимость:</h3>
<p class="mb-4">Косметический ремонт — <strong>от 3 000 ₽/м²</strong>. Капитальный ремонт — <strong>от 8 000 ₽/м²</strong>. Укладка плитки — <strong>от 1 500 ₽/м²</strong>.</p>`
  },
  {
    url: 'services/realtor',
    title: 'Частный риэлтор',
    seo_title: 'Частный риэлтор во Владивостоке — аренда и продажа недвижимости | Prim-Uslugi',
    seo_description: 'Частный риэлтор во Владивостоке. Помощь в аренде и продаже квартир, домов, коммерческой недвижимости. Безопасные сделки.',
    seo_keywords: 'риэлтор Владивосток, аренда квартир Владивосток, продажа квартир, частный риэлтор, недвижимость Приморье',
    header_description: 'Профессиональный частный риэлтор в Приморском крае. Помощь в аренде и продаже квартир, домов, коммерческой недвижимости. Безопасное сопровождение сделки.',
    icon_name: 'Home',
    category: 'legal',
    price_from: 10000,
    price_to: 100000,
    duration: '3–30 дней',
    details: [
      { title: 'Аренда квартир', text: 'Подбор объектов аренды, проверка документов, заключение договора.' },
      { title: 'Продажа недвижимости', text: 'Оценка, реклама объекта, показы, переговоры и сделка.' },
      { title: 'Покупка жилья', text: 'Поиск вариантов, юридическая проверка, сопровождение сделки.' },
      { title: 'Коммерческая недвижимость', text: 'Аренда и продажа офисов, складов, торговых помещений.' }
    ],
    content: `<h2 class="text-2xl font-bold mb-4 text-primary">Частный риэлтор во Владивостоке</h2>
<p class="mb-6 leading-relaxed">Нужна помощь с <strong>недвижимостью во Владивостоке</strong>? Наш частный риэлтор поможет выгодно купить, продать или арендовать квартиру, дом или коммерческое помещение.</p>
<h3 class="text-xl font-bold mb-3 text-primary">Услуги риэлтора:</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Аренда квартир</strong> и домов в Владивостоке и крае</li>
  <li><strong>Продажа квартир</strong>: оценка, реклама, сделка</li>
  <li><strong>Покупка жилья</strong> с юридической проверкой</li>
  <li><strong>Коммерческая недвижимость</strong>: офисы, склады</li>
  <li>Сопровождение ипотечных сделок</li>
</ul>
<h3 class="text-xl font-bold mb-3 text-primary">Комиссия:</h3>
<p class="mb-4">Аренда — <strong>50-100% от месячной платы</strong>. Купля-продажа — <strong>2-3% от суммы сделки</strong>.</p>`
  }
];

const insertNew = db.prepare(`
  INSERT OR IGNORE INTO pages (
    url, title, content, seo_title, seo_description, seo_keywords,
    header_description, details_json, icon_name, image_url,
    category, price_from, price_to, duration, is_service
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '/images/banner.png', ?, ?, ?, ?, 1)
`);

db.transaction(() => {
  for (const s of newServices) {
    insertNew.run(
      s.url, s.title, s.content.trim(),
      s.seo_title, s.seo_description, s.seo_keywords,
      s.header_description, JSON.stringify(s.details), s.icon_name,
      s.category, s.price_from, s.price_to, s.duration
    );
  }
})();

// Update SEO for existing services
const seoUpdates = [
  { url: 'services/commissioner', seo_title: 'Аварийный комиссар во Владивостоке — выезд за 20 мин | Prim-Uslugi', seo_description: 'Аварийный комиссар во Владивостоке. Оформление ДТП, европротокол, юридическая помощь. Выезд за 20 минут. Работаем 24/7.', seo_keywords: 'аварийный комиссар Владивосток, оформление ДТП, европротокол, помощь при ДТП' },
  { url: 'services/loaders', seo_title: 'Грузчики во Владивостоке — переезд, погрузка | Prim-Uslugi', seo_description: 'Профессиональные грузчики во Владивостоке. Квартирные и офисные переезды, погрузка/разгрузка. Бережно и быстро.', seo_keywords: 'грузчики Владивосток, переезд, погрузка разгрузка, такелажные работы' },
  { url: 'services/freight', seo_title: 'Грузоперевозки во Владивостоке и Приморском крае | Prim-Uslugi', seo_description: 'Грузоперевозки во Владивостоке и по Приморскому краю. Любые объёмы, страховка грузов. Фиксированные цены.', seo_keywords: 'грузоперевозки Владивосток, доставка грузов, логистика Приморье, газель грузовик' },
  { url: 'services/evacuator', seo_title: 'Эвакуатор во Владивостоке 24/7 — срочный вызов | Prim-Uslugi', seo_description: 'Эвакуатор во Владивостоке круглосуточно. Быстрая подача, бережная погрузка. Эвакуация любого транспорта.', seo_keywords: 'эвакуатор Владивосток, срочный эвакуатор, эвакуация авто, помощь на дороге' },
];

const updateSeo = db.prepare('UPDATE pages SET seo_title=?, seo_description=?, seo_keywords=? WHERE url=? AND (seo_title IS NULL OR seo_title = \'\')');
db.transaction(() => {
  for (const u of seoUpdates) {
    updateSeo.run(u.seo_title, u.seo_description, u.seo_keywords, u.url);
  }
})();

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

// Orders helpers
export function getOrders() {
  return db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
}

export function addOrder({ name, phone, email, service, comment, arrival_time }) {
  return db.prepare(`
    INSERT INTO orders (name, phone, email, service, comment, arrival_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, phone, email || null, service || null, comment || null, arrival_time || null);
}

export function updateOrderStatus(id, status) {
  return db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
}

export function deleteOrder(id) {
  return db.prepare('DELETE FROM orders WHERE id = ?').run(id);
}

// Chat helpers
export function getChatMessages(session_id) {
  return db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC').all();
}

export function addChatMessage({ session_id, sender, message }) {
  return db.prepare('INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)')
    .run(session_id, sender, message);
}

export function getChatSessions() {
  return db.prepare(`
    SELECT DISTINCT session_id, 
      (SELECT message FROM chat_messages WHERE session_id = c.session_id ORDER BY created_at DESC LIMIT 1) as last_message,
      (SELECT created_at FROM chat_messages WHERE session_id = c.session_id ORDER BY created_at DESC LIMIT 1) as last_active
    FROM chat_messages c
    ORDER BY last_active DESC
  `).all();
}

// Push subscription helpers
export function addPushSubscription(subscription_json) {
  return db.prepare('INSERT OR IGNORE INTO push_subscriptions (subscription_json) VALUES (?)')
    .run(subscription_json);
}

export function getPushSubscriptions() {
  return db.prepare('SELECT * FROM push_subscriptions').all();
}

export function deletePushSubscription(subscription_json) {
  return db.prepare('DELETE FROM push_subscriptions WHERE subscription_json = ?').run(subscription_json);
}

export default db;
