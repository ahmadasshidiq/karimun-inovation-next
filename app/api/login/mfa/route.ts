import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { recordAuditLog } from "@/lib/audit-log";
import { createSessionResponse, readMfaChallenge } from "@/lib/auth-session";
import {
  clearMfaFailures,
  getMfaBlockSeconds,
  MFA_CHALLENGE_COOKIE,
  recordMfaFailure,
  verifyUserMfaCode,
} from "@/lib/mfa";
import { prisma } from "@/lib/prisma";

const challengeExpired = () =>
  NextResponse.json(
    {
      message: "Sesi verifikasi berakhir. Silakan login kembali.",
      restart: true,
    },
    { status: 401 },
  );

export async function POST(request: Request) {
  try {
    const challenge = await readMfaChallenge(
      (await cookies()).get(MFA_CHALLENGE_COOKIE)?.value,
    );
    if (!challenge) return challengeExpired();

    const user = await prisma.user.findFirst({
      where: { id: challenge.userId, status: "ACTIVE", deletedAt: null },
      include: {
        role: true,
        institution: { include: { nomenclature: true } },
      },
    });
    if (!user || !user.mfaEnabledAt || !user.mfaSecret) return challengeExpired();

    const blockSeconds = await getMfaBlockSeconds(user.id);
    if (blockSeconds > 0) {
      await recordAuditLog({
        request,
        userId: user.id,
        action: "LOGIN_MFA_BLOCKED",
        entity: "login",
        entityId: user.id,
      });
      return NextResponse.json(
        {
          message: `Terlalu banyak percobaan kode. Coba lagi dalam ${Math.ceil(blockSeconds / 60)} menit.`,
        },
        { status: 429, headers: { "Retry-After": String(blockSeconds) } },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      code?: unknown;
    };
    const verification = await verifyUserMfaCode(user, body.code);

    if (!verification.ok) {
      await recordMfaFailure(user.id);
      await recordAuditLog({
        request,
        userId: user.id,
        action: "LOGIN_MFA_FAILED",
        entity: "login",
        entityId: user.id,
      });
      return NextResponse.json(
        { message: "Kode autentikasi tidak valid." },
        { status: 401 },
      );
    }

    await clearMfaFailures(user.id);
    await recordAuditLog({
      request,
      userId: user.id,
      action: verification.method === "recovery" ? "LOGIN_RECOVERY_CODE" : "LOGIN",
      entity: "login",
      entityId: user.id,
      metadata: {
        mfa: true,
        ...(verification.method === "recovery"
          ? { remainingRecoveryCodes: verification.remainingRecoveryCodes }
          : {}),
      },
    });

    return await createSessionResponse(user, challenge.rememberMe);
  } catch (error) {
    console.error("MFA login error:", error);
    return NextResponse.json(
      { message: "Verifikasi gagal. Silakan coba kembali." },
      { status: 500 },
    );
  }
}
