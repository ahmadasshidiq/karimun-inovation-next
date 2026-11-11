import { scryptSync, timingSafeEqual } from "node:crypto";

import QRCode from "qrcode";
import { NextRequest, NextResponse } from "next/server";

import { recordAuditLog } from "@/lib/audit-log";
import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  buildOtpAuthUrl,
  clearMfaFailures,
  decryptMfaSecret,
  encryptMfaSecret,
  generateMfaSecret,
  generateRecoveryCodes,
  getMfaBlockSeconds,
  normalizeMfaCode,
  readRecoveryHashes,
  recordMfaFailure,
  verifyTotp,
  verifyUserMfaCode,
} from "@/lib/mfa";
import { prisma } from "@/lib/prisma";

const unauthorized = () =>
  NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

const blockedResponse = (seconds: number) =>
  NextResponse.json(
    {
      message: `Terlalu banyak percobaan kode. Coba lagi dalam ${Math.ceil(seconds / 60)} menit.`,
    },
    { status: 429, headers: { "Retry-After": String(seconds) } },
  );

const isPasswordMatch = (password: string, salt: string, storedHex: string) => {
  const stored = Buffer.from(storedHex, "hex");
  if (!stored.length) return false;
  return timingSafeEqual(stored, scryptSync(password, salt, stored.length));
};

const readBody = async (request: NextRequest) =>
  (await request.json().catch(() => ({}))) as Record<string, unknown>;

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  return NextResponse.json({
    data: {
      enabled: Boolean(user.mfaEnabledAt),
      enabledAt: user.mfaEnabledAt?.toISOString() ?? null,
      recoveryCodesRemaining: readRecoveryHashes(user.mfaRecoveryCodes).length,
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();
  if (user.mfaEnabledAt) {
    return NextResponse.json(
      { message: "Autentikasi dua langkah sudah aktif." },
      { status: 409 },
    );
  }

  const body = await readBody(request);
  const password = typeof body.password === "string" ? body.password : "";
  if (!isPasswordMatch(password, user.salt, user.password)) {
    await recordAuditLog({
      request,
      userId: user.id,
      action: "MFA_SETUP_DENIED",
      entity: "session/mfa",
      entityId: user.id,
    });
    return NextResponse.json(
      { message: "Password tidak sesuai." },
      { status: 400 },
    );
  }

  const secret = generateMfaSecret();
  await prisma.user.update({
    where: { id: user.id },
    data: { mfaPendingSecret: encryptMfaSecret(secret) },
  });

  const otpauthUrl = buildOtpAuthUrl(secret, user.username);
  const qrSvg = await QRCode.toString(otpauthUrl, {
    type: "svg",
    margin: 1,
    width: 200,
  });

  return NextResponse.json({ data: { secret, otpauthUrl, qrSvg } });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();
  if (!user.mfaPendingSecret) {
    return NextResponse.json(
      { message: "Mulai pengaturan autentikasi dua langkah terlebih dahulu." },
      { status: 400 },
    );
  }

  const blockSeconds = await getMfaBlockSeconds(user.id);
  if (blockSeconds > 0) return blockedResponse(blockSeconds);

  const body = await readBody(request);
  const secret = decryptMfaSecret(user.mfaPendingSecret);
  const step = verifyTotp(secret, normalizeMfaCode(body.code));
  if (step === null) {
    await recordMfaFailure(user.id);
    return NextResponse.json(
      { message: "Kode autentikasi tidak valid." },
      { status: 400 },
    );
  }

  const { codes, hashes } = generateRecoveryCodes();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      mfaSecret: encryptMfaSecret(secret),
      mfaPendingSecret: null,
      mfaEnabledAt: new Date(),
      mfaLastUsedStep: step,
      mfaRecoveryCodes: hashes,
    },
  });
  await clearMfaFailures(user.id);
  await recordAuditLog({
    request,
    userId: user.id,
    action: "MFA_ENABLED",
    entity: "session/mfa",
    entityId: user.id,
  });

  return NextResponse.json({
    message: "Autentikasi dua langkah berhasil diaktifkan.",
    data: { recoveryCodes: codes },
  });
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();
  if (!user.mfaEnabledAt) {
    return NextResponse.json(
      { message: "Autentikasi dua langkah belum aktif." },
      { status: 400 },
    );
  }

  const blockSeconds = await getMfaBlockSeconds(user.id);
  if (blockSeconds > 0) return blockedResponse(blockSeconds);

  const body = await readBody(request);
  const password = typeof body.password === "string" ? body.password : "";
  const passwordValid = isPasswordMatch(password, user.salt, user.password);
  const verification = passwordValid
    ? await verifyUserMfaCode(user, body.code)
    : { ok: false as const };

  if (!verification.ok) {
    await recordMfaFailure(user.id);
    await recordAuditLog({
      request,
      userId: user.id,
      action: "MFA_DISABLE_DENIED",
      entity: "session/mfa",
      entityId: user.id,
    });
    return NextResponse.json(
      { message: "Password atau kode autentikasi tidak valid." },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      mfaSecret: null,
      mfaPendingSecret: null,
      mfaEnabledAt: null,
      mfaLastUsedStep: null,
      mfaRecoveryCodes: [],
    },
  });
  await clearMfaFailures(user.id);
  await recordAuditLog({
    request,
    userId: user.id,
    action: "MFA_DISABLED",
    entity: "session/mfa",
    entityId: user.id,
  });

  return NextResponse.json({
    message: "Autentikasi dua langkah berhasil dinonaktifkan.",
  });
}
