import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServiceClient } from '../src/clients/service.js';
import { basicAuthHeader } from '../src/clients/http.js';
import { checkServices } from '../src/index.js';
import { loadConfig } from '../src/config.js';

const base = {
  name: 'octop',
  baseUrl: 'http://10.0.0.5:8088',
  username: 'u',
  password: 'p',
  timeoutMs: 1000,
};

function fakeFetch(response) {
  const calls = [];
  const fn = async (url, opts) => {
    calls.push({ url, opts });
    if (response instanceof Error) throw response;
    return { ok: response.status < 400, status: response.status };
  };
  fn.calls = calls;
  return fn;
}

test('cabeçalho de autenticação é Basic em base64', () => {
  assert.equal(basicAuthHeader('u', 'p'), 'Basic ' + Buffer.from('u:p').toString('base64'));
});

test('ping com 200 marca alcançável e autorizado', async () => {
  const f = fakeFetch({ status: 200 });
  const r = await createServiceClient({ ...base, fetchImpl: f }).ping();
  assert.deepEqual(r, { name: 'octop', reachable: true, status: 200, authorized: true });
});

test('ping com 401 marca alcançável e não autorizado', async () => {
  const f = fakeFetch({ status: 401 });
  const r = await createServiceClient({ ...base, fetchImpl: f }).ping();
  assert.equal(r.reachable, true);
  assert.equal(r.authorized, false);
});

test('ping com 403 (bloqueio) não conta como autorizado', async () => {
  const f = fakeFetch({ status: 403 });
  const r = await createServiceClient({ ...base, fetchImpl: f }).ping();
  assert.equal(r.reachable, true);
  assert.equal(r.authorized, false);
});

test('senha vai só no cabeçalho, nunca na URL', async () => {
  const f = fakeFetch({ status: 200 });
  await createServiceClient({ ...base, password: 'senha-secreta', fetchImpl: f }).ping();
  const [call] = f.calls;
  assert.doesNotMatch(call.url, /senha-secreta/);
  assert.equal(call.opts.headers.Authorization, basicAuthHeader('u', 'senha-secreta'));
});

test('erro de rede vira "sem conexão" sem vazar detalhes', async () => {
  const f = fakeFetch(new TypeError('fetch failed'));
  const r = await createServiceClient({ ...base, fetchImpl: f }).ping();
  assert.deepEqual(r, { name: 'octop', reachable: false, error: 'sem conexão' });
});

test('tempo esgotado vira "tempo esgotado"', async () => {
  const abort = new Error('aborted');
  abort.name = 'AbortError';
  const f = fakeFetch(abort);
  const r = await createServiceClient({ ...base, fetchImpl: f }).ping();
  assert.equal(r.error, 'tempo esgotado');
});

test('checkServices consulta os dois serviços', async () => {
  const cfg = loadConfig({
    OCTOP_BASE_URL: 'http://a:1',
    OCTOP_USERNAME: 'a',
    OCTOP_PASSWORD: 'a',
    HERMES_BASE_URL: 'http://b:2',
    HERMES_USERNAME: 'b',
    HERMES_PASSWORD: 'b',
  });
  const f = fakeFetch({ status: 200 });
  const results = await checkServices(cfg, f);
  assert.deepEqual(results.map((r) => r.name), ['octop', 'hermes']);
  assert.equal(f.calls.length, 2);
});
