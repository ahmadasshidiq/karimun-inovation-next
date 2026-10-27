import { NextRequest } from "next/server";

import {
  checkPublicApiRateLimit,
  methodNotAllowed,
  optionsResponse,
  publicJson,
} from "@/lib/public-api";
import { prisma } from "@/lib/prisma";
import { sanitizeAnnouncementContent } from "@/lib/helper/announcement-content";

const toPlainText = (content: string) =>
  sanitizeAnnouncementContent(content)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toPublicAnnouncement = (announcement: {
  id: string;
  title: string;
  content: string;
  announcementDate: Date;
}) => {
  const content = sanitizeAnnouncementContent(announcement.content);
  const plainText = toPlainText(announcement.content);

  return {
    id: announcement.id,
    title: announcement.title,
    summary: plainText.slice(0, 240),
    content,
    announcementDate: announcement.announcementDate.toISOString().slice(0, 10),
  };
};

const parsePositiveInteger = (value: string | null, fallback: number, max: number) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

export async function GET(request: NextRequest) {
  const rateLimitResponse = checkPublicApiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const page = parsePositiveInteger(request.nextUrl.searchParams.get("page"), 1, Number.MAX_SAFE_INTEGER);
    const limit = parsePositiveInteger(request.nextUrl.searchParams.get("limit"), 10, 50);
    const search = request.nextUrl.searchParams.get("search")?.trim() || "";
    const where = {
      status: "ACTIVE" as const,
      deletedAt: null,
      ...(search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {}),
    };

    const [records, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        select: {
          id: true,
          title: true,
          content: true,
          announcementDate: true,
        },
        orderBy: [{ announcementDate: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.announcement.count({ where }),
    ]);

    return publicJson(request, {
      success: true,
      data: records.map(toPublicAnnouncement),
      meta: { page, limit, total },
    });
  } catch (error) {
    console.error("Public announcement list error:", error);
    return publicJson(
      request,
      { success: false, message: "Gagal mengambil pengumuman." },
      { status: 500 },
    );
  }
}

export const OPTIONS = optionsResponse;
export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
