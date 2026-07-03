// middleware/adminAuth.js — HTTP Basic Auth guard for /api/admin/* routes
function timingSafeEqual(a, b) {
  const crypto = require('crypto');
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function adminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme !== 'Basic' || !encoded) {
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  let decoded;
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const separatorIndex = decoded.indexOf(':');
  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  const validUser =
    timingSafeEqual(username, process.env.ADMIN_USERNAME || '') &&
    timingSafeEqual(password, process.env.ADMIN_PASSWORD || '');

  if (!validUser) {
    return res.status(403).json({ success: false, message: 'Invalid username or password.' });
  }

  next();
}

module.exports = adminAuth;
