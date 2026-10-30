const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DEFAULT_PASSWORD = '7so-admin-secret';
const PRODUCTS_PATH = path.join(ROOT, 'data', 'products.json');
const SETTINGS_PATH = path.join(ROOT, 'data', 'settings.json');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readProducts() {
  if (!fs.existsSync(PRODUCTS_PATH)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}

function writeProducts(products) {
  ensureDir(PRODUCTS_PATH);
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
}

function readSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) return { storeName: '7SO STORE', discordLink: 'https://discord.gg/gupu65sVck' };
  try {
    const s = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    return (typeof s === 'object' && s !== null) ? s : { storeName: '7SO STORE', discordLink: 'https://discord.gg/gupu65sVck' };
  } catch {
    return { storeName: '7SO STORE', discordLink: 'https://discord.gg/gupu65sVck' };
  }
}

function writeSettings(settings) {
  ensureDir(SETTINGS_PATH);
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let urlPath = decodeURIComponent(url.pathname);

  if (urlPath === '/api/products') {
    const method = req.method.toUpperCase();
    const target = url.searchParams.get('_target');
    const pw = url.searchParams.get('password') || '';

    function respond(code, body) {
      res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(body));
    }

    function checkAuth() {
      if ((method === 'POST' || method === 'PUT' || method === 'DELETE') && pw !== DEFAULT_PASSWORD) {
        respond(403, { error: 'Unauthorized' });
        return false;
      }
      return true;
    }

    if (method === 'GET') {
      if (target === 'settings') respond(200, readSettings());
      else respond(200, readProducts());
    } else if (method === 'POST') {
      if (!checkAuth()) return;
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (target === 'settings') { writeSettings(data); respond(200, { success: true }); }
          else {
            const items = Array.isArray(data) ? data : [data];
            const existing = readProducts();
            const ids = new Set(existing.map(p => p.id));
            items.forEach(p => { if (!ids.has(p.id)) existing.push(p); });
            writeProducts(existing);
            respond(200, { success: true });
          }
        } catch(e) { respond(400, { error: 'Invalid JSON' }); }
      });
    } else if (method === 'PUT') {
      if (!checkAuth()) return;
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (!data.id) { respond(400, { error: 'Product ID required' }); return; }
          const existing = readProducts();
          const idx = existing.findIndex(p => p.id === data.id);
          if (idx >= 0) existing[idx] = { ...existing[idx], ...data };
          else existing.push(data);
          writeProducts(existing);
          respond(200, { success: true });
        } catch(e) { respond(400, { error: 'Invalid JSON' }); }
      });
    } else if (method === 'DELETE') {
      if (!checkAuth()) return;
      const id = url.searchParams.get('id');
      if (!id) { respond(400, { error: 'Product ID required' }); return; }
      writeProducts(readProducts().filter(p => String(p.id) !== String(id)));
      respond(200, { success: true });
    } else {
      respond(405, { error: 'Method not allowed' });
    }
    return;
  }

  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  fs.access(filePath, fs.constants.F_OK, (exists) => {
    if (exists) {
      fs.readFile(filePath, (err, content) => {
        if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not Found'); }
        else { res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'text/plain; charset=utf-8' }); res.end(content); }
      });
    } else {
      fs.readFile(path.join(ROOT, 'index.html'), (err, content) => {
        if (err) { res.writeHead(404); res.end('Not Found'); }
        else { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(content); }
      });
    }
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
  });
}

module.exports = server;
