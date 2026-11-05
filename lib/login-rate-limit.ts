const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IDENTIFIER = 5;
const MAX_FAILURES_PER_IP = 20;

type Entry = { count: number; resetAt: number };

const failures = new Map<string, Entry>();

const getEntry = (key: string, now: number) => {
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= now) {
    failures.delete(key);
    return null;
  }
  return entry;
};

const cleanup = (now: number) => {
  if (failures.size < 10_000) return;
  for (const [key, entry] of failures) {
    if (entry.resetAt <= now) failures.delete(key);
  }
};

export const getClientIp = (request: Request) =>
  request.headers.get("cf-connecting-ip") ||
  request.headers.get("x-real-ip") ||
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";

const keysFor = (identifier: string, ip: string) => ({
  identifierKey: `id:${identifier.toLowerCase()}`,
  ipKey: `ip:${ip}`,
});

export function getLoginBlockSeconds(identifier: string, ip: string) {
  const now = Date.now();
  const { identifierKey, ipKey } = keysFor(identifier, ip);
  const byIdentifier = getEntry(identifierKey, now);
  const byIp = getEntry(ipKey, now);

  const blockedUntil = Math.max(
    byIdentifier && byIdentifier.count >= MAX_FAILURES_PER_IDENTIFIER
      ? byIdentifier.resetAt
      : 0,
    byIp && byIp.count >= MAX_FAILURES_PER_IP ? byIp.resetAt : 0,
  );

  return blockedUntil > now ? Math.ceil((blockedUntil - now) / 1000) : 0;
}

export function recordLoginFailure(identifier: string, ip: string) {
  const now = Date.now();
  cleanup(now);
  const { identifierKey, ipKey } = keysFor(identifier, ip);

  for (const key of [identifierKey, ipKey]) {
    const entry = getEntry(key, now);
    if (entry) entry.count += 1;
    else failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
  }
}

export function clearLoginFailures(identifier: string) {
  failures.delete(keysFor(identifier, "").identifierKey);
}
