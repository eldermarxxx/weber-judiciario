import { useState } from 'react'
import { DOCUMENTOS_TREINO } from '../lib/dados.js'
import Kpi from '../components/Kpi.jsx'

const STATUS = { indexado: 'Indexado', fila: 'Na fila' }
const CLASSE = { indexado: 'status-concluido', fila: 'status-pendente' }

export default function Treinamento() {
  const [documentos, setDocumentos] = useState(DOCUMENTOS_TREINO)
  const [aviso, setAviso] = useState('')

  const naFila = documentos.filter((d) => d.status === 'fila').length
  const indexados = documentos.length - naFila

  function enviar(e) {
    const novos = [...e.target.files].map((arquivo, i) => ({
      id: `N-${Date.now()}-${i}`,
      nome: arquivo.name,
      tipo: 'A classificar',
      enviadoEm: new Date().toLocaleDateString('pt-BR'),
      status: 'fila',
    }))
    setDocumentos([...documentos, ...novos])
    setAviso('')
    e.target.value = ''
  }

  function treinar() {
    setDocumentos(documentos.map((d) => (d.status === 'fila' ? { ...d, status: 'indexado' } : d)))
    if (naFila === 0) {
      setAviso('Nenhum documento novo para treinar.')
      return
    }
    const quantos = naFila === 1 ? '1 documento indexado' : `${naFila} documentos indexados`
    setAviso(`${quantos}. Treino simulado: o robô ainda não está ligado ao backend.`)
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Treinamento do robô</h1>
          <p className="meta">Documentos desta conta que ensinam o robô</p>
        </div>
        <div className="page-acoes">
          <label className="btn btn-primary arquivo-botao">
            Enviar documentos
            <input type="file" multiple accept=".pdf,.doc,.docx" className="arquivo" onChange={enviar} />
          </label>
          <button type="button" className="btn" onClick={treinar}>Treinar robô</button>
        </div>
      </header>

      <div className="pilha">
        <p className="hint">Esta área só aparece para administradores. Usuários convidados não veem documentos nem o treinamento.</p>

        <div className="kpis">
          <Kpi rotulo="Documentos" valor={documentos.length} dica="Enviados pela conta" />
          <Kpi rotulo="Indexados" valor={indexados} dica="Já usados pelo robô" />
          <Kpi rotulo="Na fila" valor={naFila} dica="Aguardando o próximo treino" />
        </div>

        <section className="card" aria-labelledby="t-documentos">
          <h2 id="t-documentos">Documentos</h2>
          {aviso && <p className="meta" role="status">{aviso}</p>}
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Arquivo</th>
                  <th>Tipo</th>
                  <th>Enviado em</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((d) => (
                  <tr key={d.id}>
                    <td>{d.nome}</td>
                    <td>{d.tipo}</td>
                    <td className="nowrap">{d.enviadoEm}</td>
                    <td><span className={`status ${CLASSE[d.status]}`}>{STATUS[d.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
