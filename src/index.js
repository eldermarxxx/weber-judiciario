import { pathToFileURL } from 'node:url';
import { loadConfig, describeConfig } from './config.js';
import { createServiceClient } from './clients/service.js';

// Ponto de entrada: confere a configuração e a conectividade dos dois serviços.
export async function checkServices(config, fetchImpl) {
  const clients = [
    createServiceClient({ name: 'octop', ...config.octop, timeoutMs: config.requestTimeoutMs, fetchImpl }),
    createServiceClient({ name: 'hermes', ...config.hermes, timeoutMs: config.requestTimeoutMs, fetchImpl }),
  ];
  return Promise.all(clients.map((c) => c.ping()));
}

// Só roda quando chamado direto: `npm start`.
// pathToFileURL trata espaços no caminho (a pasta do projeto tem espaço).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = loadConfig();
  console.log('Configuração carregada:', JSON.stringify(describeConfig(config), null, 2));
  const results = await checkServices(config);
  for (const r of results) console.log(r);
}
