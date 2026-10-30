import { USO_MES } from '../lib/dados.js'

function percentual(usado, limite) {
  if (limite <= 0) return 0
  return Math.min(Math.round((usado / limite) * 100), 100)
}

function formatar(n) {
  return n.toLocaleString('pt-BR')
}

export default function Uso() {
  const pctMinutas = percentual(USO_MES.minutasUsadas, USO_MES.minutasLimite)
  const pctTokens = percentual(USO_MES.tokensUsados, USO_MES.tokensLimite)
  const restantes = USO_MES.minutasLimite - USO_MES.minutasUsadas

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Uso</h1>
          <p className="meta">Consumo do mês e limite do plano</p>
        </div>
      </header>

      <div className="grid">
        <section className="card" aria-labelledby="t-minutas">
          <h2 id="t-minutas">Minutas</h2>
          <p className="meta">{USO_MES.minutasUsadas} de {USO_MES.minutasLimite} minutas usadas</p>
          <div className="meter" role="meter" aria-label="Minutas usadas no mês" aria-valuemin={0} aria-valuemax={USO_MES.minutasLimite} aria-valuenow={USO_MES.minutasUsadas}>
            <span style={{ width: `${pctMinutas}%` }} />
          </div>
          <p className="hint">Restam {restantes} minutas neste plano.</p>
        </section>

        <section className="card" aria-labelledby="t-tokens">
          <h2 id="t-tokens">Tokens de IA</h2>
          <p className="meta">{formatar(USO_MES.tokensUsados)} de {formatar(USO_MES.tokensLimite)} tokens usados</p>
          <div className="meter" role="meter" aria-label="Tokens usados no mês" aria-valuemin={0} aria-valuemax={USO_MES.tokensLimite} aria-valuenow={USO_MES.tokensUsados}>
            <span style={{ width: `${pctTokens}%` }} />
          </div>
          <p className="hint">O consumo de IA fica incluso no plano dentro desse limite.</p>
        </section>
      </div>
    </>
  )
}
