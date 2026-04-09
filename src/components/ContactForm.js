'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    comment: '',
    consent: false
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) return;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', service: '', comment: '', consent: false });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="card-premium relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Забронировать услугу</h2>
          <p className="text-grey-500 text-sm">Оставьте свои контактные данные, и наш менеджер свяжется с вами в течение 5 минут для уточнения деталей.</p>
        </div>
        
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Заявка принята!</h3>
              <p className="text-grey-500 mb-8 max-w-xs mx-auto">Мы уже обрабатываем ваш запрос и скоро перезвоним.</p>
              <button 
                onClick={() => setStatus('idle')} 
                className="btn btn-primary bg-accent"
              >
                Отправить еще раз
              </button>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6" 
              onSubmit={handleSubmit}
            >
              <div className="grid grid-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-grey-400 ml-1">Имя</label>
                  <input 
                    type="text" 
                    placeholder="Иван Иванов" 
                    className="w-full p-4 rounded-xl bg-grey-50 border border-grey-100 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-grey-400 ml-1">Телефон</label>
                  <input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__" 
                    className="w-full p-4 rounded-xl bg-grey-50 border border-grey-100 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-grey-400 ml-1">Тип услуги</label>
                <select 
                  className="w-full p-4 rounded-xl bg-grey-50 border border-grey-100 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  required
                >
                  <option value="">Выберите категорию</option>
                  <option value="Грузоперевозки">🚚 Грузоперевозки</option>
                  <option value="Грузчики">💪 Грузчики</option>
                  <option value="Аварийный комиссар">🛡️ Аварийный комиссар</option>
                  <option value="Эвакуатор">🚜 Эвакуатор</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-grey-400 ml-1">Комментарий</label>
                <textarea 
                  placeholder="Опишите вашу задачу..." 
                  rows="3" 
                  className="w-full p-4 rounded-xl bg-grey-50 border border-grey-100 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => setFormData({...formData, consent: !formData.consent})}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  formData.consent ? 'bg-accent border-accent text-white' : 'border-grey-200'
                }`}>
                  {formData.consent && <CheckCircle2 size={16} />}
                </div>
                <span className="text-xs text-grey-500">
                  Я согласен на <Link href="/services/personal-data" className="text-accent underline hover:text-primary transition-colors">обработку персональных данных</Link>
                </span>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary bg-accent py-4 flex items-center gap-2 group overflow-hidden"
                disabled={status === 'loading'}
              >
                <div className="relative z-10 flex items-center gap-2">
                  {status === 'loading' ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>Отправить заявку</span>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-xs justify-center"
                >
                  <AlertCircle size={14} /> Ошибка при отправке. Пожалуйста, проверьте данные.
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
