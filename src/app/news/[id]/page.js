import db from '@/lib/db';
import { defaultMetadata, siteUrl } from '@/lib/metadata';
import NewsDetailClient from './NewsDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  let newsItem = null;
  
  try {
    newsItem = db.prepare('SELECT title, content, image_url FROM news WHERE id = ?').get(id);
  } catch (e) {
    console.error('Error fetching news metadata:', e);
  }

  if (!newsItem) return { title: 'Новость не найдена | Prim-Uslugi' };

  // Create a short description from content
  const description = newsItem.content.substring(0, 150).replace(/\n/g, ' ') + '...';
  const url = `${siteUrl}/news/${id}`;

  return {
    ...defaultMetadata,
    title: `${newsItem.title} | Prim-Uslugi`,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: newsItem.title,
      description,
      url,
      images: newsItem.image_url ? [{ url: newsItem.image_url, width: 1200, height: 630 }] : defaultMetadata.openGraph.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: newsItem.title,
      description,
      images: newsItem.image_url ? [newsItem.image_url] : defaultMetadata.twitter.images,
    }
  };
}

export default function NewsPage() {
  return <NewsDetailClient />;
}
