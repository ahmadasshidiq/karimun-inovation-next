import { randomBytes, scryptSync } from "node:crypto";

import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

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

export async function GET(request: NextRequest) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10),
  );
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const status = request.nextUrl.searchParams.get("status");
  const roleId = request.nextUrl.searchParams.get("roleId") || "";

  const where = {
    deletedAt: null,
    ...(status === Status.ACTIVE || status === Status.INACTIVE
      ? { status }
      : {}),
    ...(roleId ? { roleId } : {}),
    ...(search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" as const } },
            { fullname: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { nip: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [data, total, roles, institutions] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { fullname: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
    prisma.role.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.institution.findMany({
      where: { deletedAt: null, status: Status.ACTIVE },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({ data, total, options: { roles, institutions } });
}

export async function POST(request: NextRequest) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const username = typeof payload.username === "string" ? payload.username.trim() : "";
  const fullname = typeof payload.fullname === "string" ? payload.fullname.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const roleId = typeof payload.roleId === "string" ? payload.roleId : "";
  const institutionId =
    typeof payload.institutionId === "string" ? payload.institutionId : "";

  if (!username || !fullname || !password || !roleId || !institutionId) {
    return NextResponse.json(
      { message: "Username, nama lengkap, password, role, dan instansi wajib diisi." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password minimal 8 karakter." },
      { status: 400 },
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
      OR: [
        { username: { equals: username, mode: "insensitive" } },
        ...(email ? [{ email: { equals: email, mode: "insensitive" as const } }] : []),
        ...(nip ? [{ nip }] : []),
      ],
    },
    select: { username: true, email: true, nip: true },
  });
  if (duplicate) {
    return NextResponse.json(
      { message: "Username, email, atau NIP sudah digunakan." },
      { status: 409 },
    );
  }

  const salt = randomBytes(32).toString("hex");
  const user = await prisma.user.create({
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
      salt,
      password: hashPassword(password, salt),
    },
    select: userSelect,
  });

  return NextResponse.json(
    { message: "Akun berhasil dibuat.", data: user },
    { status: 201 },
  );
}
