import { useState } from 'react'
import {
  INITIAL_TEXT,
  STATUS,
  applyAdjustment,
  statusAfterAdjustment,
  statusAfterReview,
  usageSummary,
} from '../lib/minuta.js'

const CHIPS = [
  'Fundamente melhor',
  'Encurte o texto',
  'Use um tom mais formal',
  'Cite precedente',
]

const USAGE = usageSummary(7, 30)

export default function Minuta() {
  const [text, setText] = useState(INITIAL_TEXT)
  const [status, setStatus] = useState(STATUS.rascunho)
  const [history, setHistory] = useState([
    { id: 0, from: 'assistant', text: 'Diga o que quer mudar. Pode ser em linguagem simples, como “deixe o ponto 2 mais curto”.' },
  ])
  const [draft, setDraft] = useState('')
  const [toast, setToast] = useState('')
  const [adjustments, setAdjustments] = useState(0)

  function notify(message) {
    setToast(message)
    window.clearTimeout(notify.timer)
    notify.timer = window.setTimeout(() => setToast(''), 2200)
  }

  function requestAdjustment(request) {
    const value = request.trim()
    if (!value) return
    const number = adjustments + 1
    setAdjustments(number)
    setHistory((h) => [
      ...h,
      { id: h.length, from: 'user', text: value },
      { id: h.length + 1, from: 'assistant', text: 'Pronto. Ajustei conforme o pedido e mantive o restante do texto. Revise o trecho marcado.' },
    ])
    setText((t) => applyAdjustment(t, value, number))
    setStatus(statusAfterAdjustment())
    setDraft('')
  }

  function onSubmit(event) {
    event.preventDefault()
    requestAdjustment(draft)
  }

  function markReviewed() {
    setStatus(statusAfterReview())
    notify('Caso marcado como revisado')
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Minuta do caso</h1>
          <p className="meta">Exemplo fictício · Processo nº 0000000-00.0000.0.00.0000 · Decisão de indeferimento</p>
        </div>
        <div className="page-acoes">
          <span className={`status status-${status.id}`} aria-live="polite">{status.label}</span>
          <button type="button" className="btn btn-primary" onClick={markReviewed}>
            Marcar como revisada
          </button>
        </div>
      </header>

      <div className="grid">
        <section className="card" aria-labelledby="t-doc">
          <h2 id="t-doc">Texto da decisão</h2>
          <textarea
            className="doc"
            aria-label="Texto da minuta"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="actions">
            <button type="button" className="btn" onClick={() => notify('Rascunho salvo')}>
              Salvar rascunho
            </button>
            <button type="button" className="btn" onClick={() => notify('Exportação em DOCX (protótipo)')}>
              Exportar DOCX
            </button>
            <button type="button" className="btn" onClick={() => notify('Exportação em PDF (protótipo)')}>
              Exportar PDF
            </button>
          </div>
        </section>

        <aside className="side">
          <section className="card" aria-labelledby="t-ajuste">
            <h2 id="t-ajuste">Pedir ajuste</h2>
            <div className="chips">
              {CHIPS.map((chip) => (
                <button key={chip} type="button" className="chip" onClick={() => requestAdjustment(chip)}>
                  {chip}
                </button>
              ))}
            </div>
            <div className="history" aria-live="polite">
              {history.map((m) => (
                <div key={m.id} className={`bubble ${m.from === 'user' ? 'bubble-me' : ''}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form className="msg" onSubmit={onSubmit}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ex.: fundamente melhor o ponto 2"
                aria-label="Pedido de ajuste"
              />
              <button type="submit" className="btn">Enviar</button>
            </form>
            <p className="hint">Cada ajuste fica salvo no histórico do caso.</p>
          </section>

          <section className="card" aria-labelledby="t-uso">
            <h2 id="t-uso">Uso do mês</h2>
            <p className="meta">{USAGE.used} de {USAGE.limit} minutas usadas</p>
            <div
              className="meter"
              role="meter"
              aria-label="Uso do mês"
              aria-valuemin={0}
              aria-valuemax={USAGE.limit}
              aria-valuenow={USAGE.used}
            >
              <span style={{ width: `${USAGE.percent}%` }} />
            </div>
            <p className="hint">Restam {USAGE.remaining} minutas neste plano.</p>
          </section>
        </aside>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
