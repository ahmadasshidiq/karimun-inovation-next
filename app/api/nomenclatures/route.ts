import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

export async function GET(request: NextRequest) {
  const access = await requirePermission("nomenclatures", "get-all");
  if (!access.user) return access.response;
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10));
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const where = { ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}) };
  const [data, total] = await Promise.all([
    prisma.nomenclature.findMany({ where, include: { _count: { select: { institutions: true } } }, orderBy: { name: "asc" }, skip: (page - 1) * limit, take: limit }),
    prisma.nomenclature.count({ where }),
  ]);
  return NextResponse.json({ data, total });
}

async function handlePost(request: NextRequest) {
  const access = await requirePermission("nomenclatures", "create");
  if (!access.user) return access.response;
  const body = (await request.json()) as { name?: string; description?: string };
  if (!body.name?.trim()) return NextResponse.json({ message: "Nama nomenklatur wajib diisi." }, { status: 400 });
  const data = await prisma.nomenclature.create({ data: { name: body.name.trim(), description: body.description?.trim() || null } });
  return NextResponse.json({ data }, { status: 201 });
}

export const POST = withAudit("nomenclatures", handlePost);
