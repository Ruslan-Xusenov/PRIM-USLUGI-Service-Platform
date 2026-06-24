'use client';
import { motion } from 'framer-motion';
import {
  Phone, CheckCircle, ArrowRight, Shield, Globe, Clock, Box,
  Truck, Hammer, AlertTriangle, Activity, Briefcase,
  Wrench, Zap, Scale, PaintBucket, Home, ChevronRight, Star
} from 'lucide-react';
import Link from 'next/link';
import ContactForm from './ContactForm';

const IconMap = {
  Shield: <Shield size={32} />,
  Truck: <Truck size={32} />,
  Hammer: <Hammer size={32} />,
  AlertTriangle: <AlertTriangle size={32} />,
  Globe: <Globe size={32} />,
  Clock: <Clock size={32} />,
  Box: <Box size={32} />,
  Activity: <Activity size={32} />,
  Briefcase: <Briefcase size={32} />,
  Wrench: <Wrench size={32} />,
  Zap: <Zap size={32} />,
  Scale: <Scale size={32} />,
  PaintBucket: <PaintBucket size={32} />,
  Home: <Home size={32} />,
};

const allServices = [
  { title: 'Грузоперевозки', href: '/services/freight', icon: <Truck size={16} /> },
  { title: 'Грузчики', href: '/services/loaders', icon: <Hammer size={16} /> },
  { title: 'Аварийный комиссар', href: '/services/commissioner', icon: <Shield size={16} /> },
  { title: 'Эвакуатор', href: '/services/evacuator', icon: <AlertTriangle size={16} /> },
  { title: 'Сантехник', href: '/services/plumber', icon: <Wrench size={16} /> },
  { title: 'Электрик', href: '/services/electrician', icon: <Zap size={16} /> },
  { title: 'Юридические услуги', href: '/services/legal', icon: <Scale size={16} /> },
  { title: 'Ремонт помещений', href: '/services/renovation', icon: <PaintBucket size={16} /> },
  { title: 'Частный риэлтор', href: '/services/realtor', icon: <Home size={16} /> },
];

