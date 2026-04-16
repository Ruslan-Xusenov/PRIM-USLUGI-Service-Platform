'use client';
import { useState } from 'react';
import { User, Lock, Key, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Новые пароли не совпадают' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Новый пароль должен быть не менее 6 символов' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Пароль успешно изменен' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Ошибка при смене пароля' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Ошибка сервера' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 font-heading tracking-tight">Профиль администратора</h1>
        <p className="text-white/40">Управление учетной записью и безопасностью</p>
      </div>

      <div className="bg-[#0b1224]/50 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="p-8 border-bottom border-white/5 bg-white/5 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">admin</h2>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider">Главный администратор</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Key size={18} className="text-blue-500" />
              <h3 className="text-lg font-bold text-white">Смена пароля</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Текущий пароль</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Новый пароль</label>
                  <input
                    type="password"
                    required
                    className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Подтверждение</label>
                  <input
                    type="password"
                    required
                    className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-head-shake ${
                message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'
              }`}>
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <p className="font-medium">{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Обновить пароль
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
