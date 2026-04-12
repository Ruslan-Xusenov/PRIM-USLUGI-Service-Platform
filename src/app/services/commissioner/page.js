import ServicePage from '../../../components/ServicePage';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Аварийный комиссар Владивосток | Вызов при ДТП 24/7',
  description: 'Срочный вызов аварийного комиссара в Приморском крае. Оформление ДТП, европротокол, помощь со страховой. Круглосуточно.',
};

export default function CommissionerPage() {
  const details = [
    { title: 'Оперативный выезд', text: 'Прибытие на место ДТП в течение 15-20 минут по всему краю.' },
    { title: 'Оформление европротокола', text: 'Грамотное заполнение всех документов без вызова сотрудников ГИБДД.' },
    { title: 'Юридическая помощь', text: 'Консультации по вопросам ответственности и получения выплат.' },
    { title: 'Фотофиксация', text: 'Профессиональная съемка места происшествия для страховых компаний.' }
  ];

  return (
    <ServicePage 
      title="Аварийный комиссар" 
      description="Оперативная защита ваших интересов и грамотное оформление документов при ДТП. Наши специалисты на связи 24/7 по всему Приморскому краю."
      details={details}
      icon={<Shield size={32} />}
      image="/images/banner_commissioner.png"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Вызов аварийного комиссара во Владивостоке и Приморском крае</h1>
      <p className="mb-6 leading-relaxed">
        Попали в дорожно-транспортное происшествие? Сохраняйте спокойствие — наша скорая автопомощь Приморья уже в пути! Опытный <strong>аварийный комиссар во Владивостоке</strong> оперативно прибудет на место.
      </p>
      
      <h2 className="text-2xl font-bold mb-4 text-primary">Наши услуги:</h2>
      <ul className="list-disc pl-6 mb-8 space-y-3">
        <li>Быстрый <strong>вызов аварийного комиссара</strong> по всему Приморскому краю.</li>
        <li>Грамотное <strong>оформление ДТП комиссаром</strong> и <strong>оформление европротокола</strong>.</li>
        <li>Выезд специалиста за 30 минут — <strong>аварийный комиссар работает 24/7</strong>.</li>
        <li><strong>Помощь при мелком ДТП</strong> с обязательной фотофиксацией места происшествия.</li>
        <li><strong>Юридическая помощь при ДТП</strong> и привлечение комиссара для урегулирования споров со страховой компанией.</li>
      </ul>

      <div className="bg-accent/5 p-6 rounded-2xl flex items-center gap-4">
        <span className="text-2xl">🔗</span>
        <p className="text-lg font-medium text-primary">
          Если ваш автомобиль не на ходу, мы организуем{' '}
          <Link href="/services/evacuator" className="text-accent underline hover:text-accent/80 transition-colors">
            срочную эвакуацию авто
          </Link>.
        </p>
      </div>
    </ServicePage>
  );
}