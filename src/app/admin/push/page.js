'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Send, Bell, Smartphone, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminPushPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const fetchSubscriberCount = async () => {
    try {
      const res = await fetch('/api/admin/push/broadcast');
      if (res.ok) {
        const data = await res.json();
        setSubscriberCount(data.count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch subscriber count:', err);
    }
  };

  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !body) return;

    setLoading(true);
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/admin/push/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.summary || 'Рассылка успешно отправлена!');
        setTitle('');
        setBody('');
        fetchSubscriberCount(); // Refresh count if some subscriptions were pruned
      } else {
        setStatus('error');
        setMessage(data.error || 'Ошибка при отправке рассылки');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Внутренняя ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Push-рассылки</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Отправляйте push-уведомления о новых акциях и статусах всем подписчикам</p>
          </div>
          <button 
            onClick={fetchSubscriberCount}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
          >
            <RefreshCw size={14} /> Обновить
          </button>
        </div>

        {/* Dashboard Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Активные подписчики PWA</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0 0' }}>{subscriberCount}</h2>
            </div>
          </div>
        </div>

        {/* Broadcast Console Form & Live Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }} className="lg:grid-cols-2">
          
          {/* Form */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Создать рассылку</h3>

            {subscriberCount === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fffbeb', color: '#b45309', border: '1px solid #fef3c7', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                <AlertCircle size={16} />
                <span>Внимание: Нет активных подписчиков. Вы можете нажать кнопку отправки, чтобы протестировать форму, но уведомления не будут доставлены реальным пользователям. Для реальной подписки откройте сайт и разрешите уведомления.</span>
              </div>
            )}

            {status === 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Заголовок уведомления</label>
                <input
                  type="text"
                  placeholder="Например: Скидка 15% на эвакуатор!"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    color: '#0f172a',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Текст уведомления</label>
                <textarea
                  placeholder="Введите основное сообщение рассылки..."
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  required
                  rows={4}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'none',
                    color: '#0f172a',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.875rem',
                  borderRadius: '0.75rem',
                  backgroundColor: loading ? '#94a3b8' : '#0f172a',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'opacity 0.2s',
                }}
              >
                <Send size={16} /> {loading ? 'Отправка...' : 'Отправить уведомление'}
              </button>
            </form>
          </div>

          {/* Live Mobile Preview */}
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone size={16} /> Предпросмотр на устройстве
            </h4>
            
            {/* Phone Mockup Frame */}
            <div style={{
              width: '300px',
              height: '180px',
              backgroundColor: '#1e293b',
              borderRadius: '1.25rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              padding: '1rem',
              color: 'white',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              {/* iOS style lock screen push bubble */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.875rem',
                padding: '0.75rem',
                display: 'flex',
                gap: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <img
                  src="/images/logo_premium.png"
                  alt="App Logo"
                  style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', objectFit: 'contain', background: 'white', padding: '0.15rem' }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#3b82f6' }}>Prim-Uslugi</span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>сейчас</span>
                  </div>
                  <h5 style={{ margin: '0.25rem 0 0.15rem 0', fontSize: '0.8rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {title || 'Заголовок пуша'}
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {body || 'Текст вашего push-сообщения...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
