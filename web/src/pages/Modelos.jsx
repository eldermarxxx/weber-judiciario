import { useState } from 'react'
import { MODELOS } from '../lib/dados.js'

export default function Modelos() {
  const [id, setId] = useState(MODELOS[0].id)
  const modelo = MODELOS.find((m) => m.id === id)
  const [texto, setTexto] = useState(modelo.texto)
  const [salvo, setSalvo] = useState(false)
  const [alterado, setAlterado] = useState(false)

  function escolher(novoId) {
    const novo = MODELOS.find((m) => m.id === novoId)
    setId(novoId)
    setTexto(novo.texto)
    setSalvo(false)
    setAlterado(false)
  }

  function salvar() {
    setSalvo(true)
    setAlterado(false)
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Modelos</h1>
          <p className="meta">Estrutura de cada tipo de decisão. Edite sem código.</p>
        </div>
      </header>

      <div className="grid">
        <section className="card" aria-labelledby="t-tipos">
          <h2 id="t-tipos">Tipos de decisão</h2>
          <ul className="lista-tipos">
            {MODELOS.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`item-tipo ${m.id === id ? 'on' : ''}`}
                  aria-current={m.id === id ? 'true' : undefined}
                  onClick={() => escolher(m.id)}
                >
                  {m.nome}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="t-editor">
          <h2 id="t-editor">{modelo.nome}</h2>
          <textarea
            className="doc"
            aria-label={`Texto do modelo ${modelo.nome}`}
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value)
              setSalvo(false)
              setAlterado(true)
            }}
          />
          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={salvar}>
              Salvar modelo
            </button>
            {alterado && <span className="meta" role="status">Alterações não salvas</span>}
            {salvo && <span className="meta" role="status">Modelo salvo</span>}
          </div>
        </section>
      </div>
    </>
  )
}
