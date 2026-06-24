'use client';
import { useState, useEffect } from 'react';
import { m } from '@/components/MotionMock';
import {
  Truck, Hammer, Shield, AlertTriangle, Wrench, Zap, Scale, PaintBucket, Home,
  ArrowRight, Search, MapPin, Star, Clock, Phone
} from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  Truck: <Truck size={28} />, Hammer: <Hammer size={28} />, Shield: <Shield size={28} />,
  AlertTriangle: <AlertTriangle size={28} />, Wrench: <Wrench size={28} />, Zap: <Zap size={28} />,
  Scale: <Scale size={28} />, PaintBucket: <PaintBucket size={28} />, Home: <Home size={28} />,
};

const categories = [
  { id: 'all', label: 'Все услуги' },
  { id: 'transport', label: 'Транспорт и грузы' },
  { id: 'home', label: 'Дом и ремонт' },
  { id: 'legal', label: 'Юридические' },
];

const staticServices = [
  { title: 'Грузоперевозки', slug: 'freight', icon: 'Truck', category: 'transport', price_from: 1000, duration: 'от 1 часа', badge: '★ Популярно', desc: 'Логистика любой сложности по Приморскому краю' },
  { title: 'Грузчики', slug: 'loaders', icon: 'Hammer', category: 'transport', price_from: 800, duration: 'от 1 часа', desc: 'Бережный переезд и складские работы' },
  { title: 'Аварийный комиссар', slug: 'commissioner', icon: 'Shield', category: 'transport', price_from: 2500, duration: '20 мин', badge: '24/7', desc: 'Оформление ДТП, европротокол' },
  { title: 'Эвакуатор', slug: 'evacuator', icon: 'AlertTriangle', category: 'transport', price_from: 2000, duration: '30 мин', badge: '24/7', desc: 'Эвакуация авто любой сложности' },
  { title: 'Сантехник', slug: 'plumber', icon: 'Wrench', category: 'home', price_from: 1500, duration: 'от 1 часа', desc: 'Устранение протечек, замена труб, монтаж' },
  { title: 'Электрик', slug: 'electrician', icon: 'Zap', category: 'home', price_from: 1500, duration: 'от 1 часа', desc: 'Ремонт проводки, розетки, щитки' },
  { title: 'Ремонт помещений', slug: 'renovation', icon: 'PaintBucket', category: 'home', price_from: 3000, duration: 'от 3 дней', desc: 'Косметический и капитальный ремонт под ключ' },
  { title: 'Юридические услуги', slug: 'legal', icon: 'Scale', category: 'legal', price_from: 2000, duration: '1–3 дня', desc: 'Договоры, иски, жалобы, претензии' },
  { title: 'Частный риэлтор', slug: 'realtor', icon: 'Home', category: 'legal', price_from: 10000, duration: '3–30 дней', desc: 'Аренда и продажа недвижимости' },
];

export default function CatalogClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState(staticServices);

  useEffect(() => {
    fetch('/api/services').then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const merged = staticServices.map(s => {
          const dyn = data.find(d => d.url === `services/${s.slug}`);
          return dyn ? { ...s, price_from: dyn.price_from || s.price_from, duration: dyn.duration || s.duration } : s;
        });
        setServices(merged);
      }
    }).catch(() => {});
  }, []);

  const filtered = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ overflowX: 'hidden', paddingTop: '6rem' }}>
      {/* Header */}
      <section style={{ padding: '4rem 0 3rem', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <div style={{ animation: 'heroFadeUp 0.6s ease backwards' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--accent)', display: 'inline-block', marginBottom: '1rem', padding: '0.35rem 0.875rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: '2rem' }}>
              Все услуги
            </span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Каталог услуг{' '}
              <span style={{ background: 'linear-gradient(135deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Prim-Uslugi
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '36rem', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              9 направлений услуг во Владивостоке и Приморском крае. Профессионалы с выездом за 30 минут.
            </p>

            {/* Search */}
            <div style={{ maxWidth: '28rem', margin: '0 auto', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }} />
              <input
                type="text"
                aria-label="Поиск по услугам"
                placeholder="Найти услугу..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '1.25rem', color: 'white', fontSize: '0.95rem', outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.625rem 1.375rem', borderRadius: '2rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.25s ease', border: 'none',
                background: activeCategory === cat.id ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.1)',
                color: activeCategory === cat.id ? 'white' : 'rgba(255,255,255,0.8)',
                boxShadow: activeCategory === cat.id ? '0 4px 16px rgba(59,130,246,0.35)' : 'none',
              }}
            >{cat.label}</button>
          ))}
        </div>
      </div>

      {/* Service Cards */}
      <section style={{ padding: '1rem 0 8rem' }}>
        <div className="container">
          <m.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}
          >
            {filtered.map((service, i) => (
              <m.div key={service.slug}>
                <Link href={`/services/${service.slug}`} style={{
                  display: 'flex', flexDirection: 'column', height: '100%',
                  background: 'rgba(12,24,45,0.65)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.75rem',
                  padding: '2rem', textDecoration: 'none', transition: 'all 0.4s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(59,130,246,0.4)'; e.currentTarget.style.background = 'rgba(15,30,53,0.9)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(12,24,45,0.65)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {service.badge && (
                    <span style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.2rem 0.65rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '2rem', color: '#fcd34d', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {service.badge}
                    </span>
                  )}
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                      {iconMap[service.icon] || <Truck size={28} />}
                    </div>
                  </div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>{service.title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem', flex: 1 }}>{service.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      {service.price_from > 0 && (
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399' }}>от {service.price_from.toLocaleString('ru-RU')} ₽</div>
                      )}
                      {service.duration && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                          <Clock size={11} /> {service.duration}
                        </div>
                      )}
                    </div>
                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </m.div>
            ))}
          </m.div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <Search size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>Услуги не найдены. Попробуйте другой запрос.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
