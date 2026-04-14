'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Globe, Search, Image as ImageIcon, AlertCircle } from 'lucide-react';
import MediaPicker from './MediaPicker';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function PageEditor({ initialData = {}, onSave, isSubmitting }) {
  const [formData, setFormData] = useState({
    url: initialData?.url || '',
    title: initialData?.title || '',
    content: initialData?.content || '',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    seo_keywords: initialData?.seo_keywords || '',
    // Service-specific fields
    is_service: initialData?.is_service || 0,
    header_description: initialData?.header_description || '',
    icon_name: initialData?.icon_name || 'Shield',
    image_url: initialData?.image_url || '',
    bg_image_url: initialData?.bg_image_url || '',
    details: (() => {
      try {
        return initialData?.details_json ? JSON.parse(initialData.details_json) : [
          { title: '', text: '' },
          { title: '', text: '' },
          { title: '', text: '' },
          { title: '', text: '' }
        ];
      } catch (e) {
        return [{ title: '', text: '' }, { title: '', text: '' }, { title: '', text: '' }, { title: '', text: '' }];
      }
    })()
  });

  const [activeTab, setActiveTab] = useState('content');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData(prev => ({ ...prev, details: newDetails }));
  };

  const addDetail = () => {
    setFormData(prev => ({ ...prev, details: [...prev.details, { title: '', text: '' }] }));
  };

  const removeDetail = (index) => {
    setFormData(prev => ({ ...prev, details: prev.details.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, details_json: JSON.stringify(formData.details) });
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
          window.quillForMedia = this.quill;
          document.getElementById('open-media-picker-btn').click();
        }
      }
    }
  }), []);

  const tabStyle = (tab, color = '#0f172a') => ({
    padding: '0.625rem 1.25rem',
    borderRadius: '0.625rem',
    fontSize: '0.9rem',
    fontWeight: 700,
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer',
    background: activeTab === tab ? color : 'transparent',
    color: activeTab === tab ? 'white' : '#64748b',
    boxShadow: activeTab === tab ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-200">
            <button type="button" onClick={() => setActiveTab('content')} style={tabStyle('content')}>Контент</button>
            <button type="button" onClick={() => setActiveTab('seo')} style={tabStyle('seo')}>SEO</button>
            <button type="button" onClick={() => setActiveTab('service')} style={tabStyle('service', '#3b82f6')}>⚙ Услуга</button>
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
        {/* Main Editor Area */}
        <div className="col-span-8 space-y-8">

          {/* ===== CONTENT TAB ===== */}
          {activeTab === 'content' && (
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
                  <button
                    id="open-media-picker-btn"
                    type="button"
                    className="hidden"
                    onClick={() => setIsMediaPickerOpen(true)}
                  ></button>
                </div>
              </div>
            </div>
          )}

          {/* ===== SEO TAB ===== */}
          {activeTab === 'seo' && (
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

          {/* ===== SERVICE TAB ===== */}
          {activeTab === 'service' && (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
              {/* Toggle */}
              <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-3xl border-2 border-blue-100">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">Режим «Страница Услуги»</h3>
                  <p className="text-sm text-slate-500">Включите для активации специального дизайна с иконками и карточками преимуществ.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.is_service === 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_service: e.target.checked ? 1 : 0 }))}
                  />
                  <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              {formData.is_service === 1 && (
                <div className="space-y-8">
                  {/* Icon & Header Description */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Иконка (Lucide)</label>
                      <input
                        type="text"
                        name="icon_name"
                        placeholder="Shield, Truck, Hammer, AlertTriangle..."
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-bold"
                        value={formData.icon_name}
                        onChange={handleChange}
                      />
                      <p className="text-[10px] text-slate-400 px-1">Доступные: Shield, Truck, Hammer, AlertTriangle, Globe, Clock, Box</p>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Описание в шапке</label>
                      <textarea
                        name="header_description"
                        rows="3"
                        placeholder="Краткое описание под заголовком страницы"
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none text-sm resize-none"
                        value={formData.header_description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Основное фото (боковая панель)</label>
                      <input
                        type="text"
                        name="image_url"
                        placeholder="/images/example.jpg"
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-medium"
                        value={formData.image_url}
                        onChange={handleChange}
                      />
                      {formData.image_url && (
                        <img src={formData.image_url} alt="preview" className="rounded-xl mt-2 max-h-32 object-cover" />
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Фоновое фото</label>
                      <input
                        type="text"
                        name="bg_image_url"
                        placeholder="/images/bg-example.jpg"
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none font-medium"
                        value={formData.bg_image_url}
                        onChange={handleChange}
                      />
                      {formData.bg_image_url && (
                        <img src={formData.bg_image_url} alt="bg preview" className="rounded-xl mt-2 max-h-32 object-cover" />
                      )}
                    </div>
                  </div>

                  {/* Advantages / Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Преимущества (Advantages)</label>
                      <button
                        type="button"
                        onClick={addDetail}
                        style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        + Добавить
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.details.map((detail, index) => (
                        <div key={index} className="relative group p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <button
                            type="button"
                            onClick={() => removeDetail(index)}
                            style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onFocus={e => e.currentTarget.style.opacity = '1'}
                            className="group-hover:opacity-100"
                          >
                            ×
                          </button>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder={`Заголовок ${index + 1} (напр. Круглосуточно 24/7)`}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-accent outline-none font-bold"
                              value={detail.title}
                              onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                            />
                            <textarea
                              placeholder="Описание преимущества..."
                              rows="2"
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-accent outline-none text-sm resize-none"
                              value={detail.text}
                              onChange={(e) => handleDetailChange(index, 'text', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Help */}
        <div className="col-span-4 space-y-6">
          <div style={{ background: '#0f172a', borderRadius: '2rem', padding: '2rem', color: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
              <AlertCircle size={24} />
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>Нужна помощь?</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <p style={{ margin: 0 }}>1. <strong>Контент</strong>: Заголовок, URL и тело страницы.</p>
              <p style={{ margin: 0 }}>2. <strong>SEO</strong>: Мета-заголовок, описание и ключевые слова.</p>
              <p style={{ margin: 0 }}>3. <strong>Услуга</strong>: Особый дизайн для страниц xizmatov с иконками и преимуществами.</p>
              <p style={{ margin: 0 }}>4. <strong>Изображения</strong>: Сначала загрузите в Медиатеку, затем вставьте URL.</p>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '2rem', padding: '2rem', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b', marginBottom: '0.5rem' }}>
              <ImageIcon size={22} style={{ color: '#3b82f6' }} />
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>Медиатека</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>Сначала загрузите изображения в Медиатеку, затем скопируйте URL и вставьте его в редактор или в поля фото.</p>
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
