import ServicePage from '../../../components/ServicePage';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Вызвать эвакуатор во Владивостоке | Срочно и дешево 24/7',
  description: 'Круглосуточный эвакуатор в Приморском крае. Эвакуация легковых авто, грузовиков, спецтехники после ДТП. Подача от 30 минут.',
};

export default function EvacuatorPage() {
  const details = [
    { title: 'Любая сложность', text: 'Эвакуация легковых авто, внедорожников, спецтехники и мотоциклов.' },
    { title: 'Круглосуточно 24/7', text: 'Мы на связи днем и ночью, в любую погоду и праздничные дни.' },
    { title: 'Бережная погрузка', text: 'Используем современное оборудование, исключающее повреждения авто.' },
    { title: 'Доступные цены', text: 'Прозрачное ценообразование и отсутствие скрытых платежей.' }
  ];

  return (
    <ServicePage 
      title="Эвакуатор" 
      description="Круглосуточная эвакуация транспорта любой сложности. Мы приедем на помощь в любую погоду, чтобы безопасно транспортировать ваш автомобиль."
      details={details}
      icon={<AlertTriangle size={32} />}
      image="/images/banner_evacuator.png"
      bgImage="/images/evacuator_bg.jpg"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Срочный эвакуатор во Владивостоке круглосуточно</h1>
      <p className="mb-6 leading-relaxed">
        Неожиданная поломка или авария? Надежный <strong>эвакуатор во Владивостоке</strong> и <strong>эвакуация авто в Приморском крае</strong> от сервиса «Prim‑Uslugi» решат вашу проблему.
      </p>
      
      <h2 className="text-2xl font-bold mb-4 text-primary">Мы предлагаем:</h2>
      <ul className="list-disc pl-6 mb-8 space-y-3">
        <li><strong>Срочный эвакуатор</strong> и оперативный выезд бригады.</li>
        <li>Услуги доступны круглосуточно — <strong>эвакуатор 24 часа</strong> (включая <strong>ночной эвакуатор</strong>).</li>
        <li><strong>Безопасная эвакуация после ДТП</strong>.</li>
        <li>Помощь любой технике: от <strong>эвакуации мотоцикла</strong> до <strong>эвакуации грузового авто</strong>.</li>
        <li>В сложных ситуациях предоставляется <strong>эвакуатор с краном-манипулятором</strong>.</li>
      </ul>
      
      <p className="mb-8 leading-relaxed">
        Наша экстренная <strong>эвакуация авто</strong> — это фиксированная цена без доплат и гарантия сохранности вашего транспорта!
      </p>

      <div className="bg-accent/5 p-6 rounded-2xl flex items-center gap-4">
        <span className="text-2xl">🔗</span>
        <p className="text-lg font-medium text-primary">
          Нужна помощь в оформлении аварии? Вызовите нашего{' '}
          <Link href="/services/commissioner" className="text-accent underline hover:text-accent/80 transition-colors">
            Аварийного комиссара
          </Link>.
        </p>
      </div>
    </ServicePage>
  );
}
