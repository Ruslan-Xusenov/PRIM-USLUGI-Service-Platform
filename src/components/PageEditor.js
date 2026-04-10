'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Save, Globe, Search, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function PageEditor({ initialData = {}, onSave, isSubmitting }) {
  const [formData, setFormData] = useState({
    url: initialData.url || '',
    title: initialData.title || '',
    content: initialData.content || '',
    seo_title: initialData.seo_title || '',
    seo_description: initialData.seo_description || '',
    seo_keywords: initialData.seo_keywords || '',
  });

  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'seo'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }), []);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Bar Actions */}
      <div className="flex justify-between items-center sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-200">
            <button 
              type="button"
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Ma'lumotlar
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'seo' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              SEO Sozlamalar
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={20} />
          <span>{isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Form Fields */}
        <div className="col-span-8 space-y-8">
          {activeTab === 'content' ? (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Sahifa sarlavhasi (H1)</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="Masalan: Biz haqimizda"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-bold text-lg transition-all"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Sahifa URL manzili</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium">primuslugi.uz/</span>
                  <input 
                    type="text" 
                    name="url"
                    required
                    placeholder="about-us"
                    className="w-full pl-[110px] pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-medium text-slate-700 transition-all"
                    value={formData.url}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-[10px] text-slate-400 px-1 italic">Diqqat: Faqat inglizcha harflar va chiziqchalar (-) ishlating.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Sahifa mazmuni</label>
                <div className="h-[500px] overflow-hidden rounded-2xl border-2 border-slate-100">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.content} 
                    onChange={handleEditorChange}
                    modules={modules}
                    style={{ height: '444px' }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Globe size={14} /> SEO Browser Title
                </label>
                <input 
                  type="text" 
                  name="seo_title"
                  placeholder="Brauzer tepasida ko'rinadigan nom"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-medium"
                  value={formData.seo_title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Search size={14} /> SEO Description
                </label>
                <textarea 
                  name="seo_description"
                  rows="4"
                  placeholder="Qidiruv natijalarida chiqadigan qisqacha tavsif..."
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-medium resize-none"
                  value={formData.seo_description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Kalit so'zlar (Keywords)</label>
                <input 
                  type="text" 
                  name="seo_keywords"
                  placeholder="logistika, yuk tashish, vladivostok..."
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-medium"
                  value={formData.seo_keywords}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Help / Tips */}
        <div className="col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-accent mb-2">
              <AlertCircle size={24} />
              <h3 className="font-bold text-lg">Yordam beramizmi?</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <p>1. **URL sarlavhasi**: Sahifa nomi asosida avtomatik shakllanadi, lekin uni qo'lda ham o'zgartirishingiz mumkin.</p>
              <p>2. **Rasm yuklash**: Matn ichiga rasm qo'shish uchun tahrirlovchi asboblar panellidan 'Picture' belgisini ishlating.</p>
              <p>3. **SEO tavsiyasi**: Qidiruv natijalarida yaxshi chiqish uchun Description qismini 160 belgidan oshirmang.</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl space-y-6">
             <div className="flex items-center gap-3 text-slate-800 mb-2">
              <ImageIcon size={22} className="text-accent" />
              <h3 className="font-bold">Media kutubxonasi</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Rasmlarni avval 'Media' bo'limiga yuklab, keyin URL manzilini matn ichiga qo'yishingiz mumkin.</p>
            <Link href="/admin/media" className="block text-center border-2 border-slate-100 hover:border-accent text-slate-600 hover:text-accent font-bold py-3 rounded-xl transition-all text-xs">Kutubxonani ochish</Link>
          </div>
        </div>
      </div>
    </form>
  );
}

import Link from 'next/link';
