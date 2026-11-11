import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { NextResponse } from "next/server";

import { allowedInnovationCategory } from "@/lib/innovation-category";
import { MFA_CHALLENGE_COOKIE, MFA_CHALLENGE_SECONDS } from "@/lib/mfa";
import { prisma } from "@/lib/prisma";

export type SessionUser = Prisma.UserGetPayload<{
  include: { role: true; institution: { include: { nomenclature: true } } };
}>;

const jwtKey = () => {
  const jwtSecret = process.env["JWT_SECRET"];
  if (!jwtSecret) throw new Error("JWT_SECRET belum dikonfigurasi.");
  return new TextEncoder().encode(jwtSecret);
};

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export const toSessionData = (user: SessionUser) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  fullname: user.fullname,
  role: user.role.name,
  permission: user.role.permission,
  institution: user.institution.name,
  nomenclature: user.institution.nomenclature.name,
  innovationCategory: allowedInnovationCategory(
    user.institution.nomenclatureId,
  ),
  mfaEnabled: Boolean(user.mfaEnabledAt),
});

export async function createSessionResponse(
  user: SessionUser,
  rememberMe: boolean,
) {
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
    .setExpirationTime(rememberMe ? "7d" : "1d")
    .sign(jwtKey());

  await prisma.user.update({
    where: { id: user.id },
    data: { currentToken: token },
  });

  const response = NextResponse.json({
    message: "Login berhasil.",
    data: toSessionData(user),
  });

  response.cookies.set("auth_token", token, {
    ...cookieBase,
    path: "/",
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  });
  response.cookies.set(MFA_CHALLENGE_COOKIE, "", {
    ...cookieBase,
    path: "/api/login",
    maxAge: 0,
  });

  return response;
}

export async function createMfaChallengeResponse(
  userId: string,
  rememberMe: boolean,
) {
  const token = await new SignJWT({ purpose: "mfa", rememberMe })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${MFA_CHALLENGE_SECONDS}s`)
    .sign(jwtKey());

  const response = NextResponse.json({
    message: "Masukkan kode autentikasi dua langkah.",
    mfaRequired: true,
  });
  response.cookies.set(MFA_CHALLENGE_COOKIE, token, {
    ...cookieBase,
    sameSite: "strict",
    path: "/api/login",
    maxAge: MFA_CHALLENGE_SECONDS,
  });

  return response;
}

export async function readMfaChallenge(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, jwtKey());
    if (payload.purpose !== "mfa" || !payload.sub) return null;
    return { userId: payload.sub, rememberMe: payload.rememberMe === true };
  } catch {
    return null;
  }
}
