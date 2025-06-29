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
  User
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { ActivityLog } from '../../types';

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock data for activity logs
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        serverId: '1',
        connectionId: '1',
        organizationId: 'org-1',
        userId: '1',
        action: 'connection.created',
        description: 'Nova conexão WhatsApp criada: Vendas Principal',
        level: 'success',
        metadata: { phoneNumber: '+55 11 99999-0001', sessionName: 'Vendas Principal' },
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        serverId: '1',
        organizationId: 'org-1',
        userId: '2',
        action: 'server.restart',
        description: 'Servidor WhatsApp BR-01 reiniciado',
        level: 'warning',
        metadata: { serverName: 'WhatsApp Server BR-01', reason: 'maintenance' },
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        connectionId: '2',
        organizationId: 'org-1',
        userId: '1',
        action: 'message.sent',
        description: 'Mensagem enviada com sucesso',
        level: 'info',
        metadata: { messageId: 'msg_123', recipient: '+55 11 88888-8888' },
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        serverId: '2',
        organizationId: 'org-1',
        userId: '3',
        action: 'connection.error',
        description: 'Falha na conexão WhatsApp: Timeout na autenticação',
        level: 'error',
        metadata: { error: 'Authentication timeout', connectionId: '3' },
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        organizationId: 'org-1',
        userId: '2',
        action: 'user.login',
        description: 'Usuário Maria Santos fez login no sistema',
        level: 'info',
        metadata: { userAgent: 'Mozilla/5.0...', ip: '192.168.1.100' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        serverId: '1',
        organizationId: 'org-1',
        userId: '1',
        action: 'server.resource.alert',
        description: 'Uso de CPU alto detectado: 85%',
        level: 'warning',
        metadata: { cpuUsage: 85, threshold: 80, serverName: 'WhatsApp Server BR-01' },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        connectionId: '1',
        organizationId: 'org-1',
        userId: '1',
        action: 'message.failed',
        description: 'Falha no envio de mensagem: Número inválido',
        level: 'error',
        metadata: { error: 'Invalid phone number', recipient: '+55 11 invalid' },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        organizationId: 'org-1',
        userId: '1',
        action: 'backup.completed',
        description: 'Backup automático concluído com sucesso',
        level: 'success',
        metadata: { backupSize: '2.5GB', duration: '15min' },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by level
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // Filter by date
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
  }, [logs, searchTerm, levelFilter, dateFilter]);

  const refreshLogs = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportLogs = () => {
    const data = filteredLogs.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      action: log.action,
      description: log.description,
      userId: log.userId,
      serverId: log.serverId,
      connectionId: log.connectionId
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
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
      default:
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('server')) return <Server className="w-4 h-4" />;
    if (action.includes('connection')) return <Smartphone className="w-4 h-4" />;
    if (action.includes('user')) return <User className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
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

  const logCounts = {
    total: logs.length,
    success: logs.filter(l => l.level === 'success').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
    info: logs.filter(l => l.level === 'info').length
  };

  return (
    <DashboardLayout currentPage="logs">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Logs de Atividade</h1>
            <p className="text-gray-300">Monitore todas as atividades do sistema</p>
          </div>
          
          <div className="flex items-center space-x-4">
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{logCounts.total}</div>
            <div className="text-gray-300 text-sm">Total de Logs</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{logCounts.success}</div>
            <div className="text-gray-300 text-sm">Sucessos</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{logCounts.info}</div>
            <div className="text-gray-300 text-sm">Informações</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{logCounts.warning}</div>
            <div className="text-gray-300 text-sm">Avisos</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{logCounts.error}</div>
            <div className="text-gray-300 text-sm">Erros</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
            />
          </div>
          
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
          >
            <option value="all" className="bg-[#2D0B55]">Todos os Níveis</option>
            <option value="success" className="bg-[#2D0B55]">Sucesso</option>
            <option value="info" className="bg-[#2D0B55]">Informação</option>
            <option value="warning" className="bg-[#2D0B55]">Aviso</option>
            <option value="error" className="bg-[#2D0B55]">Erro</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
          >
            <option value="all" className="bg-[#2D0B55]">Todo o Período</option>
            <option value="today" className="bg-[#2D0B55]">Hoje</option>
            <option value="week" className="bg-[#2D0B55]">Última Semana</option>
            <option value="month" className="bg-[#2D0B55]">Último Mês</option>
          </select>
        </div>

        {/* Logs List */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Nenhum log encontrado</h3>
              <p className="text-gray-400">
                {searchTerm || levelFilter !== 'all' || dateFilter !== 'all'
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
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(log.level)}
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-semibold">{log.description}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Ação: {log.action}</span>
                        {log.serverId && <span>Servidor: {log.serverId}</span>}
                        {log.connectionId && <span>Conexão: {log.connectionId}</span>}
                        <span>Usuário: {log.userId}</span>
                      </div>
                      
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                          <div className="text-gray-300 text-sm">Detalhes:</div>
                          <div className="mt-1 space-y-1">
                            {Object.entries(log.metadata).map(([key, value]) => (
                              <div key={key} className="text-xs text-gray-400">
                                <span className="font-semibold">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LogsPage;