import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAuthenticatedUser())) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  const data = await prisma.nomenclature.findFirst({ where: { id }, include: { _count: { select: { institutions: true } } } });
  if (!data) return NextResponse.json({ message: "Nomenklatur tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await getAuthenticatedUser())) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json()) as { name?: string; description?: string };
  if (!body.name?.trim()) return NextResponse.json({ message: "Nama nomenklatur wajib diisi." }, { status: 400 });
  try { const data = await prisma.nomenclature.update({ where: { id }, data: { name: body.name.trim(), description: body.description?.trim() || null } }); return NextResponse.json({ data }); }
  catch { return NextResponse.json({ message: "Nomenklatur tidak ditemukan." }, { status: 404 }); }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await getAuthenticatedUser())) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  try { await prisma.nomenclature.delete({ where: { id } }); return NextResponse.json({ message: "Nomenklatur berhasil dihapus." }); }
  catch { return NextResponse.json({ message: "Nomenklatur tidak ditemukan atau masih digunakan." }, { status: 400 }); }
}
