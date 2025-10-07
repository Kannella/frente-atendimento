'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Camera, Save, RotateCcw } from 'lucide-react';
import { FormData, DemandaFormData, ElogioFormData } from '@/lib/types';
import { DataManager } from '@/lib/data-manager';
import { toast } from 'sonner';

interface FormularioDemandaProps {
  onSubmit?: (data: FormData) => void;
}

export default function FormularioDemanda({ onSubmit }: FormularioDemandaProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    numeroFornecimento: '',
    categoriaCliente: '',
    representantePolitico: '',
    isElogio: null as boolean | null,
    isTitular: null as boolean | null,
    telefone: '',
    vinculoTitular: '',
    nomeTitular: '',
    telefoneTitular: '',
    tipoManifestacao: '',
    tipoServico: '',
    detalhesServico: '',
    notaSaneamento: 5,
    depoimentoSaneamento: '',
    notaQualidadeVida: 5,
    depoimentoQualidadeVida: '',
    notaAtendimento: 3,
    observacoes: '',
    foto: '',
    localContato: '',
    nomeResponsavel: ''
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco: '',
      numeroFornecimento: '',
      categoriaCliente: '',
      representantePolitico: '',
      isElogio: null,
      isTitular: null,
      telefone: '',
      vinculoTitular: '',
      nomeTitular: '',
      telefoneTitular: '',
      tipoManifestacao: '',
      tipoServico: '',
      detalhesServico: '',
      notaSaneamento: 5,
      depoimentoSaneamento: '',
      notaQualidadeVida: 5,
      depoimentoQualidadeVida: '',
      notaAtendimento: 3,
      observacoes: '',
      foto: '',
      localContato: '',
      nomeResponsavel: ''
    });
    setStep(1);
  };

  const handleSubmit = () => {
    const baseData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      nome: formData.nome,
      endereco: formData.endereco,
      numeroFornecimento: formData.numeroFornecimento,
      categoriaCliente: formData.categoriaCliente as any,
      representantePolitico: formData.representantePolitico as any,
      observacoes: formData.observacoes,
      foto: formData.foto,
      localContato: formData.localContato as any,
      nomeResponsavel: formData.nomeResponsavel
    };

    let finalData: FormData;

    if (formData.isElogio) {
      finalData = {
        ...baseData,
        isElogio: true,
        notaSaneamento: formData.notaSaneamento,
        depoimentoSaneamento: formData.depoimentoSaneamento,
        notaQualidadeVida: formData.notaQualidadeVida,
        depoimentoQualidadeVida: formData.depoimentoQualidadeVida,
        notaAtendimento: formData.notaAtendimento
      } as ElogioFormData;
    } else {
      finalData = {
        ...baseData,
        isElogio: false,
        isTitular: formData.isTitular!,
        telefone: formData.telefone,
        vinculoTitular: formData.vinculoTitular as any,
        nomeTitular: formData.nomeTitular,
        telefoneTitular: formData.telefoneTitular,
        tipoManifestacao: formData.tipoManifestacao as any,
        tipoServico: formData.tipoServico as any,
        detalhesServico: formData.detalhesServico
      } as DemandaFormData;
    }

    DataManager.saveFormData(finalData);
    onSubmit?.(finalData);
    toast.success('Formulário salvo com sucesso!');
    resetForm();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.nome && formData.endereco && formData.numeroFornecimento && formData.categoriaCliente;
      case 2:
        if (formData.categoriaCliente === 'politico') {
          return formData.representantePolitico;
        }
        return true;
      case 3:
        return formData.isElogio !== null;
      case 4:
        if (formData.isElogio) {
          return formData.depoimentoSaneamento && formData.depoimentoQualidadeVida;
        } else {
          return formData.isTitular !== null;
        }
      case 5:
        if (formData.isElogio) {
          return formData.localContato && formData.nomeResponsavel;
        } else {
          if (formData.isTitular) {
            return formData.telefone;
          } else {
            return formData.vinculoTitular && formData.nomeTitular && formData.telefoneTitular;
          }
        }
      case 6:
        if (!formData.isElogio) {
          return formData.tipoManifestacao && formData.tipoServico && formData.detalhesServico;
        }
        return true;
      case 7:
        return formData.localContato && formData.nomeResponsavel;
      default:
        return true;
    }
  };

  const getMaxStep = () => {
    if (formData.isElogio) return 5;
    return 7;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Programa Integra Tietê - Pacote 16
          </CardTitle>
          <CardDescription className="text-center">
            Este formulário foi desenvolvido para registrar de forma padronizada todas as manifestações, 
            dúvidas, solicitações e reclamações da população impactada pelas obras do Programa Integra Tietê - Pacote 16, 
            garantindo seu encaminhamento, acompanhamento e resposta dentro dos prazos e fluxos definidos no 
            Plano de Gestão Socioambiental (PGSA).
          </CardDescription>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-muted-foreground">
              Etapa {step} de {getMaxStep()}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Etapa 1: Dados Básicos */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados Básicos</h3>
              
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  placeholder="Endereço completo"
                />
              </div>

              <div>
                <Label htmlFor="numeroFornecimento">Número de Fornecimento</Label>
                <Input
                  id="numeroFornecimento"
                  value={formData.numeroFornecimento}
                  onChange={(e) => setFormData({...formData, numeroFornecimento: e.target.value})}
                  placeholder="Número de fornecimento"
                />
              </div>

              <div>
                <Label>Categoria do Cliente</Label>
                <Select value={formData.categoriaCliente} onValueChange={(value) => setFormData({...formData, categoriaCliente: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morador">Morador</SelectItem>
                    <SelectItem value="lideranca">Liderança Comunitária</SelectItem>
                    <SelectItem value="comercial">Representante Comercial</SelectItem>
                    <SelectItem value="sindico">Síndico</SelectItem>
                    <SelectItem value="politico">Representante Político</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Etapa 2: Representante Político (condicional) */}
          {step === 2 && formData.categoriaCliente === 'politico' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tipo de Representante Político</h3>
              
              <div>
                <Label>Tipo de Representante</Label>
                <Select value={formData.representantePolitico} onValueChange={(value) => setFormData({...formData, representantePolitico: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deputado">Deputado</SelectItem>
                    <SelectItem value="vereador">Vereador</SelectItem>
                    <SelectItem value="secretario">Secretário</SelectItem>
                    <SelectItem value="assessor">Assessor</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Etapa 3: Tipo de Manifestação */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tipo de Manifestação</h3>
              
              <div>
                <Label>Esta manifestação é um elogio?</Label>
                <RadioGroup 
                  value={formData.isElogio?.toString()} 
                  onValueChange={(value) => setFormData({...formData, isElogio: value === 'true'})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="elogio-sim" />
                    <Label htmlFor="elogio-sim">Sim, é um elogio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="elogio-nao" />
                    <Label htmlFor="elogio-nao">Não, é uma solicitação ou reclamação</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Etapa 4: Pesquisa de Satisfação (se elogio) ou Titular (se não elogio) */}
          {step === 4 && formData.isElogio && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pesquisa de Satisfação</h3>
              
              <div>
                <Label>Nota para serviços de saneamento (1-10)</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <span>1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.notaSaneamento}
                    onChange={(e) => setFormData({...formData, notaSaneamento: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <span>10</span>
                  <span className="font-semibold w-8">{formData.notaSaneamento}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="depoimentoSaneamento">Depoimento sobre os serviços de saneamento</Label>
                <Textarea
                  id="depoimentoSaneamento"
                  value={formData.depoimentoSaneamento}
                  onChange={(e) => setFormData({...formData, depoimentoSaneamento: e.target.value})}
                  placeholder="Compartilhe sua experiência com os serviços de saneamento"
                />
              </div>

              <div>
                <Label>Percepção de melhoria da qualidade de vida após as obras (1-10)</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <span>1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.notaQualidadeVida}
                    onChange={(e) => setFormData({...formData, notaQualidadeVida: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <span>10</span>
                  <span className="font-semibold w-8">{formData.notaQualidadeVida}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="depoimentoQualidadeVida">Depoimento sobre a qualidade de vida</Label>
                <Textarea
                  id="depoimentoQualidadeVida"
                  value={formData.depoimentoQualidadeVida}
                  onChange={(e) => setFormData({...formData, depoimentoQualidadeVida: e.target.value})}
                  placeholder="Como as obras impactaram sua qualidade de vida?"
                />
              </div>

              <div>
                <Label>Nota para o atendimento (1-5)</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <span>1</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.notaAtendimento}
                    onChange={(e) => setFormData({...formData, notaAtendimento: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <span>5</span>
                  <span className="font-semibold w-8">{formData.notaAtendimento}</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && !formData.isElogio && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Solicitante</h3>
              
              <div>
                <Label>O solicitante é o titular da conta?</Label>
                <RadioGroup 
                  value={formData.isTitular?.toString()} 
                  onValueChange={(value) => setFormData({...formData, isTitular: value === 'true'})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="titular-sim" />
                    <Label htmlFor="titular-sim">Sim, sou o titular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="titular-nao" />
                    <Label htmlFor="titular-nao">Não, não sou o titular</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Etapa 5: Dados de Contato */}
          {step === 5 && formData.isElogio && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Atendimento</h3>
              
              <div>
                <Label>Local do primeiro contato</Label>
                <Select value={formData.localContato} onValueChange={(value) => setFormData({...formData, localContato: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="itinerante">Itinerante</SelectItem>
                    <SelectItem value="canteiro">Canteiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nomeResponsavel">Nome do responsável pelo atendimento</Label>
                <Input
                  id="nomeResponsavel"
                  value={formData.nomeResponsavel}
                  onChange={(e) => setFormData({...formData, nomeResponsavel: e.target.value})}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
          )}

          {step === 5 && !formData.isElogio && formData.isTitular && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados de Contato</h3>
              
              <div>
                <Label htmlFor="telefone">Número de telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          )}

          {step === 5 && !formData.isElogio && !formData.isTitular && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados do Titular</h3>
              
              <div>
                <Label>Vínculo com o titular</Label>
                <Select value={formData.vinculoTitular} onValueChange={(value) => setFormData({...formData, vinculoTitular: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vínculo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="familiar">Familiar</SelectItem>
                    <SelectItem value="locatario">Locatário</SelectItem>
                    <SelectItem value="procurador">Procurador</SelectItem>
                    <SelectItem value="corretor">Corretor</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nomeTitular">Nome do titular</Label>
                <Input
                  id="nomeTitular"
                  value={formData.nomeTitular}
                  onChange={(e) => setFormData({...formData, nomeTitular: e.target.value})}
                  placeholder="Nome completo do titular"
                />
              </div>

              <div>
                <Label htmlFor="telefoneTitular">Telefone do titular</Label>
                <Input
                  id="telefoneTitular"
                  value={formData.telefoneTitular}
                  onChange={(e) => setFormData({...formData, telefoneTitular: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          )}

          {/* Etapa 6: Tipo de Serviço (apenas para não-elogios) */}
          {step === 6 && !formData.isElogio && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detalhes da Manifestação</h3>
              
              <div>
                <Label>Tipo de manifestação</Label>
                <RadioGroup 
                  value={formData.tipoManifestacao} 
                  onValueChange={(value) => setFormData({...formData, tipoManifestacao: value})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solicitacao" id="solicitacao" />
                    <Label htmlFor="solicitacao">Solicitação</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reclamacao" id="reclamacao" />
                    <Label htmlFor="reclamacao">Reclamação</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Tipo de serviço</Label>
                <Select value={formData.tipoServico} onValueChange={(value) => setFormData({...formData, tipoServico: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comercial">Comercial (questões administrativas, conta, segunda via, etc.)</SelectItem>
                    <SelectItem value="operacional">Operacional (hidrômetro, corte, instalação, água, esgoto)</SelectItem>
                    <SelectItem value="consorcio">Consórcio (obras, ruído, poeira, vistoria cautelar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="detalhesServico">Detalhes do serviço/problema</Label>
                <Textarea
                  id="detalhesServico"
                  value={formData.detalhesServico}
                  onChange={(e) => setFormData({...formData, detalhesServico: e.target.value})}
                  placeholder="Descreva detalhadamente a solicitação ou reclamação"
                />
              </div>
            </div>
          )}

          {/* Etapa Final: Observações e Finalização */}
          {step === getMaxStep() && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Finalização</h3>
              
              {!formData.isElogio && (
                <>
                  <div>
                    <Label>Local do primeiro contato</Label>
                    <Select value={formData.localContato} onValueChange={(value) => setFormData({...formData, localContato: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="itinerante">Itinerante</SelectItem>
                        <SelectItem value="canteiro">Canteiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nomeResponsavel">Nome do responsável pelo atendimento</Label>
                    <Input
                      id="nomeResponsavel"
                      value={formData.nomeResponsavel}
                      onChange={(e) => setFormData({...formData, nomeResponsavel: e.target.value})}
                      placeholder="Nome do responsável"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="observacoes">Observações adicionais</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Observações gerais sobre o atendimento"
                />
              </div>

              <div>
                <Label>Foto do caso (opcional)</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Tirar Foto
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {formData.foto ? 'Foto anexada' : 'Nenhuma foto anexada'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Botões de Navegação */}
          <div className="flex justify-between">
            <div className="flex space-x-2">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => setStep(step - 1)}
                >
                  Voltar
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>

            <div>
              {step < getMaxStep() ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Próximo
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Formulário
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}