// Servidor que recebe o webhook do WhatsApp. O segredo vai no caminho: POST /webhook/whatsapp/{WEBHOOK_SECRET}.
import { createServer } from 'node:http';
import { handleWebhook } from './channels/whatsapp.js';

const PREFIXO = '/webhook/whatsapp/';

export function createWebhookServer({ secret, channel, responder }) {
  return createServer(async (req, res) => {
    if (req.method !== 'POST' || !req.url.startsWith(PREFIXO)) {
      res.writeHead(404).end();
      return;
    }
    let raw = '';
    for await (const chunk of req) raw += chunk;
    let body = null;
    try {
      body = JSON.parse(raw || 'null');
    } catch {
      res.writeHead(400).end();
      return;
    }
    const pathSecret = decodeURIComponent(req.url.slice(PREFIXO.length));
    const r = await handleWebhook({ secret, pathSecret, body, channel, responder });
    res.writeHead(r.status, { 'Content-Type': 'application/json' }).end(JSON.stringify({ handled: Boolean(r.handled) }));
  });
}
