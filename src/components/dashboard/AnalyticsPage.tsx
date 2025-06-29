import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  MessageSquare,
  Users,
  DollarSign,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('conversations');

  const metrics = {
    conversations: {
      total: 2847,
      change: 23,
      data: [120, 150, 180, 200, 170, 190, 220]
    },
    messages: {
      total: 15420,
      change: 18,
      data: [800, 950, 1100, 1200, 980, 1150, 1300]
    },
    tokens: {
      total: 89500,
      change: 15,
      data: [4200, 4800, 5100, 5400, 4900, 5200, 5800]
    },
    performance: {
      total: 94.5,
      change: 8,
      data: [88, 90, 92, 94, 91, 93, 95]
    }
  };

  const channelData = [
    { name: 'WhatsApp', messages: 1247, percentage: 45, color: 'bg-green-500' },
    { name: 'Instagram', messages: 832, percentage: 30, color: 'bg-pink-500' },
    { name: 'Email', messages: 416, percentage: 15, color: 'bg-blue-500' },
    { name: 'SMS', messages: 277, percentage: 10, color: 'bg-purple-500' },
  ];

  const timeData = [
    { hour: '00-02', messages: 45 },
    { hour: '02-04', messages: 23 },
    { hour: '04-06', messages: 12 },
    { hour: '06-08', messages: 89 },
    { hour: '08-10', messages: 234 },
    { hour: '10-12', messages: 345 },
    { hour: '12-14', messages: 298 },
    { hour: '14-16', messages: 267 },
    { hour: '16-18', messages: 189 },
    { hour: '18-20', messages: 156 },
    { hour: '20-22', messages: 98 },
    { hour: '22-00', messages: 67 },
  ];

  const exportData = () => {
    // Simulate data export
    const data = {
      period: dateRange,
      metrics: metrics,
      channels: channelData,
      timeDistribution: timeData,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout currentPage="analytics">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-gray-300">Análise detalhada do desempenho da sua IA</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
            >
              <option value="7d" className="bg-[#2D0B55]">Últimos 7 dias</option>
              <option value="30d" className="bg-[#2D0B55]">Últimos 30 dias</option>
              <option value="90d" className="bg-[#2D0B55]">Últimos 90 dias</option>
              <option value="1y" className="bg-[#2D0B55]">Último ano</option>
            </select>
            
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              key: 'conversations', 
              title: 'Conversas', 
              icon: MessageSquare, 
              color: 'from-blue-500 to-blue-600',
              suffix: ''
            },
            { 
              key: 'messages', 
              title: 'Mensagens', 
              icon: MessageSquare, 
              color: 'from-green-500 to-green-600',
              suffix: ''
            },
            { 
              key: 'tokens', 
              title: 'Tokens Usados', 
              icon: Zap, 
              color: 'from-yellow-500 to-yellow-600',
              suffix: ''
            },
            { 
              key: 'performance', 
              title: 'Performance', 
              icon: Target, 
              color: 'from-purple-500 to-purple-600',
              suffix: '%'
            },
          ].map((metric) => (
            <div
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedMetric === metric.key ? 'border-[#FF7A00]' : 'border-white/20 hover:border-[#FF7A00]/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 ${
                  metrics[metric.key as keyof typeof metrics].change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {Math.abs(metrics[metric.key as keyof typeof metrics].change)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {metrics[metric.key as keyof typeof metrics].total.toLocaleString()}{metric.suffix}
              </div>
              <div className="text-gray-300 text-sm">{metric.title}</div>
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              Tendência - {selectedMetric === 'conversations' ? 'Conversas' : 
                          selectedMetric === 'messages' ? 'Mensagens' :
                          selectedMetric === 'tokens' ? 'Tokens' : 'Performance'}
            </h3>
            <BarChart3 className="w-6 h-6 text-[#FF7A00]" />
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {metrics[selectedMetric as keyof typeof metrics].data.map((value, index) => {
              const maxValue = Math.max(...metrics[selectedMetric as keyof typeof metrics].data);
              const height = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-[#FF7A00] to-[#FF9500] rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-gray-400 text-xs mt-2">
                    {index === 0 ? '6d' : index === 1 ? '5d' : index === 2 ? '4d' : 
                     index === 3 ? '3d' : index === 4 ? '2d' : index === 5 ? '1d' : 'Hoje'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel Distribution & Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Channel Distribution */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Distribuição por Canal</h3>
            <div className="space-y-4">
              {channelData.map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${channel.color} rounded-full`}></div>
                    <span className="text-white font-medium">{channel.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white font-semibold">{channel.messages.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm">{channel.percentage}%</div>
                    </div>
                    <div className="w-20 bg-white/10 rounded-full h-2">
                      <div
                        className={`${channel.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${channel.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Distribution */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Distribuição por Horário</h3>
            <div className="h-48 flex items-end justify-between space-x-1">
              {timeData.map((time, index) => {
                const maxMessages = Math.max(...timeData.map(t => t.messages));
                const height = (time.messages / maxMessages) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-[#FF7A00]/60 to-[#FF9500]/60 rounded-t transition-all duration-500 hover:opacity-80"
                      style={{ height: `${height}%` }}
                      title={`${time.hour}: ${time.messages} mensagens`}
                    ></div>
                    <span className="text-gray-400 text-xs mt-2 transform -rotate-45 origin-center">
                      {time.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Insights de Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">Pico de Atividade</h4>
              <p className="text-gray-300 text-sm">10h-12h é o horário com mais conversas ativas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">Canal Principal</h4>
              <p className="text-gray-300 text-sm">WhatsApp representa 45% de todas as conversas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">Tempo de Resposta</h4>
              <p className="text-gray-300 text-sm">Média de 1.8s - 40% mais rápido que humanos</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;