'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Clock, 
  Shield, 
  Truck, 
  Hammer, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle,
  MapPin,
  Users,
  Award,
  Circle,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import NewsFeed from '@/components/NewsFeed';

export default function Home() {
  const [focusedId, setFocusedId] = useState(null);
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const services = [
    {
      title: 'Грузоперевозки',
      desc: 'Логистические решения любой сложности. От малотоннажных до крупногабаритных перевозок по краю.',
      icon: <Truck size={32} />,
      link: '/services/freight',
      badge: 'Популярно'
    },
    {
      title: 'Грузчики',
      desc: 'Команда профессионалов для бережного переезда и складских работ. Работаем с хрупкими грузами.',
      icon: <Hammer size={32} />,
      link: '/services/loaders'
    },
    {
      title: 'Аварийный комиссар',
      desc: 'Квалифицированная помощь при ДТП и юридическое сопровождение. Прибытие за 20 минут.',
      icon: <Shield size={32} />,
      link: '/services/commissioner'
    },
    {
      title: 'Эвакуатор',
      desc: 'Круглосуточная эвакуация всех типов транспорта. Безопасная погрузка в любых условиях.',
      icon: <AlertTriangle size={32} />,
      link: '/services/evacuator'
    }
  ];

  const stats = [
    { label: 'Лет опыта', value: '5+', icon: <Award /> },
    { label: 'Городов края', value: '12', icon: <MapPin /> },
    { label: 'Довольных клиентов', value: '10k+', icon: <Users /> }
  ];

  const utps = [
    { title: 'Приезд за 30 минут', desc: 'Оперативная подача в любую точку города.' },
    { title: 'Фиксированная цена', desc: 'Никаких скрытых платежей после заказа.' },
    { title: 'Гарантия качества', desc: 'Полная материальная ответственность.' },
    { title: 'Работаем 24/7', desc: 'Ваша безопасность и комфорт круглосуточно.' },
    { title: 'Проф. техника', desc: 'Современный автопарк под любые нужды.' }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - now works with global background */}
      <section className="relative hero-height flex items-center overflow-hidden">
        {/* Local background removed to show global bridge background */}
        <div className="container relative z-10 px-6">
          <motion.div 
            initial="hidden"
            animate="show"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-accent"></span>
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs">Лидеры рынка Приморья</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-white text-5xl md:text-7xl mb-8 leading-[1.1] font-extrabold tracking-tight">
              Сервис нового <br /> 
              <span className="text-gradient">поколения</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-grey-400 mb-12 max-w-xl leading-relaxed">
              Мы объединили лучшие практики логистики и экстренной помощи, чтобы обеспечить вам максимальную надежность во Владивостоке и по всему краю.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="#contact" className="btn btn-accent px-8 py-4 text-white">
                Заказать услугу <ArrowRight size={18} className="ml-2" />
              </Link>
              <a href="tel:+79998887766" className="btn btn-primary bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10">
                <Phone size={18} className="mr-2 text-accent" /> +7 (999) 888-77-66
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-0 left-0 right-0 z-20 hidden lg:block">
          <div className="container">
            <div className="grid grid-3 glass-dark border-none rounded-t-[3rem] p-12 gap-8 text-white max-w-4xl">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                    {stat.icon}
                  </div>
                  <div>
                    <span className="text-3xl font-bold block">{stat.value}</span>
                    <span className="text-xs text-grey-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-bg-main relative">
        <div className="shape-blob top-0 left-0"></div>
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Направления работы</span>
              <h2 className="text-4xl md:text-5xl font-bold">Услуги, на которые можно <span className="text-accent underline decoration-accent/20">положиться</span></h2>
            </div>
            <Link href="/services/freight" className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest pb-2 border-b-2 border-accent/20 hover:border-accent transition-all">
              Все услуги <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-1 md:grid-2 lg:grid-4 gap-8 relative"
          >
            {/* Contextual Focus Overlay for this section */}
            <div className={`focus-overlay ${focusedId !== null ? 'active' : ''}`} style={{ position: 'absolute', pointerEvents: 'none' }} />
            
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className={`transition-all duration-500 ${
                  focusedId === null ? '' : focusedId === index ? 'focus-active' : 'focus-dim'
                }`}
                onMouseEnter={() => setFocusedId(index)}
                onMouseLeave={() => setFocusedId(null)}
              >
                <Link href={service.link} className="card-premium h-full flex flex-col group relative">
                  {service.badge && (
                    <span className="absolute top-6 right-6 px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase rounded-full tracking-wider">
                      {service.badge}
                    </span>
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center text-accent mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-grey-500 text-sm mb-12 line-clamp-3 leading-relaxed">{service.desc}</p>
                  
                  <div className="mt-auto pt-8 border-t border-grey-100 flex items-center justify-between">
                    <span className="text-accent font-bold text-xs uppercase tracking-widest">Узнать больше</span>
                    <div className="w-10 h-10 rounded-full bg-grey-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                       <ArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* UTP Section - Premium Layout */}
      <section className="section bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 skew-x-12 translate-x-20"></div>
        <div className="container relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-white text-4xl md:text-5xl mb-6">Почему нам доверяют <br className="hidden md:block" /> тысячи жителей края?</h2>
            <p className="text-grey-400 max-w-xl mx-auto">Мы выстроили систему качественного контроля на каждом этапе выполнения заказа.</p>
          </div>
          
          <div className="grid grid-1 md:grid-5 gap-8">
            {utps.map((utp, index) => (
              <div key={index} className="p-8 glass-dark rounded-[2rem] border-white/5 hover:border-accent/20 transition-all text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent mb-6 mx-auto">
                  <CheckCircle size={24} />
                </div>
                <h4 className="text-white font-bold mb-3">{utp.title}</h4>
                <p className="text-grey-500 text-xs leading-relaxed">{utp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break / About Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2 items-center gap-20">
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                <img src="/images/banner.png" alt="Company" className="w-full h-[500px] object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 glass shadow-premium p-10 rounded-3xl hidden md:block">
                <div className="text-primary font-bold text-5xl mb-2">24/7</div>
                <div className="text-accent font-bold uppercase tracking-widest text-xs">Мы всегда на связи</div>
              </div>
            </div>
            
            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">О компании</span>
              <h2 className="text-4xl font-bold mb-8 leading-tight">Приморский край — наша <span className="text-accent">зона ответственности</span></h2>
              <p className="text-grey-600 mb-8 leading-relaxed">
                Мы — не просто диспетчерская служба. Prim-Uslugi — это объединение профессиональных исполнителей, имеющих многолетний опыт работы в сложных климатических и рельефных условиях юга Дальнего Востока.
              </p>
              
              <div className="grid grid-2 gap-8 mb-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent flex-shrink-0"><Circle size={10} fill="currentColor" /></div>
                  <div>
                    <h5 className="font-bold mb-1">Филиалы в 3 городах</h5>
                    <p className="text-xs text-grey-500">Владивосток, Находка, Уссурийск.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent flex-shrink-0"><Circle size={10} fill="currentColor" /></div>
                  <div>
                    <h5 className="font-bold mb-1">Собственный парк</h5>
                    <p className="text-xs text-grey-500">Более 50 единиц спецтехники.</p>
                  </div>
                </div>
              </div>
              
              <button className="btn btn-primary">Читать полную историю</button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section bg-bg-footer relative overflow-hidden">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">На связи</span>
              <h2 className="text-white text-4xl font-bold">События и актуальные новости <br className="hidden md:block" /> нашего сервиса</h2>
            </div>
          </div>
          <NewsFeed />
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-bg-main" id="contact">
        <div className="container">
          <div className="grid grid-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Готовы объединить усилия?</h2>
              <p className="text-grey-500 mb-12">
                Мы ценим ваше время. Оставьте свои данные, и мы свяжемся с вами в течение нескольких минут для решения вашего вопроса.
              </p>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl glass shadow-sm flex items-center justify-center text-accent"><Phone size={24} /></div>
                  <div>
                    <span className="text-xs text-grey-500 block">Прямая линия</span>
                    <a href="tel:+79998887766" className="text-xl font-bold hover:text-accent transition-colors">+7 (999) 888-77-66</a>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl glass shadow-sm flex items-center justify-center text-accent"><Mail size={24} /></div>
                  <div>
                    <span className="text-xs text-grey-500 block">Почта для бизнеса</span>
                    <a href="mailto:corp@prim-uslugi.ru" className="text-xl font-bold hover:text-accent transition-colors">corp@prim-uslugi.ru</a>
                  </div>
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Floating Blobs for background */}
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none -z-10 overflow-hidden">
        <div className="shape-blob top-1/4 -left-20 bg-blue-500/10"></div>
        <div className="shape-blob bottom-1/4 -right-20 bg-purple-500/10"></div>
      </div>
    </div>
  );
}
