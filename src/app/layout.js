'use client';
import './globals.css';
import { Outfit, Inter } from 'next/font/google';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Menu, X, ArrowRight, ChevronRight, MapPin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading', weight: ['300','400','500','600','700','800','900'] });
const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-body', weight: ['300','400','500','600','700'] });

export default function RootLayout({ children }) {
  return (
    <SettingsProvider>
      <LayoutContent>{children}</LayoutContent>
    </SettingsProvider>
  );
}

function LayoutContent({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const settings = useSettings();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Грузоперевозки', href: '/services/freight' },
    { name: 'Грузчики', href: '/services/loaders' },
    { name: 'Аварийный комиссар', href: '/services/commissioner' },
    { name: 'Эвакуатор', href: '/services/evacuator' },
  ];

  return (
    <html lang="ru" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased">

        {/* ===== NAVIGATION ===== */}
        <header
          className={`fixed top-0 left-0 right-0 z-1000 transition-all duration-700 ${
            (mounted && mobileMenuOpen) || isAdmin ? 'hidden' : 'block'
          } ${isScrolled ? 'py-1' : 'py-2'}`}
        >
          <div className="container">
            <nav
              style={{
                background: isScrolled ? 'rgba(6, 12, 26, 0.95)' : 'rgba(6, 12, 26, 0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '1.5rem',
                padding: isScrolled ? '0.5rem 1.25rem' : '0.625rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1)',
                boxShadow: isScrolled ? '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.05)' : 'none',
              }}
            >
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                <div style={{
                  width: '2.25rem', height: '2.25rem',
                  borderRadius: '0.625rem',
                  background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(59,130,246,0.25)',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}>
                  <img src="/images/logo_premium.png" alt="Prim-Uslugi Logo" style={{ width: '1.625rem', height: '1.625rem', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'white', letterSpacing: '-0.025em', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                    PRIM<span style={{ color: 'var(--accent)' }}>-</span>USLUGI
                  </div>
                  <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: '0.15rem' }}>
                    Service Platform
                  </div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <ul style={{ display: 'none', alignItems: 'center', gap: '0.25rem', margin: 0, padding: 0, listStyle: 'none' }} className="md:flex">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: pathname === link.href ? 'white' : 'rgba(255,255,255,0.65)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.875rem',
                        transition: 'all 0.25s ease',
                        textDecoration: 'none',
                        background: pathname === link.href ? 'rgba(59,130,246,0.1)' : 'transparent',
                        display: 'block',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = pathname === link.href ? 'white' : 'rgba(255,255,255,0.65)';
                        e.currentTarget.style.background = pathname === link.href ? 'rgba(59,130,246,0.1)' : 'transparent';
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Right Side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Phone Display - Desktop */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/80 font-semibold text-sm">
                  <Phone size={14} className="text-accent" />
                  <span>{settings.contact_phone}</span>
                </div>
                
                {/* Phone Call - Mobile Only */}
                <a 
                  href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`} 
                  className="flex lg:hidden items-center gap-2 p-2 text-white/80 hover:text-white"
                >
                  <Phone size={20} className="text-accent" />
                </a>

                {/* CTA Button - Desktop */}
                <Link
                  href="#contact"
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.375rem',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    borderRadius: '1rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                    transition: 'all 0.3s ease',
                  }}
                  className="lg:flex"
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.45)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.35)';
                  }}
                >
                  Заказать
                  <ArrowRight size={15} />
                </Link>

                {/* Mobile Menu Btn */}
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.625rem',
                    borderRadius: '0.875rem',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Toggle menu"
                  className="flex md:hidden"
                >
                  <Menu size={22} />
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* ===== MOBILE SIDE DRAWER ===== */}
        <AnimatePresence>
          {mobileMenuOpen && !isAdmin && (
            <>
              {/* Backdrop - only on mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden"
                style={{
                  position: 'fixed', inset: 0, zIndex: 1100,
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(4px)',
                }}
              />

              {/* Drawer - only on mobile */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
                className="md:hidden"
                style={{
                  position: 'fixed', inset: 0, zIndex: 9999,
                  background: '#030711',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Grid bg */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 0,
                  backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />

                {/* Blue glow */}
                <div style={{
                  position: 'absolute', top: '-20%', left: '-20%',
                  width: '60%', height: '60%',
                  background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)',
                  zIndex: 0,
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 1 }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.3)',
                  }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                      <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem' }}>
                        <img src="/images/logo_premium.png" alt="Logo" style={{ width: '1.5rem', height: '1.5rem', objectFit: 'contain' }} />
                      </div>
                      <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>PRIM-USLUGI</span>
                    </Link>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        background: 'rgba(255,255,255,0.08)', padding: '0.75rem',
                        borderRadius: '0.875rem', color: 'white', cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease',
                      }}
                      aria-label="Close menu"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  {/* Nav links */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem' }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', margin: 0, padding: 0, listStyle: 'none' }}>
                      {navLinks.map((link, i) => (
                        <motion.li
                          key={link.name}
                          initial={{ opacity: 0, x: -24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 + i * 0.06, ease: [0.23, 1, 0.32, 1] }}
                        >
                          <Link
                            href={link.href}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '1.25rem 1rem', borderRadius: '1rem',
                              color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                              fontWeight: 700, fontSize: '1.25rem',
                              fontFamily: 'var(--font-heading)',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                              transition: 'all 0.25s ease',
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                            onMouseEnter={e => {
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.paddingLeft = '1.5rem';
                              e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                              e.currentTarget.style.paddingLeft = '1rem';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <span>{link.name}</span>
                            <ChevronRight size={20} style={{ color: 'var(--accent)', opacity: 0.7 }} />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Contacts block */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      style={{ marginTop: '2.5rem' }}
                    >
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--accent)', opacity: 0.8, display: 'block', marginBottom: '1rem' }}>
                        Контакты
                      </span>
                      <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '1.25rem', padding: '1.5rem',
                        display: 'flex', flexDirection: 'column', gap: '1.25rem',
                      }}>
                        <a href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', fontWeight: 700, fontSize: '1.125rem', textDecoration: 'none' }}>
                          <Phone size={22} style={{ color: 'var(--accent)' }} />
                          {settings.contact_phone}
                        </a>
                        <a href={`mailto:${settings.contact_email}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                          <Mail size={20} style={{ color: 'var(--accent)' }} />
                          {settings.contact_email}
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
                      style={{ marginTop: '1.5rem' }}
                    >
                      <Link
                        href="#contact"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          padding: '1.125rem', borderRadius: '1.25rem',
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white', fontWeight: 700, fontSize: '1rem',
                          textDecoration: 'none',
                          boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Заказать услугу
                        <ArrowRight size={18} />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Footer cities */}
                  <div style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center',
                  }}>
                    {['Владивосток', 'Уссурийск', 'Находка'].map(city => (
                      <span key={city} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)' }}>
                        <MapPin size={11} style={{ color: 'var(--accent)', opacity: 0.6 }} />
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ===== MAIN CONTENT ===== */}
        <main className={`${(mounted && mobileMenuOpen) ? 'hidden' : 'block'}`}>
          {children}
        </main>

        {/* ===== FOOTER ===== */}
        <footer
          className={`${(mounted && mobileMenuOpen) || isAdmin ? 'hidden' : 'block'}`}
          style={{
            background: 'rgba(4, 8, 18, 0.97)',
            backdropFilter: 'blur(24px)',
            paddingTop: '6rem',
            paddingBottom: '3rem',
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '80%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)',
          }} />
          <div style={{
            position: 'absolute', top: '-60%', left: '50%', transform: 'translateX(-50%)',
            width: '60%', height: '300px',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            {/* Top Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '3rem', marginBottom: '5rem' }}
              className="grid grid-2 lg:grid-4"
            >
              {/* Brand Column */}
              <div>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', textDecoration: 'none' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(59,130,246,0.2)', flexShrink: 0 }}>
                    <img src="/images/logo_premium.png" alt="Logo" style={{ width: '2.25rem', height: '2.25rem', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em' }}>PRIM-USLUGI</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.7 }}>Service Platform</div>
                  </div>
                </Link>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '18rem' }}>
                  Профессиональные решения для логистики и помощи на дорогах в Приморском крае. Работаем 24/7.
                </p>

                {/* Rating badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '2rem',
                }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={12} fill="var(--accent-gold)" style={{ color: 'var(--accent-gold)' }} />
                  ))}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginLeft: '0.25rem' }}>4.9 / 5.0</span>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.75rem' }}>
                  Услуги
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', margin: 0, padding: 0, listStyle: 'none' }}>
                  {navLinks.map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.25s ease' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = 'var(--accent-bright)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.6, flexShrink: 0 }} />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.75rem' }}>
                  Компания
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', margin: 0, padding: 0, listStyle: 'none' }}>
                  {[
                    { label: 'Конфиденциальность', href: '/services/privacy' },
                    { label: 'Персональные данные', href: '/services/personal-data' },
                  ].map(item => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.25s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-bright)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                      >
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.6, flexShrink: 0 }} />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li style={{ marginTop: '0.5rem' }}>
                    <h5 style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>Регионы</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {['Владивосток', 'Уссурийск', 'Находка'].map(city => (
                        <span key={city} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                          <MapPin size={13} style={{ color: 'var(--accent)', opacity: 0.5 }} />
                          {city}
                        </span>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>

              {/* Contacts */}
              <div>
                <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.75rem' }}>
                  Связь с нами
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { icon: <Phone size={18} />, label: 'Горячая линия', value: settings.contact_phone, href: `tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}` },
                    { icon: <Mail size={18} />, label: 'E-mail', value: settings.contact_email, href: `mailto:${settings.contact_email}` },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent)', flexShrink: 0,
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                          {item.label}
                        </span>
                        <a
                          href={item.href}
                          style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.25s ease' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-bright)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                        >
                          {item.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: '1rem',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', width: '100%' }}>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  © {new Date().getFullYear()} Prim-Uslugi. Инновационные решения услуг.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {[
                    { name: 'VK', key: 'social_vk' },
                    { name: 'Telegram', key: 'social_telegram' },
                    { name: 'WhatsApp', key: 'social_whatsapp' }
                  ].map(sn => (
                    <a
                      key={sn.name}
                      href={settings[sn.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.25s ease' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                    >
                      {sn.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Call Button Mobile */}
        {!isAdmin && (
          <a
            href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`}
            style={{
              position: 'fixed', bottom: '1.5rem', right: '1.5rem',
              width: '3.75rem', height: '3.75rem',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 900, boxShadow: '0 8px 32px rgba(59,130,246,0.45)',
              animation: 'bounce-soft 2.5s ease-in-out infinite',
              textDecoration: 'none',
            }}
            className="md:hidden"
          >
            <Phone size={22} />
          </a>
        )}

        {/* Yandex Metrica */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(99999999, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
            });
          `}
        </Script>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/99999999" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}