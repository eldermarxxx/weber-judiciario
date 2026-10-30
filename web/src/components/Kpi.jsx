export default function Kpi({ rotulo, valor, dica }) {
  return (
    <div className="kpi">
      <span className="rotulo">{rotulo}</span>
      <strong className="kpi-valor">{valor}</strong>
      <p className="hint">{dica}</p>
    </div>
  )
}