export default function ServicePage({ title, description, details, icon, image, bgImage, bgMobileImage, priceFrom, priceTo, duration, children }) {
  const resolvedIcon = typeof icon === 'string' ? (IconMap[icon] || <Box size={32} />) : icon;
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-bg-main">
      {/* ===== BREADCRUMBS ===== */}
      <div style={{
        paddingTop: '6rem',
        paddingBottom: '0.5rem',
        background: 'rgba(6,12,26,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="container">
          <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >Главная</Link>
            <ChevronRight size={14} />
            <Link href="/catalog" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >Услуги</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--accent-bright)' }}>{title}</span>
          </nav>
        </div>
      </div>

      {/* ===== HERO HEADER ===== */}
      <section className="relative pb-20 overflow-hidden" style={{ paddingTop: '3rem' }}>
        {(bgImage || bgMobileImage) && (
          <style dangerouslySetInnerHTML={{__html: `
            ${bgImage ? `@media (min-width: 769px) { body::before { background-image: url('${bgImage}') !important; } }` : ''}
            ${bgMobileImage ? `@media (max-width: 768px) { body::before { background-image: url('${bgMobileImage}') !important; } }` : ''}
            ${bgImage && !bgMobileImage ? `@media (max-width: 768px) { body::before { background-image: url('${bgImage}') !important; } }` : ''}
          `}} />
        )}
        <div className="container relative z-10">
          <motion.div initial="hidden" animate="show" variants={fadeInUp} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                {resolvedIcon || <Box size={24} />}
              </div>
              <span className="text-accent font-bold uppercase tracking-widest text-xs">Prim-Uslugi — Приморский край</span>
            </div>
            <h1 className="text-white font-extrabold mb-6 tracking-tight" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1 }}>{title}</h1>
            <p className="text-xl text-grey-400 leading-relaxed max-w-2xl mb-8">{description}</p>

            {/* Price & Duration badges */}
            {(priceFrom || duration) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {priceFrom && (
                  <div style={{
                    padding: '0.625rem 1.25rem',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: '2rem',
                    fontSize: '0.9rem', fontWeight: 700, color: '#34d399',
                  }}>
                    от {priceFrom.toLocaleString('ru-RU')} ₽
                    {priceTo ? ` — ${priceTo.toLocaleString('ru-RU')} ₽` : ''}
                  </div>
                )}
                {duration && (
                  <div style={{
                    padding: '0.625rem 1.25rem',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    borderRadius: '2rem',
                    fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}>
                    <Clock size={14} /> {duration}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="section">
        <div className="container grid grid-2 gap-20 items-start">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}>
            <div className="mb-12">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Подробности</span>
              <h2 className="text-4xl font-bold mb-6">Преимущества работы <br />с нами в регионе</h2>
              <p className="text-grey-600 mb-10 text-lg">
                Наша компания использует передовые технологии и современную технику для оказания услуг на самом высоком уровне.
              </p>

              <div className="grid gap-6">
                {details.map((detail, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="p-6 card-premium border-none bg-white shadow-premium flex gap-6 items-start group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-lg mb-2">{detail.title}</h4>
                      <p className="text-grey-500 text-sm leading-relaxed">{detail.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="card-premium bg-primary text-white p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Вызвать мастера прямо сейчас</h3>
              <p className="text-grey-400 mb-8 relative z-10 max-w-sm">Оставьте заявку — перезвоним за 2 минуты и согласуем удобное время выезда.</p>
              <div className="flex flex-wrap gap-4 relative z-10">
                <a href="tel:+79673888889" className="btn btn-accent px-8">
                  <Phone size={18} className="mr-2" /> Позвонить
                </a>
                <Link href="#contact" className="btn bg-white/5 border border-white/10 text-white hover:bg-white/10">
                  Оставить заявку
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-8">
            <div className="card-premium p-0 overflow-hidden border-none shadow-premium bg-primary-light/30">
              <img
                src={image || "/images/banner.png"}
                alt={`${title} во Владивостоке`}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '350px', display: 'block' }}
              />
              <div className="p-8">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Globe size={20} className="text-accent" /> Охват территорий
                </h4>
                <ul className="grid gap-4">
                  {['Владивосток (все районы)', 'Уссурийск и филиалы', 'Находка и порт', 'Артем и Аэропорт'].map(zone => (
                    <li key={zone} className="flex items-center justify-between text-sm py-3 border-b border-grey-50 last:border-0 font-medium text-grey-600">
                      {zone}
                      <ArrowRight size={14} className="text-accent" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rating block */}
            <div className="card-premium p-8 border-none" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="flex items-center gap-4 mb-3">
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                </div>
                <span style={{ fontWeight: 800, color: '#fcd34d', fontSize: '1.1rem' }}>4.9 / 5.0</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>На основе отзывов 10 000+ клиентов Приморского края</p>
            </div>
          </aside>
        </div>
      </section>

      {/* SEO Text */}
      {children && (
        <section className="section bg-white pt-16 pb-16">
          <div className="container max-w-4xl prose-lg text-grey-600">
            {children}
          </div>
        </section>
      )}

      {/* Cross-links */}
      <section className="section bg-white border-t border-grey-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Другие услуги Prim-Uslugi</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {allServices.map(s => (
              <Link key={s.href} href={s.href} className="group card-premium hover:border-accent/30 transition-all" style={{ padding: '1.25rem' }}>
                <div className="w-10 h-10 rounded-xl bg-grey-50 text-grey-400 group-hover:bg-accent group-hover:text-white transition-all flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h4 className="font-bold mb-2" style={{ fontSize: '0.9rem' }}>{s.title}</h4>
                <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  Открыть <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-sm bg-bg-main" id="contact">
        <div className="container max-w-3xl">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
