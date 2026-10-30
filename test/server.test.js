import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWebhookServer } from '../src/server.js';

const mensagem = {
  event: 'messages.upsert',
  data: { key: { remoteJid: '5565999990000@s.whatsapp.net', fromMe: false }, message: { conversation: 'oi' } },
};

// Sobe o servidor numa porta livre, roda a função e fecha.
async function comServidor(opts, fn) {
  const server = createWebhookServer(opts);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    return await fn(base);
  } finally {
    server.close();
  }
}

test('webhook com segredo certo responde e envia a resposta', async () => {
  const enviados = [];
  const channel = { sendText: async (to, text) => { enviados.push({ to, text }); return { ok: true, status: 201 }; } };
  const responder = async ({ text }) => `eco: ${text}`;
  await comServidor({ secret: 'seg', channel, responder }, async (base) => {
    const res = await fetch(`${base}/webhook/whatsapp/seg`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mensagem),
    });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { handled: true });
  });
  assert.deepEqual(enviados, [{ to: '5565999990000', text: 'eco: oi' }]);
});

test('segredo errado responde 404', async () => {
  const channel = { sendText: async () => ({ ok: true, status: 201 }) };
  await comServidor({ secret: 'seg', channel, responder: async () => 'x' }, async (base) => {
    const res = await fetch(`${base}/webhook/whatsapp/outro`, { method: 'POST', body: '{}' });
    assert.equal(res.status, 404);
  });
});

test('caminho diferente de webhook responde 404', async () => {
  const channel = { sendText: async () => ({ ok: true, status: 201 }) };
  await comServidor({ secret: 'seg', channel, responder: async () => 'x' }, async (base) => {
    const res = await fetch(`${base}/outra/coisa`, { method: 'POST', body: '{}' });
    assert.equal(res.status, 404);
  });
});

test('corpo que não é JSON responde 400', async () => {
  const channel = { sendText: async () => ({ ok: true, status: 201 }) };
  await comServidor({ secret: 'seg', channel, responder: async () => 'x' }, async (base) => {
    const res = await fetch(`${base}/webhook/whatsapp/seg`, { method: 'POST', body: '{não é json' });
    assert.equal(res.status, 400);
  });
});
