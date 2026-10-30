const fs = require('fs');
const path = require('path');

const PRODUCTS_PATH = path.join(__dirname, '..', 'data', 'products.json');
const SETTINGS_PATH = path.join(__dirname, '..', 'data', 'settings.json');
const DEFAULT_PASSWORD = '7so-admin-secret';

function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch { return []; }
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
}

function readSettings() {
  try {
    const s = fs.readFileSync(SETTINGS_PATH, 'utf8');
    const parsed = JSON.parse(s);
    return (typeof parsed === 'object' && parsed !== null) ? parsed : { storeName: '7SO STORE', discordLink: 'https://discord.gg/gupu65sVck' };
  } catch {
    return { storeName: '7SO STORE', discordLink: 'https://discord.gg/gupu65sVck' };
  }
}

function writeSettings(settings) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

exports.handler = async (event, context) => {
  const method = event.httpMethod || 'GET';
  const query = event.queryStringParameters || {};
  const body = event.body || '{}';
  const pw = query.password || '';
  const target = query._target;

  function respond(code, data) {
    return { statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
  }

  function checkAuth() {
    if ((method === 'POST' || method === 'PUT' || method === 'DELETE') && pw !== DEFAULT_PASSWORD) {
      return respond(403, { error: 'Unauthorized' });
    }
    return null;
  }

  try {
    if (method === 'GET') {
      if (target === 'settings') {
        return respond(200, readSettings());
      }
      return respond(200, readProducts());
    }

    let parsed;
    try { parsed = JSON.parse(body); } catch (e) { return respond(400, { error: 'Invalid JSON' }); }

    if (method === 'POST') {
      const auth = checkAuth();
      if (auth) return auth;
      if (target === 'settings') {
        writeSettings(parsed);
        return respond(200, { success: true });
      }
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const existing = readProducts();
      const ids = new Set(existing.map(p => p.id));
      items.forEach(p => { if (!ids.has(p.id)) existing.push(p); });
      writeProducts(existing);
      return respond(200, { success: true });
    }

    if (method === 'PUT') {
      const auth = checkAuth();
      if (auth) return auth;
      if (!parsed.id) return respond(400, { error: 'Product ID required' });
      const existing = readProducts();
      const idx = existing.findIndex(p => p.id === parsed.id);
      if (idx >= 0) existing[idx] = { ...existing[idx], ...parsed };
      else existing.push(parsed);
      writeProducts(existing);
      return respond(200, { success: true });
    }

    if (method === 'DELETE') {
      const auth = checkAuth();
      if (auth) return auth;
      const id = query.id || '';
      if (!id) return respond(400, { error: 'Product ID required' });
      writeProducts(readProducts().filter(p => String(p.id) !== String(id)));
      return respond(200, { success: true });
    }

    return respond(405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return respond(500, { error: err.message });
  }
};
