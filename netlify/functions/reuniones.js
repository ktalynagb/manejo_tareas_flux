const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const store = getStore({
    name: 'flux-reuniones',
    siteID: process.env.SITE_ID,
    token: process.env.FLUX_API_TOKEN
  });

  if (event.httpMethod === 'GET') {
    const data = await store.get('reuniones', { type: 'json' });
    return { statusCode: 200, headers, body: JSON.stringify(data || []) };
  }

  if (event.httpMethod === 'POST') {
    let reuniones;
    try {
      reuniones = JSON.parse(event.body || '[]');
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'JSON inválido' }) };
    }
    await store.setJSON('reuniones', reuniones);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };
};
