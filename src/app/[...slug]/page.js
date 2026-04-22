import db from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = db.prepare('SELECT title, seo_title, seo_description, seo_keywords FROM pages WHERE url = ?').get(slugPath);

  if (!page) return {};

  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
    keywords: page.seo_keywords,
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = db.prepare('SELECT * FROM pages WHERE url = ?').get(slugPath);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-main pt-32 pb-20">
      <div className="container px-6">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            {page.title}
          </h1>
          <div className="w-24 h-1 bg-accent rounded-full"></div>
        </header>

        <article 
          className="prose prose-invert prose-lg max-w-none 
            prose-p:text-grey-400 prose-p:leading-relaxed 
            prose-headings:text-white prose-headings:font-bold 
            prose-strong:text-white prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-3xl prose-img:shadow-2xl"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none -z-10 overflow-hidden">
        <div className="shape-blob top-1/4 -left-20 bg-blue-500/5"></div>
        <div className="shape-blob bottom-1/4 -right-20 bg-purple-500/5"></div>
      </div>
    </div>
  );
}
