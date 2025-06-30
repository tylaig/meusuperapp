import React, { useState, useEffect } from 'react';
import { 
  RefreshCw,
  Plus,
  Play,
  Pause,
  Settings,
  BarChart3,
  MessageSquare,
  Mail,
  Phone,
  Send,
  Clock,
  Target,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Filter,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  Download,
  Upload,
  Calendar,
  Tag,
  User,
  Building,
  DollarSign,
  Activity,
  Workflow,
  Bot,
  Brain,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  ExternalLink,
  Star,
  Archive,
  Bell,
  Globe,
  Smartphone,
  Instagram,
  Facebook,
  Telegram
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface FollowUpFlow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  triggers: Array<{
    type: 'time_delay' | 'no_response' | 'webhook' | 'interaction' | 'status_change' | 'date_based';
    condition: string;
    value: any;
  }>;
  actions: Array<{
    type: 'send_message' | 'send_email' | 'send_sms' | 'create_task' | 'assign_tag' | 'change_status' | 'webhook';
    channel?: 'whatsapp' | 'instagram' | 'email' | 'sms' | 'telegram';
    content?: string;
    delay?: number;
    conditions?: any;
  }>;
  analytics: {
    totalExecutions: number;
    successRate: number;
    conversionRate: number;
    avgResponseTime: number;
    lastExecution: string;
  };
  aiSettings: {
    enabled: boolean;
    personalization: boolean;
    sentimentAnalysis: boolean;
    predictiveOptimization: boolean;
    autoOptimizeTime: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface FollowUpExecution {
  id: string;
  flowId: string;
  contactId: string;
  contactName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep: number;
  totalSteps: number;
  startedAt: string;
  completedAt?: string;
  results: Array<{
    stepId: string;
    action: string;
    status: 'success' | 'failed' | 'skipped';
    timestamp: string;
    response?: string;
    error?: string;
  }>;
  metrics: {
    messagesOpened: number;
    linksClicked: number;
    responsesReceived: number;
    conversionAchieved: boolean;
  };
}

interface AIInsight {
  id: string;
  type: 'optimization' | 'pattern' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionable: boolean;
  suggestedAction?: string;
  createdAt: string;
}

const FollowUpPage: React.FC = () => {
  const [flows, setFlows] = useState<FollowUpFlow[]>([]);
  const [executions, setExecutions] = useState<FollowUpExecution[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<FollowUpFlow | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    channel: 'all',
    performance: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'flows' | 'executions' | 'analytics' | 'insights'>('flows');

  useEffect(() => {
    loadFollowUpData();
  }, []);

  const loadFollowUpData = async () => {
    setIsLoading(true);
    
    // Mock data for follow-up flows
    const mockFlows: FollowUpFlow[] = [
      {
        id: '1',
        name: 'Lead Nurturing - Plano Pro',
        description: 'Sequência automatizada para leads interessados no plano Pro',
        status: 'active',
        triggers: [
          { type: 'interaction', condition: 'demo_completed', value: true },
          { type: 'no_response', condition: 'hours_without_response', value: 24 }
        ],
        actions: [
          {
            type: 'send_message',
            channel: 'whatsapp',
            content: 'Olá {nome}! Vi que você participou da nossa demonstração. Ficou com alguma dúvida?',
            delay: 60
          },
          {
            type: 'send_email',
            channel: 'email',
            content: 'Proposta personalizada anexa com desconto especial de 20%',
            delay: 1440
          },
          {
            type: 'create_task',
            content: 'Ligar para {nome} - Follow-up demo',
            delay: 2880
          }
        ],
        analytics: {
          totalExecutions: 247,
          successRate: 87.5,
          conversionRate: 23.8,
          avgResponseTime: 4.2,
          lastExecution: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        aiSettings: {
          enabled: true,
          personalization: true,
          sentimentAnalysis: true,
          predictiveOptimization: true,
          autoOptimizeTime: true
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Recuperação de Carrinho Abandonado',
        description: 'Reativa leads que abandonaram o processo de compra',
        status: 'active',
        triggers: [
          { type: 'status_change', condition: 'cart_abandoned', value: true },
          { type: 'time_delay', condition: 'hours_since_abandonment', value: 2 }
        ],
        actions: [
          {
            type: 'send_message',
            channel: 'whatsapp',
            content: 'Oi {nome}! Notei que você estava interessado em nossos planos. Posso ajudar com alguma dúvida?',
            delay: 0
          },
          {
            type: 'send_message',
            channel: 'whatsapp',
            content: 'Que tal uma conversa rápida de 15 minutos para esclarecer tudo? Tenho um desconto especial para você!',
            delay: 720
          }
        ],
        analytics: {
          totalExecutions: 156,
          successRate: 92.3,
          conversionRate: 31.4,
          avgResponseTime: 2.8,
          lastExecution: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        aiSettings: {
          enabled: true,
          personalization: true,
          sentimentAnalysis: false,
          predictiveOptimization: true,
          autoOptimizeTime: true
        },
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Onboarding Novos Clientes',
        description: 'Sequência de boas-vindas e configuração inicial',
        status: 'active',
        triggers: [
          { type: 'status_change', condition: 'customer_created', value: true }
        ],
        actions: [
          {
            type: 'send_message',
            channel: 'whatsapp',
            content: 'Bem-vindo à família meusuper.app, {nome}! 🎉 Vamos configurar tudo para você começar a vender 24/7?',
            delay: 5
          },
          {
            type: 'send_email',
            channel: 'email',
            content: 'Guia completo de primeiros passos + acesso ao treinamento exclusivo',
            delay: 60
          },
          {
            type: 'create_task',
            content: 'Agendar call de onboarding com {nome}',
            delay: 1440
          }
        ],
        analytics: {
          totalExecutions: 89,
          successRate: 96.6,
          conversionRate: 78.9,
          avgResponseTime: 1.2,
          lastExecution: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        aiSettings: {
          enabled: true,
          personalization: true,
          sentimentAnalysis: true,
          predictiveOptimization: false,
          autoOptimizeTime: false
        },
        createdAt: '2024-01-10T08:15:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Reativação Clientes Inativos',
        description: 'Reconecta com clientes que não usam a plataforma há 30 dias',
        status: 'paused',
        triggers: [
          { type: 'date_based', condition: 'days_inactive', value: 30 }
        ],
        actions: [
          {
            type: 'send_email',
            channel: 'email',
            content: 'Sentimos sua falta! Veja as novidades que preparamos para você',
            delay: 0
          },
          {
            type: 'send_message',
            channel: 'whatsapp',
            content: 'Oi {nome}! Que tal retomarmos suas vendas? Temos novidades incríveis!',
            delay: 1440
          }
        ],
        analytics: {
          totalExecutions: 34,
          successRate: 73.5,
          conversionRate: 18.2,
          avgResponseTime: 8.7,
          lastExecution: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        aiSettings: {
          enabled: false,
          personalization: false,
          sentimentAnalysis: false,
          predictiveOptimization: false,
          autoOptimizeTime: false
        },
        createdAt: '2024-01-05T16:45:00Z',
        updatedAt: new Date().toISOString()
      }
    ];

    // Mock executions
    const mockExecutions: FollowUpExecution[] = [
      {
        id: '1',
        flowId: '1',
        contactId: 'contact-1',
        contactName: 'Maria Silva',
        status: 'running',
        currentStep: 2,
        totalSteps: 3,
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        results: [
          {
            stepId: 'step-1',
            action: 'send_message',
            status: 'success',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            response: 'Mensagem enviada com sucesso'
          },
          {
            stepId: 'step-2',
            action: 'send_email',
            status: 'success',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            response: 'Email aberto pelo destinatário'
          }
        ],
        metrics: {
          messagesOpened: 2,
          linksClicked: 1,
          responsesReceived: 1,
          conversionAchieved: false
        }
      },
      {
        id: '2',
        flowId: '2',
        contactId: 'contact-2',
        contactName: 'João Santos',
        status: 'completed',
        currentStep: 2,
        totalSteps: 2,
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        results: [
          {
            stepId: 'step-1',
            action: 'send_message',
            status: 'success',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            response: 'Cliente respondeu positivamente'
          },
          {
            stepId: 'step-2',
            action: 'send_message',
            status: 'success',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            response: 'Conversão realizada - cliente fechou negócio'
          }
        ],
        metrics: {
          messagesOpened: 2,
          linksClicked: 3,
          responsesReceived: 2,
          conversionAchieved: true
        }
      }
    ];

    // Mock AI insights
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'optimization',
        title: 'Otimização de Horário Detectada',
        description: 'A IA identificou que mensagens enviadas entre 14h-16h têm 34% mais taxa de resposta',
        impact: 'high',
        confidence: 89,
        actionable: true,
        suggestedAction: 'Ajustar horários de envio para 14h-16h',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'pattern',
        title: 'Padrão de Comportamento Identificado',
        description: 'Leads que interagem com vídeos têm 67% mais chance de conversão',
        impact: 'medium',
        confidence: 76,
        actionable: true,
        suggestedAction: 'Incluir vídeos explicativos nos follow-ups',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Previsão de Churn',
        description: 'Cliente Ana Costa tem 78% de probabilidade de cancelamento nos próximos 7 dias',
        impact: 'critical',
        confidence: 92,
        actionable: true,
        suggestedAction: 'Ativar fluxo de retenção urgente',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ];

    setFlows(mockFlows);
    setExecutions(mockExecutions);
    setAiInsights(mockInsights);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'draft':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'running':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'cancelled':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'text-red-400 bg-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'sms':
        return <Phone className="w-4 h-4 text-purple-500" />;
      case 'telegram':
        return <Telegram className="w-4 h-4 text-blue-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleFlowStatus = (flowId: string) => {
    setFlows(prev => prev.map(flow => 
      flow.id === flowId 
        ? { 
            ...flow, 
            status: flow.status === 'active' ? 'paused' : 'active',
            updatedAt: new Date().toISOString()
          }
        : flow
    ));
  };

  const duplicateFlow = (flowId: string) => {
    const flowToDuplicate = flows.find(f => f.id === flowId);
    if (flowToDuplicate) {
      const newFlow: FollowUpFlow = {
        ...flowToDuplicate,
        id: Date.now().toString(),
        name: `${flowToDuplicate.name} (Cópia)`,
        status: 'draft',
        analytics: {
          totalExecutions: 0,
          successRate: 0,
          conversionRate: 0,
          avgResponseTime: 0,
          lastExecution: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFlows(prev => [newFlow, ...prev]);
    }
  };

  const deleteFlow = (flowId: string) => {
    if (confirm('Tem certeza que deseja excluir este fluxo?')) {
      setFlows(prev => prev.filter(flow => flow.id !== flowId));
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || flow.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const activeFlows = flows.filter(f => f.status === 'active').length;
  const totalExecutions = flows.reduce((sum, flow) => sum + flow.analytics.totalExecutions, 0);
  const avgConversionRate = flows.reduce((sum, flow) => sum + flow.analytics.conversionRate, 0) / flows.length;
  const runningExecutions = executions.filter(e => e.status === 'running').length;

  return (
    <DashboardLayout currentPage="follow-up">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Follow-up Inteligente</h1>
            <p className="text-gray-300">Automação avançada com IA para nutrição e conversão de leads</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Fluxo</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">Ativos</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{activeFlows}</div>
            <div className="text-gray-300 text-sm">Fluxos Ativos</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">Em execução</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{runningExecutions}</div>
            <div className="text-gray-300 text-sm">Execuções Ativas</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">Conversão</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{avgConversionRate.toFixed(1)}%</div>
            <div className="text-gray-300 text-sm">Taxa Média</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-400 text-sm font-semibold">Total</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalExecutions.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Execuções</div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar fluxos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todos</option>
                  <option value="active" className="bg-[#2D0B55]">Ativo</option>
                  <option value="paused" className="bg-[#2D0B55]">Pausado</option>
                  <option value="draft" className="bg-[#2D0B55]">Rascunho</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Performance</label>
                <select
                  value={filters.performance}
                  onChange={(e) => setFilters(prev => ({ ...prev, performance: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todas</option>
                  <option value="high" className="bg-[#2D0B55]">Alta Performance</option>
                  <option value="medium" className="bg-[#2D0B55]">Média Performance</option>
                  <option value="low" className="bg-[#2D0B55]">Baixa Performance</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {[
            { id: 'flows', name: 'Fluxos', icon: Workflow },
            { id: 'executions', name: 'Execuções', icon: Activity },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 },
            { id: 'insights', name: 'IA Insights', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
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

        {/* Flows Tab */}
        {activeTab === 'flows' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFlows.map((flow) => (
              <div
                key={flow.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      flow.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      flow.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      <Workflow className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{flow.name}</h3>
                      <p className="text-gray-400 text-sm">{flow.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(flow.status)}`}>
                      {flow.status.toUpperCase()}
                    </span>
                    
                    <div className="relative">
                      <button className="text-gray-400 hover:text-white transition-colors p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Settings Indicator */}
                {flow.aiSettings.enabled && (
                  <div className="flex items-center space-x-2 mb-4 p-2 bg-[#FF7A00]/20 rounded-lg">
                    <Brain className="w-4 h-4 text-[#FF7A00]" />
                    <span className="text-[#FF7A00] text-sm font-medium">IA Ativada</span>
                    <div className="flex space-x-1">
                      {flow.aiSettings.personalization && <Sparkles className="w-3 h-3 text-[#FF7A00]" />}
                      {flow.aiSettings.sentimentAnalysis && <Target className="w-3 h-3 text-[#FF7A00]" />}
                      {flow.aiSettings.predictiveOptimization && <TrendingUp className="w-3 h-3 text-[#FF7A00]" />}
                    </div>
                  </div>
                )}

                {/* Triggers */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Gatilhos</h4>
                  <div className="space-y-1">
                    {flow.triggers.slice(0, 2).map((trigger, index) => (
                      <div key={index} className="text-gray-300 text-sm flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#FF7A00] rounded-full"></div>
                        <span>{trigger.condition.replace('_', ' ')}: {trigger.value}</span>
                      </div>
                    ))}
                    {flow.triggers.length > 2 && (
                      <div className="text-gray-400 text-sm">+{flow.triggers.length - 2} mais</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Ações</h4>
                  <div className="flex space-x-2">
                    {flow.actions.slice(0, 3).map((action, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        {action.channel && getChannelIcon(action.channel)}
                        <span className="text-gray-300 text-xs">{action.type.replace('_', ' ')}</span>
                      </div>
                    ))}
                    {flow.actions.length > 3 && (
                      <span className="text-gray-400 text-xs">+{flow.actions.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">{flow.analytics.totalExecutions}</div>
                    <div className="text-gray-400 text-xs">Execuções</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 text-lg font-bold">{flow.analytics.conversionRate.toFixed(1)}%</div>
                    <div className="text-gray-400 text-xs">Conversão</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFlowStatus(flow.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1 ${
                      flow.status === 'active' 
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {flow.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{flow.status === 'active' ? 'Pausar' : 'Ativar'}</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedFlow(flow)}
                    className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => duplicateFlow(flow.id)}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => deleteFlow(flow.id)}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Executions Tab */}
        {activeTab === 'executions' && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Execuções Recentes</h3>
              <button
                onClick={loadFollowUpData}
                disabled={isLoading}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-4">
              {executions.map((execution) => {
                const flow = flows.find(f => f.id === execution.flowId);
                const progress = (execution.currentStep / execution.totalSteps) * 100;
                
                return (
                  <div key={execution.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{execution.contactName}</h4>
                          <p className="text-gray-400 text-sm">{flow?.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(execution.status)}`}>
                          {execution.status.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">{formatDateTime(execution.startedAt)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-sm">Progresso</span>
                        <span className="text-white text-sm">{execution.currentStep}/{execution.totalSteps}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-[#FF7A00] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-white font-semibold">{execution.metrics.messagesOpened}</div>
                        <div className="text-gray-400 text-xs">Abertas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{execution.metrics.linksClicked}</div>
                        <div className="text-gray-400 text-xs">Cliques</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{execution.metrics.responsesReceived}</div>
                        <div className="text-gray-400 text-xs">Respostas</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${execution.metrics.conversionAchieved ? 'text-green-400' : 'text-gray-400'}`}>
                          {execution.metrics.conversionAchieved ? 'Sim' : 'Não'}
                        </div>
                        <div className="text-gray-400 text-xs">Conversão</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Chart */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Performance dos Fluxos</h3>
              <div className="space-y-4">
                {flows.map((flow) => (
                  <div key={flow.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{flow.name}</span>
                      <span className="text-[#FF7A00] font-semibold">{flow.analytics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#FF7A00] to-[#FF9500] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${flow.analytics.conversionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Performance */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Performance por Canal</h3>
              <div className="space-y-4">
                {[
                  { channel: 'whatsapp', name: 'WhatsApp', rate: 34.2, total: 1247 },
                  { channel: 'email', name: 'Email', rate: 28.7, total: 856 },
                  { channel: 'sms', name: 'SMS', rate: 22.1, total: 423 },
                  { channel: 'instagram', name: 'Instagram', rate: 19.8, total: 234 }
                ].map((item) => (
                  <div key={item.channel} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(item.channel)}
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{item.rate}%</div>
                      <div className="text-gray-400 text-sm">{item.total} envios</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-[#FF7A00]" />
                  <span>Insights da IA</span>
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          insight.type === 'optimization' ? 'bg-blue-500/20 text-blue-400' :
                          insight.type === 'pattern' ? 'bg-green-500/20 text-green-400' :
                          insight.type === 'prediction' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {insight.type === 'optimization' && <TrendingUp className="w-5 h-5" />}
                          {insight.type === 'pattern' && <Target className="w-5 h-5" />}
                          {insight.type === 'prediction' && <Brain className="w-5 h-5" />}
                          {insight.type === 'recommendation' && <Sparkles className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{insight.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
                          {insight.suggestedAction && (
                            <div className="bg-[#FF7A00]/20 rounded-lg p-2">
                              <div className="text-[#FF7A00] text-xs font-semibold mb-1">AÇÃO SUGERIDA</div>
                              <p className="text-orange-200 text-sm">{insight.suggestedAction}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getImpactColor(insight.impact)}`}>
                          {insight.impact.toUpperCase()}
                        </span>
                        <div className="text-right">
                          <div className="text-white text-sm font-semibold">{insight.confidence}%</div>
                          <div className="text-gray-400 text-xs">Confiança</div>
                        </div>
                      </div>
                    </div>

                    {insight.actionable && (
                      <div className="flex space-x-2">
                        <button className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>Aplicar</span>
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300">
                          Mais Detalhes
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Flow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Novo Fluxo de Follow-up</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="text-center py-8">
                <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Construtor de Fluxos</h3>
                <p className="text-gray-400 mb-6">
                  O construtor visual de fluxos estará disponível na versão completa da plataforma.
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300">
                    Usar Template Pronto
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors duration-300">
                    Criar do Zero
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors duration-300">
                    Importar Fluxo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flow Detail Modal */}
        {selectedFlow && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedFlow.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    selectedFlow.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedFlow.name}</h3>
                    <p className="text-gray-400">{selectedFlow.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFlow(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Flow Configuration */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Gatilhos</h4>
                    <div className="space-y-2">
                      {selectedFlow.triggers.map((trigger, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-white font-medium">{trigger.type.replace('_', ' ')}</div>
                          <div className="text-gray-400 text-sm">{trigger.condition}: {trigger.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Ações</h4>
                    <div className="space-y-2">
                      {selectedFlow.actions.map((action, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center space-x-2 mb-1">
                            {action.channel && getChannelIcon(action.channel)}
                            <span className="text-white font-medium">{action.type.replace('_', ' ')}</span>
                            {action.delay && (
                              <span className="text-gray-400 text-sm">({action.delay}min)</span>
                            )}
                          </div>
                          {action.content && (
                            <div className="text-gray-300 text-sm">{action.content}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Analytics & AI Settings */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Performance</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-white text-lg font-bold">{selectedFlow.analytics.totalExecutions}</div>
                        <div className="text-gray-400 text-sm">Execuções</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-green-400 text-lg font-bold">{selectedFlow.analytics.conversionRate.toFixed(1)}%</div>
                        <div className="text-gray-400 text-sm">Conversão</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-blue-400 text-lg font-bold">{selectedFlow.analytics.successRate.toFixed(1)}%</div>
                        <div className="text-gray-400 text-sm">Sucesso</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-purple-400 text-lg font-bold">{selectedFlow.analytics.avgResponseTime.toFixed(1)}h</div>
                        <div className="text-gray-400 text-sm">Resp. Média</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Configurações de IA</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'enabled', label: 'IA Ativada', icon: Brain },
                        { key: 'personalization', label: 'Personalização', icon: User },
                        { key: 'sentimentAnalysis', label: 'Análise de Sentimento', icon: Target },
                        { key: 'predictiveOptimization', label: 'Otimização Preditiva', icon: TrendingUp },
                        { key: 'autoOptimizeTime', label: 'Otimização de Horário', icon: Clock }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <setting.icon className="w-4 h-4 text-[#FF7A00]" />
                            <span className="text-white">{setting.label}</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full ${
                            selectedFlow.aiSettings[setting.key as keyof typeof selectedFlow.aiSettings] 
                              ? 'bg-green-500' 
                              : 'bg-gray-500'
                          }`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => toggleFlowStatus(selectedFlow.id)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 ${
                    selectedFlow.status === 'active' 
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {selectedFlow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{selectedFlow.status === 'active' ? 'Pausar' : 'Ativar'}</span>
                </button>
                
                <button className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                
                <button
                  onClick={() => duplicateFlow(selectedFlow.id)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FollowUpPage;