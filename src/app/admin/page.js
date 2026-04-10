'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Edit2, Trash2, ExternalLink, Plus, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id) => {
    if (!confirm('Вы действительно хотите удалить эту страницу?')) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPages();
    } catch (error) {
      alert('Произошла ошибка при удалении');
    }
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    page.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Дашборд</h1>
          <p className="text-slate-500 mt-1">Список всех динамических страниц</p>
        </div>
        <Link href="/admin/new" className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95">
          <Plus size={20} />
          <span>Новая страница</span>
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по страницам..." 
              className="w-full pl-12 pr-6 py-3 rounded-xl border-none focus:ring-2 focus:ring-accent/20 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Заголовок</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">URL-адрес</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Дата создания</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium">Загрузка...</td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium">Страницы не найдены</td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-800">{page.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">SEO Title: {page.seo_title || 'N/A'}</div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="bg-slate-100 text-accent px-3 py-1 rounded-lg text-xs font-mono">/{page.url}</code>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {new Date(page.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/${page.url}`} 
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-accent hover:bg-white rounded-lg shadow-sm"
                          title="Посмотреть"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          href={`/admin/edit/${page.id}`} 
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg shadow-sm"
                          title="Редактировать"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => deletePage(page.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm"
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
