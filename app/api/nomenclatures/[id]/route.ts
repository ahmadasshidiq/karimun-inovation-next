import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requirePermission("nomenclatures", "get-by-id");
  if (!access.user) return access.response;
  const { id } = await context.params;
  const data = await prisma.nomenclature.findFirst({ where: { id }, include: { _count: { select: { institutions: true } } } });
  if (!data) return NextResponse.json({ message: "Nomenklatur tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data });
}

async function handlePut(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await requirePermission("nomenclatures", "update");
  if (!access.user) return access.response;
  const { id } = await context.params;
  const body = (await request.json()) as { name?: string; description?: string };
  if (!body.name?.trim()) return NextResponse.json({ message: "Nama nomenklatur wajib diisi." }, { status: 400 });
  try { const data = await prisma.nomenclature.update({ where: { id }, data: { name: body.name.trim(), description: body.description?.trim() || null } }); return NextResponse.json({ data }); }
  catch { return NextResponse.json({ message: "Nomenklatur tidak ditemukan." }, { status: 404 }); }
}

async function handleDelete(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await requirePermission("nomenclatures", "delete");
  if (!access.user) return access.response;
  const { id } = await context.params;
  try { await prisma.nomenclature.delete({ where: { id } }); return NextResponse.json({ message: "Nomenklatur berhasil dihapus." }); }
  catch { return NextResponse.json({ message: "Nomenklatur tidak ditemukan atau masih digunakan." }, { status: 400 }); }
}

export const PUT = withAudit("nomenclatures/[id]", handlePut);
export const DELETE = withAudit("nomenclatures/[id]", handleDelete);
