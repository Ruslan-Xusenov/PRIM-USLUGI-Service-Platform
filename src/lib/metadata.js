// SEO metadata for all pages - exported from separate file
// because layout.js is a Client Component

export const siteUrl = process.env.SITE_URL || 'https://prim-uslugi.ru';

export const defaultMetadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Prim-Uslugi — Услуги во Владивостоке и Приморском крае 24/7',
    template: '%s | Prim-Uslugi Владивосток',
  },
  description: 'Профессиональные услуги во Владивостоке и Приморском крае: грузоперевозки, грузчики, эвакуатор, сантехник, электрик, ремонт квартир, юридические услуги, частный риэлтор. Работаем 24/7.',
  keywords: [
    'услуги Владивосток', 'грузоперевозки Владивосток', 'грузчики Владивосток',
    'эвакуатор Владивосток', 'сантехник Владивосток', 'электрик Владивосток',
    'ремонт квартир Владивосток', 'юридические услуги Владивосток',
    'риэлтор Владивосток', 'Приморский край услуги', 'Prim-Uslugi',
  ],
  authors: [{ name: 'Prim-Uslugi', url: siteUrl }],
  creator: 'Prim-Uslugi',
  publisher: 'Prim-Uslugi',
  category: 'Услуги',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: 'Prim-Uslugi',
    title: 'Prim-Uslugi — Услуги во Владивостоке 24/7',
    description: 'Профессиональные услуги во Владивостоке: грузоперевозки, сантехник, электрик, ремонт, юрист, риэлтор. Быстрый выезд 24/7.',
    images: [
      {
        url: '/images/banner.png',
        width: 1200,
        height: 630,
        alt: 'Prim-Uslugi — сервисная платформа Приморского края',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prim-Uslugi — Услуги во Владивостоке 24/7',
    description: 'Грузоперевозки, сантехник, электрик, ремонт, юрист, риэлтор во Владивостоке. Выезд за 30 мин.',
    images: ['/images/banner.png'],
  },
  alternates: {
    canonical: siteUrl,
    languages: { 'ru-RU': siteUrl },
  },
  verification: {
    // yandex: 'ВАШ_КОД_ВЕРИФИКАЦИИ', // Добавьте код Яндекс Вебмастера
  },
  icons: {
    icon: '/images/logo_premium.png',
    apple: '/images/logo_premium.png',
    shortcut: '/images/logo_premium.png',
  },
  manifest: '/manifest.json',
};
