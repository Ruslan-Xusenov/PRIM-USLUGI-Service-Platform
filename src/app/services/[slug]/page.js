import db from '@/lib/db';
import { notFound } from 'next/navigation';
import ServicePage from '@/components/ServicePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const url = `services/${slug}`;
  const page = db.prepare('SELECT title, seo_title, seo_description, seo_keywords FROM pages WHERE url = ?').get(url);

  if (!page) return {};

  const siteUrl = process.env.SITE_URL || 'https://prim-uslugi.ru';

  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: { canonical: `${siteUrl}/${url}` },
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description,
      url: `${siteUrl}/${url}`,
      siteName: 'Prim-Uslugi',
      locale: 'ru_RU',
      type: 'website',
    },
  };
}

export default async function DynamicServicePage({ params }) {
  const { slug } = await params;
  const url = `services/${slug}`;
  const page = db.prepare('SELECT * FROM pages WHERE url = ?').get(url);

  if (!page || !page.is_service) {
    notFound();
  }

  let details = [];
  try {
    details = page.details_json ? JSON.parse(page.details_json) : [];
  } catch (e) {
    console.error('Error parsing details_json:', e);
  }

  return (
    <ServicePage
      title={page.title}
      description={page.header_description}
      details={details}
      icon={page.icon_name}
      image={page.image_url}
      bgImage={page.bg_image_url}
      priceFrom={page.price_from}
      priceTo={page.price_to}
      duration={page.duration}
    >
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </ServicePage>
  );
}
