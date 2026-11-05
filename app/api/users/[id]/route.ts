import { randomBytes, scryptSync } from "node:crypto";

import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { canManageRole, requirePermission } from "@/lib/auth-user";
import { getPasswordError } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

const hashPassword = (password: string, salt: string) =>
  scryptSync(password, salt, 64).toString("hex");

const userSelect = {
  id: true,
  roleId: true,
  institutionId: true,
  username: true,
  email: true,
  fullname: true,
  nip: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  role: { select: { id: true, name: true } },
  institution: { select: { id: true, name: true } },
} as const;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requirePermission("users", "get-by-id");
  if (!access.user) return access.response;
  const { id } = await context.params;
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: userSelect,
  });
  if (!user) {
    return NextResponse.json({ message: "Akun tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ data: user });
}

async function handlePut(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requirePermission("users", "update");
  if (!access.user) return access.response;
  const { id } = await context.params;
  const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return NextResponse.json({ message: "Akun tidak ditemukan." }, { status: 404 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const username = typeof payload.username === "string" ? payload.username.trim() : "";
  const fullname = typeof payload.fullname === "string" ? payload.fullname.trim() : "";
  const roleId = typeof payload.roleId === "string" ? payload.roleId : "";
  const institutionId =
    typeof payload.institutionId === "string" ? payload.institutionId : "";
  if (!username || !fullname || !roleId || !institutionId) {
    return NextResponse.json(
      { message: "Username, nama lengkap, role, dan instansi wajib diisi." },
      { status: 400 },
    );
  }
  if (!(await canManageRole(access.user, [existing.roleId, roleId]))) {
    return NextResponse.json(
      { message: "Hanya Super Admin yang dapat mengelola akun dengan role tersebut." },
      { status: 403 },
    );
  }

  const email = typeof payload.email === "string" && payload.email.trim()
    ? payload.email.trim().toLowerCase()
    : null;
  const nip = typeof payload.nip === "string" && payload.nip.trim()
    ? payload.nip.trim()
    : null;
  const duplicate = await prisma.user.findFirst({
    where: {
      id: { not: id },
      OR: [
        { username: { equals: username, mode: "insensitive" } },
        ...(email ? [{ email: { equals: email, mode: "insensitive" as const } }] : []),
        ...(nip ? [{ nip }] : []),
      ],
    },
    select: { id: true },
  });
  if (duplicate) {
    return NextResponse.json(
      { message: "Username, email, atau NIP sudah digunakan." },
      { status: 409 },
    );
  }

  const newPassword = typeof payload.password === "string" ? payload.password : "";
  const passwordError = newPassword ? getPasswordError(newPassword) : null;
  if (passwordError) {
    return NextResponse.json({ message: passwordError }, { status: 400 });
  }
  const salt = newPassword ? randomBytes(32).toString("hex") : null;
  const user = await prisma.user.update({
    where: { id },
    data: {
      username,
      fullname,
      email,
      nip,
      phone: typeof payload.phone === "string" && payload.phone.trim()
        ? payload.phone.trim()
        : null,
      roleId,
      institutionId,
      status: payload.status === Status.INACTIVE ? Status.INACTIVE : Status.ACTIVE,
      ...(newPassword && salt
        ? { password: hashPassword(newPassword, salt), salt, currentToken: null }
        : {}),
    },
    select: userSelect,
  });

  return NextResponse.json({ message: "Akun berhasil diperbarui.", data: user });
}

async function handleDelete(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requirePermission("users", "delete");
  if (!access.user) return access.response;
  const authenticatedUser = access.user;
  const { id } = await context.params;
  if (authenticatedUser.id === id) {
    return NextResponse.json(
      { message: "Akun yang sedang digunakan tidak dapat dihapus." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { roleId: true },
  });
  if (target && !(await canManageRole(authenticatedUser, [target.roleId]))) {
    return NextResponse.json(
      { message: "Hanya Super Admin yang dapat mengelola akun dengan role tersebut." },
      { status: 403 },
    );
  }

  const result = await prisma.user.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date(), status: Status.INACTIVE, currentToken: null },
  });
  if (!result.count) {
    return NextResponse.json({ message: "Akun tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ message: "Akun berhasil dihapus." });
}

export const PUT = withAudit("users/[id]", handlePut);
export const DELETE = withAudit("users/[id]", handleDelete);
