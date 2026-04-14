const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, 'prim_uslugi.db');
const db = new Database(dbPath);

const services = [
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
      { title: 'Офисные переезды', text: 'Быстрый переезд вашего бизнеса с минимальным простоем в работе.' },
      { title: 'Складские работы', text: 'Помощь в организации хранения, разгрузка фур и контейнеров.' },
      { title: 'Такелажные работы', text: 'Перенос тяжелых и негабаритных предметов: пианино, сейфы, станки.' }
    ],
    content: `
      <h1 class="text-3xl font-bold mb-6 text-primary">Услуги грузчиков во Владивостоке: быстрый переезд и погрузка</h1>
      <p class="mb-6 leading-relaxed">
        Требуется физическая помощь? Предоставляем опытные бригады: <strong>грузчики во Владивостоке</strong> и Приморском крае готовы выехать к вам за 30 минут.
      </p>
      
      <h2 class="text-2xl font-bold mb-4 text-primary">Что мы предлагаем:</h2>
      <ul class="list-disc pl-6 mb-8 space-y-3">
        <li>Оперативные <strong>грузчики на час</strong> для любых задач.</li>
        <li><strong>Быстрый переезд с грузчиками</strong> под ключ.</li>
        <li>Аккуратная <strong>погрузка/разгрузка машин</strong>, вагонов и складов.</li>
        <li><strong>Сбор и разборка мебели</strong>, а также <strong>вывоз старой мебели</strong>.</li>
        <li>Сложные <strong>такелажные работы</strong> (перемещение сейфов, пианино, оборудования).</li>
      </ul>
      
      <p class="mb-8 leading-relaxed">
        Наши профессиональные грузчики гарантируют сохранность ваших вещей. Оказываем комплексную помощь при переезде по всему Приморью.
      </p>

      <div class="bg-accent/5 p-6 rounded-2xl flex items-center gap-4">
        <span class="text-2xl">🔗</span>
        <p class="text-lg font-medium text-primary">
          Требуется транспорт для вещей? Перейдите в раздел <strong>Грузоперевозки</strong>.
        </p>
      </div>
    `
  },
  {
    url: 'services/freight',
    title: 'Грузоперевозки',
    header_description: 'Интеллектуальная логистика для ваших грузов. Мы обеспечиваем полную прозрачность, безопасность и своевременную доставку по всему Дальнему Востоку.',
    icon_name: 'Truck',
    image_url: '/images/IMG_0512.jpg',
    bg_image_url: '/images/IMG_0512.jpg',
    details: [
      { title: 'Городские перевозки', text: 'Оперативная доставка грузов по Владивостоку и другим городам края.' },
      { title: 'Междугородние рейсы', text: 'Перевозки по всему Приморскому краю с гарантией соблюдения сроков.' },
      { title: 'Разнообразие транспорта', text: 'В нашем парке машины различной грузоподъемности под любые задачи.' },
      { title: 'Страхование грузов', text: 'Мы несем полную материальную ответственность за сохранность вашего имущества.' }
    ],
    content: `
      <h1 class="text-3xl font-bold mb-6 text-primary">Профессиональные грузоперевозки во Владивостоке и Приморском крае</h1>
      <p class="mb-6 leading-relaxed">
        Ищете надежный способ доставить вещи или товары? Сервис «Prim‑Uslugi» осуществляет <strong>грузоперевозки во Владивостоке</strong> и по всему Приморскому краю. Мы организуем перевозку грузов по Приморью любой сложности: от домашних переездов до коммерческих поставок.
      </p>
      
      <h2 class="text-2xl font-bold mb-4 text-primary">Наши преимущества:</h2>
      <ul class="list-disc pl-6 mb-8 space-y-3">
        <li><strong>Грузоперевозки недорого</strong> и с прозрачным ценообразованием.</li>
        <li>Осуществляем <strong>межгородские грузоперевозки</strong> (Уссурийск, Находка, Артем и другие города).</li>
        <li>Доступна <strong>перевозка хрупких грузов</strong> и <strong>перевозка негабаритных грузов</strong>.</li>
        <li>Выполняем <strong>доставку грузов любой сложности</strong> с оформлением страховки.</li>
        <li>Работаем круглосуточно — <strong>грузоперевозки 24/7</strong>.</li>
      </ul>

      <div class="bg-accent/5 p-6 rounded-2xl flex items-center gap-4">
        <span class="text-2xl">🔗</span>
        <p class="text-lg font-medium text-primary">
          Нужна помощь с погрузкой? Закажите наши <strong>услуги профессиональных грузчиков</strong>.
        </p>
      </div>
    `
  },
  {
    url: 'services/evacuator',
    title: 'Эвакуатор',
    header_description: 'Круглосуточная эвакуация транспорта любой сложности. Мы приедем на помощь в любую погоду, чтобы безопасно транспортировать ваш автомобиль.',
    icon_name: 'AlertTriangle',
    image_url: '/images/banner_evacuator.png',
    bg_image_url: '/images/evacuator_bg.jpg',
    details: [
      { title: 'Любая сложность', text: 'Эвакуация легковых авто, внедорожников, спецтехники и мотоциклов.' },
      { title: 'Круглосуточно 24/7', text: 'Мы на связи днем и ночью, в любую погоду и праздничные дни.' },
      { title: 'Бережная погрузка', text: 'Используем современное оборудование, исключающее повреждения авто.' },
      { title: 'Доступные цены', text: 'Прозрачное ценообразование и отсутствие скрытых платежей.' }
    ],
    content: `
      <h1 class="text-3xl font-bold mb-6 text-primary">Срочный эвакуатор во Владивостоке круглосуточно</h1>
      <p class="mb-6 leading-relaxed">
        Неожиданная поломка или авария? Надежный <strong>эвакуатор во Владивостоке</strong> и <strong>эвакуация авто в Приморском крае</strong> от сервиса «Prim‑Uslugi» решат вашу проблему.
      </p>
      
      <h2 class="text-2xl font-bold mb-4 text-primary">Мы предлагаем:</h2>
      <ul class="list-disc pl-6 mb-8 space-y-3">
        <li><strong>Срочный эвакуатор</strong> и оперативный выезд бригады.</li>
        <li>Услуги доступны круглосуточно — <strong>эвакуатор 24 часа</strong> (включая <strong>ночной эвакуатор</strong>).</li>
        <li><strong>Безопасная эвакуация после ДТП</strong>.</li>
        <li>Помощь любой технике: от <strong>эвакуации мотоцикла</strong> до <strong>эвакуации грузового авто</strong>.</li>
        <li>В сложных ситуациях предоставляется <strong>эвакуатор с краном-манипулятором</strong>.</li>
      </ul>
      
      <p class="mb-8 leading-relaxed">
        Наша экстренная <strong>эвакуация авто</strong> — это фиксированная цена без доплат и гарантия сохранности вашего транспорта!
      </p>

      <div class="bg-accent/5 p-6 rounded-2xl flex items-center gap-4">
        <span class="text-2xl">🔗</span>
        <p class="text-lg font-medium text-primary">
          Нужна помощь в оформлении аварии? Вызовите нашего <strong>Аварийного комиссара</strong>.
        </p>
      </div>
    `
  }
];

// Re-ensure tables exist before inserting
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
`);

// Check and add columns
const pagesInfo = db.prepare("PRAGMA table_info(pages)").all();
const pagesColumns = pagesInfo.map(c => c.name);

const newCols = [
  { name: 'header_description', type: 'TEXT' },
  { name: 'details_json', type: 'TEXT' },
  { name: 'icon_name', type: 'TEXT' },
  { name: 'image_url', type: 'TEXT' },
  { name: 'bg_image_url', type: 'TEXT' },
  { name: 'is_service', type: 'INTEGER DEFAULT 0' }
];

for (const col of newCols) {
  if (!pagesColumns.includes(col.name)) {
    db.exec(`ALTER TABLE pages ADD COLUMN ${col.name} ${col.type}`);
  }
}

const insert = db.prepare(`
  INSERT OR REPLACE INTO pages (
    url, title, content, header_description, details_json, icon_name, image_url, bg_image_url, is_service
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

db.transaction(() => {
  for (const s of services) {
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

console.log('Seeding completed successfully.');