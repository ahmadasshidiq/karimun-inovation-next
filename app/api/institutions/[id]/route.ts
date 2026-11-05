import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requirePermission("institutions", "get-by-id");
  if (!access.user) return access.response;
  const { id } = await context.params;
  const data = await prisma.institution.findFirst({ where: { id, deletedAt: null }, include: { nomenclature: { select: { id: true, name: true } }, _count: { select: { users: true, childInstitutions: true } } } });
  if (!data) return NextResponse.json({ message: "Instansi tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data });
}

async function handlePut(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await requirePermission("institutions", "update");
  if (!access.user) return access.response;
  const { id } = await context.params;
  const body = (await request.json()) as { name?: string; type?: string; nomenclatureId?: string; address?: string };
  if (!body.name?.trim() || !body.type?.trim() || !body.nomenclatureId) return NextResponse.json({ message: "Nama, tipe, dan nomenklatur wajib diisi." }, { status: 400 });
  try { const data = await prisma.institution.update({ where: { id }, data: { name: body.name.trim(), type: body.type.trim(), nomenclatureId: body.nomenclatureId, address: body.address?.trim() || null } }); return NextResponse.json({ data }); }
  catch { return NextResponse.json({ message: "Instansi tidak ditemukan." }, { status: 404 }); }
}

async function handleDelete(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await requirePermission("institutions", "delete");
  if (!access.user) return access.response;
  const { id } = await context.params;
  try { await prisma.institution.update({ where: { id }, data: { deletedAt: new Date(), status: "INACTIVE" } }); return NextResponse.json({ message: "Instansi berhasil dihapus." }); }
  catch { return NextResponse.json({ message: "Instansi tidak ditemukan atau masih digunakan." }, { status: 400 }); }
}

export const PUT = withAudit("institutions/[id]", handlePut);
export const DELETE = withAudit("institutions/[id]", handleDelete);
