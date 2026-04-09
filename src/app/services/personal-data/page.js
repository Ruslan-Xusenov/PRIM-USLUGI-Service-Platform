'use client';
import { motion } from 'framer-motion';

export default function PersonalDataPage() {
  return (
    <div className="bg-bg-main pt-40 pb-20">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium bg-white p-12"
        >
          <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Юридическая информация</span>
          <h1 className="text-4xl font-bold mb-10 tracking-tight">Обработка персональных данных</h1>
          
          <div className="flex flex-col gap-8 text-grey-600 leading-relaxed">
            <p className="text-lg">Настоящая политика определяет порядок обработки персональных данных и меры по обеспечению безопасности в <strong>Prim-Uslugi</strong>.</p>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">1</span>
                Общие положения
              </h2>
              <p>Оператор ставит своей важнейшей целью соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну. Мы гарантируем полную конфиденциальность ваших данных.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">2</span>
                Основные понятия
              </h2>
              <p>Персональные данные — любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому лицу (субъекту персональных данных), такая как имя, номер телефона, адрес и другие данные, предоставленные через формы сайта.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">3</span>
                Цели обработки
              </h2>
              <p>Цель обработки персональных данных Пользователя — оперативное информирование; предоставление доступа Пользователю к сервисам и материалам сайта, а также организация обратной связи для оказания услуг логистики и помощи.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">4</span>
                Правовые основания
              </h2>
              <p>Оператор обрабатывает персональные данные Пользователя только в случае их заполнения и/или отправки Пользователем самостоятельно через специальные формы. Отправляя свои данные, Пользователь выражает свое согласие с данной Политикой.</p>
            </section>
            
            <div className="mt-10 pt-10 border-t border-grey-100 flex justify-between items-center text-sm text-grey-400">
               <span>Prim-Uslugi Legal Department</span>
               <span className="italic">Последнее обновление: 8 апреля 2026 г.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
