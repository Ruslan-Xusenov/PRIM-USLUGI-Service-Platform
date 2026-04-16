'use client';
import { useState, useEffect } from 'react';
import { Share2, Phone, Mail, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    social_vk: '',
    social_telegram: '',
    social_whatsapp: '',
    contact_phone: '',
    contact_email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Настройки успешно сохранены' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Ошибка при сохранении' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Ошибка сервера' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 font-heading tracking-tight">Общие настройки</h1>
        <p className="text-white/40">Управление контактами и социальными сетями</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Social Media Section */}
        <section className="bg-[#0b1224]/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
              <Share2 size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Социальные сети</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">VK URL</label>
              <input
                type="text"
                className="form-input"
                style={{ padding: '1rem 1.25rem' }}
                value={settings.social_vk}
                onChange={(e) => setSettings({ ...settings, social_vk: e.target.value })}
                placeholder="https://vk.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">Telegram URL</label>
              <input
                type="text"
                className="form-input"
                style={{ padding: '1rem 1.25rem' }}
                value={settings.social_telegram}
                onChange={(e) => setSettings({ ...settings, social_telegram: e.target.value })}
                placeholder="https://t.me/..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">WhatsApp URL / Номер</label>
              <input
                type="text"
                className="form-input"
                style={{ padding: '1rem 1.25rem' }}
                value={settings.social_whatsapp}
                onChange={(e) => setSettings({ ...settings, social_whatsapp: e.target.value })}
                placeholder="https://wa.me/..."
              />
            </div>
          </div>
        </section>

        {/* Contacts Section */}
        <section className="bg-[#0b1224]/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
              <Phone size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Контактная информация</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">Телефон</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'rgba(255,255,255,0.2)' }}>
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1.25rem', paddingTop: '1rem', paddingBottom: '1rem', width: '100%' }}
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">E-mail</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'rgba(255,255,255,0.2)' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1.25rem', paddingTop: '1rem', paddingBottom: '1rem', width: '100%' }}
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>

        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-head-shake ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Сохранить настройки
          </button>
        </div>
      </form>
    </div>
  );
}
