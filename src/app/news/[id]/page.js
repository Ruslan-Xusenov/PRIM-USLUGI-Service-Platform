'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';

const TYPE_LABELS = {
  update: { label: 'Обновление', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  promo: { label: 'Акция', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  news: { label: 'Новость', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

export default function NewsDetail() {
  const params = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      fetch(`/api/admin/news/${id}`)
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => setItem(data))
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    }
    load();
  }, [params]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '3px solid rgba(59,130,246,0.2)', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (notFound || !item) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '4rem' }}>📭</div>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Новость не найдена</h2>
      <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>← На главную</Link>
    </div>
  );

  const typeInfo = TYPE_LABELS[item.type] || TYPE_LABELS.update;
  const wordCount = item.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 170));

  return (
    <div style={{ paddingTop: '7rem', paddingBottom: '8rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/#news"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none', marginBottom: '2.5rem',
              transition: 'color 0.25s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            <ArrowLeft size={16} />
            Все новости
          </Link>
        </motion.div>

        {/* Article Card */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{
            background: 'rgba(10, 20, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '2rem',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Article Header */}
          <div style={{
            padding: '2.5rem 2.5rem 2rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Type + Date row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.375rem 0.875rem',
                background: typeInfo.bg, borderRadius: '2rem',
                fontSize: '0.7rem', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.15em',
                color: typeInfo.color,
                border: `1px solid ${typeInfo.color}30`,
              }}>
                <Tag size={10} />
                {typeInfo.label}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
                  <Calendar size={13} />
                  {new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
                  <Clock size={13} />
                  {readTime} мин чтения
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.625rem, 3.5vw, 2.25rem)',
              fontWeight: 900, color: 'white', lineHeight: 1.2,
              letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)',
              margin: 0,
            }}>
              {item.title}
            </h1>
          </div>

          {/* Article Image (if exists) */}
          {item.image_url && (
            <div style={{
              width: '100%',
              maxHeight: '400px',
              overflow: 'hidden',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <img 
                src={item.image_url} 
                alt={item.title} 
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'cover' }} 
              />
            </div>
          )}

          {/* Article Body */}
          <div style={{ padding: '2.5rem' }}>
            <div style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1.05rem', lineHeight: 1.85,
              whiteSpace: 'pre-wrap',
            }}>
              {item.content}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem 2.5rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Prim-Uslugi News
            </span>
            <Link
              href="/#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white', borderRadius: '0.875rem',
                fontWeight: 700, fontSize: '0.85rem',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
              }}
            >
              Заказать услугу
            </Link>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
