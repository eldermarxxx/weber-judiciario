import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App.jsx'

describe('tela de Minuta', () => {
  it('abre na tela de Minuta com status de rascunho', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Minuta do caso' })).toBeInTheDocument()
    expect(screen.getByText('Rascunho')).toBeInTheDocument()
  })

  it('tem uma única ação primária', () => {
    const { container } = render(<App />)
    expect(container.querySelectorAll('.btn-primary')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Marcar como revisada' })).toHaveClass('btn-primary')
  })

  it('pedido por chip adiciona ao histórico, marca o texto e muda o status', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Fundamente melhor' }))
    expect(screen.getByText('Pronto. Ajustei conforme o pedido e mantive o restante do texto. Revise o trecho marcado.')).toBeInTheDocument()
    expect(screen.getByLabelText('Texto da minuta').value).toContain('[Ajuste 1: Fundamente melhor]')
    expect(screen.getByText('Em revisão')).toBeInTheDocument()
  })

  it('pedido digitado é enviado e o campo é limpo', () => {
    render(<App />)
    const input = screen.getByLabelText('Pedido de ajuste')
    fireEvent.change(input, { target: { value: 'deixe o ponto 2 mais curto' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByText('deixe o ponto 2 mais curto')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('pedido vazio não faz nada', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByLabelText('Texto da minuta').value).not.toContain('[Ajuste')
    expect(screen.getByText('Rascunho')).toBeInTheDocument()
  })

  it('marcar como revisada fica no cabeçalho, ao lado do status', () => {
    render(<App />)
    const botao = screen.getByRole('button', { name: 'Marcar como revisada' })
    const cabecalho = botao.closest('.page-head')
    expect(cabecalho).not.toBeNull()
    expect(cabecalho).toContainElement(screen.getByText('Rascunho'))
  })

  it('marcar como revisada conclui o caso', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Marcar como revisada' }))
    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })

  it('edição manual do texto é preservada', () => {
    render(<App />)
    const doc = screen.getByLabelText('Texto da minuta')
    fireEvent.change(doc, { target: { value: 'Texto editado pelo servidor' } })
    expect(doc.value).toBe('Texto editado pelo servidor')
  })

  it('uso do mês mostra o que resta do plano', () => {
    render(<App />)
    expect(screen.getByText('7 de 30 minutas usadas')).toBeInTheDocument()
    expect(screen.getByText('Restam 23 minutas neste plano.')).toBeInTheDocument()
  })
})
