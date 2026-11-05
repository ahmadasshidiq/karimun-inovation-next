import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import { Status } from "@prisma/client";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

import { recordAuditLog } from "@/lib/audit-log";
import {
  clearLoginFailures,
  getClientIp,
  getLoginBlockSeconds,
  recordLoginFailure,
} from "@/lib/login-rate-limit";
import { prisma } from "@/lib/prisma";

type LoginBody = {
  identifier?: unknown;
  password?: unknown;
  rememberMe?: unknown;
};

const unauthorizedResponse = () =>
  NextResponse.json(
    { message: "Login gagal. Silakan periksa kembali data Anda." },
    { status: 401 },
  );

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const identifier =
      typeof body.identifier === "string" ? body.identifier.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const rememberMe = body.rememberMe === true;

    if (!identifier || !password) {
      return unauthorizedResponse();
    }

    const ip = getClientIp(request);
    const blockSeconds = getLoginBlockSeconds(identifier, ip);

    if (blockSeconds > 0) {
      await recordAuditLog({
        request,
        action: "LOGIN_BLOCKED",
        entity: "login",
        metadata: { identifier },
      });
      return NextResponse.json(
        {
          message: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil(blockSeconds / 60)} menit.`,
        },
        { status: 429, headers: { "Retry-After": String(blockSeconds) } },
      );
    }

    const failed = async () => {
      recordLoginFailure(identifier, ip);
      await recordAuditLog({
        request,
        userId: user?.id,
        action: "LOGIN_FAILED",
        entity: "login",
        metadata: { identifier },
      });
      return unauthorizedResponse();
    };

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: identifier, mode: "insensitive" } },
          { email: { equals: identifier, mode: "insensitive" } },
        ],
      },
      include: {
        role: true,
        institution: {
          include: { nomenclature: true },
        },
      },
    });

    if (!user) {
      scryptSync(password, "invalid-login-salt", 64);
      return await failed();
    }

    if (user.status !== Status.ACTIVE || user.deletedAt) {
      return await failed();
    }

    const storedHash = Buffer.from(user.password, "hex");
    const submittedHash = scryptSync(password, user.salt, storedHash.length);

    if (
      storedHash.length === 0 ||
      storedHash.length !== submittedHash.length ||
      !timingSafeEqual(storedHash, submittedHash)
    ) {
      return await failed();
    }

    clearLoginFailures(identifier);
    await recordAuditLog({
      request,
      userId: user.id,
      action: "LOGIN",
      entity: "login",
      entityId: user.id,
    });

    const jwtSecret = process.env["JWT_SECRET"];

    if (!jwtSecret) {
      throw new Error("JWT_SECRET belum dikonfigurasi.");
    }

    const tokenLifetime = rememberMe ? "7d" : "1d";
    const token = await new SignJWT({
      username: user.username,
      roleId: user.roleId,
      role: user.role.name,
      institutionId: user.institutionId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setJti(randomUUID())
      .setIssuedAt()
      .setExpirationTime(tokenLifetime)
      .sign(new TextEncoder().encode(jwtSecret));

    await prisma.user.update({
      where: { id: user.id },
      data: { currentToken: token },
    });

    const response = NextResponse.json({
      message: "Login berhasil.",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role.name,
        permission: user.role.permission,
        institution: user.institution.name,
        nomenclature: user.institution.nomenclature.name,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Login gagal. Silakan coba kembali." },
      { status: 500 },
    );
  }
}
