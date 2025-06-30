import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  Eye,
  Copy,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Brain,
  Database,
  Globe,
  FileText,
  Code,
  MessageSquare,
  BarChart3,
  Calendar,
  Target,
  Cpu,
  Activity,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Info,
  Link,
  Folder,
  File,
  Monitor,
  Smartphone,
  Mail,
  Phone
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  purpose: string;
  model: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  lastModified: string;
  createdAt: string;
  triggers: {
    type: 'schedule' | 'event' | 'manual';
    config: any;
  }[];
  knowledgeBase: string[];
  metrics: {
    interactions: number;
    successRate: number;
    avgResponseTime: number;
    tokensUsed: number;
  };
  settings: {
    temperature: number;
    topP: number;
    maxTokens: number;
    tone: string;
    style: string;
    language: string;
  };
}

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: 'file' | 'web' | 'manual' | 'api';
  size: number;
  documents: number;
  lastUpdated: string;
  status: 'ready' | 'processing' | 'error';
}

const AIAgentPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'knowledge'>('list');
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'status'>('modified');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'model' | 'triggers' | 'knowledge' | 'preview'>('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [previewResponse, setPreviewResponse] = useState('');

  // Form state for agent creation/editing
  const [agentForm, setAgentForm] = useState({
    name: '',
    description: '',
    purpose: '',
    model: 'gpt-4',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    tone: 'professional',
    style: 'balanced',
    language: 'pt-BR',
    triggers: [],
    knowledgeBase: []
  });

  const [knowledgeForm, setKnowledgeForm] = useState({
    name: '',
    description: '',
    type: 'file' as 'file' | 'web' | 'manual' | 'api',
    content: '',
    urls: [''],
    files: []
  });

  useEffect(() => {
    loadAgents();
    loadKnowledgeBases();
  }, []);

  const loadAgents = () => {
    // Mock data for AI agents
    const mockAgents: AIAgent[] = [
      {
        id: '1',
        name: 'Assistente de Vendas',
        description: 'Agente especializado em qualificação de leads e fechamento de vendas',
        purpose: 'Automatizar o processo de vendas e aumentar conversões',
        model: 'gpt-4',
        status: 'active',
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-15T10:00:00Z',
        triggers: [
          { type: 'event', config: { event: 'new_lead' } },
          { type: 'schedule', config: { cron: '0 9 * * *' } }
        ],
        knowledgeBase: ['kb-1', 'kb-2'],
        metrics: {
          interactions: 1247,
          successRate: 87.5,
          avgResponseTime: 1.2,
          tokensUsed: 45230
        },
        settings: {
          temperature: 0.7,
          topP: 0.9,
          maxTokens: 2048,
          tone: 'professional',
          style: 'persuasive',
          language: 'pt-BR'
        }
      },
      {
        id: '2',
        name: 'Suporte Técnico',
        description: 'Agente para atendimento e resolução de problemas técnicos',
        purpose: 'Fornecer suporte 24/7 para questões técnicas',
        model: 'claude-3',
        status: 'active',
        lastModified: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-10T14:30:00Z',
        triggers: [
          { type: 'event', config: { event: 'support_ticket' } }
        ],
        knowledgeBase: ['kb-3'],
        metrics: {
          interactions: 892,
          successRate: 94.2,
          avgResponseTime: 0.8,
          tokensUsed: 32150
        },
        settings: {
          temperature: 0.3,
          topP: 0.8,
          maxTokens: 1024,
          tone: 'helpful',
          style: 'technical',
          language: 'pt-BR'
        }
      },
      {
        id: '3',
        name: 'Agente de Marketing',
        description: 'Criação de conteúdo e campanhas de marketing personalizadas',
        purpose: 'Automatizar criação de conteúdo e engajamento',
        model: 'gpt-4-turbo',
        status: 'training',
        lastModified: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-20T09:15:00Z',
        triggers: [
          { type: 'schedule', config: { cron: '0 8,14,20 * * *' } }
        ],
        knowledgeBase: ['kb-4'],
        metrics: {
          interactions: 456,
          successRate: 76.8,
          avgResponseTime: 2.1,
          tokensUsed: 28940
        },
        settings: {
          temperature: 0.8,
          topP: 0.95,
          maxTokens: 3000,
          tone: 'creative',
          style: 'engaging',
          language: 'pt-BR'
        }
      }
    ];
    setAgents(mockAgents);
  };

  const loadKnowledgeBases = () => {
    // Mock data for knowledge bases
    const mockKnowledgeBases: KnowledgeBase[] = [
      {
        id: 'kb-1',
        name: 'Base de Produtos',
        description: 'Informações completas sobre todos os produtos e serviços',
        type: 'file',
        size: 2.5,
        documents: 45,
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'ready'
      },
      {
        id: 'kb-2',
        name: 'Scripts de Vendas',
        description: 'Melhores práticas e scripts para diferentes cenários de venda',
        type: 'manual',
        size: 1.2,
        documents: 23,
        lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'ready'
      },
      {
        id: 'kb-3',
        name: 'Documentação Técnica',
        description: 'Manuais técnicos e troubleshooting guides',
        type: 'web',
        size: 4.8,
        documents: 127,
        lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'processing'
      },
      {
        id: 'kb-4',
        name: 'Conteúdo de Marketing',
        description: 'Templates, exemplos e guidelines de marketing',
        type: 'api',
        size: 3.1,
        documents: 67,
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'ready'
      }
    ];
    setKnowledgeBases(mockKnowledgeBases);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'training':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Bot className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'inactive':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'training':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setAgentForm({
      name: '',
      description: '',
      purpose: '',
      model: 'gpt-4',
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048,
      tone: 'professional',
      style: 'balanced',
      language: 'pt-BR',
      triggers: [],
      knowledgeBase: []
    });
    setActiveTab('basic');
    setCurrentView('create');
  };

  const handleEditAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setAgentForm({
      name: agent.name,
      description: agent.description,
      purpose: agent.purpose,
      model: agent.model,
      temperature: agent.settings.temperature,
      topP: agent.settings.topP,
      maxTokens: agent.settings.maxTokens,
      tone: agent.settings.tone,
      style: agent.settings.style,
      language: agent.settings.language,
      triggers: agent.triggers,
      knowledgeBase: agent.knowledgeBase
    });
    setActiveTab('basic');
    setCurrentView('edit');
  };

  const handleSaveAgent = () => {
    const newAgent: AIAgent = {
      id: selectedAgent?.id || Date.now().toString(),
      name: agentForm.name,
      description: agentForm.description,
      purpose: agentForm.purpose,
      model: agentForm.model,
      status: selectedAgent?.status || 'inactive',
      lastModified: new Date().toISOString(),
      createdAt: selectedAgent?.createdAt || new Date().toISOString(),
      triggers: agentForm.triggers,
      knowledgeBase: agentForm.knowledgeBase,
      metrics: selectedAgent?.metrics || {
        interactions: 0,
        successRate: 0,
        avgResponseTime: 0,
        tokensUsed: 0
      },
      settings: {
        temperature: agentForm.temperature,
        topP: agentForm.topP,
        maxTokens: agentForm.maxTokens,
        tone: agentForm.tone,
        style: agentForm.style,
        language: agentForm.language
      }
    };

    if (selectedAgent) {
      setAgents(prev => prev.map(a => a.id === selectedAgent.id ? newAgent : a));
    } else {
      setAgents(prev => [...prev, newAgent]);
    }

    setCurrentView('list');
  };

  const handleDeleteAgent = (agentId: string) => {
    if (confirm('Tem certeza que deseja excluir este agente?')) {
      setAgents(prev => prev.filter(a => a.id !== agentId));
    }
  };

  const handleToggleStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ));
  };

  const handleTestAgent = async () => {
    if (!previewMessage.trim()) return;
    
    setIsLoading(true);
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const responses = [
      "Olá! Como posso ajudá-lo hoje? Estou aqui para responder suas dúvidas sobre nossos produtos e serviços.",
      "Entendo sua necessidade. Com base nas informações que você forneceu, posso recomendar algumas opções que se adequam ao seu perfil.",
      "Essa é uma excelente pergunta! Deixe-me explicar detalhadamente como isso funciona...",
      "Agradeço seu interesse! Vou verificar as melhores opções disponíveis para sua situação específica."
    ];
    
    setPreviewResponse(responses[Math.floor(Math.random() * responses.length)]);
    setIsLoading(false);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'modified':
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
  });

  const aiModels = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Modelo mais avançado para tarefas complexas',
      capabilities: ['Raciocínio avançado', 'Análise de código', 'Criatividade'],
      pricing: '$0.03/1K tokens',
      maxTokens: 8192,
      languages: ['Português', 'Inglês', '100+ idiomas']
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      description: 'Versão otimizada do GPT-4 com melhor performance',
      capabilities: ['Velocidade superior', 'Contexto estendido', 'Custo reduzido'],
      pricing: '$0.01/1K tokens',
      maxTokens: 128000,
      languages: ['Português', 'Inglês', '100+ idiomas']
    },
    {
      id: 'claude-3',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Modelo equilibrado entre inteligência e velocidade',
      capabilities: ['Análise detalhada', 'Segurança avançada', 'Raciocínio ético'],
      pricing: '$0.015/1K tokens',
      maxTokens: 200000,
      languages: ['Português', 'Inglês', 'Francês', 'Espanhol']
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'Modelo mais poderoso da Anthropic',
      capabilities: ['Máxima inteligência', 'Tarefas complexas', 'Análise profunda'],
      pricing: '$0.075/1K tokens',
      maxTokens: 200000,
      languages: ['Português', 'Inglês', 'Francês', 'Espanhol']
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Modelo multimodal do Google',
      capabilities: ['Multimodal', 'Análise de imagens', 'Integração Google'],
      pricing: '$0.0025/1K tokens',
      maxTokens: 32000,
      languages: ['Português', 'Inglês', '40+ idiomas']
    }
  ];

  const triggerTypes = [
    {
      id: 'schedule',
      name: 'Agendado',
      description: 'Executa em horários específicos',
      icon: Calendar,
      config: ['cron', 'timezone', 'frequency']
    },
    {
      id: 'event',
      name: 'Baseado em Evento',
      description: 'Ativado por eventos específicos',
      icon: Zap,
      config: ['event_type', 'conditions', 'filters']
    },
    {
      id: 'manual',
      name: 'Manual',
      description: 'Ativação manual pelo usuário',
      icon: Play,
      config: ['permissions', 'interface']
    }
  ];

  if (currentView === 'knowledge') {
    return (
      <DashboardLayout currentPage="ai-agent">
        <div className="space-y-8">
          {/* Knowledge Base Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Base de Conhecimento</h1>
              <p className="text-gray-300">Gerencie documentos e fontes de conhecimento para seus agentes</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('list')}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Bot className="w-4 h-4" />
                <span>Voltar aos Agentes</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300">
                <Plus className="w-4 h-4" />
                <span>Nova Base</span>
              </button>
            </div>
          </div>

          {/* Knowledge Base Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledgeBases.map((kb) => (
              <div key={kb.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      kb.type === 'file' ? 'bg-blue-500' :
                      kb.type === 'web' ? 'bg-green-500' :
                      kb.type === 'manual' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}>
                      {kb.type === 'file' && <File className="w-6 h-6 text-white" />}
                      {kb.type === 'web' && <Globe className="w-6 h-6 text-white" />}
                      {kb.type === 'manual' && <Edit className="w-6 h-6 text-white" />}
                      {kb.type === 'api' && <Code className="w-6 h-6 text-white" />}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(kb.status)}`}>
                      {kb.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">{kb.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{kb.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-white font-semibold">{kb.size} MB</div>
                    <div className="text-gray-400 text-xs">Tamanho</div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{kb.documents}</div>
                    <div className="text-gray-400 text-xs">Documentos</div>
                  </div>
                </div>
                
                <div className="text-gray-400 text-xs mb-4">
                  Atualizado: {formatDate(kb.lastUpdated)}
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300">
                    <Edit className="w-3 h-3 inline mr-1" />
                    Editar
                  </button>
                  <button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors duration-300">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (currentView === 'create' || currentView === 'edit') {
    return (
      <DashboardLayout currentPage="ai-agent">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentView === 'create' ? 'Criar Agente IA' : 'Editar Agente IA'}
              </h1>
              <p className="text-gray-300">Configure seu agente de IA personalizado</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('list')}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              
              <button
                onClick={handleSaveAgent}
                className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Agente</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            {[
              { id: 'basic', name: 'Básico', icon: Bot },
              { id: 'model', name: 'Modelo IA', icon: Brain },
              { id: 'triggers', name: 'Triggers', icon: Zap },
              { id: 'knowledge', name: 'Conhecimento', icon: Database },
              { id: 'preview', name: 'Preview', icon: Eye }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#FF7A00] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Informações Básicas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Nome do Agente *</label>
                    <input
                      type="text"
                      value={agentForm.name}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      placeholder="Ex: Assistente de Vendas"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Idioma</label>
                    <select
                      value={agentForm.language}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="pt-BR" className="bg-[#2D0B55]">Português (Brasil)</option>
                      <option value="en-US" className="bg-[#2D0B55]">English (US)</option>
                      <option value="es-ES" className="bg-[#2D0B55]">Español</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Descrição</label>
                  <textarea
                    value={agentForm.description}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Descreva o que este agente faz..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Propósito</label>
                  <textarea
                    value={agentForm.purpose}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, purpose: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Qual o objetivo principal deste agente?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Tom de Voz</label>
                    <select
                      value={agentForm.tone}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, tone: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="professional" className="bg-[#2D0B55]">Profissional</option>
                      <option value="friendly" className="bg-[#2D0B55]">Amigável</option>
                      <option value="casual" className="bg-[#2D0B55]">Casual</option>
                      <option value="formal" className="bg-[#2D0B55]">Formal</option>
                      <option value="creative" className="bg-[#2D0B55]">Criativo</option>
                      <option value="helpful" className="bg-[#2D0B55]">Prestativo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Estilo de Resposta</label>
                    <select
                      value={agentForm.style}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, style: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="balanced" className="bg-[#2D0B55]">Equilibrado</option>
                      <option value="concise" className="bg-[#2D0B55]">Conciso</option>
                      <option value="detailed" className="bg-[#2D0B55]">Detalhado</option>
                      <option value="technical" className="bg-[#2D0B55]">Técnico</option>
                      <option value="persuasive" className="bg-[#2D0B55]">Persuasivo</option>
                      <option value="engaging" className="bg-[#2D0B55]">Envolvente</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* AI Model Tab */}
            {activeTab === 'model' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Configuração do Modelo IA</h3>
                
                {/* Model Selection */}
                <div>
                  <label className="block text-white font-semibold mb-4">Selecionar Modelo</label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {aiModels.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => setAgentForm(prev => ({ ...prev, model: model.id }))}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          agentForm.model === model.id
                            ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{model.name}</h4>
                          <span className="text-gray-400 text-sm">{model.provider}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{model.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Preço:</span>
                            <span className="text-white">{model.pricing}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Max Tokens:</span>
                            <span className="text-white">{model.maxTokens.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-gray-400 text-xs mb-1">Capacidades:</div>
                          <div className="flex flex-wrap gap-1">
                            {model.capabilities.slice(0, 2).map((cap, index) => (
                              <span key={index} className="bg-white/10 text-white text-xs px-2 py-1 rounded">
                                {cap}
                              </span>
                            ))}
                            {model.capabilities.length > 2 && (
                              <span className="text-gray-400 text-xs">+{model.capabilities.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Temperature: {agentForm.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={agentForm.temperature}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Conservador</span>
                      <span>Criativo</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Top-p: {agentForm.topP}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={agentForm.topP}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                      className="w-full slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Focado</span>
                      <span>Diverso</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Max Tokens</label>
                    <input
                      type="number"
                      value={agentForm.maxTokens}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      min="100"
                      max="8192"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Triggers Tab */}
            {activeTab === 'triggers' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Configuração de Triggers</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {triggerTypes.map((trigger) => (
                    <div
                      key={trigger.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#FF7A00]/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-lg flex items-center justify-center">
                          <trigger.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{trigger.name}</h4>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{trigger.description}</p>
                      
                      <button className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300">
                        Configurar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge Base Tab */}
            {activeTab === 'knowledge' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Base de Conhecimento</h3>
                  <button
                    onClick={() => setCurrentView('knowledge')}
                    className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    <Database className="w-4 h-4" />
                    <span>Gerenciar Bases</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {knowledgeBases.map((kb) => (
                    <div
                      key={kb.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        agentForm.knowledgeBase.includes(kb.id)
                          ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      onClick={() => {
                        const isSelected = agentForm.knowledgeBase.includes(kb.id);
                        setAgentForm(prev => ({
                          ...prev,
                          knowledgeBase: isSelected
                            ? prev.knowledgeBase.filter(id => id !== kb.id)
                            : [...prev.knowledgeBase, kb.id]
                        }));
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          kb.type === 'file' ? 'bg-blue-500' :
                          kb.type === 'web' ? 'bg-green-500' :
                          kb.type === 'manual' ? 'bg-purple-500' : 'bg-orange-500'
                        }`}>
                          {kb.type === 'file' && <File className="w-4 h-4 text-white" />}
                          {kb.type === 'web' && <Globe className="w-4 h-4 text-white" />}
                          {kb.type === 'manual' && <Edit className="w-4 h-4 text-white" />}
                          {kb.type === 'api' && <Code className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{kb.name}</h4>
                          <p className="text-gray-400 text-sm">{kb.documents} documentos</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Preview do Agente</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Agent Info */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Informações do Agente</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Nome:</span>
                          <span className="text-white">{agentForm.name || 'Sem nome'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Modelo:</span>
                          <span className="text-white">{agentForm.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tom:</span>
                          <span className="text-white">{agentForm.tone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estilo:</span>
                          <span className="text-white">{agentForm.style}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Parâmetros</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Temperature:</span>
                          <span className="text-white">{agentForm.temperature}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Top-p:</span>
                          <span className="text-white">{agentForm.topP}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max Tokens:</span>
                          <span className="text-white">{agentForm.maxTokens}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Test Interface */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Testar Agente</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">Mensagem de Teste</label>
                          <textarea
                            value={previewMessage}
                            onChange={(e) => setPreviewMessage(e.target.value)}
                            rows={3}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                            placeholder="Digite uma mensagem para testar o agente..."
                          />
                        </div>
                        
                        <button
                          onClick={handleTestAgent}
                          disabled={isLoading || !previewMessage.trim()}
                          className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Testar Agente
                            </>
                          )}
                        </button>
                        
                        {previewResponse && (
                          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                            <h5 className="text-green-300 font-semibold mb-2">Resposta do Agente:</h5>
                            <p className="text-white">{previewResponse}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="ai-agent">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Agentes de IA</h1>
            <p className="text-gray-300">Gerencie seus agentes de inteligência artificial</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('knowledge')}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Database className="w-4 h-4" />
              <span>Base de Conhecimento</span>
            </button>
            
            <button
              onClick={handleCreateAgent}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Agente</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">+2 este mês</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{agents.length}</div>
            <div className="text-gray-300 text-sm">Agentes Criados</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">87% uptime</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{agents.filter(a => a.status === 'active').length}</div>
            <div className="text-gray-300 text-sm">Agentes Ativos</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">+23% hoje</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {agents.reduce((sum, agent) => sum + agent.metrics.interactions, 0).toLocaleString()}
            </div>
            <div className="text-gray-300 text-sm">Interações Total</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-400 text-sm font-semibold">Média geral</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {(agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / agents.length || 0).toFixed(1)}%
            </div>
            <div className="text-gray-300 text-sm">Taxa de Sucesso</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar agentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="all" className="bg-[#2D0B55]">Todos os status</option>
                <option value="active" className="bg-[#2D0B55]">Ativo</option>
                <option value="inactive" className="bg-[#2D0B55]">Inativo</option>
                <option value="training" className="bg-[#2D0B55]">Treinando</option>
                <option value="error" className="bg-[#2D0B55]">Erro</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="modified" className="bg-[#2D0B55]">Última modificação</option>
                <option value="name" className="bg-[#2D0B55]">Nome</option>
                <option value="status" className="bg-[#2D0B55]">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left text-white font-semibold p-4">Agente</th>
                  <th className="text-left text-white font-semibold p-4">Modelo</th>
                  <th className="text-left text-white font-semibold p-4">Status</th>
                  <th className="text-left text-white font-semibold p-4">Interações</th>
                  <th className="text-left text-white font-semibold p-4">Taxa de Sucesso</th>
                  <th className="text-left text-white font-semibold p-4">Última Modificação</th>
                  <th className="text-left text-white font-semibold p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedAgents.map((agent) => (
                  <tr key={agent.id} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-300">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-lg flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{agent.name}</div>
                          <div className="text-gray-400 text-sm">{agent.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{agent.model}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(agent.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(agent.status)}`}>
                          {agent.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{agent.metrics.interactions.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{agent.metrics.successRate.toFixed(1)}%</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{formatDate(agent.lastModified)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleStatus(agent.id)}
                          className={`p-2 rounded-lg transition-colors duration-300 ${
                            agent.status === 'active'
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                          title={agent.status === 'active' ? 'Pausar' : 'Ativar'}
                        >
                          {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedAgent(agent);
                            setShowPreview(true);
                          }}
                          className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sortedAgents.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Nenhum agente encontrado</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Crie seu primeiro agente de IA para começar'
                }
              </p>
              <button
                onClick={handleCreateAgent}
                className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Criar Primeiro Agente
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAgentPage;