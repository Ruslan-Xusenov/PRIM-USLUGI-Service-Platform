'use client';
import { useState, useEffect } from 'react';
import { LazyMotion, m, AnimatePresence } from '@/components/MotionMock';

import {
  Phone, Shield, Truck, Hammer, AlertTriangle, ArrowRight, CheckCircle,
  MapPin, Users, Award, Mail, Star, Zap, Clock, TrendingUp, ArrowUpRight,
  Wrench, Scale, PaintBucket, Home as HomeIcon, Search, ChevronRight, Quote,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import DeferredRender from '@/components/DeferredRender';
import { useSettings } from '@/context/SettingsContext';
import { loadFramerFeatures } from '@/components/MotionMock';

const ContactForm = dynamic(() => import('@/components/ContactForm'));
const NewsFeed = dynamic(() => import('@/components/NewsFeed'));



const popularServices = [
  { label: 'Грузчики', href: '/services/loaders', icon: <Hammer size={18} /> },
  { label: 'Эвакуатор', href: '/services/evacuator', icon: <AlertTriangle size={18} /> },
  { label: 'Ремонт квартир', href: '/services/renovation', icon: <PaintBucket size={18} /> },
  { label: 'Сантехник', href: '/services/plumber', icon: <Wrench size={18} /> },
  { label: 'Электрик', href: '/services/electrician', icon: <Zap size={18} /> },
  { label: 'Юрист', href: '/services/legal', icon: <Scale size={18} /> },
  { label: 'Риэлтор', href: '/services/realtor', icon: <HomeIcon size={18} /> },
  { label: 'Грузоперевозки', href: '/services/freight', icon: <Truck size={18} /> },
];

/* How it works steps */
const howItWorks = [
  { step: '01', title: 'Оставляете заявку', desc: 'Заполните форму или позвоните нам — займёт 1 минуту.' },
  { step: '02', title: 'Мы находим мастера', desc: 'Подбираем ближайшего профессионала по вашему запросу.' },
  { step: '03', title: 'Согласовываете детали', desc: 'Мастер связывается с вами, обсуждает сроки и стоимость.' },
  { step: '04', title: 'Мастер выполняет работу', desc: 'Приезжает и выполняет работу качественно и в срок.' },
];

/* Reviews */
const reviews = [
  { name: 'Александр К.', service: 'Эвакуатор', rating: 5, text: 'Машина сломалась посреди ночи. Эвакуатор приехал за 25 минут. Всё сделали быстро и аккуратно!' },
  { name: 'Мария Д.', service: 'Сантехник', rating: 5, text: 'Труба лопнула в воскресенье вечером. Мастер приехал через 40 минут, всё починил. Очень доволен сервисом.' },
  { name: 'Игорь В.', service: 'Ремонт помещений', rating: 5, text: 'Отличная бригада! Сделали косметический ремонт в квартире за 5 дней. Качество отменное, цена честная.' },
  { name: 'Светлана Р.', service: 'Электрик', rating: 5, text: 'Срочно нужен был электрик — проводка перегорела. Мастер с допуском, всё сделал профессионально.' },
];

/* ====================================================
   Fade-in variant helpers
   ==================================================== */
const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.23, 1, 0.32, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } },
};

/* ====================================================
   ServiceCard
   ==================================================== */
