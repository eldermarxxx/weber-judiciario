import { describe, it, expect } from 'vitest'
import {
  INITIAL_TEXT,
  STATUS,
  applyAdjustment,
  statusAfterAdjustment,
  statusAfterReview,
  usageSummary,
} from '../src/lib/minuta.js'

describe('applyAdjustment', () => {
  it('insere o trecho marcado logo antes do dispositivo', () => {
    const out = applyAdjustment(INITIAL_TEXT, 'Fundamente melhor', 1)
    const marker = out.indexOf('[Ajuste 1: Fundamente melhor]')
    expect(marker).toBeGreaterThan(-1)
    expect(marker).toBeLessThan(out.indexOf('3. Do dispositivo'))
  })

  it('preserva o restante do texto', () => {
    const out = applyAdjustment(INITIAL_TEXT, 'Encurte o texto', 1)
    expect(out.replace('[Ajuste 1: Encurte o texto]\n\n', '')).toBe(INITIAL_TEXT)
  })

  it('usa o número do ajuste na marcação', () => {
    let text = INITIAL_TEXT
    text = applyAdjustment(text, 'a', 1)
    text = applyAdjustment(text, 'b', 2)
    expect(text).toContain('[Ajuste 1: a]')
    expect(text).toContain('[Ajuste 2: b]')
  })

  it('sem seção de dispositivo, acrescenta no fim', () => {
    const out = applyAdjustment('Texto livre', 'Teste', 1)
    expect(out).toBe('Texto livre\n\n[Ajuste 1: Teste]')
  })
})

describe('status', () => {
  it('qualquer ajuste manda o caso para revisão', () => {
    expect(statusAfterAdjustment()).toEqual(STATUS.revisao)
  })

  it('marcar como revisada conclui o caso', () => {
    expect(statusAfterReview()).toEqual(STATUS.concluida)
  })
})

describe('usageSummary', () => {
  it('calcula restante e percentual', () => {
    expect(usageSummary(7, 30)).toEqual({ used: 7, limit: 30, remaining: 23, percent: 23 })
  })

  it('não fica negativo nem passa de 100%', () => {
    expect(usageSummary(40, 30)).toMatchObject({ remaining: 0, percent: 100 })
  })

  it('limite zero não divide por zero', () => {
    expect(usageSummary(0, 0)).toMatchObject({ remaining: 0, percent: 0 })
  })
})
