// Cliente genérico para um serviço da VPS (Octop ou Hermes).
// Os caminhos exatos de login e de API ainda precisam ser confirmados na instância do cliente.

import { basicAuthHeader, request } from './http.js';

export function createServiceClient({ name, baseUrl, username, password, timeoutMs, fetchImpl }) {
  const headers = { Authorization: basicAuthHeader(username, password) };

  return {
    name,

    // Verifica se o serviço responde. Não envia senha em URL.
    async ping() {
      try {
        const res = await request(baseUrl, { headers, timeoutMs, fetchImpl });
        // Só 2xx conta como autorizado. 401 e 403 (bloqueio) não passam.
        return { name, reachable: true, status: res.status, authorized: res.ok };
      } catch (err) {
        return { name, reachable: false, error: err.name === 'AbortError' ? 'tempo esgotado' : 'sem conexão' };
      }
    },
  };
}
