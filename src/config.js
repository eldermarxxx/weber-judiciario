// Lê a configuração do ambiente. Segredos nunca têm valor padrão no código.

const REQUIRED = [
  'OCTOP_BASE_URL',
  'OCTOP_USERNAME',
  'OCTOP_PASSWORD',
  'HERMES_BASE_URL',
  'HERMES_USERNAME',
  'HERMES_PASSWORD',
];

export function loadConfig(env = process.env) {
  const missing = REQUIRED.filter((name) => !env[name] || !env[name].trim());
  if (missing.length > 0) {
    // Mostra só os nomes das variáveis, nunca os valores.
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }

  const timeout = Number(env.REQUEST_TIMEOUT_MS ?? 8000);
  if (!Number.isInteger(timeout) || timeout <= 0) {
    throw new Error('REQUEST_TIMEOUT_MS deve ser um inteiro positivo');
  }

  return {
    requestTimeoutMs: timeout,
    octop: {
      baseUrl: env.OCTOP_BASE_URL.trim(),
      username: env.OCTOP_USERNAME.trim(),
      password: env.OCTOP_PASSWORD,
    },
    hermes: {
      baseUrl: env.HERMES_BASE_URL.trim(),
      username: env.HERMES_USERNAME.trim(),
      password: env.HERMES_PASSWORD,
    },
  };
}

// Versão segura para log: mostra o que está configurado, sem senhas.
export function describeConfig(config) {
  return {
    requestTimeoutMs: config.requestTimeoutMs,
    octop: { baseUrl: config.octop.baseUrl, username: config.octop.username, password: '***' },
    hermes: { baseUrl: config.hermes.baseUrl, username: config.hermes.username, password: '***' },
  };
}
