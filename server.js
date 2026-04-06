// Minimal zero-dependency static file server for Render's Node web service.
// Serves index.html, styles.css, and /assets. Binds to process.env.PORT.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function safeResolve(urlPath) {
  // Strip query string, decode, and prevent path traversal.
  const cleaned = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const resolved = path.normalize(path.join(ROOT, cleaned));
  if (!resolved.startsWith(ROOT)) return null;
  return resolved;
}

function sendFile(res, filePath, statusCode = 200) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return sendNotFound(res);
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(statusCode, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
      ...SECURITY_HEADERS,
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function sendNotFound(res) {
  const fallback = path.join(ROOT, 'index.html');
  fs.stat(fallback, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
      res.end('Not Found');
      return;
    }
    // SPA-style fallback: rewrite to index.html with 200.
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache',
      ...SECURITY_HEADERS,
    });
    fs.createReadStream(fallback).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    res.end('Method Not Allowed');
    return;
  }

  // Health check endpoint for Render.
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    res.end('ok');
    return;
  }

  let target = safeResolve(req.url === '/' ? '/index.html' : req.url);
  if (!target) return sendNotFound(res);

  fs.stat(target, (err, stat) => {
    if (err) return sendNotFound(res);
    if (stat.isDirectory()) target = path.join(target, 'index.html');
    sendFile(res, target);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sandbox Group LLC static site listening on 0.0.0.0:${PORT}`);
});
