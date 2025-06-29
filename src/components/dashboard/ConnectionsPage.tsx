import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  QrCode, 
  Wifi, 
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Plus,
  RefreshCw,
  Trash2,
  Settings,
  MessageSquare,
  Clock,
  Activity,
  Search,
  Filter
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { WhatsAppConnection } from '../../types';

const ConnectionsPage: React.FC = () => {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for WhatsApp connections
    setConnections([
      {
        id: '1',
        serverId: '1',
        sessionName: 'Vendas Principal',
        phoneNumber: '+55 11 99999-0001',
        status: 'connected',
        lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        messagesCount: {
          sent: 1247,
          received: 892,
          failed: 3
        },
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        serverId: '1',
        sessionName: 'Suporte Técnico',
        phoneNumber: '+55 11 99999-0002',
        status: 'connected',
        lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        messagesCount: {
          sent: 856,
          received: 1203,
          failed: 1
        },
        createdAt: '2024-01-16T14:30:00Z'
      },
      {
        id: '3',
        serverId: '2',
        sessionName: 'Marketing Bot',
        phoneNumber: '+55 11 99999-0003',
        status: 'connecting',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        messagesCount: {
          sent: 0,
          received: 0,
          failed: 0
        },
        createdAt: '2024-01-20T09:15:00Z'
      },
      {
        id: '4',
        serverId: '2',
        sessionName: 'Financeiro',
        phoneNumber: '+55 11 99999-0004',
        status: 'error',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        messagesCount: {
          sent: 234,
          received: 156,
          failed: 12
        },
        createdAt: '2024-01-18T16:45:00Z'
      },
      {
        id: '5',
        serverId: '1',
        sessionName: 'Vendas Secundário',
        phoneNumber: '+55 11 99999-0005',
        status: 'disconnected',
        lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        messagesCount: {
          sent: 567,
          received: 423,
          failed: 8
        },
        createdAt: '2024-01-17T11:20:00Z'
      }
    ]);
  }, []);

  const refreshConnections = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      case 'connecting':
        return <Activity className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'disconnected':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'connecting':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatLastActivity = (timestamp: string) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conn.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || conn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const totalMessages = connections.reduce((sum, conn) => sum + conn.messagesCount.sent + conn.messagesCount.received, 0);
  const errorCount = connections.filter(c => c.status === 'error').length;

  return (
    <DashboardLayout currentPage="connections">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Conexões WhatsApp</h1>
            <p className="text-gray-300">Gerencie todas as suas conexões WhatsApp</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshConnections}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300">
              <Plus className="w-4 h-4" />
              <span>Nova Conexão</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+2 hoje</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{connectedCount}</div>
            <div className="text-gray-300 text-sm">Conexões Ativas</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">+15% hoje</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalMessages.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Mensagens Total</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">87% capacidade</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{connections.length}</div>
            <div className="text-gray-300 text-sm">Total de Sessões</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <span className="text-red-400 text-sm font-semibold">{errorCount > 0 ? 'Atenção' : 'OK'}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{errorCount}</div>
            <div className="text-gray-300 text-sm">Conexões com Erro</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome ou telefone..."
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
            <option value="connected" className="bg-[#2D0B55]">Conectado</option>
            <option value="disconnected" className="bg-[#2D0B55]">Desconectado</option>
            <option value="connecting" className="bg-[#2D0B55]">Conectando</option>
            <option value="error" className="bg-[#2D0B55]">Erro</option>
          </select>
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredConnections.map((connection) => (
            <div
              key={connection.id}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300"
            >
              {/* Connection Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(connection.status)}
                  <div>
                    <h3 className="text-white font-semibold">{connection.sessionName}</h3>
                    <p className="text-gray-400 text-sm">{connection.phoneNumber}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(connection.status)}`}>
                  {connection.status.toUpperCase()}
                </div>
              </div>

              {/* QR Code for connecting sessions */}
              {connection.status === 'connecting' && connection.qrCode && (
                <div className="mb-4 p-4 bg-white rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-800 text-sm font-semibold">Escaneie o QR Code</span>
                    <button
                      onClick={() => setShowQRCode(showQRCode === connection.id ? null : connection.id)}
                      className="text-[#FF7A00] hover:text-[#FF9500] transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                  {showQRCode === connection.id && (
                    <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              )}

              {/* Message Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-green-400 text-lg font-bold">{connection.messagesCount.sent}</div>
                  <div className="text-gray-400 text-xs">Enviadas</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 text-lg font-bold">{connection.messagesCount.received}</div>
                  <div className="text-gray-400 text-xs">Recebidas</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 text-lg font-bold">{connection.messagesCount.failed}</div>
                  <div className="text-gray-400 text-xs">Falhas</div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">Última atividade</span>
                </div>
                <span className="text-white text-sm">{formatLastActivity(connection.lastActivity)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {connection.status === 'connected' && (
                  <button className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>Mensagens</span>
                  </button>
                )}
                
                {connection.status === 'disconnected' && (
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1">
                    <Wifi className="w-3 h-3" />
                    <span>Conectar</span>
                  </button>
                )}
                
                {connection.status === 'error' && (
                  <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>Reconectar</span>
                  </button>
                )}
                
                <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300">
                  <Settings className="w-3 h-3" />
                </button>
                
                <button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors duration-300">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredConnections.length === 0 && (
          <div className="text-center py-12">
            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma conexão encontrada</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Crie sua primeira conexão WhatsApp para começar'
              }
            </p>
            <button className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300">
              Nova Conexão
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConnectionsPage;