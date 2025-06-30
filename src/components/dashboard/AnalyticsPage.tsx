import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Download, 
  Filter,
  MessageSquare,
  Users,
  DollarSign,
  Clock,
  Target,
  Zap,
  Eye,
  RefreshCw,
  Settings,
  Share2,
  FileText,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Mail,
  Instagram,
  Phone,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Timer,
  UserCheck,
  ShoppingCart,
  CreditCard,
  Repeat,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
  Plus,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Database,
  Layers,
  MoreVertical
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface MetricData {
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage' | 'time';
}

interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

interface FilterOptions {
  dateRange: string;
  channels: string[];
  campaigns: string[];
  sources: string[];
  teams: string[];
  customDateStart?: string;
  customDateEnd?: string;
}

interface AnalyticsData {
  overview: {
    totalConversations: MetricData;
    totalMessages: MetricData;
    responseTime: MetricData;
    satisfactionRate: MetricData;
    conversionRate: MetricData;
    revenue: MetricData;
    activeUsers: MetricData;
    retentionRate: MetricData;
  };
  performance: {
    conversationsByChannel: ChartDataPoint[];
    messagesByHour: ChartDataPoint[];
    conversionFunnel: ChartDataPoint[];
    responseTimeByChannel: ChartDataPoint[];
    satisfactionByTeam: ChartDataPoint[];
    revenueBySource: ChartDataPoint[];
  };
  insights: {
    topPerformers: Array<{
      name: string;
      metric: string;
      value: number;
      change: number;
      avatar?: string;
    }>;
    bottlenecks: Array<{
      issue: string;
      impact: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      suggestion: string;
    }>;
    opportunities: Array<{
      title: string;
      description: string;
      potential: string;
      effort: 'low' | 'medium' | 'high';
    }>;
  };
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: '30d',
    channels: [],
    campaigns: [],
    sources: [],
    teams: []
  });
  const [selectedMetric, setSelectedMetric] = useState('conversations');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(300); // 5 minutes

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadAnalyticsData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, filters]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulate API call with realistic data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData: AnalyticsData = {
      overview: {
        totalConversations: {
          current: 2847,
          previous: 2234,
          change: 27.4,
          trend: 'up',
          target: 3000,
          format: 'number'
        },
        totalMessages: {
          current: 15420,
          previous: 12890,
          change: 19.6,
          trend: 'up',
          format: 'number'
        },
        responseTime: {
          current: 1.8,
          previous: 2.3,
          change: -21.7,
          trend: 'up',
          target: 2.0,
          unit: 's',
          format: 'time'
        },
        satisfactionRate: {
          current: 94.5,
          previous: 91.2,
          change: 3.6,
          trend: 'up',
          target: 95.0,
          unit: '%',
          format: 'percentage'
        },
        conversionRate: {
          current: 23.8,
          previous: 19.4,
          change: 22.7,
          trend: 'up',
          target: 25.0,
          unit: '%',
          format: 'percentage'
        },
        revenue: {
          current: 127500,
          previous: 98200,
          change: 29.9,
          trend: 'up',
          target: 150000,
          format: 'currency'
        },
        activeUsers: {
          current: 1247,
          previous: 1089,
          change: 14.5,
          trend: 'up',
          format: 'number'
        },
        retentionRate: {
          current: 87.3,
          previous: 84.1,
          change: 3.8,
          trend: 'up',
          target: 90.0,
          unit: '%',
          format: 'percentage'
        }
      },
      performance: {
        conversationsByChannel: [
          { date: '2024-01-01', value: 1247, label: 'WhatsApp', category: 'whatsapp' },
          { date: '2024-01-01', value: 832, label: 'Instagram', category: 'instagram' },
          { date: '2024-01-01', value: 416, label: 'Email', category: 'email' },
          { date: '2024-01-01', value: 277, label: 'SMS', category: 'sms' },
          { date: '2024-01-01', value: 75, label: 'Telegram', category: 'telegram' }
        ],
        messagesByHour: Array.from({ length: 24 }, (_, i) => ({
          date: `${i.toString().padStart(2, '0')}:00`,
          value: Math.floor(Math.random() * 300) + 50,
          label: `${i}h`
        })),
        conversionFunnel: [
          { date: '2024-01-01', value: 100, label: 'Visitantes', category: 'visitors' },
          { date: '2024-01-01', value: 45, label: 'Leads', category: 'leads' },
          { date: '2024-01-01', value: 28, label: 'Qualificados', category: 'qualified' },
          { date: '2024-01-01', value: 12, label: 'Propostas', category: 'proposals' },
          { date: '2024-01-01', value: 8, label: 'Fechamentos', category: 'closed' }
        ],
        responseTimeByChannel: [
          { date: '2024-01-01', value: 1.2, label: 'WhatsApp', category: 'whatsapp' },
          { date: '2024-01-01', value: 2.1, label: 'Instagram', category: 'instagram' },
          { date: '2024-01-01', value: 4.5, label: 'Email', category: 'email' },
          { date: '2024-01-01', value: 1.8, label: 'SMS', category: 'sms' },
          { date: '2024-01-01', value: 1.5, label: 'Telegram', category: 'telegram' }
        ],
        satisfactionByTeam: [
          { date: '2024-01-01', value: 96.2, label: 'Vendas', category: 'sales' },
          { date: '2024-01-01', value: 94.8, label: 'Suporte', category: 'support' },
          { date: '2024-01-01', value: 92.1, label: 'Marketing', category: 'marketing' },
          { date: '2024-01-01', value: 95.5, label: 'IA Bot', category: 'ai' }
        ],
        revenueBySource: [
          { date: '2024-01-01', value: 45200, label: 'Website', category: 'website' },
          { date: '2024-01-01', value: 32100, label: 'Instagram', category: 'instagram' },
          { date: '2024-01-01', value: 28900, label: 'Indicação', category: 'referral' },
          { date: '2024-01-01', value: 21300, label: 'Google Ads', category: 'google' }
        ]
      },
      insights: {
        topPerformers: [
          {
            name: 'Maria Santos',
            metric: 'Conversões',
            value: 47,
            change: 23.5,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
          },
          {
            name: 'João Silva',
            metric: 'Satisfação',
            value: 98.2,
            change: 5.1,
            avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
          },
          {
            name: 'IA Assistant',
            metric: 'Tempo Resposta',
            value: 0.8,
            change: -15.2,
            avatar: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
          }
        ],
        bottlenecks: [
          {
            issue: 'Tempo de resposta alto no email',
            impact: 'Redução de 12% na satisfação',
            severity: 'high',
            suggestion: 'Implementar auto-resposta inteligente'
          },
          {
            issue: 'Baixa conversão no Instagram',
            impact: 'Perda de R$ 15k/mês',
            severity: 'medium',
            suggestion: 'Otimizar funil de qualificação'
          },
          {
            issue: 'Sobrecarga da equipe de vendas',
            impact: 'Aumento de 8% no tempo de resposta',
            severity: 'medium',
            suggestion: 'Expandir automação para leads frios'
          }
        ],
        opportunities: [
          {
            title: 'Automação de Follow-up',
            description: 'Implementar sequência automática para leads não respondidos',
            potential: '+R$ 25k/mês',
            effort: 'low'
          },
          {
            title: 'Integração com CRM',
            description: 'Conectar dados de conversas com pipeline de vendas',
            potential: '+15% conversão',
            effort: 'medium'
          },
          {
            title: 'Análise de Sentimento',
            description: 'IA para detectar satisfação em tempo real',
            potential: '+8% satisfação',
            effort: 'high'
          }
        ]
      }
    };

    setAnalyticsData(mockData);
    setIsLoading(false);
  };

  const formatValue = (value: number, format?: string, unit?: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}${unit || '%'}`;
      case 'time':
        return `${value.toFixed(1)}${unit || 's'}`;
      default:
        return value.toLocaleString('pt-BR') + (unit || '');
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    if (change < 0) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'text-red-400 bg-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const exportData = async (format: 'csv' | 'json' | 'pdf') => {
    setIsLoading(true);
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `analytics-${timestamp}.${format}`;
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Generate CSV data
      let csvContent = 'Métrica,Valor Atual,Valor Anterior,Mudança (%)\n';
      if (analyticsData) {
        Object.entries(analyticsData.overview).forEach(([key, data]) => {
          csvContent += `${key},${data.current},${data.previous},${data.change}\n`;
        });
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    setIsLoading(false);
    setShowExportModal(false);
  };

  const availableChannels = ['whatsapp', 'instagram', 'email', 'sms', 'telegram'];
  const availableCampaigns = ['Black Friday', 'Natal', 'Verão 2024', 'Lançamento'];
  const availableSources = ['Website', 'Instagram', 'Google Ads', 'Indicação', 'Email'];
  const availableTeams = ['Vendas', 'Suporte', 'Marketing', 'IA Bot'];

  if (!analyticsData) {
    return (
      <DashboardLayout currentPage="analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF7A00]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="analytics">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Avançado</h1>
            <p className="text-gray-300">Análise completa de performance e insights estratégicos</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Auto Refresh Toggle */}
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
              </label>
              <span className="text-white text-sm">Auto-refresh</span>
            </div>

            {/* View Mode Selector */}
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
            >
              <option value="overview" className="bg-[#2D0B55]">Visão Geral</option>
              <option value="detailed" className="bg-[#2D0B55]">Detalhado</option>
              <option value="comparison" className="bg-[#2D0B55]">Comparação</option>
            </select>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {/* Refresh Button */}
            <button
              onClick={loadAnalyticsData}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
            
            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date Range */}
              <div>
                <label className="block text-white font-semibold mb-2">Período</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="7d" className="bg-[#2D0B55]">Últimos 7 dias</option>
                  <option value="30d" className="bg-[#2D0B55]">Últimos 30 dias</option>
                  <option value="90d" className="bg-[#2D0B55]">Últimos 90 dias</option>
                  <option value="1y" className="bg-[#2D0B55]">Último ano</option>
                  <option value="custom" className="bg-[#2D0B55]">Personalizado</option>
                </select>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-white font-semibold mb-2">Canais</label>
                <div className="relative">
                  <select
                    multiple
                    value={filters.channels}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      channels: Array.from(e.target.selectedOptions, option => option.value)
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  >
                    {availableChannels.map(channel => (
                      <option key={channel} value={channel} className="bg-[#2D0B55]">
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sources */}
              <div>
                <label className="block text-white font-semibold mb-2">Fontes</label>
                <select
                  multiple
                  value={filters.sources}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sources: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  {availableSources.map(source => (
                    <option key={source} value={source} className="bg-[#2D0B55]">{source}</option>
                  ))}
                </select>
              </div>

              {/* Teams */}
              <div>
                <label className="block text-white font-semibold mb-2">Equipes</label>
                <select
                  multiple
                  value={filters.teams}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    teams: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  {availableTeams.map(team => (
                    <option key={team} value={team} className="bg-[#2D0B55]">{team}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Date Range */}
            {filters.dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Data Inicial</label>
                  <input
                    type="date"
                    value={filters.customDateStart || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, customDateStart: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Data Final</label>
                  <input
                    type="date"
                    value={filters.customDateEnd || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, customDateEnd: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>
            )}

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-gray-400 text-sm">
                {filters.channels.length + filters.sources.length + filters.teams.length} filtros aplicados
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({
                    dateRange: '30d',
                    channels: [],
                    campaigns: [],
                    sources: [],
                    teams: []
                  })}
                  className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(analyticsData.overview).map(([key, data]) => {
            const icons = {
              totalConversations: MessageSquare,
              totalMessages: MessageSquare,
              responseTime: Clock,
              satisfactionRate: Target,
              conversionRate: TrendingUp,
              revenue: DollarSign,
              activeUsers: Users,
              retentionRate: Repeat
            };
            
            const Icon = icons[key as keyof typeof icons] || BarChart3;
            const progress = data.target ? (data.current / data.target) * 100 : null;
            
            return (
              <div
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedMetric === key ? 'border-[#FF7A00]' : 'border-white/20 hover:border-[#FF7A00]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 ${getChangeColor(data.change)}`}>
                    {getChangeIcon(data.change)}
                    <span className="text-sm font-semibold">
                      {Math.abs(data.change).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-white mb-1">
                  {formatValue(data.current, data.format, data.unit)}
                </div>
                
                <div className="text-gray-300 text-sm mb-3 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>

                {/* Progress Bar for Target Metrics */}
                {progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Meta: {formatValue(data.target!, data.format, data.unit)}</span>
                      <span className="text-white">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#FF7A00] to-[#FF9500] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Comparison with Previous Period */}
                <div className="mt-3 text-xs text-gray-400">
                  vs. período anterior: {formatValue(data.previous, data.format, data.unit)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversations by Channel */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Conversas por Canal</h3>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                <PieChart className="w-6 h-6 text-[#FF7A00]" />
              </div>
            </div>
            
            <div className="space-y-4">
              {analyticsData.performance.conversationsByChannel.map((item, index) => {
                const total = analyticsData.performance.conversationsByChannel.reduce((sum, i) => sum + i.value, 0);
                const percentage = (item.value / total) * 100;
                const colors = ['bg-green-500', 'bg-pink-500', 'bg-blue-500', 'bg-purple-500', 'bg-cyan-500'];
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${colors[index]} rounded-full`}></div>
                      <span className="text-white font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-white font-semibold">{item.value.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{percentage.toFixed(1)}%</div>
                      </div>
                      <div className="w-20 bg-white/10 rounded-full h-2">
                        <div
                          className={`${colors[index]} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Messages by Hour */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Mensagens por Horário</h3>
              <Activity className="w-6 h-6 text-[#FF7A00]" />
            </div>
            
            <div className="h-48 flex items-end justify-between space-x-1">
              {analyticsData.performance.messagesByHour.map((item, index) => {
                const maxValue = Math.max(...analyticsData.performance.messagesByHour.map(i => i.value));
                const height = (item.value / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-[#FF7A00] to-[#FF9500] rounded-t transition-all duration-500 hover:opacity-80"
                      style={{ height: `${height}%` }}
                      title={`${item.date}: ${item.value} mensagens`}
                    ></div>
                    <span className="text-gray-400 text-xs mt-2 transform -rotate-45 origin-center">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Funil de Conversão</h3>
              <Target className="w-6 h-6 text-[#FF7A00]" />
            </div>
            
            <div className="space-y-4">
              {analyticsData.performance.conversionFunnel.map((item, index) => {
                const maxValue = analyticsData.performance.conversionFunnel[0].value;
                const percentage = (item.value / maxValue) * 100;
                const conversionRate = index > 0 ? 
                  (item.value / analyticsData.performance.conversionFunnel[index - 1].value) * 100 : 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{item.label}</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">{item.value}%</div>
                        {index > 0 && (
                          <div className="text-gray-400 text-sm">{conversionRate.toFixed(1)}% conv.</div>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#FF7A00] to-[#FF9500] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Response Time by Channel */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Tempo de Resposta</h3>
              <Timer className="w-6 h-6 text-[#FF7A00]" />
            </div>
            
            <div className="space-y-4">
              {analyticsData.performance.responseTimeByChannel.map((item, index) => {
                const maxValue = Math.max(...analyticsData.performance.responseTimeByChannel.map(i => i.value));
                const percentage = (item.value / maxValue) * 100;
                const isGood = item.value <= 2.0;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isGood ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-white font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-white font-semibold">{item.value.toFixed(1)}s</div>
                      <div className="w-20 bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isGood ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performers */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Top Performers</h3>
              <UserCheck className="w-6 h-6 text-[#FF7A00]" />
            </div>
            
            <div className="space-y-4">
              {analyticsData.insights.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={performer.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                      alt={performer.name}
                      className="w-10 h-10 rounded-full border-2 border-[#FF7A00]"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF7A00] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{performer.name}</div>
                    <div className="text-gray-400 text-sm">{performer.metric}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{performer.value}</div>
                    <div className={`text-sm ${getChangeColor(performer.change)}`}>
                      {performer.change > 0 ? '+' : ''}{performer.change.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottlenecks */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Gargalos</h3>
              <AlertTriangle className="w-6 h-6 text-[#FF7A00]" />
            </div>
            
            <div className="space-y-4">
              {analyticsData.insights.bottlenecks.map((bottleneck, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium text-sm">{bottleneck.issue}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(bottleneck.severity)}`}>
                      {bottleneck.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{bottleneck.impact}</p>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-[#FF7A00] text-xs font-semibold mb-1">SUGESTÃO</div>
                    <p className="text-gray-300 text-sm">{bottleneck.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Oportunidades</h3>
              <TrendingUp className="w-6 h-6 text-[#FF7A00]" />
            </div>
            
            <div className="space-y-4">
              {analyticsData.insights.opportunities.map((opportunity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium text-sm">{opportunity.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEffortColor(opportunity.effort)}`}>
                      {opportunity.effort.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{opportunity.description}</p>
                  <div className="bg-green-500/20 rounded-lg p-3">
                    <div className="text-green-400 text-xs font-semibold mb-1">POTENCIAL</div>
                    <p className="text-green-300 text-sm font-semibold">{opportunity.potential}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Exportar Dados</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Formato</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => exportData('csv')}
                      disabled={isLoading}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 flex flex-col items-center space-y-1"
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">CSV</span>
                    </button>
                    <button
                      onClick={() => exportData('json')}
                      disabled={isLoading}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 flex flex-col items-center space-y-1"
                    >
                      <Database className="w-5 h-5" />
                      <span className="text-sm">JSON</span>
                    </button>
                    <button
                      onClick={() => exportData('pdf')}
                      disabled={isLoading}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 flex flex-col items-center space-y-1"
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">PDF</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Incluir</label>
                  <div className="space-y-2">
                    {[
                      { id: 'overview', label: 'Métricas Gerais' },
                      { id: 'performance', label: 'Dados de Performance' },
                      { id: 'insights', label: 'Insights e Análises' },
                      { id: 'charts', label: 'Dados dos Gráficos' }
                    ].map((option) => (
                      <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCharts.includes(option.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCharts(prev => [...prev, option.id]);
                            } else {
                              setSelectedCharts(prev => prev.filter(id => id !== option.id));
                            }
                          }}
                          className="w-4 h-4 text-[#FF7A00] bg-white/10 border-white/20 rounded focus:ring-[#FF7A00] focus:ring-2"
                        />
                        <span className="text-white text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <RefreshCw className="w-6 h-6 text-[#FF7A00] animate-spin" />
                    <span className="text-white ml-2">Processando exportação...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;