import { CASOS, USO_MES } from '../lib/dados.js'
import { usageSummary } from '../lib/minuta.js'
import TabelaCasos from '../components/TabelaCasos.jsx'
import Kpi from '../components/Kpi.jsx'

export default function Inicio({ ir }) {
  // shortcut: os dados fictícios já vêm do mais recente, ordenar pela data quando a API existir
  const recentes = CASOS.slice(0, 3)
  const uso = usageSummary(USO_MES.minutasUsadas, USO_MES.minutasLimite)
  const emAndamento = CASOS.filter((c) => c.status !== 'concluido').length
  const concluidos = CASOS.length - emAndamento

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Início</h1>
          <p className="meta">Acompanhe os casos e comece uma minuta nova</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => ir('Minuta')}>Nova minuta</button>
      </header>

      <div className="pilha">
        <div className="kpis">
          <Kpi rotulo="Em andamento" valor={emAndamento} dica="Rascunhos e casos em revisão" />
          <Kpi rotulo="Concluídos" valor={concluidos} dica={`De ${CASOS.length} casos`} />
          <Kpi rotulo="Minutas no mês" valor={`${uso.used} de ${uso.limit}`} dica="No plano atual" />
        </div>

        <div className="grid">
          <section className="card" aria-labelledby="t-recentes">
            <h2 id="t-recentes">Casos recentes</h2>
            <TabelaCasos casos={recentes} vazio="Nenhum caso ainda." onAbrir={() => ir('Minuta')} />
          </section>

          <aside className="side">
            <section className="card" aria-labelledby="t-uso">
              <h2 id="t-uso">Uso do mês</h2>
              <p className="meta">{uso.used} de {uso.limit} minutas usadas</p>
              <div
                className="meter"
                role="meter"
                aria-label="Minutas usadas no mês"
                aria-valuemin={0}
                aria-valuemax={uso.limit}
                aria-valuenow={uso.used}
              >
                <span style={{ width: `${uso.percent}%` }} />
              </div>
              <p className="hint">Restam {uso.remaining} minutas neste plano.</p>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
