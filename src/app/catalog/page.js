import { defaultMetadata, siteUrl } from '@/lib/metadata';
import CatalogClient from './CatalogClient';

export const metadata = {
  ...defaultMetadata,
  title: 'Каталог услуг | Prim-Uslugi Владивосток',
  description: 'Полный каталог услуг во Владивостоке: грузоперевозки, грузчики, эвакуатор, сантехник, электрик, юрист, риэлтор, ремонт квартир. Цены, отзывы, вызов мастера.',
  keywords: [
    ...defaultMetadata.keywords,
    'каталог услуг', 'заказать услугу', 'вызвать мастера', 'найти мастера', 'список услуг',
  ],
  alternates: {
    canonical: `${siteUrl}/catalog`,
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Каталог услуг во Владивостоке | Prim-Uslugi',
    description: 'Более 9 направлений услуг для дома и бизнеса во Владивостоке. Быстрый выезд, фиксированные цены.',
    url: `${siteUrl}/catalog`,
  },
};

export default function CatalogPage() {
  return <CatalogClient />;
}
