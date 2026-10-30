// Dados de exemplo para as telas. Tudo fictício. Trocar pela API quando ela existir.

export const CASOS = [
  { id: 'C-001', titulo: 'Caso fictício 1', tipo: 'Decisão interlocutória', status: 'rascunho', atualizado: '23/10/2026' },
  { id: 'C-002', titulo: 'Caso fictício 2', tipo: 'Recurso eleitoral', status: 'revisao', atualizado: '22/10/2026' },
  { id: 'C-003', titulo: 'Caso fictício 3', tipo: 'Sentença de mérito', status: 'concluido', atualizado: '20/10/2026' },
]

export const STATUS_CASO = {
  rascunho: 'Rascunho',
  revisao: 'Em revisão',
  concluido: 'Concluído',
}

export const MODELOS = [
  {
    id: 'interlocutoria',
    nome: 'Decisão interlocutória',
    texto: 'Relatório\n[pedido, partes e documentos]\n\nFundamentação\n1. Requisitos da tutela de urgência\n2. Probabilidade do direito\n3. Perigo de dano\n\nDispositivo\n[defere, indefere ou determina diligência, com prazo]',
  },
  {
    id: 'recurso',
    nome: 'Recurso eleitoral (acórdão)',
    texto: 'Ementa\n1. Caso em exame\n2. Questões em discussão\n3. Razões de decidir\n4. Dispositivo e tese\n\nRelatório\n[decisão recorrida e razões]\n\nVoto\n[admissibilidade, preliminares, mérito e dosimetria]\n\nDispositivo\n[conhecer ou não, dar ou negar provimento]',
  },
  {
    id: 'sentenca',
    nome: 'Sentença de mérito',
    texto: 'Relatório\n[partes, pedido e defesa]\n\nFundamentação\n1. Questões de fato\n2. Questões de direito\n3. Análise das provas\n\nDispositivo\n[procedente, parcialmente procedente ou improcedente]',
  },
]

export const USO_MES = { minutasUsadas: 7, minutasLimite: 30, tokensUsados: 1_250_000, tokensLimite: 5_000_000 }

export const CANAL = { nome: 'WhatsApp', conectado: false, numero: '' }

// Acessos da conta. Tudo fictício.
export const USUARIOS = [
  { id: 'U-001', nome: 'Administração da conta', email: 'admin@exemplo.com', perfil: 'administrador', status: 'ativo', ultimoAcesso: '28/10/2026 08:12' },
  { id: 'U-002', nome: 'Ana Exemplo', email: 'ana@exemplo.com', perfil: 'usuario', status: 'ativo', ultimoAcesso: '27/10/2026 17:05' },
  { id: 'U-003', nome: 'Bruno Exemplo', email: 'bruno@exemplo.com', perfil: 'usuario', status: 'desativado', ultimoAcesso: '02/10/2026 09:30' },
  { id: 'U-004', nome: 'Carla Exemplo', email: 'carla@exemplo.com', perfil: 'usuario', status: 'convite', ultimoAcesso: null },
]

// Documentos que treinam o robô. Só a área administrativa mostra estes dados.
export const DOCUMENTOS_TREINO = [
  { id: 'D-001', nome: 'Decisão exemplo 01.pdf', tipo: 'Decisão', enviadoEm: '20/10/2026', status: 'indexado' },
  { id: 'D-002', nome: 'Sentença exemplo 02.docx', tipo: 'Sentença', enviadoEm: '21/10/2026', status: 'indexado' },
  { id: 'D-003', nome: 'Acórdão exemplo 03.pdf', tipo: 'Acórdão', enviadoEm: '26/10/2026', status: 'fila' },
]
