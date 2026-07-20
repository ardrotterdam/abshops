import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4173;

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function resolveFile(urlPath) {
    let p = decodeURIComponent(urlPath.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const abs = path.join(ROOT, p.replace(/^\//, ''));
    if (!abs.startsWith(ROOT)) return null;
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
    const asIndex = path.join(abs, 'index.html');
    if (fs.existsSync(asIndex)) return asIndex;
    return null;
}

const server = http.createServer((req, res) => {
    const file = resolveFile(req.url || '/');
    if (!file) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
    }
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
    console.log(`Smoke server on http://127.0.0.1:${PORT}`);
});