function ServiceCard({ service, index, focused, onEnter, onLeave }) {
  const isDimmed = focused !== null && focused !== index;
  const isActive = focused === index;

  const iconColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
  const iconBgs = [
    'rgba(59,130,246,0.1)', 'rgba(139,92,246,0.1)',
    'rgba(16,185,129,0.1)', 'rgba(245,158,11,0.1)',
  ];
  const glows = [
    'rgba(59,130,246,0.15)', 'rgba(139,92,246,0.15)',
    'rgba(16,185,129,0.15)', 'rgba(245,158,11,0.15)',
  ];

  return (
    <m.div
      variants={fadeInUp}
      style={{
        transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
        opacity: isDimmed ? 0.35 : 1,
        filter: isDimmed ? 'blur(2px) saturate(0.5)' : 'none',
        transform: isActive ? 'translateY(-4px) scale(1.01)' : 'none',
        zIndex: isActive ? 10 : 1,
        position: 'relative',
      }}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={onLeave}
    >
      <Link
        href={service.link}
        style={{
          display: 'flex', flexDirection: 'column',
          height: '100%',
          background: isActive
            ? `linear-gradient(135deg, rgba(15,30,53,0.9), rgba(20,40,70,0.9))`
            : 'rgba(12,24,45,0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isActive
            ? `1px solid ${iconColors[index]}50`
            : '1px solid rgba(255,255,255,0.07)',
          borderRadius: '1.75rem',
          padding: '2.25rem',
          textDecoration: 'none',
          boxShadow: isActive
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${glows[index]}`
            : '0 4px 24px rgba(0,0,0,0.3)',
          transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        {/* Badge */}
        {service.badge && (
          <span style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            padding: '0.25rem 0.75rem',
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '2rem',
            color: '#fcd34d', fontSize: '0.65rem', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.15em',
          }}>
            {service.badge}
          </span>
        )}

        {/* Icon */}
        <div style={{
          width: '3.5rem', height: '3.5rem',
          borderRadius: '1rem',
          background: iconBgs[index],
          border: `1px solid ${iconColors[index]}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.75rem',
          color: iconColors[index],
          transition: 'all 0.4s ease',
          boxShadow: isActive ? `0 0 20px ${glows[index]}` : 'none',
        }}>
          {service.icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.25rem', fontWeight: 800,
          color: isActive ? 'white' : 'rgba(255,255,255,0.9)',
          marginBottom: '0.875rem',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.02em',
          transition: 'color 0.3s ease',
        }}>
          {service.title}
        </h3>

        {/* Desc */}
        <p style={{
          color: 'var(--text-secondary)', fontSize: '0.9rem',
          lineHeight: 1.7, marginBottom: '2rem',
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {service.desc}
        </p>

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${isActive ? iconColors[index] + '25' : 'rgba(255,255,255,0.06)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'border-color 0.3s ease',
        }}>
          <span style={{ color: iconColors[index], fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Узнать больше
          </span>
          <div style={{
            width: '2.25rem', height: '2.25rem',
            borderRadius: '0.75rem',
            background: isActive ? iconColors[index] : 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
            transition: 'all 0.4s ease',
          }}>
            <ArrowRight size={16} />
          </div>
        </div>
      </Link>
    </m.div>
  );
}

/* ====================================================
   StatCard
   ==================================================== */
function StatCard({ stat, index }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: '1.25rem',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '1.25rem',
        transition: 'all 0.35s ease',
      }}
      whileHover={{
        background: 'rgba(59,130,246,0.08)',
        borderColor: 'rgba(59,130,246,0.25)',
        y: -2,
      }}
    >
      <div style={{
        width: '3.25rem', height: '3.25rem',
        borderRadius: '1rem',
        background: 'rgba(59,130,246,0.12)',
        border: '1px solid rgba(59,130,246,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent)', flexShrink: 0,
      }}>
        {stat.icon && <stat.icon.type {...stat.icon.props} size={24} />}
      </div>
      <div>
        <div style={{
          fontSize: '2rem', fontWeight: 900, lineHeight: 1,
          fontFamily: 'var(--font-heading)', letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.25rem',
        }}>
          {stat.value}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)' }}>
          {stat.label}
        </div>
      </div>
    </m.div>
  );
}

/* ====================================================
   Home Page
   ==================================================== */
