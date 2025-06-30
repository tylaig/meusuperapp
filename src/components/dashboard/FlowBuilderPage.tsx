import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Calendar,
  Check,
  Clock,
  Code,
  Copy,
  Cpu,
  Database,
  Eye,
  FileText,
  Filter,
  GitBranch,
  Globe,
  Grid,
  Instagram,
  Layers,
  Mail,
  MessageSquare,
  Mic,
  MousePointer,
  Phone,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  Target,
  Trash2,
  TrendingUp,
  Upload as UploadIcon,
  Users,
  Volume2,
  Workflow,
  X,
  ZoomIn,
  ZoomOut,
  Zap
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'end' | 'webhook' | 'api' | 'database' | 'email' | 'sms' | 'notification';
  category: 'triggers' | 'actions' | 'conditions' | 'integrations' | 'utilities' | 'ai' | 'data' | 'communication';
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
    config: any;
    icon: React.ElementType;
    color: string;
    status?: 'success' | 'error' | 'warning' | 'pending';
  };
  connections: {
    input: boolean;
    outputs: string[];
  };
}

interface FlowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  style?: any;
  label?: string;
  status?: 'success' | 'error' | 'warning' | 'active';
}

interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'error';
  nodes: FlowNode[];
  connections: FlowConnection[];
  createdAt: string;
  lastModified: string;
  lastRun?: string;
  metrics?: {
    executions: number;
    successRate: number;
    avgDuration: number;
    errors: number;
  };
}

