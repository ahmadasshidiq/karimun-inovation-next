import { calculateReadingTime, sanitizeNewsContent } from "@/lib/news";
import { legacyCategoryLabel } from "@/lib/news-category";

export const toPublicNews = (news: {
  id: string; title: string; slug: string; excerpt: string; content: string;
  coverImage: string | null; category: string; categoryRef: { name: string } | null; type: string; eventDate: Date | null;
  isFeatured: boolean; publishedAt: Date | null;
}) => {
  const content = sanitizeNewsContent(news.content);
  return {
    id: news.id,
    title: news.title,
    slug: news.slug,
    excerpt: news.excerpt,
    content,
    coverImage: news.coverImage,
    category: news.categoryRef?.name || legacyCategoryLabel(news.category),
    type: news.type,
    eventDate: news.eventDate?.toISOString().slice(0, 10) || null,
    isFeatured: news.isFeatured,
    publishedAt: news.publishedAt?.toISOString() || null,
    readingTime: calculateReadingTime(content),
  };
};

export const publicNewsWhere = (now = new Date()) => ({
  status: "PUBLISHED" as const,
  deletedAt: null,
  publishedAt: { not: null, lte: now },
});