export default function HomeClient() {
  const [focusedId, setFocusedId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [dynamicServices, setDynamicServices] = useState([]);
  const settings = useSettings();
  const { scrollY } = { scrollY: { get: () => 0 } };
  const heroY = 0;

  useEffect(() => { 
    setMounted(true); 
    async function loadServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDynamicServices(data);
          }
        }
      } catch (error) {
        console.error('Error loading dynamic services:', error);
      }
    }
    loadServices();
  }, []);

  const staticServices = [
    {
      title: 'Грузоперевозки',
      desc: 'Логистические решения любой сложности. От малотоннажных до крупногабаритных перевозок по краю.',
      icon: <Truck size={28} />,
      link: '/services/freight',
      badge: '★ Популярно',
    },
    {
      title: 'Грузчики',
      desc: 'Команда профессионалов для бережного переезда и складских работ. Работаем с хрупкими грузами.',
      icon: <Hammer size={28} />,
      link: '/services/loaders',
    },
    {
      title: 'Аварийный комиссар',
      desc: 'Квалифицированная помощь при ДТП и юридическое сопровождение. Прибытие за 20 минут.',
      icon: <Shield size={28} />,
      link: '/services/commissioner',
    },
    {
      title: 'Эвакуатор',
      desc: 'Круглосуточная эвакуация всех типов транспорта. Безопасная погрузка в любых условиях.',
      icon: <AlertTriangle size={28} />,
      link: '/services/evacuator',
    },
  ];

  const iconMap = {
    Truck: <Truck size={28} />,
    Hammer: <Hammer size={28} />,
    Shield: <Shield size={28} />,
    AlertTriangle: <AlertTriangle size={28} />,
  };

  const services = dynamicServices.length > 0
    ? dynamicServices.map(s => ({
        title: s.title,
        desc: s.header_description || s.seo_description || '',
        icon: iconMap[s.icon_name] || <Truck size={28} />,
        link: `/${s.url}`,
      }))
    : staticServices;

  const stats = [
    { label: 'Лет опыта', value: '5+', icon: <Award /> },
    { label: 'Городов края', value: '12', icon: <MapPin /> },
    { label: 'Клиентов', value: '10k+', icon: <Users /> },
  ];

  const utps = [
    { icon: <Zap />, title: 'Приезд за 30 мин', desc: 'Оперативная подача в любую точку города.' },
    { icon: <TrendingUp />, title: 'Фиксированная цена', desc: 'Никаких скрытых платежей после заказа.' },
    { icon: <Shield />, title: 'Гарантия качества', desc: 'Полная материальная ответственность.' },
    { icon: <Clock />, title: 'Работаем 24/7', desc: 'Ваша безопасность круглосуточно.' },
    { icon: <Star />, title: 'Проф. техника', desc: 'Современный автопарк под любые нужды.' },
  ];

  return (
    <LazyMotion features={loadFramerFeatures} strict>
      <div style={{ overflowX: 'hidden' }}>

      {/* ================================================
          HERO SECTION
          ================================================ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '8rem',
        paddingBottom: '6rem',
      }}>
        {/* Ambient glows */}
        <div style={{
          position: 'absolute', top: '10%', left: '-5%',
          width: '50%', height: '70%',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '-5%',
          width: '45%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
            className="grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Left: Text — CSS animations for instant LCP */}
            <div style={{ gridColumn: 'span 7' }}>
              {/* Eyebrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', animation: 'heroFadeUp 0.5s ease both', animationDelay: '0.15s' }}>
                <span style={{ width: '2.5rem', height: '2px', background: 'linear-gradient(90deg, #3b82f6, #2563eb)', borderRadius: '2px' }} />
                <span style={{
                  fontSize: '0.7rem', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.25em',
                  color: 'var(--accent-bright)',
                  padding: '0.375rem 0.875rem',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '2rem',
                }}>
                  Лидеры рынка Приморья
                </span>
              </div>

              {/* Headline — immediately visible for LCP (no JS dependency) */}
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: 'white',
                  marginBottom: '1.75rem',
                  fontFamily: 'var(--font-heading)',
                  animation: 'heroFadeUp 0.4s ease both',
                  animationDelay: '0.05s',
                }}
              >
                Сервис нового{' '}
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  поколения
                </span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  maxWidth: '34rem',
                  marginBottom: '3rem',
                  animation: 'heroFadeUp 0.5s ease both',
                  animationDelay: '0.25s',
                }}
              >
                Мы объединили лучшие практики логистики и экстренной помощи, чтобы обеспечить вам максимальную надежность во Владивостоке и по всему краю.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', animation: 'heroFadeUp 0.5s ease both', animationDelay: '0.35s' }}>
                <Link
                  href="#contact"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white', borderRadius: '1.25rem',
                    fontWeight: 700, fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
                    transition: 'all 0.35s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(59,130,246,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.4)'; }}
                >
                  Заказать услугу
                  <ArrowRight size={18} />
                </Link>
                <a
                  href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                    padding: '1rem 1.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    color: 'white', borderRadius: '1.25rem',
                    fontWeight: 700, fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all 0.35s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <Phone size={18} style={{ color: 'var(--accent)' }} />
                  {settings.contact_phone}
                </a>
              </div>

              {/* Trust row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', flexWrap: 'wrap', animation: 'heroFadeUp 0.5s ease both', animationDelay: '0.45s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} fill="var(--accent-gold)" style={{ color: 'var(--accent-gold)' }} />
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginLeft: '0.5rem' }}>4.9 / 5.0</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>10 000+ довольных клиентов</span>
              </div>
            </div>

            {/* Right: Stats Card */}
            <m.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{ gridColumn: 'span 5' }}
              className="hidden lg:block"
            >
              <div style={{
                background: 'rgba(8, 18, 38, 0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '2.25rem',
                padding: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
              }}>
                {/* Corner glow */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: '12rem', height: '12rem',
                  background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                  transform: 'translate(30%, -30%)',
                }} />

                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginBottom: '2rem' }}>
                  Наши показатели
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats.map((stat, i) => (
                    <StatCard key={i} stat={stat} index={i} />
                  ))}
                </div>

                {/* Bottom badge */}
                <div style={{
                  marginTop: '2rem', paddingTop: '1.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <div style={{
                    width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#34d399', flexShrink: 0,
                  }}>
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Работаем 24 / 7</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Круглосуточная поддержка</div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* ================================================
          SERVICES SECTION
          ================================================ */}
      <DeferredRender delay={400}>
      <section style={{ padding: '8rem 0', position: 'relative' }}>
        {/* Top edge glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '200px',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container">
          {/* Section header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}
            className="flex flex-col md:flex-row justify-between items-end"
          >
            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              style={{ maxWidth: '36rem' }}
            >
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.25em', color: 'var(--accent)', display: 'block', marginBottom: '1rem',
                padding: '0.35rem 0.875rem',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.18)',
                borderRadius: '2rem',
                width: 'fit-content',
              }}>
                Направления работы
              </span>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900, letterSpacing: '-0.03em',
                color: 'white', lineHeight: 1.1,
                fontFamily: 'var(--font-heading)',
              }}>
                Услуги, на которые{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  можно положиться
                </span>
              </h2>
            </m.div>

            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                href="/services/freight"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)',
                  textDecoration: 'none', transition: 'all 0.3s ease',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.875rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'transparent'; }}
              >
                Все услуги
                <ArrowRight size={16} />
              </Link>
            </m.div>
          </div>

          {/* Cards Grid */}
          <div style={{ position: 'relative' }}>
            {/* Focus overlay */}
            {focusedId !== null && (
              <div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(6,12,26,0.55)',
                backdropFilter: 'blur(6px)',
                zIndex: 5,
                pointerEvents: 'none',
                transition: 'opacity 0.4s ease',
              }} />
            )}

            <m.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '1.25rem',
                position: 'relative', zIndex: 6,
              }}
              className="grid grid-1 md:grid-2 lg:grid-4"
            >
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  service={service}
                  index={index}
                  focused={focusedId}
                  onEnter={setFocusedId}
                  onLeave={() => setFocusedId(null)}
                />
              ))}
            </m.div>
          </div>
        </div>
      </section>
      </DeferredRender>

      {/* ================================================
          POPULAR SERVICES QUICK ACCESS
          ================================================ */}
      <DeferredRender delay={300}>
      <section style={{ padding: '3rem 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container">
          <m.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem', textAlign: 'center' }}>
              Популярные услуги — быстрый переход
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              {popularServices.map(s => (
                <Link key={s.href} href={s.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2rem', color: 'rgba(255,255,255,0.75)',
                  fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                >
                  <span style={{ color: 'var(--accent)' }}>{s.icon}</span>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      </DeferredRender>

      {/* ================================================
          WHY US / UTP SECTION
          ================================================ */}
      <section style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background surface */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(4, 10, 24, 0.7)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }} />
        {/* Diagonal accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '30%', height: '100%',
          background: 'linear-gradient(135deg, transparent, rgba(59,130,246,0.04))',
          transform: 'skewX(-8deg) translateX(5%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <m.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: '5rem' }}
          >
            <span style={{
              fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.25em', color: 'var(--accent)',
              display: 'inline-block', marginBottom: '1.25rem',
              background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)',
              padding: '0.35rem 0.875rem', borderRadius: '2rem',
            }}>
              Наши преимущества
            </span>
            <h2 style={{
              fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
              fontWeight: 900, color: 'white', lineHeight: 1.1,
              fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em',
            }}>
              Почему нам доверяют<br />
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                тысячи жителей края?
              </span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '38rem', margin: '1.25rem auto 0', lineHeight: 1.7, fontSize: '1rem' }}>
              Мы выстроили систему качественного контроля на каждом этапе выполнения заказа.
            </p>
          </m.div>

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '1.25rem',
            }}
            className="grid grid-1 md:grid-5"
          >
            {utps.map((utp, index) => (
              <m.div
                key={index}
                variants={fadeInUp}
                style={{
                  padding: '2rem 1.5rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '1.5rem',
                  textAlign: 'center',
                  transition: 'all 0.4s ease',
                  cursor: 'default',
                }}
                whileHover={{
                  background: 'rgba(59,130,246,0.07)',
                  borderColor: 'rgba(59,130,246,0.25)',
                  y: -4,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(59,130,246,0.08)',
                }}
              >
                <div style={{
                  width: '3rem', height: '3rem',
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', margin: '0 auto 1.25rem',
                  fontSize: '1.25rem',
                }}>
                  {utp.icon && <utp.icon.type {...utp.icon.props} size={22} />}
                </div>
                <h3 style={{ color: 'white', fontWeight: 800, marginBottom: '0.625rem', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
                  {utp.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.65 }}>
                  {utp.desc}
                </p>
              </m.div>
            ))}
          </m.div>
          </div>
        </div>
      </section>
      </DeferredRender>

      {/* ================================================
          ABOUT SECTION
          ================================================ */}
      <DeferredRender delay={300}>
      <section style={{ padding: '8rem 0', position: 'relative' }}>
        <div className="container">
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: '4rem', alignItems: 'center' }}
            className="grid grid-2"
          >
            {/* Image side */}
            <m.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              style={{ position: 'relative' }}
            >
              {/* Main image */}
              <div style={{
                borderRadius: '1.75rem', overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
                width: '100%',
              }}>
                <Image src="/images/banner_web.jpg" alt="Company" width={800} height={400} style={{ width: '100%', height: 'clamp(14rem, 28vw, 20rem)', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                {/* Image overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(6,12,26,0.5) 0%, transparent 60%)',
                }} />
              </div>

              {/* Floating badge */}
              <m.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', bottom: '-1.5rem', right: '-1rem',
                  background: 'rgba(8, 18, 38, 0.92)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '1.25rem', padding: '1.25rem 1.75rem',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
                className="hidden md:block"
              >
                <div style={{
                  fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em',
                  fontFamily: 'var(--font-heading)',
                  background: 'linear-gradient(135deg, white, rgba(255,255,255,0.7))',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}>
                  24/7
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginTop: '0.375rem' }}>
                  На связи
                </div>
              </m.div>

              {/* Accent blob */}
              <div style={{
                position: 'absolute', top: '-2rem', left: '-2rem',
                width: '10rem', height: '10rem',
                background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
            </m.div>

            {/* Text side */}
            <m.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.25em', color: 'var(--accent)',
                display: 'inline-block', marginBottom: '1.25rem',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)',
                padding: '0.35rem 0.875rem', borderRadius: '2rem',
              }}>
                О компании
              </span>

              <h2 style={{
                fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)',
                fontWeight: 900, letterSpacing: '-0.03em',
                fontFamily: 'var(--font-heading)', lineHeight: 1.1,
                marginBottom: '1.5rem', color: 'white',
              }}>
                Приморский край —{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  наша зона ответственности
                </span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '1rem' }}>
                Мы — не просто диспетчерская служба. Prim-Uslugi — это объединение профессиональных исполнителей, имеющих многолетний опыт работы в сложных климатических и рельефных условиях юга Дальнего Востока.
              </p>

              {/* Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '1.25rem', rowGap: '2rem', marginBottom: '2.5rem' }}>
                {[
                  { icon: <MapPin size={16} />, title: 'Филиалы в 3 городах', desc: 'Владивосток, Находка, Уссурийск.' },
                  { icon: <Truck size={16} />, title: 'Собственный парк', desc: 'Более 50 единиц спецтехники.' },
                  { icon: <Shield size={16} />, title: 'Страхование грузов', desc: 'Полная материальная ответственность.' },
                  { icon: <Star size={16} />, title: 'Рейтинг 4.9/5', desc: 'По отзывам 10 000+ клиентов.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', gap: '0.875rem',
                      padding: '1.25rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '1.25rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.background = 'rgba(59,130,246,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <div style={{
                      width: '2rem', height: '2rem', borderRadius: '0.625rem', flexShrink: 0,
                      background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: 'var(--accent)',
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="#contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.875rem 1.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1.25rem', color: 'white',
                  fontWeight: 700, fontSize: '0.9rem',
                  textDecoration: 'none', transition: 'all 0.35s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                Читать полную историю
                <ArrowUpRight size={16} />
              </Link>
            </m.div>
          </div>
          </div>
        </div>
      </section>
      </DeferredRender>

      {/* ================================================
          HOW IT WORKS
          ================================================ */}
      <DeferredRender delay={400}>
      <section style={{ padding: '8rem 0', position: 'relative' }}>
        <div className="container">
          <m.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--accent)', display: 'inline-block', marginBottom: '1rem', padding: '0.35rem 0.875rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: '2rem' }}>Как это работает</span>
            <h2 style={{ fontSize: 'clamp(1.875rem,4vw,2.75rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Заказ услуги за{' '}
              <span style={{ background: 'linear-gradient(135deg,#60a5fa,#818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4 простых шага</span>
            </h2>
          </m.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
            {howItWorks.map((step, i) => (
              <m.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(59,130,246,0.12)', fontFamily: 'var(--font-heading)', lineHeight: 1, marginBottom: '1rem' }}>{step.step}</div>
                <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.625rem', fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block" style={{ position: 'absolute', right: '-0.75rem', top: '2.5rem', color: 'rgba(59,130,246,0.3)', zIndex: 10 }}>
                    <ChevronRight size={24} />
                  </div>
                )}
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          REVIEWS
          ================================================ */}
      <section style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden', background: 'rgba(4,10,24,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <m.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--accent)', display: 'inline-block', marginBottom: '1rem', padding: '0.35rem 0.875rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: '2rem' }}>Отзывы клиентов</span>
            <h2 style={{ fontSize: 'clamp(1.875rem,4vw,2.75rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Нам доверяют{' '}
              <span style={{ background: 'linear-gradient(135deg,#60a5fa,#818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10 000+ клиентов</span>
            </h2>
          </m.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem' }}>
            {reviews.map((rev, i) => (
              <m.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ padding: '2rem', background: 'rgba(12,24,45,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= rev.rating ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />)}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.7, flex: 1 }}>"{rev.text}"</p>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{rev.name}</div>
                  <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600 }}>{rev.service}</div>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          NEWS SECTION
          ================================================ */}
      <section style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(4, 8, 18, 0.65)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}
            className="flex flex-col md:flex-row justify-between items-end"
          >
            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.25em', color: 'var(--accent)',
                display: 'inline-block', marginBottom: '1rem',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)',
                padding: '0.35rem 0.875rem', borderRadius: '2rem',
              }}>
                На связи
              </span>
              <h2 style={{
                fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
                fontWeight: 900, color: 'white', lineHeight: 1.1,
                fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em',
              }}>
                События и актуальные<br />
                <span style={{
                  background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  новости нашего сервиса
                </span>
              </h2>
            </m.div>
          </div>
          <NewsFeed />
        </div>
      </section>

      {/* ================================================
          CONTACT SECTION
          ================================================ */}
      <section style={{ padding: '8rem 0' }} id="contact">
        <div className="container">
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }}
            className="grid grid-2"
          >
            {/* Left */}
            <m.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.25em', color: 'var(--accent)',
                display: 'inline-block', marginBottom: '1.25rem',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)',
                padding: '0.35rem 0.875rem', borderRadius: '2rem',
              }}>
                Связаться с нами
              </span>

              <h2 style={{
                fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)',
                fontWeight: 900, letterSpacing: '-0.03em',
                fontFamily: 'var(--font-heading)', lineHeight: 1.1,
                marginBottom: '1.5rem', color: 'white',
              }}>
                Готовы объединить{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  усилия?
                </span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '3rem', fontSize: '1rem', maxWidth: '28rem' }}>
                Мы ценим ваше время. Оставьте свои данные, и мы свяжемся с вами в течение нескольких минут.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: <Phone size={20} />, label: 'Прямая линия', value: settings.contact_phone, href: `tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}` },
                  { icon: <Mail size={20} />, label: 'Почта для бизнеса', value: settings.contact_email, href: `mailto:${settings.contact_email}` },
                  { icon: <Clock size={20} />, label: 'Режим работы', value: 'Круглосуточно, 24/7', href: null },
                ].map((item, i) => (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1.25rem',
                      padding: '1.25rem 1.5rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '1.25rem',
                      transition: 'all 0.3s ease',
                    }}
                    whileHover={{
                      background: 'rgba(59,130,246,0.06)',
                      borderColor: 'rgba(59,130,246,0.2)',
                    }}
                  >
                    <div style={{
                      width: '3rem', height: '3rem', borderRadius: '0.875rem',
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)', flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                        {item.label}
                      </span>
                      {item.href ? (
                        <a href={item.href} style={{ color: 'white', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'color 0.25s ease' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-bright)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'white'}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{item.value}</span>
                      )}
                    </div>
                  </m.div>
                ))}
              </div>
            </m.div>

            {/* Right: Form */}
            <m.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <ContactForm />
            </m.div>
          </div>
        </div>
      </section>
      </div>
    </LazyMotion>
  );
}
