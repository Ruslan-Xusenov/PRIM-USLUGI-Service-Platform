'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';

const inputStyle = {
  width: '100%', padding: '0.875rem 1.25rem',
  border: '1px solid #e2e8f0', borderRadius: '0.875rem',
  fontSize: '0.9rem', color: '#1e293b', outline: 'none',
  fontFamily: 'inherit', transition: 'all 0.2s', background: 'white',
};

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 800,
  textTransform: 'uppercase', letterSpacing: '0.12em',
  color: '#64748b', marginBottom: '0.5rem',
};

export default function AdminNewsEdit() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ title: '', content: '', type: 'news', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDirectUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm({ ...form, image_url: data.url });
      } else {
        setError(data.error || 'Ошибка при загрузке');
      }
    } catch {
      setError('Ошибка соединения при загрузке');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetch(`/api/admin/news/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.id) setForm({ 
          title: data.title, 
          content: data.content, 
          type: data.type || 'news',
          image_url: data.image_url || '' 
        });
        else setError('Новость не найдена');
      })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/admin/news/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { router.push('/admin/news'); router.refresh(); }
      else setError(data.error || 'Ошибка сохранения');
    } catch { setError('Ошибка соединения'); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <Link href="/admin/news" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#f1f5f9', color: '#64748b', textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0 }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Редактировать новость
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>ID: {params.id}</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>Загрузка...</div>
      ) : (
        <form onSubmit={handleSave} style={{ maxWidth: '52rem' }}>
          <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div>
              <label style={labelStyle}>Тип новости</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="news">📰 Новость</option>
                <option value="update">🔄 Обновление</option>
                <option value="promo">🎁 Акция</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Заголовок *</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Ссылка на изображение (URL)</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input type="text" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={inputStyle}
                  placeholder="https://example.com/image.jpg"
                  onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0 1.25rem', height: '3.25rem',
                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                    borderRadius: '0.875rem', color: '#64748b',
                    fontWeight: 700, fontSize: '0.85rem',
                    cursor: 'pointer', transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <ImageIcon size={18} />
                  Медиатека
                </button>
                <label
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0 1.25rem', height: '3.25rem',
                    background: '#3b82f6', border: 'none',
                    borderRadius: '0.875rem', color: 'white',
                    fontWeight: 700, fontSize: '0.85rem',
                    cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    whiteSpace: 'nowrap', opacity: uploading ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(59,130,246,0.2)',
                  }}
                  onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = '#2563eb'; }}
                  onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = '#3b82f6'; }}
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {uploading ? '...' : 'Загрузить'}
                  <input type="file" style={{ display: 'none' }} onChange={handleDirectUpload} accept="image/*" disabled={uploading} />
                </label>
              </div>
              <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.375rem', paddingLeft: '0.5rem' }}>
                Загрузите фото с компьютера или выберите из медиатеки
              </p>
            </div>

            <div>
              <label style={labelStyle}>Содержание *</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                required
              />
            </div>

            {error && (
              <div style={{ padding: '0.875rem 1.25rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.875rem', color: '#ef4444', fontSize: '0.875rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <Link href="/admin/news" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.875rem', background: '#f1f5f9', color: '#64748b', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                Отмена
              </Link>
              <button type="submit" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', borderRadius: '0.875rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 16px rgba(59,130,246,0.35)', fontFamily: 'inherit' }}>
                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </form>
      )}

      <MediaPicker 
        isOpen={isMediaPickerOpen} 
        onClose={() => setIsMediaPickerOpen(false)} 
        onSelect={(url) => setForm({ ...form, image_url: url })}
      />
    </AdminLayout>
  );
}
