'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock, Sparkles } from 'lucide-react';

const TYPE_COLORS = {
  update: { label: 'Обновление', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
  promo: { label: 'Акция', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  news: { label: 'Новость', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

function NewsCard({ n, isPlaceholder }) {
  const typeInfo = n?.type ? (TYPE_COLORS[n.type] || TYPE_COLORS.update) : TYPE_COLORS.update;
  const wordCount = n?.content ? n.content.trim().split(/\s+/).length : 80;
  const readTime = Math.max(1, Math.ceil(wordCount / 170));

  const content = (
    <motion.div
      variants={item}
      style={{
        background: 'rgba(12, 24, 45, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '1.5rem',
        display: 'flex', flexDirection: 'column',
        height: '100%', minHeight: '380px',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)',
        cursor: isPlaceholder ? 'default' : 'pointer',
        textDecoration: 'none',
      }}
      whileHover={!isPlaceholder ? {
        borderColor: `${typeInfo.color}40`,
        background: 'rgba(16, 32, 60, 0.85)',
        y: -4,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${typeInfo.color}15`,
      } : {}}
    >
      {/* Image Area */}
      <div style={{
        width: '100%',
        height: '180px',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
      }}>
        {!isPlaceholder && n.image_url ? (
          <img 
            src={n.image_url} 
            alt={n.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, rgba(59,130,246,0.05), rgba(59,130,246,0.02))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(59,130,246,0.1)',
          }}>
            <Sparkles size={48} />
          </div>
        )}
        {/* Type badge overlay */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.3rem 0.75rem',
            background: typeInfo.bg, 
            backdropFilter: 'blur(8px)',
            border: `1px solid ${typeInfo.border}`,
            borderRadius: '2rem', color: typeInfo.color,
            fontSize: '0.6rem', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.15em',
          }}>
            {isPlaceholder ? 'Спецпредложение' : typeInfo.label}
          </span>
        </div>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Date + read time row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {!isPlaceholder && n?.created_at && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
              <Calendar size={11} />
              {new Date(n.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
            <Clock size={11} />
            {readTime} мин
          </div>
        </div>

        {/* Title */}
        <h4 style={{
          color: 'white', fontSize: '1.05rem', fontWeight: 800,
          marginBottom: '0.75rem', lineHeight: 1.35,
          fontFamily: 'var(--font-heading)',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          transition: 'color 0.3s',
        }}>
          {isPlaceholder ? 'Новые горизонты логистики в Приморье' : n.title}
        </h4>

        {/* Excerpt */}
        <p style={{
          color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          marginBottom: '1.25rem',
        }}>
          {isPlaceholder
            ? 'Мы постоянно расширяем наш парк и улучшаем качество обслуживания для вас.'
            : n.content}
        </p>

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Prim-News
          </span>

          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: typeInfo.color, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Читать <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </motion.div>
  );

  if (isPlaceholder) return content;

  return (
    <Link href={`/news/${n.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      {content}
    </Link>
  );
}

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => setNews(Array.isArray(data) ? data : []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '3rem', height: '3rem', border: '3px solid rgba(59,130,246,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Обновляем ленту...</p>
      </div>
    </div>
  );

  const items = news.length === 0
    ? [null, null, null]
    : news.slice(0, 6);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {items.map((n, i) => (
        <NewsCard key={n ? n.id : i} n={n} isPlaceholder={!n} />
      ))}
    </motion.div>
  );
}