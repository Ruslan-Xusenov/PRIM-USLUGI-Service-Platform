'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Upload, Copy, Check, Trash2, Image as ImageIcon, Search } from 'lucide-react';

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchMedia();
      } else {
        alert('Ошибка при загрузке');
      }
    } catch (error) {
      alert('Произошла ошибка при загрузке');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url, index) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Медиатека</h1>
          <p className="text-slate-500 mt-1">Загружайте и управляйте изображениями</p>
        </div>
        <label className={`flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all cursor-pointer active:scale-95 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={20} />
          <span>{isUploading ? 'Загрузка...' : 'Загрузить фото'}</span>
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
        </label>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Поиск изображений..." 
            className="w-full pl-12 pr-6 py-3 rounded-xl border border-slate-100 focus:border-accent outline-none bg-slate-50/50 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold">Загрузка...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
            <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold tracking-tight text-lg">Нет медиафайлов</p>
            <p className="text-slate-300 text-sm mt-1">Загрузите первое изображение с помощью кнопки сверху</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredMedia.map((item, index) => (
              <div key={index} className="group relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 aspect-square">
                <img 
                  src={item.url} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <button 
                    onClick={() => copyToClipboard(item.url, index)}
                    className="p-3 bg-white text-slate-900 rounded-xl hover:bg-accent hover:text-white transition-all shadow-xl active:scale-90"
                    title="Копировать ссылку"
                  >
                    {copiedIndex === index ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                  <span className="text-[9px] text-white font-bold bg-black/40 px-2 py-1 rounded uppercase tracking-widest truncate max-w-[80%]">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 bg-accent/5 border border-accent/10 rounded-3xl p-8 flex items-start gap-4">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-accent/20">
          <Copy size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-1">Совет: Использование изображений</h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            После загрузки изображения наведите на него курсор и нажмите иконку <b>скопировать</b>. 
            Затем в визуальном редакторе страниц нажмите кнопку добавления картинки и вставьте скопированный URL.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}