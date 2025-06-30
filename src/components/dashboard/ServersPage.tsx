import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  Wifi, 
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Plus,
  RefreshCw,
  Settings,
  BarChart3,
  MessageSquare,
  Users,
  Clock,
  Zap,
  Play,
  Pause,
  Trash2,
  Edit,
  Terminal,
  Download
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import DemoAlert from '../common/DemoAlert';
import { useDemoMode } from '../../hooks/useDemoMode';
import { Server as ServerType } from '../../types';

const ServersPage: React.FC = () => {
  const [servers, setServers] = useState<ServerType[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showDemoAlert, demoAlertConfig, triggerDemoAlert, closeDemoAlert } = useDemoMode();

  useEffect(() => {
    // Mock data for servers
    setServers([
      {
        id: '1',
        name: 'WhatsApp Server BR-01',
        hostname: 'wa-br-01.meusuper.app',
        ipAddress: '192.168.1.10',
        region: 'São Paulo, BR',
        status: 'online',
        organizationId: 'org-1',
        resources: {
          cpu: { usage: 45, cores: 4 },
          memory: { used: 6.2, total: 16, percentage: 39 },
          storage: { used: 120, total: 500, percentage: 24 },
          network: { inbound: 2.5, outbound: 1.8 }
        },
        whatsapp: {
          activeConnections: 87,
          maxConnections: 100,
          queuedMessages: 23,
          sentToday: 15420,
          receivedToday: 8930
        },
        uptime: 99.8,
        lastUpdate: new Date().toISOString(),
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'WhatsApp Server US-01',
        hostname: 'wa-us-01.meusuper.app',
        ipAddress: '192.168.1.11',
        region: 'Virginia, US',
        status: 'online',
        organizationId: 'org-1',
        resources: {
          cpu: { usage: 32, cores: 8 },
          memory: { used: 12.8, total: 32, percentage: 40 },
          storage: { used: 280, total: 1000, percentage: 28 },
          network: { inbound: 4.2, outbound: 3.1 }
        },
        whatsapp: {
          activeConnections: 92,
          maxConnections: 100,
          queuedMessages: 8,
          sentToday: 28750,
          receivedToday: 16420
        },
        uptime: 99.9,
        lastUpdate: new Date().toISOString(),
        createdAt: '2024-01-10T08:30:00Z'
      },
      {
        id: '3',
        name: 'WhatsApp Server EU-01',
        hostname: 'wa-eu-01.meusuper.app',
        ipAddress: '192.168.1.12',
        region: 'Frankfurt, DE',
        status: 'maintenance',
        organizationId: 'org-1',
        resources: {
          cpu: { usage: 15, cores: 4 },
          memory: { used: 3.2, total: 16, percentage: 20 },
          storage: { used: 95, total: 500, percentage: 19 },
          network: { inbound: 0.5, outbound: 0.3 }
        },
        whatsapp: {
          activeConnections: 0,
          maxConnections: 100,
          queuedMessages: 0,
          sentToday: 0,
          receivedToday: 0
        },
        uptime: 98.5,
        lastUpdate: new Date().toISOString(),
        createdAt: '2024-01-20T14:15:00Z'
      }
    ]);
  }, []);

  const refreshServers = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update random data for demo
    setServers(prev => prev.map(server => ({
      ...server,
      resources: {
        ...server.resources,
        cpu: { ...server.resources.cpu, usage: Math.max(10, Math.min(90, server.resources.cpu.usage + (Math.random() - 0.5) * 10)) },
        memory: { ...server.resources.memory, percentage: Math.max(10, Math.min(90, server.resources.memory.percentage + (Math.random() - 0.5) * 5)) }
      },
      whatsapp: {
        ...server.whatsapp,
        sentToday: server.whatsapp.sentToday + Math.floor(Math.random() * 100),
        receivedToday: server.whatsapp.receivedToday + Math.floor(Math.random() * 50)
      }
    })));
    
    setIsLoading(false);
  };

  const handleServerAction = (action: string, serverId?: string) => {
    const actions = {
      'create-server': {
        title: 'Criar Novo Servidor',
        message: 'A criação de novos servidores requer configuração avançada de infraestrutura. Na versão completa, você pode provisionar servidores automaticamente em diferentes regiões.'
      },
      'restart-server': {
        title: 'Reiniciar Servidor',
        message: 'O reinício de servidores em produção requer confirmação adicional e pode afetar conexões ativas. Esta funcionalidade está disponível na versão completa.'
      },
      'delete-server': {
        title: 'Excluir Servidor',
        message: 'A exclusão de servidores é uma operação crítica que requer múltiplas confirmações. Esta funcionalidade está disponível apenas na versão completa.'
      },
      'server-logs': {
        title: 'Logs do Servidor',
        message: 'O acesso completo aos logs do servidor com filtros avançados e exportação está disponível na versão completa da plataforma.'
      },
      'server-terminal': {
        title: 'Terminal do Servidor',
        message: 'O acesso direto ao terminal do servidor é uma funcionalidade avançada disponível apenas na versão completa, com controles de segurança rigorosos.'
      }
    };

    const config = actions[action as keyof typeof actions];
    if (config) {
      triggerDemoAlert(config.title, config.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <Settings className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'offline':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const totalConnections = servers.reduce((sum, server) => sum + server.whatsapp.activeConnections, 0);
  const totalMessages = servers.reduce((sum, server) => sum + server.whatsapp.sentToday + server.whatsapp.receivedToday, 0);
  const onlineServers = servers.filter(server => server.status === 'online').length;

  return (
    <DashboardLayout currentPage="servers">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Servidores WhatsApp</h1>
            <p className="text-gray-300">Gerencie e monitore seus servidores em tempo real</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshServers}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
            
            <button
              onClick={() => handleServerAction('create-server')}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Servidor</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+2 este mês</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{onlineServers}/{servers.length}</div>
            <div className="text-gray-300 text-sm">Servidores Online</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">87% capacidade</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalConnections}</div>
            <div className="text-gray-300 text-sm">Conexões Ativas</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">+15% hoje</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{formatNumber(totalMessages)}</div>
            <div className="text-gray-300 text-sm">Mensagens Hoje</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-400 text-sm font-semibold">99.2%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">99.2%</div>
            <div className="text-gray-300 text-sm">Uptime Médio</div>
          </div>
        </div>

        {/* Servers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {servers.map((server) => (
            <div
              key={server.id}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedServer(selectedServer === server.id ? null : server.id)}
            >
              {/* Server Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(server.status)}
                  <div>
                    <h3 className="text-white font-semibold">{server.name}</h3>
                    <p className="text-gray-400 text-sm">{server.region}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(server.status)}`}>
                  {server.status.toUpperCase()}
                </div>
              </div>

              {/* WhatsApp Connections */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Conexões WhatsApp</span>
                  <span className="text-white font-semibold">
                    {server.whatsapp.activeConnections}/{server.whatsapp.maxConnections}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#FF7A00] to-[#FF9500] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(server.whatsapp.activeConnections / server.whatsapp.maxConnections) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Cpu className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-white text-sm font-semibold">{server.resources.cpu.usage}%</span>
                  </div>
                  <span className="text-gray-400 text-xs">CPU</span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Activity className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-white text-sm font-semibold">{server.resources.memory.percentage}%</span>
                  </div>
                  <span className="text-gray-400 text-xs">RAM</span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <HardDrive className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-white text-sm font-semibold">{server.resources.storage.percentage}%</span>
                  </div>
                  <span className="text-gray-400 text-xs">Storage</span>
                </div>
              </div>

              {/* Messages Today */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Enviadas: {formatNumber(server.whatsapp.sentToday)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Recebidas: {formatNumber(server.whatsapp.receivedToday)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {server.status === 'online' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServerAction('restart-server', server.id);
                      }}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1"
                    >
                      <Pause className="w-3 h-3" />
                      <span>Reiniciar</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServerAction('server-terminal', server.id);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                    >
                      <Terminal className="w-3 h-3" />
                    </button>
                  </>
                )}
                
                {server.status === 'offline' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServerAction('restart-server', server.id);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Iniciar</span>
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServerAction('server-logs', server.id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                >
                  <BarChart3 className="w-3 h-3" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServerAction('delete-server', server.id);
                  }}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Expanded Details */}
              {selectedServer === server.id && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Hostname</span>
                      <p className="text-white text-sm font-mono">{server.hostname}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">IP Address</span>
                      <p className="text-white text-sm font-mono">{server.ipAddress}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Uptime</span>
                      <p className="text-white text-sm">{server.uptime}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Fila de Mensagens</span>
                      <p className="text-white text-sm">{server.whatsapp.queuedMessages}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = '/connections'}
                      className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                    >
                      Ver Conexões
                    </button>
                    <button
                      onClick={() => window.location.href = '/logs'}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                    >
                      Ver Logs
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Performance dos Servidores</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleServerAction('server-logs')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
              <BarChart3 className="w-6 h-6 text-[#FF7A00]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servers.filter(s => s.status === 'online').map((server, index) => (
              <div key={server.id} className="space-y-4">
                <h4 className="text-white font-medium">{server.name}</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">CPU</span>
                      <span className="text-white">{server.resources.cpu.usage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${server.resources.cpu.usage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Memória</span>
                      <span className="text-white">{server.resources.memory.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${server.resources.memory.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Storage</span>
                      <span className="text-white">{server.resources.storage.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${server.resources.storage.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Alert */}
        <DemoAlert
          isOpen={showDemoAlert}
          onClose={closeDemoAlert}
          title={demoAlertConfig.title}
          message={demoAlertConfig.message}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServersPage;