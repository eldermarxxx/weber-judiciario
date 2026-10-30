import { useEffect, useRef, useState } from 'react'
import { CASOS, STATUS_CASO } from '../lib/dados.js'
import TabelaCasos from '../components/TabelaCasos.jsx'

export default function Casos({ ir }) {
  const [filtro, setFiltro] = useState('')
  const [status, setStatus] = useState('todos')
  const campoBusca = useRef(null)

  // Tecla "/" leva o foco para a busca, salvo quando já se está digitando em um campo.
  useEffect(() => {
    function atalho(e) {
      if (e.key !== '/' || (e.target instanceof HTMLElement && e.target.matches('input, textarea, select'))) return
      e.preventDefault()
      campoBusca.current.focus()
    }
    document.addEventListener('keydown', atalho)
    return () => document.removeEventListener('keydown', atalho)
  }, [])

  const visiveis = CASOS.filter((c) => {
    const busca = filtro.trim().toLowerCase()
    const bateBusca = !busca || c.titulo.toLowerCase().includes(busca) || c.tipo.toLowerCase().includes(busca)
    const bateStatus = status === 'todos' || c.status === status
    return bateBusca && bateStatus
  })

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Casos</h1>
          <p className="meta">{visiveis.length} de {CASOS.length} casos</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => ir('Minuta')}>Nova minuta</button>
      </header>

      <section className="card" aria-labelledby="t-lista">
        <h2 id="t-lista">Lista de casos</h2>
        <div className="filtros">
          <div className="busca">
            <input
              ref={campoBusca}
              className="campo"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar por título ou tipo"
              aria-label="Buscar casos"
            />
            <kbd className="tecla" aria-hidden="true">/</kbd>
          </div>
          <select className="campo" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por status">
            <option value="todos">Todos os status</option>
            {Object.entries(STATUS_CASO).map(([id, nome]) => (
              <option key={id} value={id}>{nome}</option>
            ))}
          </select>
        </div>

        <TabelaCasos casos={visiveis} vazio="Nenhum caso encontrado com esse filtro." onAbrir={() => ir('Minuta')} />
      </section>
    </>
  )
}
