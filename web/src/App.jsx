import { useLayoutEffect, useRef, useState } from 'react'
import Inicio from './pages/Inicio.jsx'
import Minuta from './pages/Minuta.jsx'
import Casos from './pages/Casos.jsx'
import Modelos from './pages/Modelos.jsx'
import Uso from './pages/Uso.jsx'
import Configuracoes from './pages/Configuracoes.jsx'
import Usuarios from './pages/Usuarios.jsx'
import Treinamento from './pages/Treinamento.jsx'
import { PERFIS, menuDo, podeVer } from './lib/perfis.js'

const TELAS = {
  Início: Inicio,
  Casos,
  Minuta,
  Usuários: Usuarios,
  Treinamento,
  Modelos,
  Uso,
  Configurações: Configuracoes,
}

export default function App() {
  const [page, setPage] = useState('Minuta')
  // Pré-visualização de perfil: quando o login existir, o perfil vem do servidor e este botão some.
  const [perfil, setPerfil] = useState('administrador')
  const atual = podeVer(perfil, page) ? page : 'Início'
  const Tela = TELAS[atual]
  const lista = useRef(null)
  const [marca, setMarca] = useState({ y: 0, h: 40 })

  // Mede o item ativo para o indicador deslizar mesmo com os rótulos de grupo entre eles
  useLayoutEffect(() => {
    const ativo = lista.current?.querySelector('.menu-item.on')
    if (ativo) setMarca({ y: ativo.offsetTop, h: ativo.offsetHeight })
  }, [atual, perfil])

  return (
    <div className="app">
      <nav className="menu" aria-label="Menu principal">
        <div className="brand">
          <span className="marca" aria-hidden="true">AM</span>
          <span>Assistente de Minutas</span>
        </div>
        <div className="menu-lista" ref={lista}>
          <span className="menu-indicador" aria-hidden="true" style={{ '--y': `${marca.y}px`, '--h': `${marca.h}px` }} />
          {menuDo(perfil).map(({ grupo, telas }) => (
            <div className="menu-grupo" key={grupo}>
              <p className="menu-rotulo">{grupo}</p>
              {telas.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`menu-item ${atual === item ? 'on' : ''}`}
                  aria-current={atual === item ? 'page' : undefined}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="menu-conta">
          <span className="meta">Perfil: {PERFIS[perfil]}</span>
          <button
            type="button"
            className="btn"
            onClick={() => setPerfil(perfil === 'administrador' ? 'usuario' : 'administrador')}
          >
            {perfil === 'administrador' ? 'Ver como usuário' : 'Voltar ao administrador'}
          </button>
        </div>
      </nav>

      <main className="content">
        <div className="tela" key={atual}>
          <Tela ir={setPage} />
        </div>
        <p className="meta aviso">Este sistema usa a Evolution API para o canal de WhatsApp.</p>
      </main>
    </div>
  )
}
