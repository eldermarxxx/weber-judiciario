import { describe, it, expect } from 'vitest'
import { podeVer, menuDo } from '../src/lib/perfis.js'

describe('perfis do painel', () => {
  it('usuário vê só o trabalho: início, casos e minuta', () => {
    expect(menuDo('usuario').map((g) => g.grupo)).toEqual(['Trabalho'])
    expect(menuDo('usuario')[0].telas).toEqual(['Início', 'Casos', 'Minuta'])
  })

  it('administrador vê a área administrativa, inclusive o treinamento do robô', () => {
    expect(podeVer('administrador', 'Treinamento')).toBe(true)
    expect(podeVer('administrador', 'Usuários')).toBe(true)
    expect(menuDo('administrador').map((g) => g.grupo)).toEqual(['Trabalho', 'Administração'])
  })

  it('usuário não abre nenhuma tela administrativa', () => {
    for (const tela of ['Usuários', 'Treinamento', 'Modelos', 'Uso', 'Configurações']) {
      expect(podeVer('usuario', tela), tela).toBe(false)
    }
  })

  it('perfil desconhecido não vê nada, nem nomes herdados do objeto', () => {
    expect(podeVer('visitante', 'Início')).toBe(false)
    expect(podeVer('toString', 'Início')).toBe(false)
    expect(menuDo('visitante')).toEqual([])
  })
})
