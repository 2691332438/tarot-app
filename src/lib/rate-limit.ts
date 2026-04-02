type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 6;

const bucket = new Map<string, RateLimitRecord>();

function cleanup(now: number) {
  for (const [key, record] of bucket.entries()) {
    if (record.resetAt <= now) {
      bucket.delete(key);
    }
  }
}

export function checkRateLimit(key: string) {
  const now = Date.now();
  cleanup(now);

  const record = bucket.get(key);

  if (!record || record.resetAt <= now) {
    const nextRecord = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };

    bucket.set(key, nextRecord);

    return {
      ok: true,
      remaining: MAX_REQUESTS - nextRecord.count,
      resetAt: nextRecord.resetAt,
    };
  }

  if (record.count >= MAX_REQUESTS) {
    return {
      ok: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count += 1;
  bucket.set(key, record);

  return {
    ok: true,
    remaining: MAX_REQUESTS - record.count,
    resetAt: record.resetAt,
  };
}
