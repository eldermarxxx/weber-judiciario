import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from '../src/App.jsx'

const ADMIN = ['Usuários', 'Treinamento', 'Modelos', 'Uso', 'Configurações']
const EVOLUTION = 'Este sistema usa a Evolution API para o canal de WhatsApp.'

const verComoUsuario = () => fireEvent.click(screen.getByRole('button', { name: 'Ver como usuário' }))
const linhaDe = (texto) => screen.getByText(texto).closest('tr')
const kpi = (rotulo) => screen.getByText(rotulo).closest('.kpi')

describe('menu por perfil', () => {
  it('administrador vê o menu separado em trabalho e administração', () => {
    render(<App />)
    expect(screen.getByText('Trabalho')).toBeInTheDocument()
    expect(screen.getByText('Administração')).toBeInTheDocument()
    for (const tela of ADMIN) expect(screen.getByRole('button', { name: tela })).toBeInTheDocument()
  })

  it('usuário não vê a área administrativa no menu', () => {
    render(<App />)
    verComoUsuario()
    expect(screen.queryByText('Administração')).not.toBeInTheDocument()
    for (const tela of ADMIN) expect(screen.queryByRole('button', { name: tela })).not.toBeInTheDocument()
    for (const tela of ['Início', 'Casos', 'Minuta']) expect(screen.getByRole('button', { name: tela })).toBeInTheDocument()
  })

  it('usuário que estava no treinamento cai no início e não vê os documentos', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Treinamento' }))
    expect(screen.getByRole('heading', { name: 'Treinamento do robô' })).toBeInTheDocument()
    verComoUsuario()
    expect(screen.getByRole('heading', { name: 'Início' })).toBeInTheDocument()
    expect(screen.queryByText('Treinamento do robô')).not.toBeInTheDocument()
    expect(screen.queryByText('Decisão exemplo 01.pdf')).not.toBeInTheDocument()
  })

  it('administrador volta a ver tudo ao sair da visualização de usuário', () => {
    render(<App />)
    verComoUsuario()
    fireEvent.click(screen.getByRole('button', { name: 'Voltar ao administrador' }))
    expect(screen.getByRole('button', { name: 'Treinamento' })).toBeInTheDocument()
  })
})

describe('usuários (área administrativa)', () => {
  it('lista a conta com perfil e status', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Usuários' }))
    expect(screen.getByRole('heading', { name: 'Usuários' })).toBeInTheDocument()
    expect(within(linhaDe('ana@exemplo.com')).getByText('Usuário')).toBeInTheDocument()
    expect(within(linhaDe('ana@exemplo.com')).getByText('Ativo')).toBeInTheDocument()
    expect(within(linhaDe('carla@exemplo.com')).getByText('Convite pendente')).toBeInTheDocument()
  })

  it('busca por nome ou e-mail', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Usuários' }))
    fireEvent.change(screen.getByLabelText('Buscar usuários'), { target: { value: 'bruno' } })
    expect(screen.queryByText('ana@exemplo.com')).not.toBeInTheDocument()
    expect(screen.getByText('bruno@exemplo.com')).toBeInTheDocument()
  })

  it('convida um usuário novo e recusa e-mail repetido', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Usuários' }))
    fireEvent.click(screen.getByRole('button', { name: 'Convidar usuário' }))
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Diego Exemplo' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ANA@exemplo.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar convite' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Já existe um usuário com este e-mail.')

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'diego@exemplo.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar convite' }))
    expect(within(linhaDe('diego@exemplo.com')).getByText('Convite pendente')).toBeInTheDocument()
    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument()
  })

  it('convite exige nome e e-mail válido', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Usuários' }))
    fireEvent.click(screen.getByRole('button', { name: 'Convidar usuário' }))
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'nao-e-email' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar convite' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome.')
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Diego' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar convite' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Informe um e-mail válido.')
  })

  it('desativa, reativa e cancela convite', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Usuários' }))
    fireEvent.click(within(linhaDe('ana@exemplo.com')).getByRole('button', { name: 'Desativar' }))
    expect(within(linhaDe('ana@exemplo.com')).getByText('Desativado')).toBeInTheDocument()
    fireEvent.click(within(linhaDe('ana@exemplo.com')).getByRole('button', { name: 'Reativar' }))
    expect(within(linhaDe('ana@exemplo.com')).getByText('Ativo')).toBeInTheDocument()
    fireEvent.click(within(linhaDe('carla@exemplo.com')).getByRole('button', { name: 'Cancelar convite' }))
    expect(screen.queryByText('carla@exemplo.com')).not.toBeInTheDocument()
  })
})

describe('treinamento do robô (só administrador)', () => {
  it('mostra os documentos da conta e avisa que usuários não veem', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Treinamento' }))
    expect(screen.getByText('Decisão exemplo 01.pdf')).toBeInTheDocument()
    expect(screen.getByText(/Usuários convidados não veem/)).toBeInTheDocument()
  })

  it('envia documentos, que entram na fila, e treina o robô', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Treinamento' }))
    const arquivo = new File(['texto'], 'acordao-novo.pdf', { type: 'application/pdf' })
    fireEvent.change(screen.getByLabelText('Enviar documentos'), { target: { files: [arquivo] } })
    expect(within(linhaDe('acordao-novo.pdf')).getByText('Na fila')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Treinar robô' }))
    expect(within(linhaDe('acordao-novo.pdf')).getByText('Indexado')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('2 documentos indexados')
  })
})

describe('início em formato de painel', () => {
  it('mostra os indicadores de casos e de minutas', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Início' }))
    expect(within(kpi('Em andamento')).getByText('2')).toBeInTheDocument()
    expect(within(kpi('Concluídos')).getByText('1')).toBeInTheDocument()
    expect(within(kpi('Minutas no mês')).getByText('7 de 30')).toBeInTheDocument()
  })
})

describe('telas novas seguem as regras do painel', () => {
  it('Usuários e Treinamento têm o aviso e no máximo um botão amarelo', () => {
    render(<App />)
    for (const nome of ['Usuários', 'Treinamento']) {
      fireEvent.click(screen.getByRole('button', { name: nome }))
      expect(screen.getByText(EVOLUTION), nome).toBeInTheDocument()
      expect(document.querySelectorAll('.btn-primary').length, nome).toBeLessThanOrEqual(1)
    }
  })
})
