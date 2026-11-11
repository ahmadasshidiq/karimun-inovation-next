import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { decodeJwt, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { withAudit } from "@/lib/audit-log";
import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  getClientIp,
  getLoginBlockSeconds,
  recordLoginFailure,
} from "@/lib/login-rate-limit";
import { getPasswordError } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const hashPassword = (password: string, salt: string, length = 64) =>
  scryptSync(password, salt, length);

const isPasswordMatch = (password: string, salt: string, storedHex: string) => {
  const stored = Buffer.from(storedHex, "hex");
  if (!stored.length) return false;
  const submitted = hashPassword(password, salt, stored.length);
  return timingSafeEqual(stored, submitted);
};

async function handlePut(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const currentPassword =
    typeof payload.currentPassword === "string" ? payload.currentPassword : "";
  const newPassword =
    typeof payload.newPassword === "string" ? payload.newPassword : "";
  const confirmPassword =
    typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json(
      {
        message:
          "Password lama, password baru, dan konfirmasi password wajib diisi.",
      },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);
  const blockSeconds = await getLoginBlockSeconds(user.username, ip);
  if (blockSeconds > 0) {
    return NextResponse.json(
      {
        message: `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(blockSeconds / 60)} menit.`,
      },
      { status: 429, headers: { "Retry-After": String(blockSeconds) } },
    );
  }

  if (!isPasswordMatch(currentPassword, user.salt, user.password)) {
    await recordLoginFailure(user.username, ip);
    return NextResponse.json(
      { message: "Password lama tidak sesuai." },
      { status: 400 },
    );
  }

  const passwordError = getPasswordError(newPassword);
  if (passwordError) {
    return NextResponse.json({ message: passwordError }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { message: "Konfirmasi password tidak sama." },
      { status: 400 },
    );
  }

  if (isPasswordMatch(newPassword, user.salt, user.password)) {
    return NextResponse.json(
      { message: "Password baru tidak boleh sama dengan password lama." },
      { status: 400 },
    );
  }

  const jwtSecret = process.env["JWT_SECRET"];
  const cookieStore = await cookies();
  const currentToken = cookieStore.get("auth_token")?.value;
  if (!jwtSecret || !currentToken) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const claims = decodeJwt(currentToken);
  const expiresAt = Number(claims.exp) || Math.floor(Date.now() / 1000) + 86400;
  const token = await new SignJWT({
    username: user.username,
    roleId: user.roleId,
    role: user.role.name,
    institutionId: user.institutionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(new TextEncoder().encode(jwtSecret));

  const salt = randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      salt,
      password: hashPassword(newPassword, salt).toString("hex"),
      currentToken: token,
    },
  });

  const response = NextResponse.json({ message: "Password berhasil diubah." });
  const remainingSeconds = expiresAt - Math.floor(Date.now() / 1000);
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remainingSeconds > 86400 ? { maxAge: remainingSeconds } : {}),
  });

  return response;
}

export const PUT = withAudit("session/password", handlePut);
