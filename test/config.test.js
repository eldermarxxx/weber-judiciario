import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, describeConfig } from '../src/config.js';

const full = {
  OCTOP_BASE_URL: 'http://10.0.0.5:8088',
  OCTOP_USERNAME: 'cliente-octop',
  OCTOP_PASSWORD: 'segredo-octop-123',
  HERMES_BASE_URL: 'http://10.0.0.5:9119',
  HERMES_USERNAME: 'cliente-hermes',
  HERMES_PASSWORD: 'segredo-hermes-456',
};

test('carrega configuração completa do ambiente', () => {
  const cfg = loadConfig(full);
  assert.equal(cfg.octop.baseUrl, 'http://10.0.0.5:8088');
  assert.equal(cfg.hermes.username, 'cliente-hermes');
  assert.equal(cfg.hermes.password, 'segredo-hermes-456');
  assert.equal(cfg.requestTimeoutMs, 8000);
});

test('lista só os nomes das variáveis ausentes, sem valores', () => {
  const env = { ...full, OCTOP_PASSWORD: '', HERMES_BASE_URL: '   ' };
  assert.throws(
    () => loadConfig(env),
    (err) => {
      assert.match(err.message, /OCTOP_PASSWORD/);
      assert.match(err.message, /HERMES_BASE_URL/);
      assert.doesNotMatch(err.message, /segredo-/);
      return true;
    },
  );
});

test('recusa timeout inválido', () => {
  assert.throws(() => loadConfig({ ...full, REQUEST_TIMEOUT_MS: '-1' }), /REQUEST_TIMEOUT_MS/);
  assert.throws(() => loadConfig({ ...full, REQUEST_TIMEOUT_MS: 'abc' }), /REQUEST_TIMEOUT_MS/);
});

test('descrição para log nunca contém senha', () => {
  const text = JSON.stringify(describeConfig(loadConfig(full)));
  assert.doesNotMatch(text, /segredo-/);
  assert.match(text, /cliente-octop/);
});
