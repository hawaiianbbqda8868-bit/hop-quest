// Minimal zero-dependency static server for Hop Quest (Railway).
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.css': 'text/css; charset=utf-8',
};
http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const fp = path.normalize(path.join(ROOT, p));
  if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(fp, (err, buf) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('not found'); }
    res.writeHead(200, {
      'content-type': TYPES[path.extname(fp)] || 'application/octet-stream',
      'cache-control': p.endsWith('.html') || p === '/index.html' ? 'no-cache' : 'public, max-age=3600',
    });
    res.end(buf);
  });
}).listen(process.env.PORT || 3000, () => console.log('Hop Quest static server up on', process.env.PORT || 3000));
