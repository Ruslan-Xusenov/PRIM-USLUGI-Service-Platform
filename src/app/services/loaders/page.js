import ServicePage from '../../../components/ServicePage';
import { Hammer } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Услуги грузчиков во Владивостоке | Грузчики на час недорого',
  description: 'Профессиональные грузчики в Приморском крае. Помощь при переезде, сборка мебели, такелажные работы. Выезд за 30 минут!',
};

export default function LoadersPage() {
  const details = [
    { title: 'Квартирные переезды', text: 'Аккуратная упаковка, погрузка и расстановка мебели на новом месте.' },
    { title: 'Офисные переезды', text: 'Быстрый переезд вашего бизнеса с минимальным простоем в работе.' },
    { title: 'Складские работы', text: 'Помощь в организации хранения, разгрузка фур и контейнеров.' },
    { title: 'Такелажные работы', text: 'Перенос тяжелых и негабаритных предметов: пианино, сейфы, станки.' }
  ];

  return (
    <ServicePage 
      title="Услуги грузчиков" 
      description="Комплексные решения для квартирных, офисных и промышленных переездов. Наша команда работает быстро, слаженно и с полной ответственностью за результат."
      details={details}
      icon={<Hammer size={32} />}
      image="/images/IMG_0511.jpg"
      bgMobileImage="/images/loaders_mobile_bg.jpg"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Услуги грузчиков во Владивостоке: быстрый переезд и погрузка</h1>
      <p className="mb-6 leading-relaxed">
        Требуется физическая помощь? Предоставляем опытные бригады: <strong>грузчики во Владивостоке</strong> и Приморском крае готовы выехать к вам за 30 минут.
      </p>
      
      <h2 className="text-2xl font-bold mb-4 text-primary">Что мы предлагаем:</h2>
      <ul className="list-disc pl-6 mb-8 space-y-3">
        <li>Оперативные <strong>грузчики на час</strong> для любых задач.</li>
        <li><strong>Быстрый переезд с грузчиками</strong> под ключ.</li>
        <li>Аккуратная <strong>погрузка/разгрузка машин</strong>, вагонов и складов.</li>
        <li><strong>Сбор и разборка мебели</strong>, а также <strong>вывоз старой мебели</strong>.</li>
        <li>Сложные <strong>такелажные работы</strong> (перемещение сейфов, пианино, оборудования).</li>
      </ul>
      
      <p className="mb-8 leading-relaxed">
        Наши профессиональные грузчики гарантируют сохранность ваших вещей. Оказываем комплексную помощь при переезде по всему Приморью.
      </p>

      <div className="bg-accent/5 p-6 rounded-2xl flex items-center gap-4">
        <span className="text-2xl">🔗</span>
        <p className="text-lg font-medium text-primary">
          Требуется транспорт для вещей? Перейдите в раздел{' '}
          <Link href="/services/freight" className="text-accent underline hover:text-accent/80 transition-colors">
            Грузоперевозки
          </Link>.
        </p>
      </div>
    </ServicePage>
  );
}
