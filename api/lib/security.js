import crypto from 'crypto';

/* ─────────────────────────────────────────────────────────────
   JWT secret handling
   ───────────────────────────────────────────────────────────── */
let devSecret = null;
let devWarned = false;

/**
 * Returns process.env.JWT_SECRET when set.
 * In production, throws if it is missing (fail fast).
 * In development, falls back to a per-process random secret (with a
 * one-time warning) so local dev works without a configured secret.
 */
export function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  if (!devSecret) {
    devSecret = crypto.randomBytes(32).toString('hex');
  }

  if (!devWarned) {
    devWarned = true;
    console.warn('JWT_SECRET is not set. Using a random development secret; tokens will not survive restarts.');
  }

  return devSecret;
}

/* ─────────────────────────────────────────────────────────────
   CORS
   ───────────────────────────────────────────────────────────── */
const DEV_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
]);

const LOCALHOST_ANY_PORT = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

/**
 * Applies strict CORS headers. Echoes the origin only when it is
 * trusted (no Origin header = same-origin/curl, same-site host, or a
 * localhost dev origin). Returns true when the request is allowed,
 * false otherwise (caller should respond 403). Never allows '*'.
 */
export function applyCors(req, res) {
  const origin = req.headers.origin;
  const host = req.headers.host;

  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS,GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  let allowed;
  if (!origin) {
    // Same-origin request or non-browser client (curl, server-to-server)
    allowed = true;
  } else if (origin === `http://${host}` || origin === `https://${host}`) {
    // Same site (matches the Host header in production)
    allowed = true;
  } else if (DEV_ORIGINS.has(origin) || LOCALHOST_ANY_PORT.test(origin)) {
    // Local development servers (Vite default 5173, etc.)
    allowed = true;
  } else {
    allowed = false;
  }

  if (allowed) {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    return true;
  }

  return false;
}

/* ─────────────────────────────────────────────────────────────
   Simple in-memory sliding rate limiter
   Best-effort only: Vercel serverless instances are ephemeral and
   this state does not persist across cold starts. That is fine for
   lightweight abuse mitigation.
   ───────────────────────────────────────────────────────────── */
const rateLimitStore = new Map();

export function rateLimit(key, limit = 20, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  record.count += 1;
  const allowed = record.count <= limit;
  return { allowed, retryAfterMs: allowed ? 0 : record.resetAt - now };
}

/* ─────────────────────────────────────────────────────────────
   Client IP extraction
   ───────────────────────────────────────────────────────────── */
export function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}
