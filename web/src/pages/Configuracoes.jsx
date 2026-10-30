import { useState } from 'react'
import { CANAL } from '../lib/dados.js'

export default function Configuracoes() {
  const [nome, setNome] = useState('')
  const [salvo, setSalvo] = useState(false)

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Configurações</h1>
          <p className="meta">Conta, canal de atendimento e aparência</p>
        </div>
      </header>

      <div className="grid">
        <section className="card" aria-labelledby="t-conta">
          <h2 id="t-conta">Conta</h2>
          <label className="rotulo" htmlFor="nome">Nome de exibição</label>
          <input
            id="nome"
            className="campo"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value)
              setSalvo(false)
            }}
            placeholder="Como você quer ser chamado"
          />
          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={() => setSalvo(true)}>
              Salvar
            </button>
            {salvo && <span className="meta" role="status">Alterações salvas</span>}
          </div>
        </section>

        <section className="card" aria-labelledby="t-canal">
          <h2 id="t-canal">Canal de atendimento</h2>
          <p className="meta">{CANAL.nome}</p>
          <span className={`status ${CANAL.conectado ? 'status-concluido' : 'status-rascunho'}`}>
            {CANAL.conectado ? 'Conectado' : 'Não conectado'}
          </span>
          <p className="hint">A conexão do WhatsApp é feita pela equipe técnica e ainda não está ativa neste ambiente.</p>
        </section>

        <section className="card" aria-labelledby="t-aparencia">
          <h2 id="t-aparencia">Aparência</h2>
          <p className="hint">O tema escuro é o padrão deste painel.</p>
        </section>
      </div>
    </>
  )
}
