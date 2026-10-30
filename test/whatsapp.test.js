import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWhatsAppChannel, parseIncoming, handleWebhook } from '../src/channels/whatsapp.js';

const ok = (status = 201) => ({ ok: status < 400, status });

test('envio usa a rota e o cabeçalho confirmados', async () => {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url, opts });
    return ok(201);
  };
  const ch = createWhatsAppChannel({ baseUrl: 'https://evo.exemplo', apiKey: 'k', instance: 'piloto', fetchImpl });
  const r = await ch.sendText('5565999990000', 'oi');
  assert.deepEqual(r, { ok: true, status: 201 });
  assert.equal(calls[0].url, 'https://evo.exemplo/message/sendText/piloto');
  assert.equal(calls[0].opts.method, 'POST');
  assert.equal(calls[0].opts.headers.apikey, 'k');
  assert.deepEqual(JSON.parse(calls[0].opts.body), { number: '5565999990000', text: 'oi' });
});

test('envio com erro devolve ok=false sem lançar', async () => {
  const ch = createWhatsAppChannel({
    baseUrl: 'https://evo.exemplo', apiKey: 'k', instance: 'piloto',
    fetchImpl: async () => ok(401),
  });
  assert.deepEqual(await ch.sendText('5565999990000', 'oi'), { ok: false, status: 401 });
});

test('lê mensagem de texto individual', () => {
  const body = {
    event: 'messages.upsert',
    data: { key: { remoteJid: '5565999990000@s.whatsapp.net', fromMe: false }, message: { conversation: ' oi ' } },
  };
  assert.deepEqual(parseIncoming(body), { from: '5565999990000', text: 'oi' });
});

test('lê texto de mensagem estendida (resposta com citação)', () => {
  const body = {
    event: 'messages.upsert',
    data: {
      key: { remoteJid: '5565999990000@s.whatsapp.net', fromMe: false },
      message: { extendedTextMessage: { text: 'fundamenta melhor' } },
    },
  };
  assert.equal(parseIncoming(body).text, 'fundamenta melhor');
});

test('ignora grupo, mensagem própria, evento diferente e mensagem sem texto', () => {
  const base = { event: 'messages.upsert', data: { key: { remoteJid: '5565@s.whatsapp.net', fromMe: false }, message: { conversation: 'x' } } };
  assert.equal(parseIncoming({ ...base, data: { ...base.data, key: { remoteJid: '123@g.us', fromMe: false } } }), null);
  assert.equal(parseIncoming({ ...base, data: { ...base.data, key: { remoteJid: '5565@s.whatsapp.net', fromMe: true } } }), null);
  assert.equal(parseIncoming({ ...base, event: 'connection.update' }), null);
  assert.equal(parseIncoming({ ...base, data: { ...base.data, message: { imageMessage: {} } } }), null);
  assert.equal(parseIncoming(null), null);
});

test('webhook com segredo errado responde 404 e não envia nada', async () => {
  let enviou = false;
  const channel = { sendText: async () => { enviou = true; return ok(); } };
  const r = await handleWebhook({ secret: 'certo', pathSecret: 'errado', body: {}, channel, responder: async () => 'x' });
  assert.equal(r.status, 404);
  assert.equal(enviou, false);
});

test('webhook válido responde ao remetente pelo canal', async () => {
  const enviados = [];
  const channel = { sendText: async (to, text) => { enviados.push({ to, text }); return ok(); } };
  const body = {
    event: 'messages.upsert',
    data: { key: { remoteJid: '5565999990000@s.whatsapp.net', fromMe: false }, message: { conversation: 'oi' } },
  };
  const r = await handleWebhook({
    secret: 's', pathSecret: 's', body, channel,
    responder: async ({ text }) => `recebi: ${text}`,
  });
  assert.deepEqual(r, { status: 200, handled: true, sent: true });
  assert.deepEqual(enviados, [{ to: '5565999990000', text: 'recebi: oi' }]);
});

test('webhook sem segredo configurado nunca aceita', async () => {
  const r = await handleWebhook({ secret: '', pathSecret: '', body: {}, channel: {}, responder: async () => '' });
  assert.equal(r.status, 404);
});
