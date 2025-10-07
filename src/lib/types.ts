// Tipos para o sistema de gestão de atendimento

export interface BaseFormData {
  id: string;
  timestamp: string;
  nome: string;
  endereco: string;
  numeroFornecimento: string;
  categoriaCliente: 'morador' | 'lideranca' | 'comercial' | 'sindico' | 'politico' | 'outro';
  representantePolitico?: 'deputado' | 'vereador' | 'secretario' | 'assessor' | 'outro';
  isElogio: boolean;
  observacoes?: string;
  foto?: string;
  localContato: 'itinerante' | 'canteiro';
  nomeResponsavel: string;
}

export interface DemandaFormData extends BaseFormData {
  isElogio: false;
  isTitular: boolean;
  telefone?: string;
  vinculoTitular?: 'familiar' | 'locatario' | 'procurador' | 'corretor' | 'outro';
  nomeTitular?: string;
  telefoneTitular?: string;
  tipoManifestacao: 'solicitacao' | 'reclamacao';
  tipoServico: 'comercial' | 'operacional' | 'consorcio';
  detalhesServico: string;
}

export interface ElogioFormData extends BaseFormData {
  isElogio: true;
  notaSaneamento: number; // 1-10
  depoimentoSaneamento: string;
  notaQualidadeVida: number; // 1-10
  depoimentoQualidadeVida: string;
  notaAtendimento: number; // 1-5
}

export type FormData = DemandaFormData | ElogioFormData;

export interface AnalyticsData {
  totalRegistros: number;
  elogios: number;
  reclamacoes: number;
  solicitacoes: number;
  porTipoServico: {
    comercial: number;
    operacional: number;
    consorcio: number;
  };
  porCategoria: {
    morador: number;
    lideranca: number;
    comercial: number;
    sindico: number;
    politico: number;
    outro: number;
  };
  mediaNotas: {
    saneamento: number;
    qualidadeVida: number;
    atendimento: number;
  };
}

export interface PeriodFilter {
  dataInicio: string;
  dataFim: string;
}