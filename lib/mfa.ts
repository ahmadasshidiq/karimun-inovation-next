import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { incrementRateLimit } from "@/lib/login-rate-limit";
import { prisma } from "@/lib/prisma";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const TOTP_PERIOD_SECONDS = 30;
const TOTP_DIGITS = 6;
const TOTP_WINDOW = 1;
const RECOVERY_CODE_COUNT = 10;
const MFA_FAILURE_WINDOW_MS = 15 * 60 * 1000;
const MAX_MFA_FAILURES = 5;

export const MFA_ISSUER = "Inovasi Karimun";
export const MFA_CHALLENGE_COOKIE = "mfa_challenge";
export const MFA_CHALLENGE_SECONDS = 5 * 60;

const encryptionKey = () => {
  const source = process.env.MFA_ENCRYPTION_KEY || process.env.JWT_SECRET;
  if (!source) throw new Error("MFA_ENCRYPTION_KEY belum dikonfigurasi.");

  return Buffer.from(
    hkdfSync("sha256", source, "karimun-mfa", "mfa-secret-encryption", 32),
  );
};

const base32Encode = (buffer: Buffer) => {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  return output;
};

const base32Decode = (input: string) => {
  const clean = input.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) throw new Error("Secret MFA tidak valid.");
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
};

export const generateMfaSecret = () => base32Encode(randomBytes(20));

export const encryptMfaSecret = (secret: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);

  return [iv, cipher.getAuthTag(), encrypted]
    .map((part) => part.toString("base64url"))
    .join(".");
};

export const decryptMfaSecret = (payload: string) => {
  const [iv, tag, encrypted] = payload
    .split(".")
    .map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
};

const totpAt = (secret: string, step: number) => {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const hmac = createHmac("sha1", base32Decode(secret)).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 15;
  const binary =
    ((hmac[offset] & 127) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];

  return String(binary % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, "0");
};

const safeEqual = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

export const normalizeMfaCode = (value: unknown) =>
  typeof value === "string" ? value.replace(/[\s-]/g, "").toUpperCase() : "";

export const verifyTotp = (
  secret: string,
  code: string,
  lastUsedStep?: number | null,
) => {
  if (!/^\d{6}$/.test(code)) return null;

  const currentStep = Math.floor(Date.now() / 1000 / TOTP_PERIOD_SECONDS);
  for (let offset = -TOTP_WINDOW; offset <= TOTP_WINDOW; offset += 1) {
    const step = currentStep + offset;
    if (lastUsedStep !== null && lastUsedStep !== undefined && step <= lastUsedStep) {
      continue;
    }
    if (safeEqual(totpAt(secret, step), code)) return step;
  }

  return null;
};

export const buildOtpAuthUrl = (secret: string, account: string) => {
  const label = encodeURIComponent(`${MFA_ISSUER}:${account}`);
  const params = new URLSearchParams({
    secret,
    issuer: MFA_ISSUER,
    algorithm: "SHA1",
    digits: String(TOTP_DIGITS),
    period: String(TOTP_PERIOD_SECONDS),
  });

  return `otpauth://totp/${label}?${params.toString()}`;
};

const hashRecoveryCode = (code: string) =>
  createHash("sha256").update(normalizeMfaCode(code)).digest("hex");

export const generateRecoveryCodes = () => {
  const codes = Array.from({ length: RECOVERY_CODE_COUNT }, () => {
    const raw = base32Encode(randomBytes(5)).slice(0, 8);
    return `${raw.slice(0, 4)}-${raw.slice(4)}`;
  });

  return { codes, hashes: codes.map(hashRecoveryCode) };
};

export const readRecoveryHashes = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

type MfaUser = {
  id: string;
  mfaSecret: string | null;
  mfaLastUsedStep: number | null;
  mfaRecoveryCodes: unknown;
};

export type MfaVerification =
  | { ok: true; method: "totp" | "recovery"; remainingRecoveryCodes: number }
  | { ok: false };

export async function verifyUserMfaCode(
  user: MfaUser,
  rawCode: unknown,
): Promise<MfaVerification> {
  const code = normalizeMfaCode(rawCode);
  if (!user.mfaSecret || !code) return { ok: false };

  const hashes = readRecoveryHashes(user.mfaRecoveryCodes);
  const step = verifyTotp(
    decryptMfaSecret(user.mfaSecret),
    code,
    user.mfaLastUsedStep,
  );

  if (step !== null) {
    const result = await prisma.user.updateMany({
      where: {
        id: user.id,
        OR: [{ mfaLastUsedStep: null }, { mfaLastUsedStep: { lt: step } }],
      },
      data: { mfaLastUsedStep: step },
    });
    return result.count
      ? { ok: true, method: "totp", remainingRecoveryCodes: hashes.length }
      : { ok: false };
  }

  const codeHash = hashRecoveryCode(code);
  if (!hashes.some((hash) => safeEqual(hash, codeHash))) return { ok: false };

  const remaining = hashes.filter((hash) => !safeEqual(hash, codeHash));
  await prisma.user.update({
    where: { id: user.id },
    data: { mfaRecoveryCodes: remaining },
  });

  return {
    ok: true,
    method: "recovery",
    remainingRecoveryCodes: remaining.length,
  };
}

const mfaFailureKey = (userId: string) => `mfa:user:${userId}`;

export async function getMfaBlockSeconds(userId: string) {
  const entry = await prisma.rateLimit.findFirst({
    where: { key: mfaFailureKey(userId), resetAt: { gt: new Date() } },
  });
  if (!entry || entry.count < MAX_MFA_FAILURES) return 0;

  return Math.ceil((entry.resetAt.getTime() - Date.now()) / 1000);
}

export async function recordMfaFailure(userId: string) {
  await incrementRateLimit(mfaFailureKey(userId), MFA_FAILURE_WINDOW_MS);
}

export async function clearMfaFailures(userId: string) {
  await prisma.rateLimit.deleteMany({ where: { key: mfaFailureKey(userId) } });
}
