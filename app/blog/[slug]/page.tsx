import { notFound } from 'next/navigation';
import { getPost, POSTS } from '@/lib/posts';
import { ArticleClient } from './ArticleClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — parsnipcrawl.dev` };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <ArticleClient post={post} />;
}
