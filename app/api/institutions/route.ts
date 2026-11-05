import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

export async function GET(request: NextRequest) {
  const access = await requirePermission("institutions", "get-all");
  if (!access.user) return access.response;
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10));
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const where = { deletedAt: null, ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}) };
  const [data, total, nomenclatures] = await Promise.all([
    prisma.institution.findMany({ where, include: { nomenclature: { select: { id: true, name: true } }, _count: { select: { users: true } } }, orderBy: { name: "asc" }, skip: (page - 1) * limit, take: limit }),
    prisma.institution.count({ where }),
    prisma.nomenclature.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return NextResponse.json({ data, total, options: { nomenclatures } });
}

async function handlePost(request: NextRequest) {
  const access = await requirePermission("institutions", "create");
  if (!access.user) return access.response;
  const body = (await request.json()) as { name?: string; type?: string; nomenclatureId?: string; address?: string };
  if (!body.name?.trim() || !body.type?.trim() || !body.nomenclatureId) return NextResponse.json({ message: "Nama, tipe, dan nomenklatur wajib diisi." }, { status: 400 });
  const data = await prisma.institution.create({ data: { name: body.name.trim(), type: body.type.trim(), nomenclatureId: body.nomenclatureId, address: body.address?.trim() || null } });
  return NextResponse.json({ data }, { status: 201 });
}

export const POST = withAudit("institutions", handlePost);
