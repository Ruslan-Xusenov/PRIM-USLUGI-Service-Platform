'use client';
import { motion } from 'framer-motion';
import { Phone, CheckCircle, ArrowRight, Shield, Globe, Clock, Box } from 'lucide-react';
import Link from 'next/link';
import ContactForm from './ContactForm';

export default function ServicePage({ title, description, details, icon, image }) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-bg-main">
      {/* Dynamic Header */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Local background removed to show global bridge background */}
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                {icon || <Box size={24} />}
              </div>
              <span className="text-accent font-bold uppercase tracking-widest text-xs">Премиальный сервис</span>
            </div>
            <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">{title}</h1>
            <p className="text-xl text-grey-400 leading-relaxed max-w-2xl">{description}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section">
        <div className="container grid grid-2 gap-20 items-start">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="mb-12">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Подробности</span>
              <h2 className="text-4xl font-bold mb-6">Преимущества работы <br /> с нами в регионе</h2>
              <p className="text-grey-600 mb-10 text-lg">
                Наша компания использует передовые технологии и современную технику для оказания услуг на самом высоком уровне. Мы понимаем специфику дорог и инфраструктуры Приморского края.
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

            <div className="card-premium bg-primary text-white p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <h3 className="text-2xl font-bold mb-4 relative z-10">Нужна оперативная помощь?</h3>
               <p className="text-grey-400 mb-8 relative z-10 max-w-sm">Наши дежурные бригады готовы к выезду прямо сейчас. Свяжитесь с нами для моментального расчета стоимости.</p>
               <div className="flex flex-wrap gap-4 relative z-10">
                 <a href="tel:+79998887766" className="btn btn-accent px-8">
                   <Phone size={18} className="mr-2" /> Позвонить
                 </a>
                 <Link href="#contact" className="btn bg-white/5 border border-white/10 text-white hover:bg-white/10">
                    Оставить заявку
                 </Link>
               </div>
            </div>
          </motion.div>

          {/* Sidebar Area */}
          <aside className="sticky top-32 space-y-8">
             <div className="card-premium p-0 overflow-hidden border-none shadow-premium bg-white">
                <img src={image || "/images/banner.png"} alt={title} className="w-full h-64 object-cover" />
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

             <div className="card-premium p-8 border-none bg-accent/5 text-accent">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center"><Shield size={20} /></div>
                  <h5 className="font-bold text-lg">Полная страховка</h5>
                </div>
                <p className="text-xs text-accent/80 font-medium">Ваша безопасность и сохранность груза застрахованы на сумму до 10 000 000 ₽. Мы несем ответственность.</p>
             </div>
          </aside>
        </div>
      </section>

      {/* Cross-linking Section */}
      <section className="section bg-white border-t border-grey-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Другие услуги комплекса</h2>
          <div className="grid grid-3 gap-8">
            <Link href="/services/freight" className="group card-premium hover:border-accent/30 transition-all">
               <div className="w-12 h-12 rounded-xl bg-grey-50 text-grey-400 group-hover:bg-accent group-hover:text-white transition-all flex items-center justify-center mb-6">
                 <Box size={20} />
               </div>
               <h4 className="text-xl font-bold mb-3">Грузоперевозки</h4>
               <p className="text-sm text-grey-500 mb-6">Доставка любых грузов по Приморскому краю.</p>
               <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-2">Открыть <ArrowRight size={14} /></span>
            </Link>
            <Link href="/services/loaders" className="group card-premium hover:border-accent/30 transition-all">
               <div className="w-12 h-12 rounded-xl bg-grey-50 text-grey-400 group-hover:bg-accent group-hover:text-white transition-all flex items-center justify-center mb-6">
                 <Box size={20} />
               </div>
               <h4 className="text-xl font-bold mb-3">Грузчики</h4>
               <p className="text-sm text-grey-500 mb-6">Команда для перемещения вашего имущества.</p>
               <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-2">Открыть <ArrowRight size={14} /></span>
            </Link>
            <Link href="/services/evacuator" className="group card-premium hover:border-accent/30 transition-all">
               <div className="w-12 h-12 rounded-xl bg-grey-50 text-grey-400 group-hover:bg-accent group-hover:text-white transition-all flex items-center justify-center mb-6">
                 <Box size={20} />
               </div>
               <h4 className="text-xl font-bold mb-3">Эвакуатор</h4>
               <p className="text-sm text-grey-500 mb-6">Помощь на дороге 24 часа в сутки.</p>
               <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-2">Открыть <ArrowRight size={14} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-sm bg-bg-main" id="contact">
        <div className="container max-w-3xl">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
