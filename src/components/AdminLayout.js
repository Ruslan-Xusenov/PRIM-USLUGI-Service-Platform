'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FilePlus, Image, Home, Newspaper, Menu, X, Settings, User, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/admin/logout', { method: 'POST' });
    if (res.ok) {
      router.push('/admin/login');
    }
  };

  // Stop background bleed from global layout
  useEffect(() => {
    document.body.style.background = '#f8fafc';
    return () => {
      document.body.style.background = '';
    }
  }, []);

  return (
    <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', position: 'relative', zIndex: 10 }}>
      <style dangerouslySetInnerHTML={{__html: `
        .admin-sidebar {
          width: 16rem; /* 256px */
          background-color: #0f172a;
          color: white;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
          transition: transform 0.38s cubic-bezier(0.23, 1, 0.32, 1);
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 50;
        }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }
        .admin-header {
          display: none;
        }
        .admin-overlay {
          display: none;
        }
        /* Mobile overrides */
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            height: 100%;
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            background: white;
            border-bottom: 1px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 30;
          }
          .admin-overlay.open {
            display: block;
            position: fixed;
            inset: 0;
            background-color: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            z-index: 40;
          }
        }
        /* Overrides to restore Tailwind behavior that was missing */
        .admin-nav-item {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; 
          border-radius: 0.75rem; color: #cbd5e1; transition: all 0.25s; text-decoration: none;
        }
        .admin-nav-item:hover {
          background-color: #1e293b; color: white;
        }
        .admin-sidebar-header {
           padding: 2rem; border-bottom: 1px solid #1e293b;
           display: flex; align-items: center; justify-content: space-between;
        }
      `}} />

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`admin-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            <div style={{ width: '2rem', height: '2rem', background: 'white', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/logo_premium.png" alt="Logo" style={{ width: '1.5rem', height: '1.5rem', objectFit: 'contain' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>PRIM-USLUGI</span>
          </Link>
          <button 
            className="md-hidden-toggle" 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'block' : 'none' }} 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className="admin-nav-item">
            <LayoutDashboard size={20} />
            <span style={{ fontWeight: 600 }}>Дашборд</span>
          </Link>
          <Link href="/admin/new" onClick={() => setIsSidebarOpen(false)} className="admin-nav-item">
            <FilePlus size={20} />
            <span style={{ fontWeight: 600 }}>Новая страница</span>
          </Link>
          <Link href="/admin/media" onClick={() => setIsSidebarOpen(false)} className="admin-nav-item">
            <Image size={20} />
            <span style={{ fontWeight: 600 }}>Медиатека</span>
          </Link>
          <Link href="/admin/news" onClick={() => setIsSidebarOpen(false)} className="admin-nav-item">
            <Newspaper size={20} />
            <span style={{ fontWeight: 600 }}>Новости</span>
          </Link>
          <div style={{ height: '1px', background: '#1e293b', margin: '0.5rem 0' }} />
          <Link href="/admin/settings" onClick={() => setIsSidebarOpen(false)} className="admin-nav-item">
            <Settings size={20} />
            <span style={{ fontWeight: 600 }}>Настройки</span>
          </Link>
          <Link href="/admin/profile" onClick={() => setIsSidebarOpen(false)} className="admin-nav-item">
            <User size={20} />
            <span style={{ fontWeight: 600 }}>Профиль</span>
          </Link>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={handleLogout}
            className="admin-nav-item w-full" 
            style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <LogOut size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Выйти</span>
          </button>
          <Link href="/" className="admin-nav-item" style={{ color: '#94a3b8' }}>
            <Home size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Вернуться на сайт</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Mobile Header */}
        <header className="admin-header">
          <button 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>Панель управления</span>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: typeof window !== 'undefined' && window.innerWidth <= 768 ? '1rem' : '2.5rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
