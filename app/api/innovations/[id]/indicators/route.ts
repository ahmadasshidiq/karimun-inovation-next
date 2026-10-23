import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationOwnerScope } from "@/lib/innovation-access";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  const data = await prisma.innovationIndicatorAssessment.findMany({
    where: {
      innovationId: id,
      innovation: {
        deletedAt: null,
        ...innovationOwnerScope(user),
      },
    },
    include: { documents: { orderBy: { createdAt: "asc" } } },
    orderBy: { indicatorId: "asc" },
  });

  return NextResponse.json({
    data: data.map((item) => ({
      indicatorId: item.indicatorId,
      parameter: item.parameter,
      score: Number(item.score),
      documents: item.documents.map((document) => ({
        id: document.id,
        documentNumber: document.documentNumber || "",
        documentDate: document.documentDate?.toISOString().slice(0, 10) || "",
        documentTitle: document.documentTitle,
        originalName: document.originalName,
        url: document.url,
        mimeType: document.mimeType,
        size: document.size,
      })),
    })),
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  const payload = (await request.json()) as {
    indicatorId?: number;
    parameter?: string;
    score?: number;
  };
  if (!payload.indicatorId || !payload.parameter?.trim())
    return NextResponse.json({ message: "Parameter indikator tidak valid." }, { status: 400 });

  const innovation = await prisma.innovation.findFirst({
    where: {
      id,
      deletedAt: null,
      ...innovationOwnerScope(user),
    },
    select: { id: true },
  });
  if (!innovation)
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  const assessment = await prisma.innovationIndicatorAssessment.upsert({
    where: {
      innovationId_indicatorId: { innovationId: id, indicatorId: payload.indicatorId },
    },
    create: {
      innovationId: id,
      indicatorId: payload.indicatorId,
      parameter: payload.parameter.trim(),
      score: Number(payload.score) || 0,
    },
    update: {
      parameter: payload.parameter.trim(),
      score: Number(payload.score) || 0,
    },
  });

  return NextResponse.json({ message: "Parameter berhasil disimpan.", data: assessment });
}
