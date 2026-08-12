// Minimal zero-dependency static server + family-room relay for Hop Quest (Railway).
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
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
const srv = http.createServer((req, res) => {
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
});
srv.listen(process.env.PORT || 3000, () => console.log('Hop Quest server + family relay up on', process.env.PORT || 3000));

// ---------- family-room WebSocket relay (RFC 6455, text frames, zero deps) ----------
// One global room: everyone connects to /ws, gets an id, lowest id is the leader.
// The server stamps each message with the sender id and broadcasts to everyone else.
let nextId = 1;
const clients = new Map(); // id -> {sock, buf}

function wsFrame(str) {
  const b = Buffer.from(str);
  let head;
  if (b.length < 126) head = Buffer.from([0x81, b.length]);
  else if (b.length < 65536) { head = Buffer.alloc(4); head[0] = 0x81; head[1] = 126; head.writeUInt16BE(b.length, 2); }
  else { head = Buffer.alloc(10); head[0] = 0x81; head[1] = 127; head.writeBigUInt64BE(BigInt(b.length), 2); }
  return Buffer.concat([head, b]);
}
function sendTo(c, obj) { try { c.sock.write(wsFrame(JSON.stringify(obj))); } catch (e) {} }
function broadcast(obj, exceptId) { for (const [id, c] of clients) { if (id !== exceptId) sendTo(c, obj); } }
function leaderId() { let m = Infinity; for (const id of clients.keys()) if (id < m) m = id; return m === Infinity ? null : m; }
function announce() { broadcast({ t: 'room', leader: leaderId(), players: [...clients.keys()] }, null); }

function parseFrame(buf) {
  if (buf.length < 2) return null;
  const op = buf[0] & 0x0f, masked = buf[1] & 0x80;
  let len = buf[1] & 0x7f, off = 2;
  if (len === 126) { if (buf.length < 4) return null; len = buf.readUInt16BE(2); off = 4; }
  else if (len === 127) { if (buf.length < 10) return null; len = Number(buf.readBigUInt64BE(2)); off = 10; }
  let mask = null;
  if (masked) { if (buf.length < off + 4) return null; mask = buf.slice(off, off + 4); off += 4; }
  if (buf.length < off + len) return null;
  let payload = buf.slice(off, off + len);
  if (mask) { const un = Buffer.alloc(len); for (let i = 0; i < len; i++) un[i] = payload[i] ^ mask[i & 3]; payload = un; }
  return { op, payload, consumed: off + len };
}

srv.on('upgrade', (req, sock) => {
  if (!(req.url || '').startsWith('/ws')) { sock.destroy(); return; }
  const key = req.headers['sec-websocket-key'];
  if (!key) { sock.destroy(); return; }
  const accept = crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
  sock.setTimeout(0); sock.setNoDelay(true);
  const id = nextId++;
  const me = { sock, buf: Buffer.alloc(0) };
  clients.set(id, me);
  sendTo(me, { t: 'welcome', id, leader: leaderId(), players: [...clients.keys()] });
  announce();
  const bye = () => { if (clients.delete(id)) announce(); try { sock.destroy(); } catch (e) {} };
  sock.on('data', chunk => {
    me.buf = Buffer.concat([me.buf, chunk]);
    for (;;) {
      const f = parseFrame(me.buf);
      if (!f) break;
      me.buf = me.buf.slice(f.consumed);
      if (f.op === 8) { bye(); return; }                                     // close
      if (f.op === 9) { try { sock.write(Buffer.concat([Buffer.from([0x8A, f.payload.length]), f.payload])); } catch (e) {} continue; } // ping→pong
      if (f.op !== 1) continue;                                              // text only
      let d; try { d = JSON.parse(f.payload.toString('utf8')); } catch (e) { continue; }
      if (!d || typeof d !== 'object' || d.t === 'ping') continue;
      d.id = id;
      broadcast(d, id);
    }
  });
  sock.on('close', bye); sock.on('error', bye); sock.on('end', bye);
});
