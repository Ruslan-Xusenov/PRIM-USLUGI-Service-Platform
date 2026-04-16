'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка сервера. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center relative overflow-hidden" style={{ minHeight: '100vh', backgroundColor: '#030711', padding: '1rem' }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(37,99,235,0.1)', filter: 'blur(120px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(59,130,246,0.1)', filter: 'blur(120px)', borderRadius: '50%' }} />
      
      <div className="w-full max-w-md relative z-10">
        <div style={{ background: 'rgba(11,18,36,0.8)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <div className="text-center mb-8">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: '#2563eb', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(37,99,235,0.2)', marginBottom: '1rem', animation: 'bounce-soft 2s infinite' }}>
              <Lock style={{ color: 'white' }} size={32} />
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em' }}>Вход в панель</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Введите учетные данные для доступа</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Логин</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'rgba(255,255,255,0.2)' }}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '1rem', paddingBottom: '1rem', borderRadius: '1rem', width: '100%', boxSizing: 'border-box' }}
                  placeholder="Ваш логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Пароль</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'rgba(255,255,255,0.2)' }}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '1rem', paddingBottom: '1rem', borderRadius: '1rem', width: '100%', boxSizing: 'border-box' }}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle style={{ color: '#ef4444', flexShrink: 0 }} size={18} />
                <p style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent w-full"
              style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontSize: '1.125rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <div style={{ width: '1.5rem', height: '1.5rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LogIn size={20} />
                  Войти
                </div>
              )}
            </button>
          </form>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} Prim-Uslugi Admin Panel
        </p>
      </div>
    </div>
  );
}
