'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Star,
  Calendar,
  FileText
} from 'lucide-react';
import { DataManager, formatDate, getDefaultPeriod } from '@/lib/data-manager';
import { FormData, AnalyticsData, PeriodFilter } from '@/lib/types';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardAnalise() {
  const [data, setData] = useState<FormData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<PeriodFilter>(getDefaultPeriod());
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    try {
      const filteredData = DataManager.getDataByPeriod(period);
      setData(filteredData);
      setAnalytics(DataManager.generateAnalytics(filteredData));
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const exportData = () => {
    if (data.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const filename = `relatorio_${period.dataInicio}_${period.dataFim}.csv`;
    DataManager.exportToCSV(data, filename);
    toast.success('Dados exportados com sucesso!');
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      DataManager.clearAllData();
      loadData();
      toast.success('Todos os dados foram removidos');
    }
  };

  // Preparar dados para gráficos
  const tipoServicoData = analytics ? [
    { name: 'Comercial', value: analytics.porTipoServico.comercial },
    { name: 'Operacional', value: analytics.porTipoServico.operacional },
    { name: 'Consórcio', value: analytics.porTipoServico.consorcio }
  ].filter(item => item.value > 0) : [];

  const categoriaData = analytics ? [
    { name: 'Morador', value: analytics.porCategoria.morador },
    { name: 'Liderança', value: analytics.porCategoria.lideranca },
    { name: 'Comercial', value: analytics.porCategoria.comercial },
    { name: 'Síndico', value: analytics.porCategoria.sindico },
    { name: 'Político', value: analytics.porCategoria.politico },
    { name: 'Outro', value: analytics.porCategoria.outro }
  ].filter(item => item.value > 0) : [];

  const manifestacaoData = analytics ? [
    { name: 'Elogios', value: analytics.elogios, color: '#00C49F' },
    { name: 'Reclamações', value: analytics.reclamacoes, color: '#FF8042' },
    { name: 'Solicitações', value: analytics.solicitacoes, color: '#0088FE' }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Análise</h1>
          <p className="text-muted-foreground">
            Análise dos dados de atendimento do Programa Integra Tietê
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={loadData} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={clearAllData} variant="destructive" size="sm">
            Limpar Dados
          </Button>
        </div>
      </div>

      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={period.dataInicio}
                onChange={(e) => setPeriod({...period, dataInicio: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={period.dataFim}
                onChange={(e) => setPeriod({...period, dataFim: e.target.value})}
              />
            </div>
            <Button onClick={() => setPeriod(getDefaultPeriod())} variant="outline">
              Período Padrão (20 a 20)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Período atual: {formatDate(period.dataInicio)} até {formatDate(period.dataFim)}
          </p>
        </CardContent>
      </Card>

      {analytics && (
        <>
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalRegistros}</div>
                <p className="text-xs text-muted-foreground">
                  manifestações registradas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Elogios</CardTitle>
                <Star className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analytics.elogios}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totalRegistros > 0 ? 
                    `${((analytics.elogios / analytics.totalRegistros) * 100).toFixed(1)}% do total` : 
                    '0% do total'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reclamações</CardTitle>
                <MessageSquare className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{analytics.reclamacoes}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totalRegistros > 0 ? 
                    `${((analytics.reclamacoes / analytics.totalRegistros) * 100).toFixed(1)}% do total` : 
                    '0% do total'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solicitações</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.solicitacoes}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totalRegistros > 0 ? 
                    `${((analytics.solicitacoes / analytics.totalRegistros) * 100).toFixed(1)}% do total` : 
                    '0% do total'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Notas Médias (apenas se houver elogios) */}
          {analytics.elogios > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notas Médias de Satisfação</CardTitle>
                <CardDescription>Baseado em {analytics.elogios} elogios recebidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {analytics.mediaNotas.saneamento.toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground">Serviços de Saneamento</p>
                    <p className="text-xs text-muted-foreground">(escala 1-10)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {analytics.mediaNotas.qualidadeVida.toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground">Qualidade de Vida</p>
                    <p className="text-xs text-muted-foreground">(escala 1-10)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {analytics.mediaNotas.atendimento.toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground">Atendimento</p>
                    <p className="text-xs text-muted-foreground">(escala 1-5)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Manifestações */}
            {manifestacaoData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Tipo de Manifestação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={manifestacaoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {manifestacaoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Gráfico de Tipos de Serviço */}
            {tipoServicoData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Tipo de Serviço</CardTitle>
                  <CardDescription>Apenas demandas (não inclui elogios)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tipoServicoData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tipoServicoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Gráfico de Categorias */}
            {categoriaData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Categoria de Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoriaData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Resumo para Relatório */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo para Relatório</CardTitle>
                <CardDescription>Dados prontos para copiar no relatório oficial</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>Período:</strong> {formatDate(period.dataInicio)} a {formatDate(period.dataFim)}</p>
                  <p><strong>Total de manifestações:</strong> {analytics.totalRegistros}</p>
                  <p><strong>Elogios:</strong> {analytics.elogios} ({analytics.totalRegistros > 0 ? ((analytics.elogios / analytics.totalRegistros) * 100).toFixed(1) : 0}%)</p>
                  <p><strong>Reclamações:</strong> {analytics.reclamacoes} ({analytics.totalRegistros > 0 ? ((analytics.reclamacoes / analytics.totalRegistros) * 100).toFixed(1) : 0}%)</p>
                  <p><strong>Solicitações:</strong> {analytics.solicitacoes} ({analytics.totalRegistros > 0 ? ((analytics.solicitacoes / analytics.totalRegistros) * 100).toFixed(1) : 0}%)</p>
                  
                  <Separator />
                  
                  <p><strong>Demandas por responsabilidade:</strong></p>
                  <p>• Sabesp (Comercial + Operacional): {analytics.porTipoServico.comercial + analytics.porTipoServico.operacional}</p>
                  <p>• Consórcio: {analytics.porTipoServico.consorcio}</p>
                  
                  {analytics.elogios > 0 && (
                    <>
                      <Separator />
                      <p><strong>Satisfação média:</strong></p>
                      <p>• Saneamento: {analytics.mediaNotas.saneamento.toFixed(1)}/10</p>
                      <p>• Qualidade de vida: {analytics.mediaNotas.qualidadeVida.toFixed(1)}/10</p>
                      <p>• Atendimento: {analytics.mediaNotas.atendimento.toFixed(1)}/5</p>
                    </>
                  )}
                </div>
                
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(document.querySelector('.bg-gray-50')?.textContent || '');
                    toast.success('Resumo copiado para a área de transferência!');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Copiar Resumo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Registros Recentes */}
          {data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Registros Recentes</CardTitle>
                <CardDescription>Últimos registros do período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {data.slice(-10).reverse().map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={item.isElogio ? 'default' : 'secondary'}>
                            {item.isElogio ? 'Elogio' : (item as any).tipoManifestacao}
                          </Badge>
                          {!item.isElogio && (
                            <Badge variant="outline">
                              {(item as any).tipoServico}
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium">{item.nome}</p>
                        <p className="text-sm text-muted-foreground">{item.endereco}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatDate(item.timestamp)}</p>
                        <p className="text-xs text-muted-foreground">{item.categoriaCliente}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {analytics && analytics.totalRegistros === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum dado encontrado</h3>
            <p className="text-muted-foreground">
              Não há registros para o período selecionado. Ajuste as datas ou registre novos atendimentos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}