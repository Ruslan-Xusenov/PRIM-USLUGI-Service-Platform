'use client';
import './globals.css';
import { Outfit, Montserrat } from 'next/font/google';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Phone, Mail, Clock, Shield, Menu, X, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });
const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], variable: '--font-body' });

export default function RootLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Грузоперевозки', href: '/services/freight' },
    { name: 'Грузчики', href: '/services/loaders' },
    { name: 'Аварийный комиссар', href: '/services/commissioner' },
    { name: 'Эвакуатор', href: '/services/evacuator' },
  ];

  return (
    <html lang="ru" className={`${outfit.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        {/* Navigation */}
        <header 
          className={`fixed top-0 left-0 right-0 z-1000 transition-all duration-700 ${
            isScrolled ? 'py-2' : 'py-5'
          }`}
        >
          <div className="container">
            <nav 
              className={`flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl transition-all duration-500 glass-dark shadow-premium border-white/10 ${
                isScrolled ? 'backdrop-blur-2xl' : 'backdrop-blur-lg'
              }`}
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm border border-grey-100">
                   <img src="/images/logo_premium.png" alt="Prim-Uslugi Logo" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-lg sm:text-xl font-extrabold tracking-tight leading-none transition-colors text-white`}>PRIM-USLUGI</span>
                  <span className={`text-[9px] uppercase tracking-[0.2em] font-bold transition-all text-accent hidden md:block`}>Service Platform</span>
                </div>
              </Link>

              {/* Desktop Menu */}
              <ul className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className={`text-sm font-semibold transition-colors hover:text-accent text-white`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4">
                <a 
                  href="tel:+79998887766" 
                  className={`hidden lg:flex items-center gap-2 font-bold transition-colors text-white`}
                >
                  <Phone size={18} className="text-accent" />
                  <span>+7 (999) 888-77-66</span>
                </a>
                 <Link 
                  href="#contact" 
                  className="btn btn-primary px-6 py-2.5 text-sm hidden lg:flex"
                >
                  Заказать услугу
                </Link>
                <button 
                  className={`md:hidden p-2 rounded-xl transition-colors text-white`}
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu size={28} />
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* Mobile Side Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-1100 bg-black/60 backdrop-blur-sm md:hidden"
              />
              
              {/* Drawer */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
                className="fixed inset-0 z-[9999] bg-[#030712] md:hidden overflow-hidden"
              >
                {/* Opaque Background Layer */}
                <div className="absolute inset-0 bg-[#030712] z-[-1]" />
                <div className="absolute inset-0 bg-drawer-grid opacity-40 z-[-1]" />
                
                <div className="flex flex-col h-full relative z-10">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1">
                        <img src="/images/logo_premium.png" alt="Logo" className="w-6 h-6 object-contain" />
                      </div>
                      <span className="text-white font-bold tracking-tight">PRIM-USLUGI</span>
                    </Link>
                    <button 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="bg-white/10 p-3 rounded-2xl text-white hover:bg-white/20 transition-all active:scale-90"
                      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    >
                      <X size={28} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-8">
                    <ul className="flex flex-col">
                      {navLinks.map((link, i) => (
                        <motion.li 
                          key={link.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          className="drawer-item"
                        >
                          <Link 
                            href={link.href} 
                            className="flex items-center justify-between text-lg font-bold text-white/90 hover:text-accent group"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{link.name}</span>
                            <ChevronRight size={20} className="text-white/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mt-12 space-y-8">
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent px-1">Contacts</span>
                        <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                          <a href="tel:+79998887766" className="flex items-center gap-4 text-white font-bold text-lg">
                            <Phone size={20} className="text-accent" /> +7 (999) 888-77-66
                          </a>
                          <a href="mailto:info@prim-uslugi.ru" className="flex items-center gap-4 text-white/70 text-sm">
                            <Mail size={18} className="text-accent" /> info@prim-uslugi.ru
                          </a>
                        </div>
                      </div>

                      <Link 
                        href="#contact" 
                        className="btn btn-accent w-full py-4 text-white shadow-lg shadow-accent/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Заказать услугу
                      </Link>
                    </div>
                  </div>

                  <div className="p-8 border-t border-white/5 bg-black/20 flex flex-wrap gap-4">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Vladivostok</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Ussuriysk</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Nakhodka</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main>
          {children}
        </main>

        <footer className="bg-footer pt-24 pb-12 text-white overflow-hidden relative">
          <div className="shape-blob -top-24 -right-24"></div>
          
          <div className="container">
            <div className="grid grid-2 lg:grid-4 gap-16 mb-20">
              <div className="lg:col-span-1">
                <Link href="/" className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1">
                    <img src="/images/logo_premium.png" alt="Logo" className="w-10 h-10 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-tight text-white">PRIM-USLUGI</span>
                    <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Service Platform</span>
                  </div>
                </Link>
                <p className="text-grey-400 mb-8 max-w-xs">
                  Профессиональные решения для логистики и помощи на дорогах в Приморском крае. Работаем 24/7.
                </p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Услуги</h4>
                <ul className="flex flex-col gap-4">
                  {navLinks.map(link => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-grey-400 hover:text-accent transition-colors flex items-center gap-2 group">
                        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Компания</h4>
                <ul className="flex flex-col gap-4">
                  <li><Link href="/services/privacy" className="text-grey-400 hover:text-accent transition-colors">Конфиденциальность</Link></li>
                  <li><Link href="/services/personal-data" className="text-grey-400 hover:text-accent transition-colors">Персональные данные</Link></li>
                  <li><span className="text-grey-500">Владивосток</span></li>
                  <li><span className="text-grey-500">Уссурийск</span></li>
                  <li><span className="text-grey-500">Находка</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Связь с нами</h4>
                <ul className="flex flex-col gap-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-accent" />
                    </div>
                    <div>
                      <span className="text-xs text-grey-500 block mb-1">Горячая линия</span>
                      <a href="tel:+79998887766" className="text-white font-bold hover:text-accent transition-colors">+7 (999) 888-77-66</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-accent" />
                    </div>
                    <div>
                      <span className="text-xs text-grey-500 block mb-1">E-mail</span>
                      <a href="mailto:info@prim-uslugi.ru" className="text-white font-bold hover:text-accent transition-colors">info@prim-uslugi.ru</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-grey-500">
              <p>© {new Date().getFullYear()} Prim-Uslugi. Инновационные решения услуг.</p>
              <div className="flex gap-8">
                <Link href="#" className="hover:text-white">VK</Link>
                <Link href="#" className="hover:text-white">Telegram</Link>
                <Link href="#" className="hover:text-white">WhatsApp</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Call Button for Mobile */}
        <a 
          href="tel:+79998887766" 
          className="fixed bottom-6 right-6 w-16 h-16 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center z-900 md:hidden animate-bounce"
        >
          <Phone size={24} />
        </a>

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