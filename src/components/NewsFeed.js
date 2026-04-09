'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock, Sparkles } from 'lucide-react';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        <p className="text-grey-500 font-medium tracking-tight">Обновляем ленту...</p>
      </div>
    </div>
  );

  if (news.length === 0) return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-3 gap-8"
    >
      {[1, 2, 3].map(i => (
        <motion.div 
          key={i} 
          variants={item}
          className="group card-premium p-8 bg-white/5 border-white/10 relative overflow-hidden h-[320px] flex flex-col justify-end"
        >
          <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-accent/20 transition-colors">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase rounded-full tracking-wider">Спецпредложение</span>
            </div>
            <h4 className="text-white text-xl font-bold mb-4 group-hover:text-accent transition-colors">Новые горизонты логистики в Приморье</h4>
            <p className="text-grey-400 text-sm mb-6 line-clamp-2">Мы постоянно расширяем наш парк и улучшаем качество обслуживания для вас.</p>
            <div className="h-px w-full bg-white/10 group-hover:bg-accent/30 transition-all mb-6"></div>
            <Link href="#" className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Подробнее <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-1 md:grid-3 gap-8"
    >
      {news.map((n) => (
        <motion.div 
          key={n.id} 
          variants={item}
          className="group card-premium p-8 bg-white/5 border-white/10 hover:border-accent/30 transition-all flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-accent">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {new Date(n.date).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent group-hover:bg-accent/10 transition-all">
              <ArrowUpRight size={16} />
            </div>
          </div>
          
          <h4 className="text-white text-xl font-bold mb-4 group-hover:text-accent transition-colors line-clamp-2">
            {n.title}
          </h4>
          
          <p className="text-grey-400 text-sm mb-12 line-clamp-3 leading-relaxed">
            {n.content}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/10">
            <span className="text-[10px] font-bold text-grey-500 uppercase tracking-widest">Prim-News</span>
            <Link href="#" className="text-white text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-colors">
              Перейти к новости
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
