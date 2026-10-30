// Regras da minuta, sem React. Testadas isoladamente.

export const STATUS = {
  rascunho: { id: 'rascunho', label: 'Rascunho' },
  revisao: { id: 'revisao', label: 'Em revisão' },
  concluida: { id: 'concluida', label: 'Concluída' },
}

export const INITIAL_TEXT = [
  'DECISÃO',
  '',
  'Vistos.',
  '',
  'Trata-se de pedido apresentado pela parte autora, em que se requer [objeto do pedido].',
  '',
  '1. Dos fatos',
  'Os autos demonstram que [resumo dos fatos relevantes].',
  '',
  '2. Da fundamentação',
  'Não se verificam, no caso, os requisitos exigidos para o deferimento do pedido, pois [fundamento principal]. A jurisprudência consolidada sobre a matéria orienta no mesmo sentido.',
  '',
  '3. Do dispositivo',
  'Diante do exposto, INDEFIRO o pedido.',
  '',
  'Intimem-se.',
].join('\n')

const DISPOSITIVO = '3. Do dispositivo'

// Insere o pedido como trecho marcado, logo antes do dispositivo.
// Se o texto não tiver a seção, o trecho vai para o fim.
export function applyAdjustment(text, request, number) {
  const block = `[Ajuste ${number}: ${request}]`
  const index = text.indexOf(DISPOSITIVO)
  if (index === -1) return `${text}\n\n${block}`
  return `${text.slice(0, index)}${block}\n\n${text.slice(index)}`
}

// Qualquer ajuste manda o caso para revisão. Concluída só volta a ser rascunho/revisão por ação explícita.
export function statusAfterAdjustment() {
  return STATUS.revisao
}

export function statusAfterReview() {
  return STATUS.concluida
}

export function usageSummary(used, limit) {
  const remaining = Math.max(limit - used, 0)
  const percent = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  return { used, limit, remaining, percent }
}
