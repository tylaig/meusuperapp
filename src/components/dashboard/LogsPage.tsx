import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Smartphone,
  User,
  MessageSquare,
  Bot,
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Database,
  Shield,
  Activity,
  Mail,
  Phone,
  Instagram,
  Send as TelegramIcon,
  Settings,
  UserCheck,
  UserX,
  CreditCard,
  Bell,
  Archive,
  Trash2,
  Copy,
  MoreVertical
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  category: 'ai' | 'sales' | 'system' | 'integration' | 'user' | 'security' | 'billing' | 'automation';
  event: string;
  description: string;
  source: {
    type: 'ai_agent' | 'user' | 'system' | 'integration' | 'webhook' | 'scheduler';
    id?: string;
    name?: string;
  };
  target?: {
    type: 'customer' | 'lead' | 'conversation' | 'campaign' | 'integration';
    id?: string;
    name?: string;
  };
  metadata: {
    channel?: 'whatsapp' | 'instagram' | 'email' | 'sms' | 'telegram';
    conversationId?: string;
    customerId?: string;
    campaignId?: string;
    integrationId?: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    duration?: number;
    responseTime?: number;
    tokensUsed?: number;
    revenue?: number;
    conversionValue?: number;
    errorCode?: string;
    stackTrace?: string;
    requestId?: string;
    sessionId?: string;
  };
  tags: string[];
}

interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  byCategory: Record<string, number>;
  aiInteractions: number;
  salesConversions: number;
  systemErrors: number;
  avgResponseTime: number;
  tokensConsumed: number;
  revenueGenerated: number;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats>({
    total: 0,
    byLevel: {},
    byCategory: {},
    aiInteractions: 0,
    salesConversions: 0,
    systemErrors: 0,
    avgResponseTime: 0,
    tokensConsumed: 0,
    revenueGenerated: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    filterLogs();
    calculateStats();
  }, [logs, searchTerm, levelFilter, categoryFilter, channelFilter, dateFilter, sourceFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    
    // Simulate API call with realistic AI sales data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        level: 'success',
        category: 'sales',
        event: 'lead_converted',
        description: 'IA converteu lead em venda - Plano Pro',
        source: { type: 'ai_agent', id: 'ai-001', name: 'Vendas IA' },
        target: { type: 'customer', id: 'cust-123', name: 'Maria Silva' },
        metadata: {
          channel: 'whatsapp',
          conversationId: 'conv-456',
          customerId: 'cust-123',
          revenue: 497,
          conversionValue: 497,
          tokensUsed: 1250,
          responseTime: 1.2,
          sessionId: 'sess-789'
        },
        tags: ['conversion', 'ai-success', 'high-value']
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        level: 'info',
        category: 'ai',
        event: 'conversation_started',
        description: 'Nova conversa iniciada via Instagram',
        source: { type: 'integration', id: 'ig-webhook', name: 'Instagram Integration' },
        target: { type: 'conversation', id: 'conv-789', name: 'João Santos' },
        metadata: {
          channel: 'instagram',
          conversationId: 'conv-789',
          customerId: 'cust-456',
          tokensUsed: 45,
          responseTime: 0.8
        },
        tags: ['new-lead', 'instagram', 'ai-response']
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        level: 'warning',
        category: 'integration',
        event: 'rate_limit_approaching',
        description: 'WhatsApp API próximo do limite de rate (85%)',
        source: { type: 'system', name: 'Rate Limiter' },
        metadata: {
          channel: 'whatsapp',
          integrationId: 'wa-api-001',
          requestId: 'req-123456'
        },
        tags: ['rate-limit', 'whatsapp', 'warning']
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        level: 'error',
        category: 'system',
        event: 'ai_model_timeout',
        description: 'Timeout na resposta do modelo de IA',
        source: { type: 'ai_agent', id: 'ai-001', name: 'Vendas IA' },
        metadata: {
          channel: 'email',
          conversationId: 'conv-321',
          duration: 30000,
          errorCode: 'TIMEOUT_ERROR',
          stackTrace: 'Error: Request timeout after 30s...',
          requestId: 'req-789012'
        },
        tags: ['ai-error', 'timeout', 'email']
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        level: 'success',
        category: 'automation',
        event: 'follow_up_sent',
        description: 'Follow-up automático enviado para lead inativo',
        source: { type: 'scheduler', name: 'Follow-up Automation' },
        target: { type: 'lead', id: 'lead-654', name: 'Ana Costa' },
        metadata: {
          channel: 'email',
          customerId: 'cust-654',
          campaignId: 'camp-001',
          tokensUsed: 180
        },
        tags: ['automation', 'follow-up', 'email']
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        level: 'info',
        category: 'user',
        event: 'user_login',
        description: 'Usuário fez login no dashboard',
        source: { type: 'user', id: 'user-001', name: 'João Silva' },
        metadata: {
          userId: 'user-001',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          sessionId: 'sess-abc123'
        },
        tags: ['login', 'user-activity']
      },
      {
        id: '7',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        level: 'success',
        category: 'ai',
        event: 'objection_handled',
        description: 'IA respondeu objeção sobre preço com sucesso',
        source: { type: 'ai_agent', id: 'ai-001', name: 'Vendas IA' },
        target: { type: 'conversation', id: 'conv-999', name: 'Pedro Oliveira' },
        metadata: {
          channel: 'whatsapp',
          conversationId: 'conv-999',
          customerId: 'cust-999',
          tokensUsed: 320,
          responseTime: 1.5
        },
        tags: ['objection-handling', 'ai-success', 'sales-process']
      },
      {
        id: '8',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        level: 'warning',
        category: 'billing',
        event: 'token_usage_high',
        description: 'Uso de tokens atingiu 80% do limite mensal',
        source: { type: 'system', name: 'Billing Monitor' },
        metadata: {
          tokensUsed: 80000,
          requestId: 'req-billing-001'
        },
        tags: ['billing', 'tokens', 'usage-warning']
      },
      {
        id: '9',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        level: 'success',
        category: 'integration',
        event: 'webhook_received',
        description: 'Webhook do Instagram processado com sucesso',
        source: { type: 'webhook', name: 'Instagram Webhook' },
        metadata: {
          channel: 'instagram',
          integrationId: 'ig-webhook-001',
          responseTime: 0.3,
          requestId: 'req-webhook-123'
        },
        tags: ['webhook', 'instagram', 'integration']
      },
      {
        id: '10',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        level: 'error',
        category: 'security',
        event: 'suspicious_login_attempt',
        description: 'Tentativa de login suspeita bloqueada',
        source: { type: 'system', name: 'Security Monitor' },
        metadata: {
          ipAddress: '192.168.1.999',
          userAgent: 'Suspicious Bot/1.0',
          errorCode: 'BLOCKED_IP',
          userId: 'unknown'
        },
        tags: ['security', 'blocked', 'suspicious']
      }
    ];

    setLogs(mockLogs);
    setIsLoading(false);
  };

  const filterLogs = () => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    // Channel filter
    if (channelFilter !== 'all') {
      filtered = filtered.filter(log => log.metadata.channel === channelFilter);
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source.type === sourceFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(log => new Date(log.timestamp) >= today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => new Date(log.timestamp) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => new Date(log.timestamp) >= monthAgo);
    }

    setFilteredLogs(filtered);
  };

  const calculateStats = () => {
    const byLevel: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let aiInteractions = 0;
    let salesConversions = 0;
    let systemErrors = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;
    let tokensConsumed = 0;
    let revenueGenerated = 0;

    filteredLogs.forEach(log => {
      // Count by level
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;
      
      // Count by category
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;

      // AI interactions
      if (log.category === 'ai' || log.source.type === 'ai_agent') {
        aiInteractions++;
      }

      // Sales conversions
      if (log.event === 'lead_converted' || log.event === 'sale_completed') {
        salesConversions++;
      }

      // System errors
      if (log.level === 'error') {
        systemErrors++;
      }

      // Response time
      if (log.metadata.responseTime) {
        totalResponseTime += log.metadata.responseTime;
        responseTimeCount++;
      }

      // Tokens consumed
      if (log.metadata.tokensUsed) {
        tokensConsumed += log.metadata.tokensUsed;
      }

      // Revenue generated
      if (log.metadata.revenue) {
        revenueGenerated += log.metadata.revenue;
      }
    });

    setStats({
      total: filteredLogs.length,
      byLevel,
      byCategory,
      aiInteractions,
      salesConversions,
      systemErrors,
      avgResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0,
      tokensConsumed,
      revenueGenerated
    });
  };

  const refreshLogs = async () => {
    await loadLogs();
  };

  const exportLogs = () => {
    const data = filteredLogs.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      category: log.category,
      event: log.event,
      description: log.description,
      source: log.source.name || log.source.type,
      target: log.target?.name || log.target?.type,
      channel: log.metadata.channel,
      tags: log.tags.join(', ')
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-sales-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'debug':
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'info':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'debug':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai':
        return <Bot className="w-4 h-4" />;
      case 'sales':
        return <TrendingUp className="w-4 h-4" />;
      case 'system':
        return <Server className="w-4 h-4" />;
      case 'integration':
        return <Zap className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'billing':
        return <CreditCard className="w-4 h-4" />;
      case 'automation':
        return <Activity className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getChannelIcon = (channel?: string) => {
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
        return <TelegramIcon className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const copyLogDetails = (log: LogEntry) => {
    const details = `
Timestamp: ${log.timestamp}
Level: ${log.level}
Category: ${log.category}
Event: ${log.event}
Description: ${log.description}
Source: ${log.source.name || log.source.type}
${log.target ? `Target: ${log.target.name || log.target.type}` : ''}
${log.metadata.channel ? `Channel: ${log.metadata.channel}` : ''}
Tags: ${log.tags.join(', ')}
    `.trim();
    
    navigator.clipboard.writeText(details);
  };

  const categories = ['ai', 'sales', 'system', 'integration', 'user', 'security', 'billing', 'automation'];
  const channels = ['whatsapp', 'instagram', 'email', 'sms', 'telegram'];
  const sources = ['ai_agent', 'user', 'system', 'integration', 'webhook', 'scheduler'];

  return (
    <DashboardLayout currentPage="logs">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Logs de Atividade IA</h1>
            <p className="text-gray-300">Monitore todas as atividades da sua IA de vendas em tempo real</p>
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

            <button
              onClick={refreshLogs}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
            
            <button
              onClick={exportLogs}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.aiInteractions}</div>
            <div className="text-gray-300 text-sm">Interações IA</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.salesConversions}</div>
            <div className="text-gray-300 text-sm">Conversões</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.systemErrors}</div>
            <div className="text-gray-300 text-sm">Erros Sistema</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.avgResponseTime.toFixed(1)}s</div>
            <div className="text-gray-300 text-sm">Tempo Médio</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.tokensConsumed.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Tokens Usados</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{formatCurrency(stats.revenueGenerated)}</div>
            <div className="text-gray-300 text-sm">Receita Gerada</div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar logs, eventos, usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="all" className="bg-[#2D0B55]">Todos os níveis</option>
                <option value="success" className="bg-[#2D0B55]">Sucesso</option>
                <option value="info" className="bg-[#2D0B55]">Informação</option>
                <option value="warning" className="bg-[#2D0B55]">Aviso</option>
                <option value="error" className="bg-[#2D0B55]">Erro</option>
                <option value="debug" className="bg-[#2D0B55]">Debug</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="all" className="bg-[#2D0B55]">Todas categorias</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-[#2D0B55] capitalize">
                    {category === 'ai' ? 'IA' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="all" className="bg-[#2D0B55]">Todos canais</option>
                {channels.map(channel => (
                  <option key={channel} value={channel} className="bg-[#2D0B55] capitalize">
                    {channel}
                  </option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="all" className="bg-[#2D0B55]">Todo período</option>
                <option value="today" className="bg-[#2D0B55]">Hoje</option>
                <option value="week" className="bg-[#2D0B55]">Última semana</option>
                <option value="month" className="bg-[#2D0B55]">Último mês</option>
              </select>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors duration-300"
              >
                <Filter className="w-4 h-4" />
                <span>Avançado</span>
                {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Fonte</label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  >
                    <option value="all" className="bg-[#2D0B55]">Todas as fontes</option>
                    {sources.map(source => (
                      <option key={source} value={source} className="bg-[#2D0B55]">
                        {source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Logs Selecionados</label>
                  <div className="text-white">{selectedLogs.length} selecionados</div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setLevelFilter('all');
                      setCategoryFilter('all');
                      setChannelFilter('all');
                      setDateFilter('all');
                      setSourceFilter('all');
                      setSelectedLogs([]);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Logs List */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Nenhum log encontrado</h3>
              <p className="text-gray-400">
                {searchTerm || levelFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Não há logs de atividade para exibir'
                }
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Level & Category Icons */}
                    <div className="flex flex-col items-center space-y-2">
                      {getLevelIcon(log.level)}
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(log.category)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{log.description}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </div>
                        <div className="px-2 py-1 bg-white/10 rounded-full text-xs font-semibold text-gray-300 capitalize">
                          {log.category === 'ai' ? 'IA' : log.category}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>Evento: {log.event}</span>
                        <span>Fonte: {log.source.name || log.source.type}</span>
                        {log.target && <span>Alvo: {log.target.name || log.target.type}</span>}
                        {log.metadata.channel && (
                          <div className="flex items-center space-x-1">
                            {getChannelIcon(log.metadata.channel)}
                            <span className="capitalize">{log.metadata.channel}</span>
                          </div>
                        )}
                      </div>

                      {/* Metadata Grid */}
                      {(log.metadata.tokensUsed || log.metadata.responseTime || log.metadata.revenue) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          {log.metadata.tokensUsed && (
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-gray-400 text-xs">Tokens Usados</div>
                              <div className="text-white font-semibold">{log.metadata.tokensUsed.toLocaleString()}</div>
                            </div>
                          )}
                          {log.metadata.responseTime && (
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-gray-400 text-xs">Tempo de Resposta</div>
                              <div className="text-white font-semibold">{log.metadata.responseTime}s</div>
                            </div>
                          )}
                          {log.metadata.revenue && (
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-gray-400 text-xs">Receita</div>
                              <div className="text-green-400 font-semibold">{formatCurrency(log.metadata.revenue)}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {log.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-gray-400 text-sm">Tags:</span>
                          <div className="flex flex-wrap gap-1">
                            {log.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Error Details */}
                      {log.level === 'error' && log.metadata.errorCode && (
                        <div className="bg-red-500/20 rounded-lg p-3 mb-3">
                          <div className="text-red-300 text-sm font-semibold mb-1">
                            Erro: {log.metadata.errorCode}
                          </div>
                          {log.metadata.stackTrace && (
                            <details className="text-red-200 text-xs">
                              <summary className="cursor-pointer">Stack Trace</summary>
                              <pre className="mt-2 whitespace-pre-wrap">{log.metadata.stackTrace}</pre>
                            </details>
                          )}
                        </div>
                      )}

                      {/* Expandable Details */}
                      {expandedLog === log.id && (
                        <div className="bg-white/5 rounded-lg p-4 mt-3">
                          <h4 className="text-white font-semibold mb-3">Detalhes Completos</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400">ID do Log</div>
                              <div className="text-white font-mono">{log.id}</div>
                            </div>
                            {log.metadata.requestId && (
                              <div>
                                <div className="text-gray-400">Request ID</div>
                                <div className="text-white font-mono">{log.metadata.requestId}</div>
                              </div>
                            )}
                            {log.metadata.sessionId && (
                              <div>
                                <div className="text-gray-400">Session ID</div>
                                <div className="text-white font-mono">{log.metadata.sessionId}</div>
                              </div>
                            )}
                            {log.metadata.ipAddress && (
                              <div>
                                <div className="text-gray-400">IP Address</div>
                                <div className="text-white font-mono">{log.metadata.ipAddress}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-white text-sm font-semibold">{formatTimestamp(log.timestamp)}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => copyLogDetails(log)}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                        title="Copiar detalhes"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button className="text-gray-400 hover:text-white transition-colors p-2">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination would go here */}
        {filteredLogs.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Mostrando {filteredLogs.length} de {logs.length} logs
            </div>
            <div className="text-gray-400 text-sm">
              Última atualização: {formatTimestamp(new Date().toISOString())}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LogsPage;