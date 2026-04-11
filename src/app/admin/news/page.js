'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Newspaper, Calendar, Search, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPE_LABELS = {
  update: { label: 'Обновление', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  promo: { label: 'Акция', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  news: { label: 'Новость', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch { setNews([]); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить эту новость?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      if (res.ok) setNews(prev => prev.filter(n => n.id !== id));
    } catch { alert('Ошибка при удалении'); }
    finally { setDeleting(null); }
  };

  const filtered = news.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Новости
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.375rem', fontSize: '0.9rem' }}>
            Управление лентой новостей. Всего: {news.length}
          </p>
        </div>
        <Link
          href="/admin/news/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white', borderRadius: '0.875rem',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
          }}
        >
          <Plus size={18} />
          Добавить новость
        </Link>
      </div>

      {/* Search */}
      <div style={{
        background: 'white', borderRadius: '1.5rem',
        border: '1px solid #f1f5f9', marginBottom: '1.5rem',
        padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        <Search size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Поиск по заголовку..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            border: 'none', outline: 'none', flex: 1,
            fontSize: '0.9rem', color: '#1e293b', background: 'transparent',
          }}
        />
      </div>

      {/* List */}
      <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center' }}>
            <Newspaper size={48} style={{ color: '#e2e8f0', margin: '0 auto 1rem' }} />
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Новостей пока нет</p>
            <Link href="/admin/news/new" style={{ display: 'inline-flex', marginTop: '1rem', alignItems: 'center', gap: '0.375rem', color: '#3b82f6', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              <Plus size={16} /> Добавить первую
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const typeInfo = TYPE_LABELS[item.type] || TYPE_LABELS.update;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: idx * 0.04 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                    padding: '1.25rem 1.5rem',
                    borderBottom: idx < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Icon */}
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: typeInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Newspaper size={18} style={{ color: typeInfo.color }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </span>
                      <span style={{ padding: '0.2rem 0.625rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', background: typeInfo.bg, color: typeInfo.color }}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: '#94a3b8', fontSize: '0.78rem' }}>
                      <Calendar size={12} />
                      {new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                    <Link
                      href={`/news/${item.id}`}
                      target="_blank"
                      title="Посмотреть"
                      style={{ padding: '0.5rem', borderRadius: '0.625rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.background = '#eff6ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Eye size={17} />
                    </Link>
                    <Link
                      href={`/admin/news/edit/${item.id}`}
                      title="Редактировать"
                      style={{ padding: '0.5rem', borderRadius: '0.625rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.background = '#eff6ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Edit2 size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      title="Удалить"
                      style={{ padding: '0.5rem', borderRadius: '0.625rem', color: '#94a3b8', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </AdminLayout>
  );
}
