// Chamada HTTP comum para os serviços da VPS, com tempo limite.

export function basicAuthHeader(username, password) {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

export async function request(url, { method = 'GET', headers = {}, timeoutMs = 8000, fetchImpl = fetch } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { method, headers, signal: controller.signal });
    return { ok: res.ok, status: res.status };
  } finally {
    clearTimeout(timer);
  }
}
