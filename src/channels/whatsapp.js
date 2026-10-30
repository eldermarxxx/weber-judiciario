// Canal de WhatsApp via Evolution API. Rota de envio confirmada no código público do projeto
// (POST /message/sendText/{instância}, cabeçalho apikey). O nome do evento do webhook
// (messages.upsert) ainda precisa ser validado numa instância real.

const SUFIXO_INDIVIDUAL = '@s.whatsapp.net'

export function createWhatsAppChannel({ baseUrl, apiKey, instance, fetchImpl = fetch }) {
  return {
    // Envia texto para um número, só com dígitos e DDI (ex.: 5565999990000).
    async sendText(number, text) {
      const res = await fetchImpl(`${baseUrl}/message/sendText/${instance}`, {
        method: 'POST',
        headers: { apikey: apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, text }),
      })
      return { ok: res.ok, status: res.status }
    },
  }
}

// Lê uma mensagem recebida. Só conversa individual, vinda de outra pessoa, com texto.
// Devolve null para o resto (grupos, mensagens enviadas pelo próprio número, eventos sem texto).
export function parseIncoming(body) {
  if (!body || body.event !== 'messages.upsert') return null
  const data = body.data ?? {}
  const key = data.key ?? {}
  if (key.fromMe) return null
  const jid = key.remoteJid ?? ''
  if (!jid.endsWith(SUFIXO_INDIVIDUAL)) return null
  const text = data.message?.conversation ?? data.message?.extendedTextMessage?.text
  if (!text || !text.trim()) return null
  return { from: jid.slice(0, -SUFIXO_INDIVIDUAL.length), text: text.trim() }
}

// Trata um webhook recebido. O segredo fica no caminho da URL e precisa bater com o configurado.
export async function handleWebhook({ secret, pathSecret, body, channel, responder }) {
  if (!secret || pathSecret !== secret) return { status: 404 }
  const msg = parseIncoming(body)
  if (!msg) return { status: 200, handled: false }
  const reply = await responder(msg)
  const sent = await channel.sendText(msg.from, reply)
  return { status: 200, handled: true, sent: sent.ok }
}
