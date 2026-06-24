import db from '@/lib/db';

export default async function sitemap() {
  const siteUrl = process.env.SITE_URL || 'https://prim-uslugi.ru';

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/catalog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/services/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/services/personal-data`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  let servicePages = [];
  try {
    const services = db.prepare('SELECT url, updated_at FROM pages WHERE is_service = 1').all();
    servicePages = services.map(s => ({
      url: `${siteUrl}/${s.url}`,
      lastModified: new Date(s.updated_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch (e) {
    console.error('Sitemap error:', e);
  }

  return [...staticPages, ...servicePages];
}
