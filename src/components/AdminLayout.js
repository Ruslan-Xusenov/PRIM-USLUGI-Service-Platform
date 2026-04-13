'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FilePlus, Image, Home, Newspaper, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shadow-xl transition-transform duration-300 md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 md:p-8 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 font-bold text-slate-900 text-xs">
              <img src="/images/logo_premium.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold tracking-tight text-lg md:text-xl">PRIM-USLUGI</span>
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 md:p-6 space-y-2 overflow-y-auto">
          <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <LayoutDashboard size={20} className="group-hover:text-accent transition-colors" />
            <span className="font-semibold text-sm md:text-base">Дашборд</span>
          </Link>
          <Link href="/admin/new" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <FilePlus size={20} className="group-hover:text-accent transition-colors" />
            <span className="font-semibold text-sm md:text-base">Новая страница</span>
          </Link>
          <Link href="/admin/media" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <Image size={20} className="group-hover:text-accent transition-colors" />
            <span className="font-semibold text-sm md:text-base">Медиатека</span>
          </Link>
          <Link href="/admin/news" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <Newspaper size={20} className="group-hover:text-accent transition-colors" />
            <span className="font-semibold text-sm md:text-base">Новости</span>
          </Link>
        </nav>

        <div className="p-4 md:p-6 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white group">
            <Home size={18} />
            <span className="text-sm font-medium">Вернуться на сайт</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-4 sticky top-0 z-30">
          <button 
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-800 text-lg">Панель управления</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-10 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
