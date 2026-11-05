import { NextRequest, NextResponse } from "next/server";
import { clientErrorMessage } from "@/lib/api-error";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { slugifyNewsCategory } from "@/lib/news-category";
import { NEWS_PERMISSION } from "@/lib/news";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

const canManage = async () => { const user = await getAuthenticatedUser(); return user && hasPermission(user.role.permission, NEWS_PERMISSION.model, NEWS_PERMISSION.action); };
const uniqueSlug = async (base: string, exceptId: string) => { let candidate = base || "kategori"; let suffix = 2; while (await prisma.newsCategoryEntity.findFirst({ where: { slug: candidate, id: { not: exceptId } }, select: { id: true } })) candidate = `${base.slice(0, 115)}-${suffix++}`; return candidate; };

async function handlePut(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await canManage())) return NextResponse.json({ message: "Tidak memiliki akses kategori berita." }, { status: 403 });
  try { const { id } = await params; const payload = await request.json() as { name?: unknown; isActive?: unknown }; const name = typeof payload.name === "string" ? payload.name.trim() : ""; if (!name) throw new Error("Nama kategori wajib diisi."); const category = await prisma.newsCategoryEntity.update({ where: { id }, data: { name, slug: await uniqueSlug(slugifyNewsCategory(name), id), isActive: payload.isActive !== false } }); return NextResponse.json({ message: "Kategori berhasil diperbarui.", data: category }); } catch (error) { return NextResponse.json({ message: clientErrorMessage(error, "Gagal memperbarui kategori.") }, { status: 400 }); }
}

async function handleDelete(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await canManage())) return NextResponse.json({ message: "Tidak memiliki akses kategori berita." }, { status: 403 });
  const { id } = await params;
  const category = await prisma.newsCategoryEntity.findUnique({ where: { id }, include: { _count: { select: { news: true } } } });
  if (!category) return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
  await prisma.newsCategoryEntity.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ message: category._count.news ? "Kategori sedang dipakai berita dan telah dinonaktifkan." : "Kategori dinonaktifkan." });
}

export const PUT = withAudit("news-categories/[id]", handlePut);
export const DELETE = withAudit("news-categories/[id]", handleDelete);
