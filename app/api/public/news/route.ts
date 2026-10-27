import { NextRequest } from "next/server";

import { publicNewsWhere, toPublicNews } from "@/lib/public-news";
import { prisma } from "@/lib/prisma";
import { checkPublicApiRateLimit, methodNotAllowed, optionsResponse, publicJson } from "@/lib/public-api";

const positiveInteger = (value: string | null, fallback: number, maximum: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
};

export async function GET(request: NextRequest) {
  const rateLimitResponse = checkPublicApiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const page = positiveInteger(request.nextUrl.searchParams.get("page"), 1, Number.MAX_SAFE_INTEGER);
    const limit = positiveInteger(request.nextUrl.searchParams.get("limit"), 10, 50);
    const search = request.nextUrl.searchParams.get("search")?.trim() || "";
    const where = { ...publicNewsWhere(), ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}) };
    const [records, total] = await Promise.all([
      prisma.news.findMany({ where, select: { id: true, title: true, slug: true, excerpt: true, content: true, coverImage: true, category: true, categoryRef: { select: { name: true } }, type: true, eventDate: true, isFeatured: true, publishedAt: true }, orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }], skip: (page - 1) * limit, take: limit }),
      prisma.news.count({ where }),
    ]);
    return publicJson(request, { success: true, data: records.map(toPublicNews), meta: { page, limit, total } });
  } catch (error) {
    console.error("Public news list error:", error);
    return publicJson(request, { success: false, message: "Gagal mengambil berita." }, { status: 500 });
  }
}

export const OPTIONS = optionsResponse;
export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
