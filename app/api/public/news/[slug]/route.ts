import { NextRequest } from "next/server";

import { publicNewsWhere, toPublicNews } from "@/lib/public-news";
import { prisma } from "@/lib/prisma";
import { checkPublicApiRateLimit, methodNotAllowed, optionsResponse, publicJson } from "@/lib/public-api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const rateLimitResponse = checkPublicApiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const { slug } = await params;
    const news = await prisma.news.findFirst({ where: { ...publicNewsWhere(), slug }, select: { id: true, title: true, slug: true, excerpt: true, content: true, coverImage: true, category: true, categoryRef: { select: { name: true } }, type: true, eventDate: true, isFeatured: true, publishedAt: true } });
    if (!news) return publicJson(request, { success: false, message: "Berita tidak ditemukan." }, { status: 404 });
    return publicJson(request, { success: true, data: toPublicNews(news) });
  } catch (error) {
    console.error("Public news detail error:", error);
    return publicJson(request, { success: false, message: "Gagal mengambil berita." }, { status: 500 });
  }
}

export const OPTIONS = optionsResponse;
export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
