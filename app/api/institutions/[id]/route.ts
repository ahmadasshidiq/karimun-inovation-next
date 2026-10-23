import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAuthenticatedUser())) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  const data = await prisma.institution.findFirst({ where: { id, deletedAt: null }, include: { nomenclature: { select: { id: true, name: true } }, _count: { select: { users: true, childInstitutions: true } } } });
  if (!data) return NextResponse.json({ message: "Instansi tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await getAuthenticatedUser())) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json()) as { name?: string; type?: string; nomenclatureId?: string; address?: string };
  if (!body.name?.trim() || !body.type?.trim() || !body.nomenclatureId) return NextResponse.json({ message: "Nama, tipe, dan nomenklatur wajib diisi." }, { status: 400 });
  try { const data = await prisma.institution.update({ where: { id }, data: { name: body.name.trim(), type: body.type.trim(), nomenclatureId: body.nomenclatureId, address: body.address?.trim() || null } }); return NextResponse.json({ data }); }
  catch { return NextResponse.json({ message: "Instansi tidak ditemukan." }, { status: 404 }); }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await getAuthenticatedUser())) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  try { await prisma.institution.update({ where: { id }, data: { deletedAt: new Date(), status: "INACTIVE" } }); return NextResponse.json({ message: "Instansi berhasil dihapus." }); }
  catch { return NextResponse.json({ message: "Instansi tidak ditemukan atau masih digunakan." }, { status: 400 }); }
}
