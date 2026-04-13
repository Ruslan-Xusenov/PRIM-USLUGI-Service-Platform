'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Globe, Search, Image as ImageIcon, AlertCircle } from 'lucide-react';
import MediaPicker from './MediaPicker';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function PageEditor({ initialData = {}, onSave, isSubmitting }) {
  const [formData, setFormData] = useState({
    url: initialData?.url || '',
    title: initialData?.title || '',
    content: initialData?.content || '',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    seo_keywords: initialData?.seo_keywords || '',
  });

  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'seo'
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [quillRef, setQuillRef] = useState(null);

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
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        image: function () {
          // Store the quill instance to use it when an image is selected
          window.quillForMedia = this.quill;
          document.getElementById('open-media-picker-btn').click();
        }
      }
    }
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
              style={{
                padding: '0.625rem 1.25rem', borderRadius: '0.625rem', fontSize: '0.9rem', fontWeight: 700, transition: 'all 0.2s', border: 'none', cursor: 'pointer',
                background: activeTab === 'content' ? '#0f172a' : 'transparent',
                color: activeTab === 'content' ? 'white' : '#64748b',
                boxShadow: activeTab === 'content' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              Контент
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('seo')}
              style={{
                padding: '0.625rem 1.25rem', borderRadius: '0.625rem', fontSize: '0.9rem', fontWeight: 700, transition: 'all 0.2s', border: 'none', cursor: 'pointer',
                background: activeTab === 'seo' ? '#0f172a' : 'transparent',
                color: activeTab === 'seo' ? 'white' : '#64748b',
                boxShadow: activeTab === 'seo' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              SEO Настройки
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={20} />
          <span>{isSubmitting ? 'Сохранение...' : 'Сохранить'}</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Form Fields */}
        <div className="col-span-8 space-y-8">
          {activeTab === 'content' ? (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Заголовок страницы (H1)</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="Например: О нас"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-bold text-lg transition-all"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">URL-адрес страницы</label>
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
                <p className="text-[10px] text-slate-400 px-1 italic">Внимание: Используйте только английские буквы и дефисы (-).</p>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Содержимое страницы</label>
                <div className="rounded-2xl border-2 border-slate-100 bg-white min-h-[500px] overflow-visible">
                  <style jsx global>{`
                    .ql-toolbar.ql-snow {
                      border: none !important;
                      border-bottom: 1px solid #f1f5f9 !important;
                      padding: 1rem !important;
                      background: #fafafa;
                      border-top-left-radius: 1rem;
                      border-top-right-radius: 1rem;
                      position: sticky;
                      top: 0;
                      z-index: 10;
                    }
                    .ql-container.ql-snow {
                      border: none !important;
                      min-height: 400px;
                      font-family: inherit;
                      font-size: 1rem;
                    }
                    .ql-editor {
                      padding: 2rem !important;
                      min-height: 400px;
                    }
                  `}</style>
                  <ReactQuill 
                    theme="snow" 
                    value={formData.content} 
                    onChange={handleEditorChange}
                    modules={modules}
                  />
                  {/* Hidden button to trigger MediaPicker from Quill handler */}
                  <button 
                    id="open-media-picker-btn" 
                    type="button" 
                    className="hidden" 
                    onClick={() => setIsMediaPickerOpen(true)}
                  ></button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Globe size={14} /> Заголовок SEO
                </label>
                <input 
                  type="text" 
                  name="seo_title"
                  placeholder="Название, отображаемое на вкладке браузера"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-medium"
                  value={formData.seo_title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Search size={14} /> Описание SEO
                </label>
                <textarea 
                  name="seo_description"
                  rows="4"
                  placeholder="Краткое описание для результатов поиска..."
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-medium resize-none"
                  value={formData.seo_description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Ключевые слова (Keywords)</label>
                <input 
                  type="text" 
                  name="seo_keywords"
                  placeholder="логистика, грузоперевозки, владивосток..."
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
          <div style={{ background: '#0f172a', borderRadius: '2rem', padding: '2rem', color: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
              <AlertCircle size={24} />
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>Нужна помощь?</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <p style={{ margin: 0 }}>1. **URL-адрес**: Формируется автоматически из названия, но вы можете изменить его вручную.</p>
              <p style={{ margin: 0 }}>2. **Изображения**: Чтобы добавить фото в текст, используйте иконку 'Picture' на панели инструментов.</p>
              <p style={{ margin: 0 }}>3. **Совет по SEO**: Постарайтесь уложить описание в 160 символов, чтобы оно лучше смотрелось в поисковиках.</p>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '2rem', padding: '2rem', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b', marginBottom: '0.5rem' }}>
              <ImageIcon size={22} style={{ color: '#3b82f6' }} />
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>Медиатека</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>Сначала загрузите изображения в Медиатеку, затем скопируйте URL и вставьте его в редактор.</p>
            <Link 
              href="/admin/media" 
              style={{ display: 'block', textAlign: 'center', border: '2px solid #f1f5f9', color: '#475569', fontWeight: 700, padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', transition: 'all 0.2s', fontSize: '0.75rem' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
            >
              Открыть Медиатеку
            </Link>
          </div>
        </div>
      </div>
      <MediaPicker 
        isOpen={isMediaPickerOpen} 
        onClose={() => setIsMediaPickerOpen(false)} 
        onSelect={(url) => {
          const quill = window.quillForMedia;
          if (quill) {
            const range = quill.getSelection() || { index: quill.getLength() };
            quill.insertEmbed(range.index, 'image', url, 'user');
          }
        }}
      />
    </form>
  );
}


import Link from 'next/link';
