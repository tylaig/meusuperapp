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
  RefreshCw
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
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

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update with random data
    setMetrics(prev => ({
      ...prev,
      salesCompleted: prev.salesCompleted + Math.floor(Math.random() * 10),
      messagesReceived: prev.messagesReceived + Math.floor(Math.random() * 50),
      messagesSent: prev.messagesSent + Math.floor(Math.random() * 50),
    }));
    
    setIsLoading(false);
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }> = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 transform hover:scale-105">
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
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
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
          />
          <MetricCard
            title="Vendas Recuperadas"
            value={metrics.salesRecovered}
            change={45}
            icon={Target}
            color="bg-gradient-to-br from-[#FF7A00] to-[#FF9500]"
            subtitle="Pela IA"
          />
          <MetricCard
            title="ROI"
            value={`${metrics.roi}%`}
            change={12}
            icon={DollarSign}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            subtitle="Retorno sobre investimento"
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
          />
          <MetricCard
            title="Mensagens Enviadas"
            value={metrics.messagesSent.toLocaleString()}
            change={25}
            icon={MessageSquare}
            color="bg-gradient-to-br from-cyan-500 to-cyan-600"
            subtitle="Pela IA"
          />
          <MetricCard
            title="Uso de Tokens"
            value={`${metrics.tokenUsage}%`}
            icon={Zap}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            subtitle="Do limite mensal"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Performance Chart */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Performance de Vendas</h3>
              <BarChart3 className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Vendas Concluídas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-white font-semibold">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Vendas Recuperadas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div className="bg-[#FF7A00] h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-white font-semibold">70%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Vendas Perdidas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
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
              <PieChart className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">WhatsApp</span>
                </div>
                <span className="text-white font-semibold">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#FF7A00] rounded-full"></div>
                  <span className="text-gray-300">Instagram</span>
                </div>
                <span className="text-white font-semibold">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Email</span>
                </div>
                <span className="text-white font-semibold">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">SMS</span>
                </div>
                <span className="text-white font-semibold">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Status das Integrações</h3>
            <Activity className="w-6 h-6 text-[#FF7A00]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Evolution API', status: 'connected', uptime: '99.9%' },
              { name: 'n8n Workflows', status: 'connected', uptime: '98.5%' },
              { name: 'Chatwoot', status: 'connected', uptime: '99.2%' },
              { name: 'PostgreSQL', status: 'connected', uptime: '100%' },
            ].map((integration, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{integration.name}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-gray-400 text-sm">Uptime: {integration.uptime}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;