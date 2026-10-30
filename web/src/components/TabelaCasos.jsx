import { STATUS_CASO } from '../lib/dados.js'

export default function TabelaCasos({ casos, vazio, onAbrir }) {
  return (
    <div className="tabela-wrap">
      <table className="tabela">
        <thead>
          <tr>
            <th scope="col">Caso</th>
            <th scope="col">Tipo</th>
            <th scope="col">Status</th>
            <th scope="col">Atualizado</th>
          </tr>
        </thead>
        <tbody>
          {casos.map((c) => (
            <tr key={c.id}>
              <td>
                <button type="button" className="caso-link" onClick={() => onAbrir(c)}>
                  {c.titulo}
                </button>
              </td>
              <td>{c.tipo}</td>
              <td><span className={`status status-${c.status}`}>{STATUS_CASO[c.status]}</span></td>
              <td className="meta">{c.atualizado}</td>
            </tr>
          ))}
          {casos.length === 0 && (
            <tr>
              <td colSpan={4} className="hint">{vazio}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
