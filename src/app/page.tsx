'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  BarChart3, 
  Users, 
  Building2, 
  Phone, 
  Mail,
  Download,
  Settings
} from 'lucide-react';
import FormularioDemanda from '@/components/FormularioDemanda';
import DashboardAnalise from '@/components/DashboardAnalise';
import { Toaster } from 'sonner';

export default function Home() {
  const [activeTab, setActiveTab] = useState('formulario');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Sistema de Atendimento
                  </h1>
                  <p className="text-sm text-gray-600">
                    Programa Integra Tietê - Pacote 16
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex">
                <Users className="w-3 h-3 mr-1" />
                Equipe de Atendimento
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="formulario" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Novo Registro</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Análise</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Welcome Card */}
          {activeTab === 'formulario' && (
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Bem-vindo ao Sistema de Atendimento
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Registre manifestações, solicitações e reclamações da população impactada pelas obras do consórcio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Formulário Inteligente</p>
                      <p className="text-sm text-blue-100">Fluxo adaptativo por tipo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Análise Automática</p>
                      <p className="text-sm text-blue-100">Relatórios prontos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Exportação</p>
                      <p className="text-sm text-blue-100">CSV para Sabesp</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Contents */}
          <TabsContent value="formulario" className="space-y-6">
            <FormularioDemanda />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardAnalise />
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Sobre o Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Sistema desenvolvido para padronizar o registro de manifestações da população impactada pelas obras do Programa Integra Tietê.</p>
              <p className="text-muted-foreground">
                Garante encaminhamento e acompanhamento conforme PGSA.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Tipos de Registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>• Elogios</span>
                <Badge variant="outline" className="text-xs">Satisfação</Badge>
              </div>
              <div className="flex justify-between">
                <span>• Reclamações</span>
                <Badge variant="outline" className="text-xs">Problemas</Badge>
              </div>
              <div className="flex justify-between">
                <span>• Solicitações</span>
                <Badge variant="outline" className="text-xs">Pedidos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Funcionalidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Formulário com lógica condicional</p>
              <p>• Dashboard de análise em tempo real</p>
              <p>• Exportação para planilhas CSV</p>
              <p>• Relatórios por período customizado</p>
              <p>• Armazenamento local seguro</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <p>© 2024 Sistema de Atendimento - Programa Integra Tietê</p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                Suporte Técnico
              </span>
              <span className="flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                Contato
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}