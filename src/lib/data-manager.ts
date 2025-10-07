import { FormData, AnalyticsData, PeriodFilter } from './types';

// Classe para gerenciar dados localmente
export class DataManager {
  private static STORAGE_KEY = 'consorcio_atendimento_data';

  static saveFormData(data: FormData): void {
    const existingData = this.getAllData();
    existingData.push(data);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
  }

  static getAllData(): FormData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getDataByPeriod(filter: PeriodFilter): FormData[] {
    const allData = this.getAllData();
    const startDate = new Date(filter.dataInicio);
    const endDate = new Date(filter.dataFim);
    
    return allData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  static generateAnalytics(data: FormData[]): AnalyticsData {
    const analytics: AnalyticsData = {
      totalRegistros: data.length,
      elogios: 0,
      reclamacoes: 0,
      solicitacoes: 0,
      porTipoServico: {
        comercial: 0,
        operacional: 0,
        consorcio: 0
      },
      porCategoria: {
        morador: 0,
        lideranca: 0,
        comercial: 0,
        sindico: 0,
        politico: 0,
        outro: 0
      },
      mediaNotas: {
        saneamento: 0,
        qualidadeVida: 0,
        atendimento: 0
      }
    };

    let totalNotasSaneamento = 0;
    let totalNotasQualidadeVida = 0;
    let totalNotasAtendimento = 0;
    let countElogios = 0;

    data.forEach(item => {
      // Contagem por categoria
      analytics.porCategoria[item.categoriaCliente]++;

      if (item.isElogio) {
        analytics.elogios++;
        const elogioData = item as any;
        totalNotasSaneamento += elogioData.notaSaneamento || 0;
        totalNotasQualidadeVida += elogioData.notaQualidadeVida || 0;
        totalNotasAtendimento += elogioData.notaAtendimento || 0;
        countElogios++;
      } else {
        const demandaData = item as any;
        if (demandaData.tipoManifestacao === 'reclamacao') {
          analytics.reclamacoes++;
        } else {
          analytics.solicitacoes++;
        }
        
        // Contagem por tipo de serviço
        if (demandaData.tipoServico) {
          analytics.porTipoServico[demandaData.tipoServico as keyof typeof analytics.porTipoServico]++;
        }
      }
    });

    // Calcular médias
    if (countElogios > 0) {
      analytics.mediaNotas.saneamento = totalNotasSaneamento / countElogios;
      analytics.mediaNotas.qualidadeVida = totalNotasQualidadeVida / countElogios;
      analytics.mediaNotas.atendimento = totalNotasAtendimento / countElogios;
    }

    return analytics;
  }

  static exportToCSV(data: FormData[], filename: string = 'dados_atendimento.csv'): void {
    if (data.length === 0) return;

    const headers = [
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
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        const row = [
          item.id,
          item.timestamp,
          `"${item.nome}"`,
          `"${item.endereco}"`,
          item.numeroFornecimento,
          item.categoriaCliente,
          item.representantePolitico || '',
          item.isElogio ? 'Elogio' : 'Demanda',
          !item.isElogio ? (item as any).isTitular : '',
          !item.isElogio ? (item as any).telefone || '' : '',
          !item.isElogio ? (item as any).vinculoTitular || '' : '',
          !item.isElogio ? (item as any).nomeTitular || '' : '',
          !item.isElogio ? (item as any).telefoneTitular || '' : '',
          !item.isElogio ? (item as any).tipoManifestacao || '' : '',
          !item.isElogio ? (item as any).tipoServico || '' : '',
          !item.isElogio ? `"${(item as any).detalhesServico || ''}"` : '',
          item.isElogio ? (item as any).notaSaneamento || '' : '',
          item.isElogio ? `"${(item as any).depoimentoSaneamento || ''}"` : '',
          item.isElogio ? (item as any).notaQualidadeVida || '' : '',
          item.isElogio ? `"${(item as any).depoimentoQualidadeVida || ''}"` : '',
          item.isElogio ? (item as any).notaAtendimento || '' : '',
          `"${item.observacoes || ''}"`,
          item.localContato,
          `"${item.nomeResponsavel}"`
        ];
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Utilitários para datas
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('pt-BR');
};

// Gerar período padrão (dia 20 do mês anterior até dia 20 do mês atual)
export const getDefaultPeriod = (): PeriodFilter => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  let startMonth = currentMonth - 1;
  let startYear = currentYear;
  
  if (startMonth < 0) {
    startMonth = 11;
    startYear = currentYear - 1;
  }
  
  const dataInicio = new Date(startYear, startMonth, 20).toISOString().split('T')[0];
  const dataFim = new Date(currentYear, currentMonth, 20).toISOString().split('T')[0];
  
  return { dataInicio, dataFim };
};