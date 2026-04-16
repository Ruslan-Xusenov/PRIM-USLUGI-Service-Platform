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

  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
    keywords: page.seo_keywords,
  };
}

export default async function DynamicServicePage({ params }) {
  const { slug } = await params;
  const url = `services/${slug}`;
  const page = db.prepare('SELECT * FROM pages WHERE url = ?').get(url);

  if (!page || !page.is_service) {
    notFound();
  }

  // Parse details from JSON
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
    >
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </ServicePage>
  );
}
