const crypto = require('crypto');

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function safeCompare(a, b) {
  const aBuf = Buffer.from(String(a));
  const bBuf = Buffer.from(String(b));
  // Pad to equal length so timingSafeEqual never throws on length mismatch,
  // without leaking the real length difference through an early return.
  const len = Math.max(aBuf.length, bBuf.length, 1);
  const aPadded = Buffer.alloc(len);
  const bPadded = Buffer.alloc(len);
  aBuf.copy(aPadded);
  bBuf.copy(bPadded);
  const equalContent = crypto.timingSafeEqual(aPadded, bPadded);
  return equalContent && aBuf.length === bBuf.length;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const SESSION_SECRET = process.env.SESSION_SECRET;

  if (!ADMIN_PASSWORD || !SESSION_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  let password;
  try {
    ({ password } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request' }) };
  }

  if (typeof password !== 'string' || !safeCompare(password, ADMIN_PASSWORD)) {
    // Small fixed delay to blunt naive brute-forcing.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid password' }) };
  }

  const exp = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: `${payload}.${sig}`, exp }),
  };
};
