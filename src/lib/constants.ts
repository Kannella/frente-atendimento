// Constantes do sistema de atendimento

export const CATEGORIAS_CLIENTE = [
  { value: 'morador', label: 'Morador' },
  { value: 'lideranca', label: 'Liderança Comunitária' },
  { value: 'comercial', label: 'Representante Comercial' },
  { value: 'sindico', label: 'Síndico' },
  { value: 'politico', label: 'Representante Político' },
  { value: 'outro', label: 'Outro' }
];

export const TIPOS_REPRESENTANTE_POLITICO = [
  { value: 'deputado', label: 'Deputado' },
  { value: 'vereador', label: 'Vereador' },
  { value: 'secretario', label: 'Secretário' },
  { value: 'assessor', label: 'Assessor' },
  { value: 'outro', label: 'Outro' }
];

export const VINCULOS_TITULAR = [
  { value: 'familiar', label: 'Familiar' },
  { value: 'locatario', label: 'Locatário' },
  { value: 'procurador', label: 'Procurador' },
  { value: 'corretor', label: 'Corretor' },
  { value: 'outro', label: 'Outro' }
];

export const TIPOS_MANIFESTACAO = [
  { value: 'solicitacao', label: 'Solicitação' },
  { value: 'reclamacao', label: 'Reclamação' }
];

export const TIPOS_SERVICO = [
  { 
    value: 'comercial', 
    label: 'Comercial',
    descricao: 'Questões administrativas como problema de conta, segunda via, fatura não chega, troca de titularidade e afins'
  },
  { 
    value: 'operacional', 
    label: 'Operacional',
    descricao: 'Troca e aferição de Hidrômetro, corte de água, instalação, regularização, referente a água e esgoto'
  },
  { 
    value: 'consorcio', 
    label: 'Consórcio',
    descricao: 'Diretamente das obras do consórcio, ruído, sinistro, excesso de poeira, vistoria cautelar'
  }
];

export const LOCAIS_CONTATO = [
  { value: 'itinerante', label: 'Itinerante' },
  { value: 'canteiro', label: 'Canteiro' }
];

export const PROGRAMA_INFO = {
  nome: 'Programa Integra Tietê - Pacote 16',
  descricao: 'Este formulário foi desenvolvido para registrar de forma padronizada todas as manifestações, dúvidas, solicitações e reclamações da população impactada pelas obras do Programa Integra Tietê - Pacote 16, garantindo seu encaminhamento, acompanhamento e resposta dentro dos prazos e fluxos definidos no Plano de Gestão Socioambiental (PGSA).'
};

export const ESCALAS_NOTAS = {
  saneamento: { min: 1, max: 10, label: 'Serviços de Saneamento' },
  qualidadeVida: { min: 1, max: 10, label: 'Qualidade de Vida' },
  atendimento: { min: 1, max: 5, label: 'Atendimento' }
};

// Cores para gráficos
export const CHART_COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6'
};

// Configurações de exportação
export const EXPORT_CONFIG = {
  defaultFilename: 'dados_atendimento',
  csvHeaders: [
    'ID',
    'Data/Hora',
    'Nome',
    'Endereço',
    'Número Fornecimento',
    'Categoria Cliente',
    'Representante Político',
    'Tipo',
    'É Titular',
    'Telefone',
    'Vínculo Titular',
    'Nome Titular',
    'Telefone Titular',
    'Tipo Manifestação',
    'Tipo Serviço',
    'Detalhes Serviço',
    'Nota Saneamento',
    'Depoimento Saneamento',
    'Nota Qualidade Vida',
    'Depoimento Qualidade Vida',
    'Nota Atendimento',
    'Observações',
    'Local Contato',
    'Responsável'
  ]
};