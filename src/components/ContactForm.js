'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    comment: '',
    consent: false,
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', service: '', comment: '', consent: false });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1.25rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1rem',
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.68rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '0.5rem',
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = 'rgba(59,130,246,0.5)';
    e.target.style.background = 'rgba(59,130,246,0.05)';
    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.background = 'rgba(255,255,255,0.04)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      background: 'rgba(10, 20, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '2rem',
      padding: '2.5rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
    }}>
      {/* Corner glows */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '14rem', height: '14rem',
        background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        transform: 'translate(30%, -30%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '10rem', height: '10rem',
        background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        transform: 'translate(-30%, 30%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.22em', color: 'var(--accent)',
            display: 'inline-block', marginBottom: '0.875rem',
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)',
            padding: '0.3rem 0.75rem', borderRadius: '2rem',
          }}>
            Форма заказа
          </span>
          <h2 style={{
            fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em',
            color: 'white', fontFamily: 'var(--font-heading)', marginBottom: '0.625rem',
          }}>
            Забронировать услугу
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>
            Наш менеджер свяжется с вами в течение 5 минут.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{ textAlign: 'center', padding: '3rem 0' }}
            >
              <div style={{
                width: '5rem', height: '5rem',
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <CheckCircle2 size={40} style={{ color: '#34d399' }} />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                Заявка принята!
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '16rem', margin: '0 auto 2rem', lineHeight: 1.65, fontSize: '0.9rem' }}>
                Мы уже обрабатываем ваш запрос и скоро перезвоним.
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white', border: 'none', borderRadius: '1rem',
                  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
                }}
              >
                Отправить ещё раз
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              onSubmit={handleSubmit}
            >
              {/* Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Имя</label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    style={{ ...inputStyle }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Телефон</label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    style={{ ...inputStyle }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  />
                </div>
              </div>

              {/* Service select */}
              <div>
                <label style={labelStyle}>Тип услуги</label>
                <select
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', color: formData.service ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }}
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                >
                  <option value="" disabled>Выберите категорию</option>
                  <option value="Грузоперевозки">🚚 Грузоперевозки</option>
                  <option value="Грузчики">💪 Грузчики</option>
                  <option value="Аварийный комиссар">🛡️ Аварийный комиссар</option>
                  <option value="Эвакуатор">🚜 Эвакуатор</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label style={labelStyle}>Комментарий</label>
                <textarea
                  placeholder="Опишите вашу задачу..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'none' }}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              {/* Consent */}
              <div
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setFormData({ ...formData, consent: !formData.consent })}
              >
                <div style={{
                  width: '1.375rem', height: '1.375rem', flexShrink: 0, marginTop: '0.1rem',
                  borderRadius: '0.4rem',
                  border: formData.consent ? '1px solid rgba(59,130,246,0.6)' : '1px solid rgba(255,255,255,0.2)',
                  background: formData.consent ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', transition: 'all 0.25s ease',
                }}>
                  {formData.consent && <CheckCircle2 size={14} />}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Я согласен на{' '}
                  <Link
                    href="/services/personal-data"
                    style={{ color: 'var(--accent-bright)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    onClick={e => e.stopPropagation()}
                  >
                    обработку персональных данных
                  </Link>
                </span>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === 'loading' || !formData.consent}
                whileHover={status !== 'loading' && formData.consent ? { y: -2, boxShadow: '0 16px 40px rgba(59,130,246,0.5)' } : {}}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  background: formData.consent
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'rgba(255,255,255,0.08)',
                  color: formData.consent ? 'white' : 'rgba(255,255,255,0.3)',
                  border: 'none', borderRadius: '1.25rem',
                  fontWeight: 700, fontSize: '1rem', cursor: formData.consent ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                  boxShadow: formData.consent ? '0 8px 24px rgba(59,130,246,0.35)' : 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {status === 'loading' ? (
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <span>Отправить заявку</span>
                    <Send size={18} />
                  </>
                )}
              </motion.button>

              {/* Error */}
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      color: '#f87171', fontSize: '0.85rem', justifyContent: 'center',
                      padding: '0.75rem', background: 'rgba(248,113,113,0.08)',
                      border: '1px solid rgba(248,113,113,0.2)', borderRadius: '0.875rem',
                    }}
                  >
                    <AlertCircle size={16} />
                    Ошибка при отправке. Пожалуйста, проверьте данные.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
