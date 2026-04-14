'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Phone,
  Shield,
  Truck,
  Hammer,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  MapPin,
  Users,
  Award,
  Mail,
  Star,
  Zap,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import NewsFeed from '@/components/NewsFeed';

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
    <motion.div
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
    </motion.div>
  );
}

/* ====================================================
   StatCard
   ==================================================== */
function StatCard({ stat, index }) {
  return (
    <motion.div
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
    </motion.div>
  );
}

/* ====================================================
   Home Page
   ==================================================== */
export default function Home() {
  const [focusedId, setFocusedId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -60]);

  useEffect(() => { setMounted(true); }, []);

  const services = [
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

        <motion.div className="container" style={{ position: 'relative', zIndex: 1, y: heroY }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
            className="grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              style={{ gridColumn: 'span 7' }}
            >
              {/* Eyebrow */}
              <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
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
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: 'white',
                  marginBottom: '1.75rem',
                  fontFamily: 'var(--font-heading)',
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
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  maxWidth: '34rem',
                  marginBottom: '3rem',
                }}
              >
                Мы объединили лучшие практики логистики и экстренной помощи, чтобы обеспечить вам максимальную надежность во Владивостоке и по всему краю.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
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
                  href="tel:+79673888889"
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
                  +7-967-388-88-89
                </a>
              </motion.div>

              {/* Trust row */}
              <motion.div
                variants={fadeInUp}
                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', flexWrap: 'wrap' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} fill="var(--accent-gold)" style={{ color: 'var(--accent-gold)' }} />
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginLeft: '0.5rem' }}>4.9 / 5.0</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>10 000+ довольных клиентов</span>
              </motion.div>
            </motion.div>

            {/* Right: Stats Card */}
            <motion.div
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
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================================================
          SERVICES SECTION
          ================================================ */}
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
            <motion.div
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
            </motion.div>

            <motion.div
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
            </motion.div>
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

            <motion.div
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
            </motion.div>
          </div>
        </div>
      </section>

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
          <motion.div
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
          </motion.div>

          <motion.div
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
              <motion.div
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
                <h4 style={{ color: 'white', fontWeight: 800, marginBottom: '0.625rem', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
                  {utp.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.65 }}>
                  {utp.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================
          ABOUT SECTION
          ================================================ */}
      <section style={{ padding: '8rem 0', position: 'relative' }}>
        <div className="container">
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: '4rem', alignItems: 'center' }}
            className="grid grid-2"
          >
            {/* Image side */}
            <motion.div
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
                <img src="/images/banner.png" alt="Company" style={{ width: '100%', height: 'clamp(14rem, 28vw, 20rem)', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                {/* Image overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(6,12,26,0.5) 0%, transparent 60%)',
                }} />
              </div>

              {/* Floating badge */}
              <motion.div
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
              </motion.div>

              {/* Accent blob */}
              <div style={{
                position: 'absolute', top: '-2rem', left: '-2rem',
                width: '10rem', height: '10rem',
                background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
            </motion.div>

            {/* Text side */}
            <motion.div
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
                      <h5 style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.title}</h5>
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
            </motion.div>
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
            <motion.div
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
            </motion.div>
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
            <motion.div
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
                  { icon: <Phone size={20} />, label: 'Прямая линия', value: '+7-967-388-88-89', href: 'tel:+79673888889' },
                  { icon: <Mail size={20} />, label: 'Почта для бизнеса', value: 'prim-uslugi@internet.ru', href: 'mailto:prim-uslugi@internet.ru' },
                  { icon: <Clock size={20} />, label: 'Режим работы', value: 'Круглосуточно, 24/7', href: null },
                ].map((item, i) => (
                  <motion.div
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
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
