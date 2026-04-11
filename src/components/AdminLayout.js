'use client';
import Link from 'next/link';
import { LayoutDashboard, FilePlus, Image, Home, LogOut, Newspaper } from 'lucide-react';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col items-stretch sticky top-0 h-screen shadow-xl">
        <div className="p-8 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
               <img src="/images/logo_premium.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold tracking-tight text-xl">PRIM-USLUGI</span>
          </Link>
          <div className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold px-1">Панель управления</div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <LayoutDashboard size={20} className="group-hover:text-accent transition-colors" />
            <span className="font-semibold">Дашборд</span>
          </Link>
          <Link href="/admin/new" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <FilePlus size={20} className="group-hover:text-accent transition-colors" />
            <span className="font-semibold">Новая страница</span>
          </Link>
          <Link href="/admin/media" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <Image size={20} className="group-hover:text-accent transition-colors" />
            <span className="font-semibold">Медиатека</span>
          </Link>
          <Link href="/admin/news" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <Newspaper size={20} className="group-hover:text-accent transition-colors" />
            <span className="font-semibold">Новости</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white group">
            <Home size={18} />
            <span className="text-sm font-medium">Вернуться на сайт</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
