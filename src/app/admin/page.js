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
        <Link 
          href="/admin/new" 
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white', borderRadius: '0.875rem',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.35)'; }}
        >
          <Plus size={18} />
          <span>Новая страница</span>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .admin-table-wrapper {
             overflow: visible !important;
             padding: 0 1rem;
          }
          .admin-table, .admin-table tbody, .admin-table tr, .admin-table td {
            display: block;
            width: 100%;
          }
          .admin-table thead {
            display: none;
          }
          .admin-table tr {
            margin-bottom: 1.5rem;
            border: 1px solid #f1f5f9 !important;
            border-radius: 1.25rem !important;
            padding: 1.25rem;
            background: #ffffff;
            box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          }
          .admin-table tr:hover {
            background: #ffffff !important;
          }
          .admin-table td {
            padding: 0.5rem 0 !important;
            border: none !important;
            text-align: left !important;
          }
          /* Make URL wrap */
          .admin-table-url {
            word-break: break-all;
            white-space: normal;
          }
          /* Actions row */
          .admin-table td:last-child {
            padding-top: 1rem !important;
            border-top: 1px dashed #e2e8f0 !important;
            margin-top: 0.5rem;
          }
          .admin-table td:last-child > div {
            justify-content: flex-start !important;
          }
        }
      `}} />

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

        <div className="overflow-x-auto admin-table-wrapper">
          <table className="w-full text-left border-collapse admin-table">
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
                      <div className="font-bold text-slate-800" style={{ fontSize: '1.1rem' }}>{page.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">SEO Title: {page.seo_title || 'N/A'}</div>
                    </td>
                    <td className="px-8 py-6 admin-table-url">
                      <code className="bg-slate-100 text-accent px-3 py-1 rounded-lg text-xs font-mono">/{page.url}</code>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {new Date(page.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link 
                          href={`/${page.url}`} 
                          target="_blank"
                          title="Посмотреть"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
                            background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                            transition: 'all 0.2s ease', textDecoration: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                        >
                          <ExternalLink size={20} />
                        </Link>
                        <Link 
                          href={`/admin/edit/${page.id}`} 
                          title="Редактировать"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
                            background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                            transition: 'all 0.2s ease', textDecoration: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                        >
                          <Edit2 size={20} />
                        </Link>
                        <button 
                          onClick={() => deletePage(page.id)}
                          title="Удалить"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', cursor: 'pointer',
                            background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                            transition: 'all 0.2s ease', textDecoration: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                        >
                          <Trash2 size={20} />
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
