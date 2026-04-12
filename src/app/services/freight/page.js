import ServicePage from '../../../components/ServicePage';
import { Truck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Грузоперевозки во Владивостоке и Приморском крае | Недорого 24/7',
  description: 'Заказать грузоперевозки в Приморском крае. Перевозка грузов любой сложности, межгород, опытные водители. Фиксированная цена.',
};

export default function FreightPage() {
  const details = [
    { title: 'Городские перевозки', text: 'Оперативная доставка грузов по Владивостоку и другим городам края.' },
    { title: 'Междугородние рейсы', text: 'Перевозки по всему Приморскому краю с гарантией соблюдения сроков.' },
    { title: 'Разнообразие транспорта', text: 'В нашем парке машины различной грузоподъемности под любые задачи.' },
    { title: 'Страхование грузов', text: 'Мы несем полную материальную ответственность за сохранность вашего имущества.' }
  ];

  return (
    <ServicePage 
      title="Грузоперевозки" 
      image="/images/banner_freight.png"
      description="Интеллектуальная логистика для ваших грузов. Мы обеспечиваем полную прозрачность, безопасность и своевременную доставку по всему Дальнему Востоку."
      details={details}
      icon={<Truck size={32} />}
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Профессиональные грузоперевозки во Владивостоке и Приморском крае</h1>
      <p className="mb-6 leading-relaxed">
        Ищете надежный способ доставить вещи или товары? Сервис «Prim‑Uslugi» осуществляет <strong>грузоперевозки во Владивостоке</strong> и по всему Приморскому краю. Мы организуем перевозку грузов по Приморью любой сложности: от домашних переездов до коммерческих поставок.
      </p>
      
      <h2 className="text-2xl font-bold mb-4 text-primary">Наши преимущества:</h2>
      <ul className="list-disc pl-6 mb-8 space-y-3">
        <li><strong>Грузоперевозки недорого</strong> и с прозрачным ценообразованием.</li>
        <li>Осуществляем <strong>межгородские грузоперевозки</strong> (Уссурийск, Находка, Артем и другие города).</li>
        <li>Доступна <strong>перевозка хрупких грузов</strong> и <strong>перевозка негабаритных грузов</strong>.</li>
        <li>Выполняем <strong>доставку грузов любой сложности</strong> с оформлением страховки.</li>
        <li>Работаем круглосуточно — <strong>грузоперевозки 24/7</strong>.</li>
      </ul>

      <div className="bg-accent/5 p-6 rounded-2xl flex items-center gap-4">
        <span className="text-2xl">🔗</span>
        <p className="text-lg font-medium text-primary">
          Нужна помощь с погрузкой? Закажите наши{' '}
          <Link href="/services/loaders" className="text-accent underline hover:text-accent/80 transition-colors">
            услуги профессиональных грузчиков
          </Link>.
        </p>
      </div>
    </ServicePage>
  );
}
