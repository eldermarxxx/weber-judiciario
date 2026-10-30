import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App.jsx'

describe('menu e telas do painel', () => {
  it('Casos mostra a lista e filtra pela busca', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Casos' }))
    expect(screen.getByRole('heading', { name: 'Casos' })).toBeInTheDocument()
    expect(screen.getByText('Caso fictício 1')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Buscar casos'), { target: { value: 'eleitoral' } })
    expect(screen.queryByText('Caso fictício 1')).not.toBeInTheDocument()
    expect(screen.getByText('Caso fictício 2')).toBeInTheDocument()
  })

  it('Casos filtra por status', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Casos' }))
    fireEvent.change(screen.getByLabelText('Filtrar por status'), { target: { value: 'concluido' } })
    expect(screen.getByText('Caso fictício 3')).toBeInTheDocument()
    expect(screen.queryByText('Caso fictício 1')).not.toBeInTheDocument()
  })

  it('Casos sem resultado mostra a mensagem vazia', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Casos' }))
    fireEvent.change(screen.getByLabelText('Buscar casos'), { target: { value: 'nada disso' } })
    expect(screen.getByText('Nenhum caso encontrado com esse filtro.')).toBeInTheDocument()
  })

  it('tecla / leva o foco para a busca de casos', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Casos' }))
    fireEvent.keyDown(document, { key: '/' })
    expect(screen.getByLabelText('Buscar casos')).toHaveFocus()
  })

  it('Casos leva à minuta pelo botão Nova minuta', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Casos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Nova minuta' }))
    expect(screen.getByRole('heading', { name: 'Minuta do caso' })).toBeInTheDocument()
  })

  it('Modelos avisa de alterações não salvas e some ao salvar', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Modelos' }))
    fireEvent.change(screen.getByLabelText(/Texto do modelo Decisão interlocutória/), { target: { value: 'novo texto' } })
    expect(screen.getByText('Alterações não salvas')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Salvar modelo' }))
    expect(screen.queryByText('Alterações não salvas')).not.toBeInTheDocument()
    expect(screen.getByText('Modelo salvo')).toBeInTheDocument()
  })

  it('Modelos troca o texto ao escolher outro tipo', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Modelos' }))
    const editor = screen.getByLabelText(/Texto do modelo Decisão interlocutória/)
    expect(editor.value).toContain('Requisitos da tutela de urgência')
    fireEvent.click(screen.getByRole('button', { name: 'Sentença de mérito' }))
    expect(screen.getByLabelText(/Texto do modelo Sentença de mérito/).value).toContain('Análise das provas')
  })

  it('Modelos salva e confirma', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Modelos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar modelo' }))
    expect(screen.getByText('Modelo salvo')).toBeInTheDocument()
  })

  it('Uso mostra minutas e tokens com o que resta', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Uso' }))
    expect(screen.getByText('7 de 30 minutas usadas')).toBeInTheDocument()
    expect(screen.getByText('Restam 23 minutas neste plano.')).toBeInTheDocument()
    expect(screen.getByText('1.250.000 de 5.000.000 tokens usados')).toBeInTheDocument()
  })

  it('Configurações mostra o canal como não conectado e salva o nome', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Configurações' }))
    expect(screen.getByText('Não conectado')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Nome de exibição'), { target: { value: 'Servidor' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByText('Alterações salvas')).toBeInTheDocument()
  })

  it('Início mostra os casos recentes e leva à minuta', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Início' }))
    expect(screen.getByRole('heading', { name: 'Início' })).toBeInTheDocument()
    expect(screen.getByText('Caso fictício 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Nova minuta' }))
    expect(screen.getByRole('heading', { name: 'Minuta do caso' })).toBeInTheDocument()
  })

  it('tabela de casos fica numa área com rolagem própria, sem estourar a página no celular', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Início' }))
    expect(container.querySelector('.tabela-wrap > table')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Casos' }))
    expect(container.querySelector('.tabela-wrap > table')).toBeInTheDocument()
  })

  it('Início abre o caso ao clicar no título', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Início' }))
    fireEvent.click(screen.getByRole('button', { name: 'Caso fictício 1' }))
    expect(screen.getByRole('heading', { name: 'Minuta do caso' })).toBeInTheDocument()
  })

  it('Início mostra o uso do mês com o que resta', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Início' }))
    expect(screen.getByText('Restam 23 minutas neste plano.')).toBeInTheDocument()
  })

  it('aviso da Evolution API aparece em todas as telas', () => {
    render(<App />)
    for (const nome of ['Início', 'Casos', 'Minuta', 'Modelos', 'Uso', 'Configurações']) {
      fireEvent.click(screen.getByRole('button', { name: nome }))
      expect(screen.getByText('Este sistema usa a Evolution API para o canal de WhatsApp.'), nome).toBeInTheDocument()
    }
  })

  it('cada tela tem um único botão amarelo', () => {
    render(<App />)
    for (const nome of ['Início', 'Casos', 'Modelos', 'Uso', 'Configurações']) {
      fireEvent.click(screen.getByRole('button', { name: nome }))
      const primarios = document.querySelectorAll('.btn-primary')
      expect(primarios.length, nome).toBeLessThanOrEqual(1)
    }
  })
})
