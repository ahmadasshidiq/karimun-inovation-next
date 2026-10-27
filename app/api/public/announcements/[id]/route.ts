import { NextRequest } from "next/server";

import {
  checkPublicApiRateLimit,
  methodNotAllowed,
  optionsResponse,
  publicJson,
} from "@/lib/public-api";
import { prisma } from "@/lib/prisma";
import { sanitizeAnnouncementContent } from "@/lib/helper/announcement-content";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimitResponse = checkPublicApiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await params;
    if (!isUuid(id)) {
      return publicJson(
        request,
        { success: false, message: "Pengumuman tidak ditemukan." },
        { status: 404 },
      );
    }

    const announcement = await prisma.announcement.findFirst({
      where: { id, status: "ACTIVE", deletedAt: null },
      select: {
        id: true,
        title: true,
        content: true,
        announcementDate: true,
      },
    });

    if (!announcement) {
      return publicJson(
        request,
        { success: false, message: "Pengumuman tidak ditemukan." },
        { status: 404 },
      );
    }

    return publicJson(request, {
      success: true,
      data: {
        id: announcement.id,
        title: announcement.title,
        content: sanitizeAnnouncementContent(announcement.content),
        announcementDate: announcement.announcementDate.toISOString().slice(0, 10),
      },
    });
  } catch (error) {
    console.error("Public announcement detail error:", error);
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
