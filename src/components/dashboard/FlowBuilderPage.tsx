import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Plus, 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Trash2, 
  Copy, 
  Eye, 
  MessageSquare, 
  Instagram, 
  Mail, 
  Phone, 
  Clock, 
  Filter, 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  X, 
  Check, 
  AlertTriangle,
  Menu,
  Image,
  Video,
  Mic,
  FileText,
  Link,
  Users,
  Calendar,
  Target,
  BarChart3,
  RefreshCw,
  Search,
  Grid,
  List,
  MousePointer,
  Move,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'end';
  channel: 'whatsapp' | 'instagram' | 'email' | 'sms';
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
    config: any;
    icon: React.ElementType;
    color: string;
  };
  connections: string[];
}

interface FlowConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface Flow {
  id: string;
  name: string;
  description: string;
  channel: 'whatsapp' | 'instagram' | 'email' | 'sms';
  status: 'draft' | 'active' | 'paused';
  nodes: FlowNode[];
  connections: FlowConnection[];
  createdAt: string;
  lastModified: string;
  metrics?: {
    executions: number;
    successRate: number;
    avgDuration: number;
  };
}

const FlowBuilderPage: React.FC = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'instagram' | 'email' | 'sms' | null>(null);
  const [draggedNode, setDraggedNode] = useState<any>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodeConfig, setShowNodeConfig] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Mock data for flows
    setFlows([
      {
        id: '1',
        name: 'Boas-vindas WhatsApp',
        description: 'Fluxo de boas-vindas para novos contatos no WhatsApp',
        channel: 'whatsapp',
        status: 'active',
        nodes: [],
        connections: [],
        createdAt: '2024-01-15T10:00:00Z',
        lastModified: '2024-01-20T14:30:00Z',
        metrics: {
          executions: 1247,
          successRate: 94.5,
          avgDuration: 2.3
        }
      },
      {
        id: '2',
        name: 'Follow-up Email',
        description: 'Sequência de follow-up por email para leads',
        channel: 'email',
        status: 'active',
        nodes: [],
        connections: [],
        createdAt: '2024-01-10T08:30:00Z',
        lastModified: '2024-01-18T16:45:00Z',
        metrics: {
          executions: 856,
          successRate: 87.2,
          avgDuration: 5.7
        }
      },
      {
        id: '3',
        name: 'Carrinho Abandonado SMS',
        description: 'Recuperação de carrinho abandonado via SMS',
        channel: 'sms',
        status: 'draft',
        nodes: [],
        connections: [],
        createdAt: '2024-01-22T11:15:00Z',
        lastModified: '2024-01-22T11:15:00Z'
      }
    ]);
  }, []);

  const channelConfigs = {
    whatsapp: {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      triggers: [
        { id: 'new_contact', title: 'Novo Contato', icon: Users, description: 'Quando um novo contato inicia conversa' },
        { id: 'keyword', title: 'Palavra-chave', icon: Search, description: 'Quando uma palavra específica é mencionada' },
        { id: 'time_based', title: 'Baseado em Tempo', icon: Clock, description: 'Em horários específicos' },
        { id: 'inactivity', title: 'Inatividade', icon: RefreshCw, description: 'Após período sem interação' }
      ],
      actions: [
        { id: 'send_text', title: 'Enviar Texto', icon: MessageSquare, description: 'Mensagem de texto simples' },
        { id: 'send_audio', title: 'Enviar Áudio', icon: Mic, description: 'Mensagem de áudio' },
        { id: 'send_image', title: 'Enviar Imagem', icon: Image, description: 'Imagem com legenda' },
        { id: 'send_video', title: 'Enviar Vídeo', icon: Video, description: 'Vídeo com legenda' },
        { id: 'send_menu', title: 'Menu Interativo', icon: Menu, description: 'Menu com opções' },
        { id: 'send_buttons', title: 'Botões', icon: Grid, description: 'Botões de ação rápida' },
        { id: 'send_template', title: 'Template', icon: FileText, description: 'Template aprovado' }
      ]
    },
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-pink-600',
      triggers: [
        { id: 'new_follower', title: 'Novo Seguidor', icon: Users, description: 'Quando alguém segue o perfil' },
        { id: 'dm_received', title: 'DM Recebida', icon: MessageSquare, description: 'Mensagem direta recebida' },
        { id: 'story_mention', title: 'Menção no Story', icon: Target, description: 'Quando mencionado em story' },
        { id: 'comment', title: 'Comentário', icon: MessageSquare, description: 'Comentário em post' }
      ],
      actions: [
        { id: 'send_dm', title: 'Enviar DM', icon: MessageSquare, description: 'Mensagem direta' },
        { id: 'post_story', title: 'Postar Story', icon: Image, description: 'Story automático' },
        { id: 'auto_reply', title: 'Resposta Automática', icon: RefreshCw, description: 'Resposta a comentários' },
        { id: 'send_quick_reply', title: 'Resposta Rápida', icon: Zap, description: 'Resposta pré-definida' }
      ]
    },
    email: {
      name: 'Email',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      triggers: [
        { id: 'new_subscriber', title: 'Novo Inscrito', icon: Users, description: 'Nova inscrição na lista' },
        { id: 'email_opened', title: 'Email Aberto', icon: Eye, description: 'Quando email é aberto' },
        { id: 'link_clicked', title: 'Link Clicado', icon: Link, description: 'Click em link específico' },
        { id: 'date_based', title: 'Data Específica', icon: Calendar, description: 'Em datas importantes' }
      ],
      actions: [
        { id: 'send_email', title: 'Enviar Email', icon: Mail, description: 'Email personalizado' },
        { id: 'send_template', title: 'Template HTML', icon: FileText, description: 'Template formatado' },
        { id: 'add_to_list', title: 'Adicionar à Lista', icon: Plus, description: 'Segmentar contato' },
        { id: 'remove_from_list', title: 'Remover da Lista', icon: X, description: 'Dessegmentar contato' },
        { id: 'update_field', title: 'Atualizar Campo', icon: Settings, description: 'Modificar dados do contato' }
      ]
    },
    sms: {
      name: 'SMS',
      icon: Phone,
      color: 'from-purple-500 to-purple-600',
      triggers: [
        { id: 'new_number', title: 'Novo Número', icon: Users, description: 'Novo número na base' },
        { id: 'keyword_sms', title: 'Palavra-chave SMS', icon: Search, description: 'SMS com palavra específica' },
        { id: 'opt_in', title: 'Opt-in', icon: Check, description: 'Confirmação de recebimento' },
        { id: 'schedule', title: 'Agendamento', icon: Clock, description: 'Horário programado' }
      ],
      actions: [
        { id: 'send_sms', title: 'Enviar SMS', icon: Phone, description: 'Mensagem de texto' },
        { id: 'send_link', title: 'Enviar Link', icon: Link, description: 'SMS com link encurtado' },
        { id: 'opt_out', title: 'Descadastrar', icon: X, description: 'Remover da lista SMS' }
      ]
    }
  };

  const commonElements = [
    { id: 'condition', title: 'Condição', icon: Filter, description: 'Decisão baseada em critérios', type: 'condition' },
    { id: 'delay', title: 'Aguardar', icon: Clock, description: 'Pausa no fluxo', type: 'delay' },
    { id: 'end', title: 'Finalizar', icon: Target, description: 'Fim do fluxo', type: 'end' }
  ];

  const handleCreateFlow = () => {
    setSelectedFlow(null);
    setSelectedChannel(null);
    setIsBuilderOpen(true);
  };

  const handleEditFlow = (flow: Flow) => {
    setSelectedFlow(flow);
    setSelectedChannel(flow.channel);
    setIsBuilderOpen(true);
  };

  const handleChannelSelect = (channel: 'whatsapp' | 'instagram' | 'email' | 'sms') => {
    setSelectedChannel(channel);
  };

  const handleDragStart = (e: React.DragEvent, nodeType: any) => {
    setDraggedNode(nodeType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNode || !selectedChannel) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale;
    const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale;

    const newNode: FlowNode = {
      id: `node_${Date.now()}`,
      type: draggedNode.type || 'action',
      channel: selectedChannel,
      position: { x, y },
      data: {
        title: draggedNode.title,
        description: draggedNode.description,
        config: {},
        icon: draggedNode.icon,
        color: channelConfigs[selectedChannel].color
      },
      connections: []
    };

    if (selectedFlow) {
      setSelectedFlow({
        ...selectedFlow,
        nodes: [...selectedFlow.nodes, newNode]
      });
    }

    setDraggedNode(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setCanvasScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setCanvasScale(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleResetView = () => {
    setCanvasOffset({ x: 0, y: 0 });
    setCanvasScale(1);
  };

  const handleSaveFlow = () => {
    if (!selectedFlow || !selectedChannel) return;

    const updatedFlow = {
      ...selectedFlow,
      lastModified: new Date().toISOString()
    };

    if (selectedFlow.id) {
      setFlows(prev => prev.map(f => f.id === selectedFlow.id ? updatedFlow : f));
    } else {
      const newFlow = {
        ...updatedFlow,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setFlows(prev => [...prev, newFlow]);
    }

    alert('Fluxo salvo com sucesso!');
  };

  const handleTestFlow = async () => {
    setIsTestMode(true);
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTestResults({
      success: true,
      executionTime: 1.2,
      stepsExecuted: selectedFlow?.nodes.length || 0,
      errors: []
    });
    
    setIsTestMode(false);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!selectedFlow) return;

    setSelectedFlow({
      ...selectedFlow,
      nodes: selectedFlow.nodes.filter(n => n.id !== nodeId),
      connections: selectedFlow.connections.filter(c => c.source !== nodeId && c.target !== nodeId)
    });
  };

  const getChannelIcon = (channel: string) => {
    const config = channelConfigs[channel as keyof typeof channelConfigs];
    return config ? config.icon : MessageSquare;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'draft':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || flow.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isBuilderOpen) {
    return (
      <DashboardLayout currentPage="automation">
        <div className="h-screen flex flex-col">
          {/* Builder Header */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-b border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsBuilderOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {selectedFlow ? `Editando: ${selectedFlow.name}` : 'Novo Fluxo de Automação'}
                  </h1>
                  {selectedChannel && (
                    <div className="flex items-center space-x-2 mt-1">
                      {React.createElement(channelConfigs[selectedChannel].icon, { className: "w-4 h-4 text-gray-400" })}
                      <span className="text-gray-400 text-sm">{channelConfigs[selectedChannel].name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white text-sm px-2">{Math.round(canvasScale * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={handleResetView}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                </div>

                <button
                  onClick={handleTestFlow}
                  disabled={isTestMode || !selectedFlow?.nodes.length}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  {isTestMode ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>Testar</span>
                </button>

                <button
                  onClick={handleSaveFlow}
                  className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Channel Selection (if no channel selected) */}
            {!selectedChannel && (
              <div className="flex-1 flex items-center justify-center">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">Selecione o Canal de Comunicação</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(channelConfigs).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => handleChannelSelect(key as any)}
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                          <config.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-white font-semibold text-lg">{config.name}</h3>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Builder Interface */}
            {selectedChannel && (
              <>
                {/* Sidebar with Elements */}
                <div className="w-80 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border-r border-white/20 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-4">Elementos Disponíveis</h3>
                    
                    {/* Triggers */}
                    <div className="mb-6">
                      <h4 className="text-gray-300 text-sm font-semibold mb-3">Gatilhos</h4>
                      <div className="space-y-2">
                        {channelConfigs[selectedChannel].triggers.map((trigger) => (
                          <div
                            key={trigger.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, { ...trigger, type: 'trigger' })}
                            className="bg-white/10 rounded-lg p-3 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <trigger.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium">{trigger.title}</div>
                                <div className="text-gray-400 text-xs">{trigger.description}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mb-6">
                      <h4 className="text-gray-300 text-sm font-semibold mb-3">Ações</h4>
                      <div className="space-y-2">
                        {channelConfigs[selectedChannel].actions.map((action) => (
                          <div
                            key={action.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, { ...action, type: 'action' })}
                            className="bg-white/10 rounded-lg p-3 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-gradient-to-br ${channelConfigs[selectedChannel].color} rounded-lg flex items-center justify-center`}>
                                <action.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium">{action.title}</div>
                                <div className="text-gray-400 text-xs">{action.description}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Common Elements */}
                    <div>
                      <h4 className="text-gray-300 text-sm font-semibold mb-3">Controles</h4>
                      <div className="space-y-2">
                        {commonElements.map((element) => (
                          <div
                            key={element.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, element)}
                            className="bg-white/10 rounded-lg p-3 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                                <element.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium">{element.title}</div>
                                <div className="text-gray-400 text-xs">{element.description}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 relative overflow-hidden">
                  <div
                    ref={canvasRef}
                    className="w-full h-full bg-gradient-to-br from-[#1A0633] to-[#2D0B55] relative cursor-move"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                      backgroundSize: `${20 * canvasScale}px ${20 * canvasScale}px`,
                      backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
                    }}
                  >
                    <div
                      style={{
                        transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasScale})`,
                        transformOrigin: '0 0'
                      }}
                    >
                      {/* Render Nodes */}
                      {selectedFlow?.nodes.map((node) => (
                        <div
                          key={node.id}
                          className="absolute bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-pointer group"
                          style={{
                            left: node.position.x,
                            top: node.position.y,
                            minWidth: '200px'
                          }}
                          onClick={() => {
                            setSelectedNode(node.id);
                            setShowNodeConfig(true);
                          }}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-10 h-10 bg-gradient-to-br ${node.data.color} rounded-lg flex items-center justify-center`}>
                              <node.data.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium">{node.data.title}</div>
                              {node.data.description && (
                                <div className="text-gray-400 text-xs">{node.data.description}</div>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNode(node.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Connection Points */}
                          <div className="flex justify-between">
                            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Empty State */}
                    {(!selectedFlow?.nodes.length) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MousePointer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-white text-xl font-semibold mb-2">Canvas Vazio</h3>
                          <p className="text-gray-400">Arraste elementos da barra lateral para começar a construir seu fluxo</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Test Results Modal */}
          {testResults && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Resultado do Teste</h3>
                  <button
                    onClick={() => setTestResults(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Check className="w-6 h-6 text-green-400" />
                    <span className="text-white">Teste executado com sucesso</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Tempo de Execução</div>
                      <div className="text-white font-semibold">{testResults.executionTime}s</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Etapas Executadas</div>
                      <div className="text-white font-semibold">{testResults.stepsExecuted}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setTestResults(null)}
                  className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 mt-6"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="automation">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Construtor de Fluxos</h1>
            <p className="text-gray-300">Crie automações multicanal inteligentes</p>
          </div>
          
          <button
            onClick={handleCreateFlow}
            className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Fluxo</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar fluxos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
            >
              <option value="all" className="bg-[#2D0B55]">Todos os status</option>
              <option value="active" className="bg-[#2D0B55]">Ativo</option>
              <option value="paused" className="bg-[#2D0B55]">Pausado</option>
              <option value="draft" className="bg-[#2D0B55]">Rascunho</option>
            </select>
          </div>
        </div>

        {/* Flows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFlows.map((flow) => {
            const ChannelIcon = getChannelIcon(flow.channel);
            
            return (
              <div
                key={flow.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${channelConfigs[flow.channel].color} rounded-xl flex items-center justify-center`}>
                      <ChannelIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{flow.name}</h3>
                      <p className="text-gray-400 text-sm">{channelConfigs[flow.channel].name}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(flow.status)}`}>
                    {flow.status.toUpperCase()}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">{flow.description}</p>

                {flow.metrics && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-white text-sm font-semibold">{flow.metrics.executions}</div>
                      <div className="text-gray-400 text-xs">Execuções</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-white text-sm font-semibold">{flow.metrics.successRate}%</div>
                      <div className="text-gray-400 text-xs">Sucesso</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-white text-sm font-semibold">{flow.metrics.avgDuration}s</div>
                      <div className="text-gray-400 text-xs">Duração</div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditFlow(flow)}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                  
                  <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300">
                    <Copy className="w-3 h-3" />
                  </button>
                  
                  <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300">
                    <BarChart3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFlows.length === 0 && (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhum fluxo encontrado</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Crie seu primeiro fluxo de automação'
              }
            </p>
            <button
              onClick={handleCreateFlow}
              className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Criar Primeiro Fluxo
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FlowBuilderPage;