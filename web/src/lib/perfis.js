// Perfis do painel. Este arquivo só organiza o que cada perfil vê.
// A API precisa checar o mesmo perfil em cada chamada, senão a tela oculta não protege nada.
export const PERFIS = {
  administrador: 'Administrador',
  usuario: 'Usuário',
}

export const TELAS_TRABALHO = ['Início', 'Casos', 'Minuta']
export const TELAS_ADMIN = ['Usuários', 'Treinamento', 'Modelos', 'Uso', 'Configurações']

export function podeVer(perfil, tela) {
  if (!Object.hasOwn(PERFIS, perfil)) return false
  if (TELAS_TRABALHO.includes(tela)) return true
  return perfil === 'administrador' && TELAS_ADMIN.includes(tela)
}

// Grupos do menu com as telas que o perfil pode abrir. Grupo vazio some.
export function menuDo(perfil) {
  return [
    { grupo: 'Trabalho', telas: TELAS_TRABALHO },
    { grupo: 'Administração', telas: TELAS_ADMIN },
  ]
    .map(({ grupo, telas }) => ({ grupo, telas: telas.filter((tela) => podeVer(perfil, tela)) }))
    .filter(({ telas }) => telas.length > 0)
}
