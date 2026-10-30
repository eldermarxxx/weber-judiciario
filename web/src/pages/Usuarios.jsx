import { useState } from 'react'
import { USUARIOS } from '../lib/dados.js'
import { PERFIS } from '../lib/perfis.js'

const STATUS = { ativo: 'Ativo', convite: 'Convite pendente', desativado: 'Desativado' }
const CLASSE = { ativo: 'status-concluido', convite: 'status-pendente', desativado: '' }
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NOVO = { nome: '', email: '', perfil: 'usuario' }

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(USUARIOS)
  const [busca, setBusca] = useState('')
  const [form, setForm] = useState(null) // null: formulário fechado
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  const termo = busca.trim().toLowerCase()
  const visiveis = usuarios.filter((u) => !termo || u.nome.toLowerCase().includes(termo) || u.email.includes(termo))
  const ativos = usuarios.filter((u) => u.status === 'ativo').length
  const pendentes = usuarios.filter((u) => u.status === 'convite').length

  function abrirConvite() {
    setForm({ ...NOVO })
    setErro('')
    setAviso('')
  }

  function convidar(e) {
    e.preventDefault()
    const email = form.email.trim().toLowerCase()
    if (!form.nome.trim()) {
      setErro('Informe o nome.')
      return
    }
    if (!EMAIL_VALIDO.test(email)) {
      setErro('Informe um e-mail válido.')
      return
    }
    if (usuarios.some((u) => u.email === email)) {
      setErro('Já existe um usuário com este e-mail.')
      return
    }
    setUsuarios([...usuarios, { id: `U-${Date.now()}`, nome: form.nome.trim(), email, perfil: form.perfil, status: 'convite', ultimoAcesso: null }])
    setForm(null)
    setErro('')
    setAviso('Convite registrado. O envio por e-mail ainda não está ligado neste protótipo.')
  }

  function alternarAtivo(id) {
    setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, status: u.status === 'ativo' ? 'desativado' : 'ativo' } : u)))
  }

  function cancelarConvite(id) {
    setUsuarios(usuarios.filter((u) => u.id !== id))
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Usuários</h1>
          <p className="meta">{ativos} ativos · {pendentes} convites pendentes</p>
        </div>
        {!form && (
          <button type="button" className="btn btn-primary" onClick={abrirConvite}>Convidar usuário</button>
        )}
      </header>

      <div className="pilha">
        {aviso && <p className="meta" role="status">{aviso}</p>}

        {form && (
          <section className="card" aria-labelledby="t-convite">
            <h2 id="t-convite">Convidar usuário</h2>
            <form onSubmit={convidar} noValidate>
              <div className="campos">
                <div>
                  <label className="rotulo" htmlFor="conv-nome">Nome</label>
                  <input id="conv-nome" className="campo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                </div>
                <div>
                  <label className="rotulo" htmlFor="conv-email">E-mail</label>
                  <input id="conv-email" type="email" className="campo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="rotulo" htmlFor="conv-perfil">Perfil</label>
                  <select id="conv-perfil" className="campo" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}>
                    {Object.entries(PERFIS).map(([id, nome]) => (
                      <option key={id} value={id}>{nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              {erro && <p className="erro" role="alert">{erro}</p>}
              <div className="actions">
                <button type="submit" className="btn btn-primary">Enviar convite</button>
                <button type="button" className="btn" onClick={() => setForm(null)}>Cancelar</button>
              </div>
            </form>
          </section>
        )}

        <section className="card" aria-labelledby="t-acessos">
          <h2 id="t-acessos">Acessos da conta</h2>
          <div className="filtros">
            <input
              className="campo campo-largo"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou e-mail"
              aria-label="Buscar usuários"
            />
          </div>
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Último acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>{PERFIS[u.perfil]}</td>
                    <td><span className={`status ${CLASSE[u.status]}`}>{STATUS[u.status]}</span></td>
                    <td className="nowrap">{u.ultimoAcesso ?? '—'}</td>
                    <td>
                      {u.status === 'convite' ? (
                        <button type="button" className="btn" onClick={() => cancelarConvite(u.id)}>Cancelar convite</button>
                      ) : (
                        <button type="button" className="btn" onClick={() => alternarAtivo(u.id)}>
                          {u.status === 'ativo' ? 'Desativar' : 'Reativar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {visiveis.length === 0 && (
                  <tr>
                    <td colSpan={6} className="hint">Nenhum usuário encontrado com essa busca.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