const FlowBuilderPage: React.FC = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [draggedNode, setDraggedNode] = useState<any>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 400, y: 300 });
  const [canvasScale, setCanvasScale] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodeConfig, setShowNodeConfig] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [sidebarCategory, setSidebarCategory] = useState<string>('triggers');

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Mock data for flows
    setFlows([
      {
        id: '1',
        name: 'Automação de Boas-vindas',
        description: 'Fluxo completo de boas-vindas para novos usuários',
        status: 'active',
        nodes: [],
        connections: [],
        createdAt: '2024-01-15T10:00:00Z',
        lastModified: '2024-01-20T14:30:00Z',
        lastRun: '2024-01-25T09:15:00Z',
        metrics: {
          executions: 1247,
          successRate: 94.5,
          avgDuration: 2.3,
          errors: 12
        }
      },
      {
        id: '2',
        name: 'Processamento de Pedidos',
        description: 'Automação completa do processo de pedidos',
        status: 'active',
        nodes: [],
        connections: [],
        createdAt: '2024-01-10T08:30:00Z',
        lastModified: '2024-01-18T16:45:00Z',
        lastRun: '2024-01-25T08:45:00Z',
        metrics: {
          executions: 856,
          successRate: 87.2,
          avgDuration: 5.7,
          errors: 8
        }
      },
      {
        id: '3',
        name: 'Análise de Dados',
        description: 'Coleta e análise automática de dados',
        status: 'draft',
        nodes: [],
        connections: [],
        createdAt: '2024-01-22T11:15:00Z',
        lastModified: '2024-01-22T11:15:00Z'
      }
    ]);
  }, []);

  const moduleCategories = {
    triggers: {
      name: 'Gatilhos',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      modules: [
        { id: 'webhook', title: 'Webhook', icon: Globe, description: 'Receber dados via HTTP', color: 'from-blue-500 to-blue-600' },
        { id: 'schedule', title: 'Agendamento', icon: Clock, description: 'Executar em horários específicos', color: 'from-purple-500 to-purple-600' },
        { id: 'email_trigger', title: 'Email Recebido', icon: Mail, description: 'Quando um email é recebido', color: 'from-green-500 to-green-600' },
        { id: 'file_watch', title: 'Monitorar Arquivo', icon: Eye, description: 'Quando arquivo é modificado', color: 'from-orange-500 to-orange-600' },
        { id: 'database_trigger', title: 'Banco de Dados', icon: Database, description: 'Mudanças no banco', color: 'from-indigo-500 to-indigo-600' },
        { id: 'api_trigger', title: 'API Call', icon: Cpu, description: 'Chamada de API externa', color: 'from-cyan-500 to-cyan-600' }
      ]
    },
    actions: {
      name: 'Ações',
      icon: Target,
      color: 'from-green-500 to-green-600',
      modules: [
        { id: 'send_email', title: 'Enviar Email', icon: Mail, description: 'Enviar email personalizado', color: 'from-blue-500 to-blue-600' },
        { id: 'send_sms', title: 'Enviar SMS', icon: Phone, description: 'Enviar mensagem SMS', color: 'from-green-500 to-green-600' },
        { id: 'send_whatsapp', title: 'WhatsApp', icon: MessageSquare, description: 'Enviar via WhatsApp', color: 'from-green-600 to-green-700' },
        { id: 'create_record', title: 'Criar Registro', icon: Plus, description: 'Criar novo registro', color: 'from-purple-500 to-purple-600' },
        { id: 'update_record', title: 'Atualizar Registro', icon: RefreshCw, description: 'Atualizar dados existentes', color: 'from-orange-500 to-orange-600' },
        { id: 'delete_record', title: 'Deletar Registro', icon: Trash2, description: 'Remover registro', color: 'from-red-500 to-red-600' },
        { id: 'api_call', title: 'Chamada API', icon: Send, description: 'Fazer requisição HTTP', color: 'from-cyan-500 to-cyan-600' },
        { id: 'file_upload', title: 'Upload Arquivo', icon: UploadIcon, description: 'Fazer upload de arquivo', color: 'from-indigo-500 to-indigo-600' }
      ]
    },
    conditions: {
      name: 'Condições',
      icon: Filter,
      color: 'from-yellow-500 to-yellow-600',
      modules: [
        { id: 'if_condition', title: 'Se/Então', icon: Filter, description: 'Condição lógica simples', color: 'from-yellow-500 to-yellow-600' },
        { id: 'switch', title: 'Switch', icon: GitBranch, description: 'Múltiplas condições', color: 'from-orange-500 to-orange-600' },
        { id: 'text_parser', title: 'Analisar Texto', icon: FileText, description: 'Extrair dados do texto', color: 'from-green-500 to-green-600' },
        { id: 'number_compare', title: 'Comparar Números', icon: BarChart3, description: 'Comparações numéricas', color: 'from-blue-500 to-blue-600' },
        { id: 'date_compare', title: 'Comparar Datas', icon: Calendar, description: 'Comparações de data/hora', color: 'from-purple-500 to-purple-600' },
        { id: 'regex_match', title: 'Regex', icon: Code, description: 'Expressões regulares', color: 'from-red-500 to-red-600' }
      ]
    },
    integrations: {
      name: 'Integrações',
      icon: Layers,
      color: 'from-purple-500 to-purple-600',
      modules: [
        { id: 'google_sheets', title: 'Google Sheets', icon: Grid, description: 'Integração com planilhas', color: 'from-green-500 to-green-600' },
        { id: 'slack', title: 'Slack', icon: MessageSquare, description: 'Enviar para Slack', color: 'from-purple-500 to-purple-600' },
        { id: 'discord', title: 'Discord', icon: Users, description: 'Integração Discord', color: 'from-indigo-500 to-indigo-600' },
        { id: 'telegram', title: 'Telegram', icon: Send, description: 'Bot do Telegram', color: 'from-blue-500 to-blue-600' },
        { id: 'instagram', title: 'Instagram', icon: Instagram, description: 'API do Instagram', color: 'from-pink-500 to-pink-600' },
        { id: 'facebook', title: 'Facebook', icon: Users, description: 'Facebook API', color: 'from-blue-600 to-blue-700' },
        { id: 'twitter', title: 'Twitter/X', icon: Share2, description: 'Postar no Twitter', color: 'from-gray-700 to-gray-800' },
        { id: 'linkedin', title: 'LinkedIn', icon: Users, description: 'LinkedIn API', color: 'from-blue-700 to-blue-800' }
      ]
    },
    utilities: {
      name: 'Utilitários',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      modules: [
        { id: 'delay', title: 'Aguardar', icon: Clock, description: 'Pausa no fluxo', color: 'from-gray-500 to-gray-600' },
        { id: 'iterator', title: 'Iterador', icon: RefreshCw, description: 'Processar lista de itens', color: 'from-blue-500 to-blue-600' },
        { id: 'aggregator', title: 'Agregador', icon: Layers, description: 'Combinar múltiplos dados', color: 'from-green-500 to-green-600' },
        { id: 'transformer', title: 'Transformador', icon: Zap, description: 'Transformar dados', color: 'from-purple-500 to-purple-600' },
        { id: 'json_parser', title: 'JSON Parser', icon: Code, description: 'Analisar dados JSON', color: 'from-orange-500 to-orange-600' },
        { id: 'csv_parser', title: 'CSV Parser', icon: FileText, description: 'Processar arquivos CSV', color: 'from-cyan-500 to-cyan-600' },
        { id: 'error_handler', title: 'Tratamento de Erro', icon: AlertTriangle, description: 'Gerenciar erros', color: 'from-red-500 to-red-600' },
        { id: 'logger', title: 'Logger', icon: FileText, description: 'Registrar atividades', color: 'from-indigo-500 to-indigo-600' }
      ]
    },
    ai: {
      name: 'Inteligência Artificial',
      icon: Bot,
      color: 'from-pink-500 to-pink-600',
      modules: [
        { id: 'openai_gpt', title: 'OpenAI GPT', icon: Bot, description: 'Processamento de linguagem', color: 'from-green-500 to-green-600' },
        { id: 'claude', title: 'Claude AI', icon: Bot, description: 'Assistente Claude', color: 'from-orange-500 to-orange-600' },
        { id: 'gemini', title: 'Google Gemini', icon: Bot, description: 'Google AI', color: 'from-blue-500 to-blue-600' },
        { id: 'text_analysis', title: 'Análise de Texto', icon: FileText, description: 'Sentimento e entidades', color: 'from-purple-500 to-purple-600' },
        { id: 'image_recognition', title: 'Reconhecimento de Imagem', icon: Eye, description: 'Análise de imagens', color: 'from-cyan-500 to-cyan-600' },
        { id: 'speech_to_text', title: 'Fala para Texto', icon: Mic, description: 'Transcrição de áudio', color: 'from-red-500 to-red-600' },
        { id: 'text_to_speech', title: 'Texto para Fala', icon: Volume2, description: 'Síntese de voz', color: 'from-indigo-500 to-indigo-600' },
        { id: 'translation', title: 'Tradução', icon: Globe, description: 'Traduzir idiomas', color: 'from-teal-500 to-teal-600' }
      ]
    }
  };

  const handleCreateFlow = () => {
    const newFlow: Flow = {
      id: Date.now().toString(),
      name: 'Novo Fluxo',
      description: 'Descrição do fluxo',
      status: 'draft',
      nodes: [],
      connections: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setSelectedFlow(newFlow);
    setIsBuilderOpen(true);
  };

  const handleEditFlow = (flow: Flow) => {
    setSelectedFlow(flow);
    setIsBuilderOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, moduleData: any) => {
    setDraggedNode(moduleData);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNode || !selectedFlow) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale;
    const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale;

    const newNode: FlowNode = {
      id: `node_${Date.now()}`,
      type: draggedNode.id.includes('trigger') ? 'trigger' : 
            draggedNode.id.includes('condition') || draggedNode.id.includes('if_') || draggedNode.id.includes('switch') ? 'condition' :
            draggedNode.id === 'delay' ? 'delay' : 'action',
      category: sidebarCategory as any,
      position: { x: x - 60, y: y - 30 }, // Center the node on cursor
      data: {
        title: draggedNode.title,
        description: draggedNode.description,
        config: {},
        icon: draggedNode.icon,
        color: draggedNode.color,
        status: 'pending'
      },
      connections: {
        input: draggedNode.id !== 'webhook' && draggedNode.id !== 'schedule', // Triggers don't have inputs
        outputs: []
      }
    };

    setSelectedFlow({
      ...selectedFlow,
      nodes: [...selectedFlow.nodes, newNode],
      lastModified: new Date().toISOString()
    });

    setDraggedNode(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const node = selectedFlow?.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggedNodeId(nodeId);
    setDragOffset({
      x: (e.clientX - rect.left) / canvasScale - node.position.x - canvasOffset.x / canvasScale,
      y: (e.clientY - rect.top) / canvasScale - node.position.y - canvasOffset.y / canvasScale
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId && selectedFlow) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newX = (e.clientX - rect.left) / canvasScale - dragOffset.x - canvasOffset.x / canvasScale;
      const newY = (e.clientY - rect.top) / canvasScale - dragOffset.y - canvasOffset.y / canvasScale;

      setSelectedFlow({
        ...selectedFlow,
        nodes: selectedFlow.nodes.map(node =>
          node.id === draggedNodeId
            ? { ...node, position: { x: newX, y: newY } }
            : node
        )
      });
    } else if (isDragging) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDraggedNodeId(null);
  };

  const handleZoomIn = () => {
    setCanvasScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setCanvasScale(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleResetView = () => {
    setCanvasOffset({ x: 400, y: 300 });
    setCanvasScale(1);
  };

  const handleAutoLayout = () => {
    if (!selectedFlow || selectedFlow.nodes.length === 0) return;

    const nodeWidth = 200;
    const nodeHeight = 120;
    const horizontalSpacing = 300;
    const verticalSpacing = 200;

    // Simple grid layout
    const updatedNodes = selectedFlow.nodes.map((node, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      return {
        ...node,
        position: {
          x: col * horizontalSpacing,
          y: row * verticalSpacing
        }
      };
    });

    setSelectedFlow({
      ...selectedFlow,
      nodes: updatedNodes
    });
  };

  const handleSaveFlow = () => {
    if (!selectedFlow) return;

    const updatedFlow = {
      ...selectedFlow,
      lastModified: new Date().toISOString()
    };

    if (flows.find(f => f.id === selectedFlow.id)) {
      setFlows(prev => prev.map(f => f.id === selectedFlow.id ? updatedFlow : f));
    } else {
      setFlows(prev => [...prev, updatedFlow]);
    }

    alert('Fluxo salvo com sucesso!');
  };

  const handleTestFlow = async () => {
    setIsTestMode(true);
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setTestResults({
      success: true,
      executionTime: 2.4,
      stepsExecuted: selectedFlow?.nodes.length || 0,
      errors: [],
      data: {
        processed: 15,
        successful: 14,
        failed: 1
      }
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

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setShowNodeConfig(true);
  };

  const handleConnectionStart = (nodeId: string) => {
    if (connectionMode) {
      if (connectionStart && connectionStart !== nodeId) {
        // Create connection
        const newConnection: FlowConnection = {
          id: `conn_${Date.now()}`,
          source: connectionStart,
          target: nodeId,
          animated: true,
          status: 'active'
        };

        if (selectedFlow) {
          setSelectedFlow({
            ...selectedFlow,
            connections: [...selectedFlow.connections, newConnection]
          });
        }

        setConnectionMode(false);
        setConnectionStart(null);
      } else {
        setConnectionStart(nodeId);
      }
    }
  };

  const renderConnection = (connection: FlowConnection) => {
    const sourceNode = selectedFlow?.nodes.find(n => n.id === connection.source);
    const targetNode = selectedFlow?.nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return null;

    const sourceX = sourceNode.position.x + 100; // Center of node
    const sourceY = sourceNode.position.y + 60;
    const targetX = targetNode.position.x + 100;
    const targetY = targetNode.position.y + 60;

    // Create curved path
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    const controlX1 = sourceX + (targetX - sourceX) * 0.3;
    const controlY1 = sourceY;
    const controlX2 = targetX - (targetX - sourceX) * 0.3;
    const controlY2 = targetY;

    const path = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;

    const getConnectionColor = () => {
      switch (connection.status) {
        case 'success': return '#10B981';
        case 'error': return '#EF4444';
        case 'warning': return '#F59E0B';
        default: return '#6B7280';
      }
    };

    return (
      <g key={connection.id}>
        <path
          d={path}
          stroke={getConnectionColor()}
          strokeWidth="2"
          fill="none"
          strokeDasharray={connection.animated ? "5,5" : "none"}
          className={connection.animated ? "animate-pulse" : ""}
        />
        {/* Arrow head */}
        <polygon
          points={`${targetX-8},${targetY-4} ${targetX},${targetY} ${targetX-8},${targetY+4}`}
          fill={getConnectionColor()}
        />
        {/* Connection status indicator */}
        <circle
          cx={midX}
          cy={midY}
          r="6"
          fill={getConnectionColor()}
          className="cursor-pointer hover:r-8 transition-all"
          onClick={() => {
            // Handle connection click
          }}
        />
      </g>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'draft':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
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
      <DashboardLayout currentPage="flow-builder">
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
                    {selectedFlow?.name || 'Novo Fluxo'}
                  </h1>
                  <p className="text-gray-400 text-sm">{selectedFlow?.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Zoom Controls */}
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white text-sm px-2 min-w-[60px] text-center">
                    {Math.round(canvasScale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={handleResetView}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Reset View"
                  >
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Auto Layout */}
                <button
                  onClick={handleAutoLayout}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors duration-300"
                  title="Auto Layout"
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Auto Layout</span>
                </button>

                {/* Connection Mode */}
                <button
                  onClick={() => {
                    setConnectionMode(!connectionMode);
                    setConnectionStart(null);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-300 ${
                    connectionMode 
                      ? 'bg-[#FF7A00] text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Connection Mode"
                >
                  <GitBranch className="w-4 h-4" />
                  <span className="hidden sm:inline">Conectar</span>
                </button>

                {/* Test Flow */}
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

                {/* Save Flow */}
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
            {/* Sidebar with Modules */}
            <div className="w-80 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border-r border-white/20 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-white font-semibold mb-4">Módulos Disponíveis</h3>
                
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {Object.entries(moduleCategories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setSidebarCategory(key)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                        sidebarCategory === key
                          ? 'bg-[#FF7A00] text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Modules */}
                <div className="space-y-2">
                  {moduleCategories[sidebarCategory as keyof typeof moduleCategories]?.modules.map((module) => (
                    <div
                      key={module.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, module)}
                      className="bg-white/10 rounded-lg p-3 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${module.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{module.title}</div>
                          <div className="text-gray-400 text-xs">{module.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                  backgroundSize: `${30 * canvasScale}px ${30 * canvasScale}px`,
                  backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
                }}
              >
                <div
                  style={{
                    transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasScale})`,
                    transformOrigin: '0 0'
                  }}
                >
                  {/* SVG for connections */}
                  <svg
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    {selectedFlow?.connections.map(renderConnection)}
                  </svg>

                  {/* Render Nodes */}
                  {selectedFlow?.nodes.map((node) => (
                    <div
                      key={node.id}
                      className={`absolute bg-white rounded-xl shadow-2xl border-2 transition-all duration-300 cursor-pointer group ${
                        selectedNode === node.id 
                          ? 'border-[#FF7A00] shadow-[#FF7A00]/20' 
                          : 'border-gray-300 hover:border-[#FF7A00]/50'
                      } ${
                        connectionMode && hoveredNode === node.id 
                          ? 'ring-4 ring-[#FF7A00]/30' 
                          : ''
                      }`}
                      style={{
                        left: node.position.x,
                        top: node.position.y,
                        width: '200px',
                        height: '120px'
                      }}
                      onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                      onClick={() => {
                        if (connectionMode) {
                          handleConnectionStart(node.id);
                        } else {
                          handleNodeClick(node.id);
                        }
                      }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Node Header */}
                      <div className={`h-12 bg-gradient-to-r ${node.data.color} rounded-t-xl flex items-center justify-between px-4`}>
                        <div className="flex items-center space-x-2">
                          <node.data.icon className="w-5 h-5 text-white" />
                          <span className="text-white font-medium text-sm">{node.data.title}</span>
                        </div>
                        
                        {/* Status indicator */}
                        <div className={`w-3 h-3 rounded-full ${
                          node.data.status === 'success' ? 'bg-green-400' :
                          node.data.status === 'error' ? 'bg-red-400' :
                          node.data.status === 'warning' ? 'bg-yellow-400' :
                          'bg-gray-400'
                        }`} />
                      </div>

                      {/* Node Body */}
                      <div className="p-4 h-16 flex items-center">
                        <p className="text-gray-600 text-xs leading-tight">
                          {node.data.description}
                        </p>
                      </div>

                      {/* Connection Points */}
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                        {node.connections.input && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                        )}
                      </div>
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg" />
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Connection mode indicator */}
                      {connectionMode && connectionStart === node.id && (
                        <div className="absolute inset-0 bg-[#FF7A00]/20 rounded-xl border-2 border-[#FF7A00] animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {(!selectedFlow?.nodes.length) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MousePointer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-white text-xl font-semibold mb-2">Canvas Vazio</h3>
                      <p className="text-gray-400 max-w-md">
                        Arraste módulos da barra lateral para começar a construir seu fluxo de automação. 
                        Use o modo de conexão para ligar os módulos.
                      </p>
                    </div>
                  </div>
                )}

                {/* Connection Mode Indicator */}
                {connectionMode && (
                  <div className="absolute top-4 left-4 bg-[#FF7A00] text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {connectionStart ? 'Clique no módulo de destino' : 'Clique no módulo de origem'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Node Configuration Modal */}
          {showNodeConfig && selectedNode && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Configurar Módulo</h3>
                  <button
                    onClick={() => setShowNodeConfig(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Nome do Módulo</label>
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      placeholder="Nome personalizado"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Descrição</label>
                    <textarea
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Descrição do módulo"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Configurações</label>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">
                        As configurações específicas do módulo aparecerão aqui baseadas no tipo selecionado.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowNodeConfig(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowNodeConfig(false)}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Results Modal */}
          {testResults && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-lg">
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
                    <span className="text-white">Fluxo executado com sucesso</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Tempo de Execução</div>
                      <div className="text-white font-semibold">{testResults.executionTime}s</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Módulos Executados</div>
                      <div className="text-white font-semibold">{testResults.stepsExecuted}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Processados</div>
                      <div className="text-white font-semibold">{testResults.data.processed}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Bem-sucedidos</div>
                      <div className="text-green-400 font-semibold">{testResults.data.successful}</div>
                    </div>
                  </div>

                  {testResults.data.failed > 0 && (
                    <div className="bg-red-500/20 rounded-lg p-3">
                      <div className="text-red-300 text-sm font-semibold">
                        {testResults.data.failed} operação(ões) falharam
                      </div>
                    </div>
                  )}
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
    <DashboardLayout currentPage="flow-builder">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Construtor de Fluxos Visuais</h1>
            <p className="text-gray-300">Crie automações complexas com interface drag-and-drop</p>
          </div>
          
          <button
            onClick={handleCreateFlow}
            className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Fluxo</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">Total</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{flows.length}</div>
            <div className="text-gray-300 text-sm">Fluxos Criados</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">Ativos</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{flows.filter(f => f.status === 'active').length}</div>
            <div className="text-gray-300 text-sm">Fluxos Ativos</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">Execuções</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {flows.reduce((sum, flow) => sum + (flow.metrics?.executions || 0), 0).toLocaleString()}
            </div>
            <div className="text-gray-300 text-sm">Total de Execuções</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-400 text-sm font-semibold">Taxa de Sucesso</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {flows.length > 0 
                ? (flows.reduce((sum, flow) => sum + (flow.metrics?.successRate || 0), 0) / flows.length).toFixed(1)
                : 0
              }%
            </div>
            <div className="text-gray-300 text-sm">Média de Sucesso</div>
          </div>
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
              <option value="error" className="bg-[#2D0B55]">Erro</option>
            </select>
          </div>
        </div>

        {/* Flows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFlows.map((flow) => (
            <div
              key={flow.id}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{flow.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {flow.lastRun ? `Executado ${new Date(flow.lastRun).toLocaleDateString()}` : 'Nunca executado'}
                    </p>
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
          ))}
        </div>

        {filteredFlows.length === 0 && (
          <div className="text-center py-12">
            <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhum fluxo encontrado</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Crie seu primeiro fluxo de automação visual'
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