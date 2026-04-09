'use client';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="bg-bg-main pt-40 pb-20">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium bg-white p-12"
        >
          <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Юридическая информация</span>
          <h1 className="text-4xl font-bold mb-10 tracking-tight">Политика конфиденциальности</h1>
          
          <div className="flex flex-col gap-8 text-grey-600 leading-relaxed">
            <p className="text-lg">Настоящая Политика конфиденциальности описывает, как <strong>Prim-Uslugi</strong> собирает, использует и защищает вашу личную информацию при использовании нашего веб-сайта.</p>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">1</span>
                Сбор информации
              </h2>
              <p>Мы собираем информацию, которую вы предоставляете нам напрямую через формы обратной связи, включая ваше имя, номер телефона и адрес электронной почты. Это необходимо для корректного оказания услуг.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">2</span>
                Использование информации
              </h2>
              <p>Предоставленная вами информация используется исключительно для связи с вами по поводу ваших запросов на услуги, предоставления консультаций и улучшения качества обслуживания.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">3</span>
                Защита данных
              </h2>
              <p>Мы принимаем все необходимые технические и организационные меры для защиты вашей личной информации от несанкционированного доступа, изменения, раскрытия или уничтожения. Доступ к данным имеют только уполномоченные сотрудники.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">4</span>
                Передача третьим лицам
              </h2>
              <p>Мы не продаем, не обмениваем и не передаем вашу личную информацию третьим лицам без вашего явного согласия, за исключением случаев, предусмотренных законодательством РФ.</p>
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
