import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IDENTIFIER = 5;
const MAX_FAILURES_PER_IP = 20;

type RateLimitRow = { count: number; reset_at: Date };

export const UNKNOWN_IP = "unknown";

export const getClientIp = (request: Request) => {
  const header = process.env.TRUSTED_PROXY_IP_HEADER?.trim().toLowerCase();
  if (!header) return UNKNOWN_IP;

  const value = request.headers.get(header);
  if (!value) return UNKNOWN_IP;

  const ip =
    header === "x-forwarded-for"
      ? value.split(",").at(-1)?.trim()
      : value.trim();

  return ip ? ip.slice(0, 64) : UNKNOWN_IP;
};

const cleanupExpired = async () => {
  if (Math.random() > 0.01) return;
  await prisma.rateLimit.deleteMany({ where: { resetAt: { lte: new Date() } } });
};

export async function incrementRateLimit(key: string, windowMs: number) {
  const [row] = await prisma.$queryRaw<RateLimitRow[]>`
    INSERT INTO "rate_limits" ("key", "count", "reset_at")
    VALUES (${key}, 1, NOW() + (${windowMs} * INTERVAL '1 millisecond'))
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "rate_limits"."reset_at" <= NOW() THEN 1
        ELSE "rate_limits"."count" + 1
      END,
      "reset_at" = CASE
        WHEN "rate_limits"."reset_at" <= NOW() THEN EXCLUDED."reset_at"
        ELSE "rate_limits"."reset_at"
      END
    RETURNING "count", "reset_at"
  `;
  void cleanupExpired().catch(() => undefined);

  return { count: row.count, resetAt: row.reset_at.getTime() };
}

const keysFor = (identifier: string, ip: string) => ({
  identifierKey: `login:id:${identifier.toLowerCase().slice(0, 150)}`,
  ipKey: ip === UNKNOWN_IP ? null : `login:ip:${ip}`,
});

export async function getLoginBlockSeconds(identifier: string, ip: string) {
  const now = Date.now();
  const { identifierKey, ipKey } = keysFor(identifier, ip);
  const entries = await prisma.rateLimit.findMany({
    where: {
      key: { in: ipKey ? [identifierKey, ipKey] : [identifierKey] },
      resetAt: { gt: new Date(now) },
    },
  });

  const blockedUntil = Math.max(
    0,
    ...entries.map((entry) => {
      const limit =
        entry.key === identifierKey
          ? MAX_FAILURES_PER_IDENTIFIER
          : MAX_FAILURES_PER_IP;
      return entry.count >= limit ? entry.resetAt.getTime() : 0;
    }),
  );

  return blockedUntil > now ? Math.ceil((blockedUntil - now) / 1000) : 0;
}

export async function recordLoginFailure(identifier: string, ip: string) {
  const { identifierKey, ipKey } = keysFor(identifier, ip);
  await Promise.all(
    [identifierKey, ipKey]
      .filter((key): key is string => Boolean(key))
      .map((key) => incrementRateLimit(key, WINDOW_MS)),
  );
}

export async function clearLoginFailures(identifier: string) {
  await prisma.rateLimit.deleteMany({
    where: { key: keysFor(identifier, UNKNOWN_IP).identifierKey },
  });
}
