// Server Component wrapper — exports metadata for the home page
import { defaultMetadata, siteUrl } from '@/lib/metadata';
import HomeClient from './HomeClient';

export const metadata = {
  ...defaultMetadata,
  title: 'Prim-Uslugi — Услуги во Владивостоке 24/7 | Грузоперевозки, Ремонт, Юрист',
  description: 'Заказывайте профессиональные услуги во Владивостоке: грузоперевозки, грузчики, эвакуатор, сантехник, электрик, ремонт квартир, юридические услуги, риэлтор. Выезд за 30 мин. Работаем 24/7.',
  keywords: [
    'услуги Владивосток', 'Prim-Uslugi', 'грузоперевозки Владивосток',
    'грузчики Владивосток', 'эвакуатор Владивосток 24/7', 'сантехник Владивосток срочно',
    'электрик Владивосток', 'ремонт квартир Владивосток под ключ',
    'юридические услуги Владивосток', 'частный риэлтор Владивосток',
    'услуги Приморский край', 'мастер на час Владивосток',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Prim-Uslugi — Услуги во Владивостоке 24/7',
    description: 'Грузоперевозки, сантехник, электрик, ремонт, юрист, риэлтор — профессионалы Приморья. Выезд за 30 минут.',
    url: siteUrl,
    images: [{ url: '/images/banner.png', width: 1200, height: 630, alt: 'Prim-Uslugi — сервисная платформа Приморья' }],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
