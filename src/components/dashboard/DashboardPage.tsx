import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  MessageSquare,
  Zap,
  Activity,
  Target,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Eye,
  Download
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import DemoAlert from '../common/DemoAlert';
import { useDemoMode } from '../../hooks/useDemoMode';
import { DashboardMetrics } from '../../types';

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    salesCompleted: 127,
    salesLost: 23,
    salesRecovered: 89,
    roi: 340,
    responseTime: 1.8,
    cac: 45,
    messagesReceived: 2847,
    messagesSent: 3921,
    tokenUsage: 75,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { showDemoAlert, demoAlertConfig, triggerDemoAlert, closeDemoAlert } = useDemoMode();

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update with random data for demo
    setMetrics(prev => ({
      ...prev,
      salesCompleted: prev.salesCompleted + Math.floor(Math.random() * 5),
      messagesReceived: prev.messagesReceived + Math.floor(Math.random() * 50),
      messagesSent: prev.messagesSent + Math.floor(Math.random() * 50),
    }));
    
    setIsLoading(false);
  };

  const handleAdvancedAction = (action: string) => {
    const actions = {
      'export-data': {
        title: 'Exportação de Dados',
        message: 'A exportação completa de dados históricos está disponível apenas na versão completa. No modo demonstração, você pode visualizar os dados mas não exportá-los.'
      },
      'configure-alerts': {
        title: 'Configuração de Alertas',
        message: 'A configuração avançada de alertas personalizados está disponível na versão completa. Você pode definir limites, canais de notificação e automações.'
      },
      'api-access': {
        title: 'Acesso à API',
        message: 'O acesso completo à API com webhooks e integrações customizadas está disponível apenas na versão completa da plataforma.'
      }
    };

    const config = actions[action as keyof typeof actions];
    if (config) {
      triggerDemoAlert(config.title, config.message);
    }
  };

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    clickable?: boolean;
    onClick?: () => void;
  }> = ({ title, value, change, icon: Icon, color, subtitle, clickable = false, onClick }) => (
    <div 
      className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all duration-300 transform hover:scale-105 ${
        clickable ? 'cursor-pointer hover:border-[#FF7A00]/50' : 'hover:border-[#FF7A00]/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span className="text-sm font-semibold">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-300 text-sm">{title}</div>
      {subtitle && <div className="text-gray-400 text-xs mt-1">{subtitle}</div>}
      {clickable && (
        <div className="mt-3 text-[#FF7A00] text-xs font-semibold">Clique para detalhes</div>
      )}
    </div>
  );

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Visão geral do desempenho da sua IA</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                autoRefresh 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{autoRefresh ? 'Pausar' : 'Iniciar'} Auto-refresh</span>
            </button>
            
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={() => handleAdvancedAction('export-data')}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/connections'}
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold group-hover:text-[#FF7A00] transition-colors">Nova Conexão</div>
                <div className="text-gray-400 text-sm">Conectar WhatsApp</div>
              </div>
            </button>

            <button
              onClick={() => handleAdvancedAction('configure-alerts')}
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold group-hover:text-[#FF7A00] transition-colors">Configurar Alertas</div>
                <div className="text-gray-400 text-sm">Definir limites</div>
              </div>
            </button>

            <button
              onClick={() => window.location.href = '/analytics'}
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold group-hover:text-[#FF7A00] transition-colors">Ver Analytics</div>
                <div className="text-gray-400 text-sm">Relatórios detalhados</div>
              </div>
            </button>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Vendas Concluídas"
            value={metrics.salesCompleted}
            change={23}
            icon={TrendingUp}
            color="bg-gradient-to-br from-green-500 to-green-600"
            subtitle="Este mês"
            clickable
            onClick={() => window.location.href = '/analytics'}
          />
          <MetricCard
            title="Vendas Recuperadas"
            value={metrics.salesRecovered}
            change={45}
            icon={Target}
            color="bg-gradient-to-br from-[#FF7A00] to-[#FF9500]"
            subtitle="Pela IA"
            clickable
            onClick={() => window.location.href = '/analytics'}
          />
          <MetricCard
            title="ROI"
            value={`${metrics.roi}%`}
            change={12}
            icon={DollarSign}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            subtitle="Retorno sobre investimento"
            clickable
            onClick={() => handleAdvancedAction('api-access')}
          />
          <MetricCard
            title="Tempo de Resposta"
            value={`${metrics.responseTime}s`}
            change={-15}
            icon={Clock}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            subtitle="Média de resposta"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="CAC"
            value={`R$ ${metrics.cac}`}
            change={-8}
            icon={Users}
            color="bg-gradient-to-br from-teal-500 to-teal-600"
            subtitle="Custo de aquisição"
          />
          <MetricCard
            title="Mensagens Recebidas"
            value={metrics.messagesReceived.toLocaleString()}
            change={18}
            icon={MessageSquare}
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
            subtitle="Últimos 30 dias"
            clickable
            onClick={() => window.location.href = '/conversations'}
          />
          <MetricCard
            title="Mensagens Enviadas"
            value={metrics.messagesSent.toLocaleString()}
            change={25}
            icon={MessageSquare}
            color="bg-gradient-to-br from-cyan-500 to-cyan-600"
            subtitle="Pela IA"
            clickable
            onClick={() => window.location.href = '/conversations'}
          />
          <MetricCard
            title="Uso de Tokens"
            value={`${metrics.tokenUsage}%`}
            icon={Zap}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            subtitle="Do limite mensal"
            clickable
            onClick={() => window.location.href = '/subscription'}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Performance Chart */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Performance de Vendas</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAdvancedAction('export-data')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <BarChart3 className="w-6 h-6 text-[#FF7A00]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Vendas Concluídas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-white font-semibold">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Vendas Recuperadas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div className="bg-[#FF7A00] h-2 rounded-full transition-all duration-1000" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-white font-semibold">70%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Vendas Perdidas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full transition-all duration-1000" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-white font-semibold">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Channel Performance */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Performance por Canal</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.location.href = '/analytics'}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <PieChart className="w-6 h-6 text-[#FF7A00]" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'WhatsApp', percentage: 45, color: 'bg-green-500' },
                { name: 'Instagram', percentage: 30, color: 'bg-[#FF7A00]' },
                { name: 'Email', percentage: 15, color: 'bg-blue-500' },
                { name: 'SMS', percentage: 10, color: 'bg-purple-500' }
              ].map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${channel.color} rounded-full`}></div>
                    <span className="text-gray-300">{channel.name}</span>
                  </div>
                  <span className="text-white font-semibold">{channel.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Status das Integrações</h3>
            <button
              onClick={() => window.location.href = '/settings'}
              className="text-[#FF7A00] hover:text-[#FF9500] font-semibold transition-colors"
            >
              Gerenciar
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Evolution API', status: 'connected', uptime: '99.9%' },
              { name: 'n8n Workflows', status: 'connected', uptime: '98.5%' },
              { name: 'Chatwoot', status: 'connected', uptime: '99.2%' },
              { name: 'PostgreSQL', status: 'connected', uptime: '100%' },
            ].map((integration, index) => (
              <button
                key={index}
                onClick={() => handleAdvancedAction('api-access')}
                className="bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium group-hover:text-[#FF7A00] transition-colors">{integration.name}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-gray-400 text-sm">Uptime: {integration.uptime}</div>
              </button>
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

export default DashboardPage;