import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Users, 
  Target, 
  BarChart3, 
  Plus, 
  Search, 
  Filter,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Calendar,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  CheckCircle,
  AlertTriangle,
  Settings,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileText,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Lightbulb,
  Shield,
  Timer,
  Percent,
  ArrowRight,
  Database,
  Layers,
  TestTube,
  Sliders
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface Campaign {
  id: string;
  name: string;
  type: 'whatsapp' | 'sms' | 'email';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';
  audience: {
    total: number;
    segments: string[];
  };
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
  };
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    replied: number;
    converted: number;
  };
  abTest?: {
    enabled: boolean;
    variants: number;
    distribution: number[];
    winner?: string;
  };
  createdAt: string;
  lastModified: string;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  filters: any[];
  count: number;
  lastUpdated: string;
}

interface ABTestVariant {
  id: string;
  name: string;
  content: string;
  percentage: number;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

const CampaignPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'segments' | 'analytics'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Campaign Creation Form State
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    type: 'whatsapp' as 'whatsapp' | 'sms' | 'email',
    agentId: '',
    flowId: '',
    instructions: '',
    delays: {
      betweenMessages: 5,
      unit: 'minutes' as 'minutes' | 'hours' | 'days'
    },
    schedule: {
      startDate: '',
      startTime: '',
      endDate: '',
      timezone: 'America/Sao_Paulo'
    },
    audience: {
      segmentIds: [] as string[],
      customFilters: [] as any[]
    },
    abTest: {
      enabled: false,
      variants: [] as ABTestVariant[],
      testDuration: 24,
      successMetric: 'conversion_rate'
    }
  });

  // Audience Segmentation State
  const [audienceFilters, setAudienceFilters] = useState<any[]>([]);
  const [audienceCount, setAudienceCount] = useState(0);
  const [showSegmentModal, setShowSegmentModal] = useState(false);

  useEffect(() => {
    loadCampaigns();
    loadSegments();
  }, []);

  const loadCampaigns = async () => {
    setIsLoading(true);
    // Mock data
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Black Friday 2024',
        type: 'whatsapp',
        status: 'running',
        audience: {
          total: 15420,
          segments: ['leads-quentes', 'clientes-vip']
        },
        schedule: {
          startDate: '2024-01-25T09:00:00Z',
          endDate: '2024-01-27T23:59:59Z',
          timezone: 'America/Sao_Paulo'
        },
        metrics: {
          sent: 12340,
          delivered: 11890,
          opened: 8920,
          clicked: 2340,
          replied: 890,
          converted: 234
        },
        abTest: {
          enabled: true,
          variants: 3,
          distribution: [40, 30, 30],
          winner: 'variant-a'
        },
        createdAt: '2024-01-20T10:00:00Z',
        lastModified: '2024-01-25T14:30:00Z'
      },
      {
        id: '2',
        name: 'Follow-up Pós-Venda',
        type: 'email',
        status: 'completed',
        audience: {
          total: 2890,
          segments: ['clientes-recentes']
        },
        schedule: {
          startDate: '2024-01-15T08:00:00Z',
          endDate: '2024-01-22T18:00:00Z',
          timezone: 'America/Sao_Paulo'
        },
        metrics: {
          sent: 2890,
          delivered: 2834,
          opened: 1920,
          clicked: 456,
          replied: 123,
          converted: 89
        },
        createdAt: '2024-01-10T15:00:00Z',
        lastModified: '2024-01-22T18:00:00Z'
      },
      {
        id: '3',
        name: 'Recuperação Carrinho',
        type: 'sms',
        status: 'scheduled',
        audience: {
          total: 5670,
          segments: ['carrinho-abandonado']
        },
        schedule: {
          startDate: '2024-02-01T10:00:00Z',
          timezone: 'America/Sao_Paulo'
        },
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          replied: 0,
          converted: 0
        },
        createdAt: '2024-01-28T11:00:00Z',
        lastModified: '2024-01-28T16:45:00Z'
      }
    ];
    setCampaigns(mockCampaigns);
    setIsLoading(false);
  };

  const loadSegments = async () => {
    const mockSegments: Segment[] = [
      {
        id: '1',
        name: 'Leads Quentes',
        description: 'Leads com alta probabilidade de conversão',
        filters: [
          { field: 'score', operator: '>=', value: 80 },
          { field: 'last_interaction', operator: '<=', value: '7 days' }
        ],
        count: 1247,
        lastUpdated: '2024-01-25T10:00:00Z'
      },
      {
        id: '2',
        name: 'Clientes VIP',
        description: 'Clientes com alto valor de vida',
        filters: [
          { field: 'total_spent', operator: '>=', value: 5000 },
          { field: 'purchase_frequency', operator: '>=', value: 5 }
        ],
        count: 456,
        lastUpdated: '2024-01-24T15:30:00Z'
      },
      {
        id: '3',
        name: 'Carrinho Abandonado',
        description: 'Usuários que abandonaram carrinho nas últimas 24h',
        filters: [
          { field: 'cart_status', operator: '=', value: 'abandoned' },
          { field: 'cart_updated', operator: '<=', value: '24 hours' }
        ],
        count: 892,
        lastUpdated: '2024-01-25T12:00:00Z'
      }
    ];
    setSegments(mockSegments);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <Edit className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'completed':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'scheduled':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'sms':
        return <Phone className="w-4 h-4 text-purple-500" />;
      default:
        return <Send className="w-4 h-4 text-gray-500" />;
    }
  };

  const calculateConversionRate = (metrics: Campaign['metrics']) => {
    if (metrics.sent === 0) return 0;
    return ((metrics.converted / metrics.sent) * 100).toFixed(2);
  };

  const calculateOpenRate = (metrics: Campaign['metrics']) => {
    if (metrics.delivered === 0) return 0;
    return ((metrics.opened / metrics.delivered) * 100).toFixed(2);
  };

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleSaveCampaign = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignForm.name,
      type: campaignForm.type,
      status: 'draft',
      audience: {
        total: audienceCount,
        segments: campaignForm.audience.segmentIds
      },
      schedule: {
        startDate: `${campaignForm.schedule.startDate}T${campaignForm.schedule.startTime}:00Z`,
        endDate: campaignForm.schedule.endDate ? `${campaignForm.schedule.endDate}T23:59:59Z` : undefined,
        timezone: campaignForm.schedule.timezone
      },
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        converted: 0
      },
      abTest: campaignForm.abTest.enabled ? {
        enabled: true,
        variants: campaignForm.abTest.variants.length,
        distribution: campaignForm.abTest.variants.map(v => v.percentage)
      } : undefined,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setShowCreateModal(false);
    setIsLoading(false);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.metrics.sent, 0);
  const totalConverted = campaigns.reduce((sum, campaign) => sum + campaign.metrics.converted, 0);
  const avgConversionRate = totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(2) : '0';

  return (
    <DashboardLayout currentPage="campaigns">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Campanhas</h1>
            <p className="text-gray-300">Gerencie campanhas de comunicação em massa</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('analytics')}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            
            <button
              onClick={handleCreateCampaign}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Campanha</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">Total</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{campaigns.length}</div>
            <div className="text-gray-300 text-sm">Campanhas Criadas</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">Média</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{avgConversionRate}%</div>
            <div className="text-gray-300 text-sm">Taxa de Conversão</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">Alcance</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalSent.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Mensagens Enviadas</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-400 text-sm font-semibold">Sucesso</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalConverted}</div>
            <div className="text-gray-300 text-sm">Conversões Total</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {[
            { id: 'campaigns', label: 'Campanhas', icon: Send },
            { id: 'segments', label: 'Segmentos', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar campanhas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todos os Status</option>
                  <option value="draft" className="bg-[#2D0B55]">Rascunho</option>
                  <option value="scheduled" className="bg-[#2D0B55]">Agendada</option>
                  <option value="running" className="bg-[#2D0B55]">Executando</option>
                  <option value="paused" className="bg-[#2D0B55]">Pausada</option>
                  <option value="completed" className="bg-[#2D0B55]">Concluída</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todos os Tipos</option>
                  <option value="whatsapp" className="bg-[#2D0B55]">WhatsApp</option>
                  <option value="email" className="bg-[#2D0B55]">Email</option>
                  <option value="sms" className="bg-[#2D0B55]">SMS</option>
                </select>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center space-y-2">
                        {getTypeIcon(campaign.type)}
                        {getStatusIcon(campaign.status)}
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">{campaign.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Público: {campaign.audience.total.toLocaleString()}</span>
                          <span>Criada: {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}</span>
                          {campaign.abTest?.enabled && (
                            <span className="text-[#FF7A00]">A/B Test</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(campaign.status)}`}>
                        {campaign.status.toUpperCase()}
                      </div>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-white text-lg font-bold">{campaign.metrics.sent.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Enviadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 text-lg font-bold">{campaign.metrics.delivered.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Entregues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 text-lg font-bold">{campaign.metrics.opened.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Abertas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 text-lg font-bold">{campaign.metrics.clicked.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Cliques</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 text-lg font-bold">{campaign.metrics.replied.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Respostas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#FF7A00] text-lg font-bold">{campaign.metrics.converted.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Conversões</div>
                    </div>
                  </div>

                  {/* Performance Bars */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Taxa de Abertura</span>
                      <span className="text-white">{calculateOpenRate(campaign.metrics)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${calculateOpenRate(campaign.metrics)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Taxa de Conversão</span>
                      <span className="text-white">{calculateConversionRate(campaign.metrics)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-[#FF7A00] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${calculateConversionRate(campaign.metrics)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-2">
                      {campaign.status === 'running' && (
                        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300 flex items-center space-x-1">
                          <Pause className="w-3 h-3" />
                          <span>Pausar</span>
                        </button>
                      )}
                      {campaign.status === 'paused' && (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300 flex items-center space-x-1">
                          <Play className="w-3 h-3" />
                          <span>Retomar</span>
                        </button>
                      )}
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300 flex items-center space-x-1">
                        <Copy className="w-3 h-3" />
                        <span>Duplicar</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300">
                        <Download className="w-3 h-3" />
                      </button>
                      <button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1 rounded-lg text-sm transition-colors duration-300">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Segments Tab */}
        {activeTab === 'segments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Segmentos de Audiência</h3>
              <button
                onClick={() => setShowSegmentModal(true)}
                className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Segmento</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">{segment.name}</h4>
                      <p className="text-gray-300 text-sm mb-3">{segment.description}</p>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-[#FF7A00] mb-1">{segment.count.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Contatos no segmento</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-gray-300 text-sm font-semibold">Filtros aplicados:</div>
                    {segment.filters.slice(0, 2).map((filter, index) => (
                      <div key={index} className="text-xs text-gray-400 bg-white/5 rounded px-2 py-1">
                        {filter.field} {filter.operator} {filter.value}
                      </div>
                    ))}
                    {segment.filters.length > 2 && (
                      <div className="text-xs text-gray-400">+{segment.filters.length - 2} mais filtros</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Atualizado: {new Date(segment.lastUpdated).toLocaleDateString('pt-BR')}</span>
                    <button className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Analytics e Insights</h3>
            
            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-semibold">Performance por Canal</h4>
                  <PieChart className="w-6 h-6 text-[#FF7A00]" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { channel: 'WhatsApp', sent: 12340, converted: 234, color: 'bg-green-500' },
                    { channel: 'Email', sent: 2890, converted: 89, color: 'bg-blue-500' },
                    { channel: 'SMS', sent: 0, converted: 0, color: 'bg-purple-500' }
                  ].map((item, index) => {
                    const conversionRate = item.sent > 0 ? ((item.converted / item.sent) * 100).toFixed(2) : '0';
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                          <span className="text-white">{item.channel}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{conversionRate}%</div>
                          <div className="text-gray-400 text-sm">{item.converted} conversões</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-semibold">Insights Automatizados</h4>
                  <Lightbulb className="w-6 h-6 text-[#FF7A00]" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <div className="text-green-300 font-semibold text-sm">Oportunidade</div>
                        <div className="text-green-200 text-sm">Campanhas de WhatsApp têm 3x mais conversão que email. Considere migrar campanhas de baixa performance.</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <div className="text-yellow-300 font-semibold text-sm">Timing</div>
                        <div className="text-yellow-200 text-sm">Melhor horário para envios: 14h-16h (terças e quintas). Taxa de abertura 45% maior.</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-blue-300 font-semibold text-sm">Segmentação</div>
                        <div className="text-blue-200 text-sm">Segmento "Leads Quentes" tem ROI 280% maior. Priorize este público em futuras campanhas.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h4 className="text-white font-semibold mb-4">Recomendações de Otimização</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TestTube className="w-4 h-4 text-[#FF7A00]" />
                    <span className="text-white font-semibold text-sm">A/B Testing</span>
                  </div>
                  <p className="text-gray-300 text-sm">Teste diferentes horários de envio para aumentar taxa de abertura em até 35%.</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-[#FF7A00]" />
                    <span className="text-white font-semibold text-sm">Segmentação</span>
                  </div>
                  <p className="text-gray-300 text-sm">Crie segmentos baseados em comportamento para personalizar mensagens.</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Timer className="w-4 h-4 text-[#FF7A00]" />
                    <span className="text-white font-semibold text-sm">Frequência</span>
                  </div>
                  <p className="text-gray-300 text-sm">Evite mais de 3 mensagens por semana para reduzir descadastros.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Campaign Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Nova Campanha</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Informações Básicas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Nome da Campanha</label>
                      <input
                        type="text"
                        value={campaignForm.name}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        placeholder="Ex: Black Friday 2024"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Tipo de Canal</label>
                      <select
                        value={campaignForm.type}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="whatsapp" className="bg-[#2D0B55]">WhatsApp</option>
                        <option value="email" className="bg-[#2D0B55]">Email</option>
                        <option value="sms" className="bg-[#2D0B55]">SMS</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-white font-semibold mb-2">Descrição</label>
                    <textarea
                      value={campaignForm.description}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Descreva o objetivo da campanha..."
                    />
                  </div>
                </div>

                {/* Agent/Flow Selection */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Agente e Fluxo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Agente IA</label>
                      <select
                        value={campaignForm.agentId}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, agentId: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="" className="bg-[#2D0B55]">Selecione um agente</option>
                        <option value="agent-1" className="bg-[#2D0B55]">Vendas Principal</option>
                        <option value="agent-2" className="bg-[#2D0B55]">Suporte Técnico</option>
                        <option value="agent-3" className="bg-[#2D0B55]">Marketing Bot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Fluxo Automatizado</label>
                      <select
                        value={campaignForm.flowId}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, flowId: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="" className="bg-[#2D0B55]">Selecione um fluxo</option>
                        <option value="flow-1" className="bg-[#2D0B55]">Promoção Black Friday</option>
                        <option value="flow-2" className="bg-[#2D0B55]">Follow-up Pós-Venda</option>
                        <option value="flow-3" className="bg-[#2D0B55]">Recuperação Carrinho</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-white font-semibold mb-2">Instruções Específicas</label>
                    <textarea
                      value={campaignForm.instructions}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, instructions: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Instruções específicas para esta campanha..."
                    />
                  </div>
                </div>

                {/* Timing Configuration */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Configuração de Timing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Delay entre Mensagens</label>
                      <input
                        type="number"
                        value={campaignForm.delays.betweenMessages}
                        onChange={(e) => setCampaignForm(prev => ({ 
                          ...prev, 
                          delays: { ...prev.delays, betweenMessages: parseInt(e.target.value) }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Unidade</label>
                      <select
                        value={campaignForm.delays.unit}
                        onChange={(e) => setCampaignForm(prev => ({ 
                          ...prev, 
                          delays: { ...prev.delays, unit: e.target.value as any }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="minutes" className="bg-[#2D0B55]">Minutos</option>
                        <option value="hours" className="bg-[#2D0B55]">Horas</option>
                        <option value="days" className="bg-[#2D0B55]">Dias</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Fuso Horário</label>
                      <select
                        value={campaignForm.schedule.timezone}
                        onChange={(e) => setCampaignForm(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule, timezone: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="America/Sao_Paulo" className="bg-[#2D0B55]">São Paulo (GMT-3)</option>
                        <option value="America/New_York" className="bg-[#2D0B55]">Nova York (GMT-5)</option>
                        <option value="Europe/London" className="bg-[#2D0B55]">Londres (GMT+0)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Agendamento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Data de Início</label>
                      <input
                        type="date"
                        value={campaignForm.schedule.startDate}
                        onChange={(e) => setCampaignForm(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule, startDate: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Horário de Início</label>
                      <input
                        type="time"
                        value={campaignForm.schedule.startTime}
                        onChange={(e) => setCampaignForm(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule, startTime: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Audience Selection */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Seleção de Audiência</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Segmentos Salvos</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {segments.map((segment) => (
                          <label key={segment.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={campaignForm.audience.segmentIds.includes(segment.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCampaignForm(prev => ({
                                    ...prev,
                                    audience: {
                                      ...prev.audience,
                                      segmentIds: [...prev.audience.segmentIds, segment.id]
                                    }
                                  }));
                                } else {
                                  setCampaignForm(prev => ({
                                    ...prev,
                                    audience: {
                                      ...prev.audience,
                                      segmentIds: prev.audience.segmentIds.filter(id => id !== segment.id)
                                    }
                                  }));
                                }
                              }}
                              className="w-4 h-4 text-[#FF7A00] bg-white/10 border-white/20 rounded focus:ring-[#FF7A00] focus:ring-2"
                            />
                            <div>
                              <span className="text-white text-sm">{segment.name}</span>
                              <div className="text-gray-400 text-xs">{segment.count.toLocaleString()} contatos</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-[#FF7A00] font-semibold mb-2">Público Total Estimado</div>
                      <div className="text-2xl font-bold text-white">
                        {campaignForm.audience.segmentIds.reduce((total, segmentId) => {
                          const segment = segments.find(s => s.id === segmentId);
                          return total + (segment?.count || 0);
                        }, 0).toLocaleString()} contatos
                      </div>
                    </div>
                  </div>
                </div>

                {/* A/B Testing */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold">Teste A/B</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={campaignForm.abTest.enabled}
                        onChange={(e) => setCampaignForm(prev => ({
                          ...prev,
                          abTest: { ...prev.abTest, enabled: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                    </label>
                  </div>

                  {campaignForm.abTest.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">Duração do Teste (horas)</label>
                          <input
                            type="number"
                            value={campaignForm.abTest.testDuration}
                            onChange={(e) => setCampaignForm(prev => ({
                              ...prev,
                              abTest: { ...prev.abTest, testDuration: parseInt(e.target.value) }
                            }))}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-semibold mb-2">Métrica de Sucesso</label>
                          <select
                            value={campaignForm.abTest.successMetric}
                            onChange={(e) => setCampaignForm(prev => ({
                              ...prev,
                              abTest: { ...prev.abTest, successMetric: e.target.value }
                            }))}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          >
                            <option value="conversion_rate" className="bg-[#2D0B55]">Taxa de Conversão</option>
                            <option value="open_rate" className="bg-[#2D0B55]">Taxa de Abertura</option>
                            <option value="click_rate" className="bg-[#2D0B55]">Taxa de Clique</option>
                            <option value="reply_rate" className="bg-[#2D0B55]">Taxa de Resposta</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                        <div className="text-blue-300 font-semibold mb-2">Configuração do Teste A/B</div>
                        <div className="text-blue-200 text-sm">
                          O teste será executado por {campaignForm.abTest.testDuration} horas com uma amostra de 20% do público. 
                          A variante vencedora será automaticamente enviada para os 80% restantes.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveCampaign}
                    disabled={!campaignForm.name || !campaignForm.type || isLoading}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Criar Campanha'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CampaignPage;