import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Clock, 
  TrendingUp, 
  Target, 
  User, 
  Tag, 
  FileText, 
  Download, 
  Upload, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Move, 
  Copy, 
  Archive, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Handshake
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  avatar?: string;
  tags: string[];
  source: string;
  createdAt: string;
  lastContact: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  score: number;
  notes: string;
  customFields: { [key: string]: any };
}

interface Deal {
  id: string;
  title: string;
  contactId: string;
  contact: Contact;
  value: number;
  probability: number;
  stageId: string;
  pipelineId: string;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  tags: string[];
  notes: string;
  activities: Activity[];
  customFields: { [key: string]: any };
  source: string;
  lostReason?: string;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
  probability: number;
  isClosedWon: boolean;
  isClosedLost: boolean;
}

interface Pipeline {
  id: string;
  name: string;
  description: string;
  stages: Stage[];
  isDefault: boolean;
  createdAt: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'whatsapp' | 'instagram';
  title: string;
  description: string;
  date: string;
  completed: boolean;
  contactId?: string;
  dealId?: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
}

const CRMPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'contacts' | 'analytics' | 'activities'>('kanban');
  const [selectedPipeline, setSelectedPipeline] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [showPipelineSettings, setShowPipelineSettings] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'table'>('kanban');

  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'Vendas Principal',
      description: 'Pipeline principal de vendas',
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      stages: [
        { id: '1', name: 'Lead', color: 'bg-blue-500', order: 1, probability: 10, isClosedWon: false, isClosedLost: false },
        { id: '2', name: 'Qualificado', color: 'bg-yellow-500', order: 2, probability: 25, isClosedWon: false, isClosedLost: false },
        { id: '3', name: 'Proposta', color: 'bg-orange-500', order: 3, probability: 50, isClosedWon: false, isClosedLost: false },
        { id: '4', name: 'Negociação', color: 'bg-purple-500', order: 4, probability: 75, isClosedWon: false, isClosedLost: false },
        { id: '5', name: 'Fechado', color: 'bg-green-500', order: 5, probability: 100, isClosedWon: true, isClosedLost: false },
        { id: '6', name: 'Perdido', color: 'bg-red-500', order: 6, probability: 0, isClosedWon: false, isClosedLost: true }
      ]
    },
    {
      id: '2',
      name: 'Upsell/Cross-sell',
      description: 'Pipeline para vendas adicionais',
      isDefault: false,
      createdAt: '2024-01-15T00:00:00Z',
      stages: [
        { id: '7', name: 'Identificado', color: 'bg-cyan-500', order: 1, probability: 20, isClosedWon: false, isClosedLost: false },
        { id: '8', name: 'Apresentação', color: 'bg-indigo-500', order: 2, probability: 60, isClosedWon: false, isClosedLost: false },
        { id: '9', name: 'Aprovação', color: 'bg-pink-500', order: 3, probability: 80, isClosedWon: false, isClosedLost: false },
        { id: '10', name: 'Implementado', color: 'bg-green-500', order: 4, probability: 100, isClosedWon: true, isClosedLost: false }
      ]
    }
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@empresa.com',
      phone: '+55 11 99999-0001',
      company: 'Tech Solutions',
      position: 'CEO',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      tags: ['lead-quente', 'decisor'],
      source: 'Website',
      createdAt: '2024-01-15T10:00:00Z',
      lastContact: '2024-01-20T14:30:00Z',
      status: 'prospect',
      score: 85,
      notes: 'Interessada em planos enterprise. Empresa com 50+ funcionários.',
      customFields: {
        budget: 'R$ 10.000 - R$ 50.000',
        timeline: '3 meses',
        employees: 50
      }
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao@startup.com',
      phone: '+55 11 99999-0002',
      company: 'StartupX',
      position: 'Founder',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      tags: ['startup', 'tech'],
      source: 'Instagram',
      createdAt: '2024-01-18T09:15:00Z',
      lastContact: '2024-01-19T16:45:00Z',
      status: 'lead',
      score: 65,
      notes: 'Startup em crescimento, precisa de automação.',
      customFields: {
        budget: 'R$ 1.000 - R$ 5.000',
        timeline: '1 mês',
        employees: 10
      }
    },
    {
      id: '3',
      name: 'Ana Costa',
      email: 'ana@consultoria.com',
      phone: '+55 11 99999-0003',
      company: 'Costa Consultoria',
      position: 'Diretora',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      tags: ['consultoria', 'b2b'],
      source: 'Indicação',
      createdAt: '2024-01-10T11:20:00Z',
      lastContact: '2024-01-22T10:15:00Z',
      status: 'customer',
      score: 95,
      notes: 'Cliente ativo, interessada em expansão.',
      customFields: {
        budget: 'R$ 5.000 - R$ 20.000',
        timeline: '2 meses',
        employees: 25
      }
    }
  ]);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      title: 'Implementação IA - Tech Solutions',
      contactId: '1',
      contact: contacts[0],
      value: 25000,
      probability: 75,
      stageId: '4',
      pipelineId: '1',
      expectedCloseDate: '2024-02-15',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      assignedTo: 'João Santos',
      tags: ['enterprise', 'high-value'],
      notes: 'Negociação avançada, aguardando aprovação final.',
      source: 'Website',
      activities: [],
      customFields: {
        competitors: 'RD Station, HubSpot',
        decisionMakers: 'Maria Silva (CEO), Carlos (CTO)',
        budget: 'R$ 20.000 - R$ 30.000'
      }
    },
    {
      id: '2',
      title: 'Automação Vendas - StartupX',
      contactId: '2',
      contact: contacts[1],
      value: 3500,
      probability: 25,
      stageId: '2',
      pipelineId: '1',
      expectedCloseDate: '2024-02-28',
      createdAt: '2024-01-18T09:15:00Z',
      updatedAt: '2024-01-19T16:45:00Z',
      assignedTo: 'Maria Santos',
      tags: ['startup', 'small-business'],
      notes: 'Startup em crescimento, orçamento limitado.',
      source: 'Instagram',
      activities: [],
      customFields: {
        competitors: 'Nenhum',
        decisionMakers: 'João Santos (Founder)',
        budget: 'R$ 2.000 - R$ 5.000'
      }
    },
    {
      id: '3',
      title: 'Expansão Plataforma - Costa Consultoria',
      contactId: '3',
      contact: contacts[2],
      value: 15000,
      probability: 60,
      stageId: '3',
      pipelineId: '1',
      expectedCloseDate: '2024-03-10',
      createdAt: '2024-01-10T11:20:00Z',
      updatedAt: '2024-01-22T10:15:00Z',
      assignedTo: 'Pedro Costa',
      tags: ['expansion', 'existing-customer'],
      notes: 'Cliente existente querendo expandir uso.',
      source: 'Indicação',
      activities: [],
      customFields: {
        competitors: 'Nenhum (cliente atual)',
        decisionMakers: 'Ana Costa (Diretora)',
        budget: 'R$ 10.000 - R$ 20.000'
      }
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'call',
      title: 'Ligação de follow-up',
      description: 'Discussão sobre proposta e próximos passos',
      date: '2024-01-22T14:00:00Z',
      completed: true,
      contactId: '1',
      dealId: '1',
      assignedTo: 'João Santos',
      createdBy: 'João Santos',
      createdAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      type: 'email',
      title: 'Envio de proposta',
      description: 'Proposta comercial detalhada enviada',
      date: '2024-01-21T09:30:00Z',
      completed: true,
      contactId: '1',
      dealId: '1',
      assignedTo: 'João Santos',
      createdBy: 'João Santos',
      createdAt: '2024-01-21T09:00:00Z'
    },
    {
      id: '3',
      type: 'whatsapp',
      title: 'Mensagem WhatsApp',
      description: 'Esclarecimento de dúvidas sobre funcionalidades',
      date: '2024-01-23T16:15:00Z',
      completed: false,
      contactId: '2',
      dealId: '2',
      assignedTo: 'Maria Santos',
      createdBy: 'Maria Santos',
      createdAt: '2024-01-23T15:00:00Z'
    }
  ]);

  const teamMembers = [
    { id: '1', name: 'João Santos', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=30&h=30&fit=crop' },
    { id: '2', name: 'Maria Santos', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=30&h=30&fit=crop' },
    { id: '3', name: 'Pedro Costa', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=30&h=30&fit=crop' }
  ];

  const currentPipeline = pipelines.find(p => p.id === selectedPipeline) || pipelines[0];

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedDeal) {
      setDeals(prev => prev.map(deal => 
        deal.id === draggedDeal.id 
          ? { ...deal, stageId, updatedAt: new Date().toISOString() }
          : deal
      ));
      setDraggedDeal(null);
    }
  };

  const getDealsForStage = (stageId: string) => {
    return deals.filter(deal => 
      deal.stageId === stageId && 
      deal.pipelineId === selectedPipeline &&
      (searchTerm === '' || 
       deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       deal.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       deal.contact.company?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'instagram': return <MessageSquare className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'text-blue-400 bg-blue-500/20';
      case 'prospect': return 'text-yellow-400 bg-yellow-500/20';
      case 'customer': return 'text-green-400 bg-green-500/20';
      case 'inactive': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const calculatePipelineMetrics = () => {
    const pipelineDeals = deals.filter(d => d.pipelineId === selectedPipeline);
    const totalValue = pipelineDeals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = pipelineDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
    const avgDealSize = pipelineDeals.length > 0 ? totalValue / pipelineDeals.length : 0;
    const conversionRate = pipelineDeals.length > 0 ? 
      (pipelineDeals.filter(d => currentPipeline.stages.find(s => s.id === d.stageId)?.isClosedWon).length / pipelineDeals.length) * 100 : 0;

    return {
      totalDeals: pipelineDeals.length,
      totalValue,
      weightedValue,
      avgDealSize,
      conversionRate
    };
  };

  const metrics = calculatePipelineMetrics();

  return (
    <DashboardLayout currentPage="crm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">CRM & Vendas</h1>
            <p className="text-gray-300">Gerencie negócios, contatos e pipeline de vendas</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNewContactModal(true)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Users className="w-4 h-4" />
              <span>Novo Contato</span>
            </button>
            
            <button
              onClick={() => setShowNewDealModal(true)}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Negócio</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">+12% mês</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metrics.totalDeals}</div>
            <div className="text-gray-300 text-sm">Negócios Ativos</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+23% mês</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{formatCurrency(metrics.totalValue)}</div>
            <div className="text-gray-300 text-sm">Valor Total</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">Ponderado</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{formatCurrency(metrics.weightedValue)}</div>
            <div className="text-gray-300 text-sm">Valor Provável</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-400 text-sm font-semibold">Ticket médio</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{formatCurrency(metrics.avgDealSize)}</div>
            <div className="text-gray-300 text-sm">Valor Médio</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-cyan-400 text-sm font-semibold">Taxa</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metrics.conversionRate.toFixed(1)}%</div>
            <div className="text-gray-300 text-sm">Conversão</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {[
            { id: 'kanban', name: 'Kanban', icon: Target },
            { id: 'contacts', name: 'Contatos', icon: Users },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 },
            { id: 'activities', name: 'Atividades', icon: Activity }
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

        {/* Kanban View */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            {/* Pipeline Selector and Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPipeline}
                  onChange={(e) => setSelectedPipeline(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  {pipelines.map(pipeline => (
                    <option key={pipeline.id} value={pipeline.id} className="bg-[#2D0B55]">
                      {pipeline.name}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowPipelineSettings(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar negócios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded transition-colors ${viewMode === 'kanban' ? 'bg-[#FF7A00] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Target className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-[#FF7A00] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded transition-colors ${viewMode === 'table' ? 'bg-[#FF7A00] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="overflow-x-auto">
              <div className="flex space-x-6 min-w-max pb-4">
                {currentPipeline.stages.map((stage) => {
                  const stageDeals = getDealsForStage(stage.id);
                  const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
                  
                  return (
                    <div
                      key={stage.id}
                      className="w-80 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage.id)}
                    >
                      {/* Stage Header */}
                      <div className="p-4 border-b border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
                            <h3 className="text-white font-semibold">{stage.name}</h3>
                            <span className="text-gray-400 text-sm">({stageDeals.length})</span>
                          </div>
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[#FF7A00] font-semibold text-sm">
                          {formatCurrency(stageValue)}
                        </div>
                      </div>

                      {/* Deals */}
                      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                        {stageDeals.map((deal) => (
                          <div
                            key={deal.id}
                            draggable
                            onDragStart={() => handleDragStart(deal)}
                            onClick={() => setSelectedDeal(deal)}
                            className="bg-white/10 rounded-lg p-4 border border-white/10 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-white font-medium text-sm leading-tight flex-1">
                                {deal.title}
                              </h4>
                              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center space-x-2 mb-3">
                              <img
                                src={deal.contact.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=30&h=30&fit=crop'}
                                alt={deal.contact.name}
                                className="w-6 h-6 rounded-full border border-white/20"
                              />
                              <span className="text-gray-300 text-sm">{deal.contact.name}</span>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[#FF7A00] font-semibold">
                                {formatCurrency(deal.value)}
                              </span>
                              <span className="text-gray-400 text-sm">
                                {deal.probability}%
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-400 text-xs">
                                  {formatDate(deal.expectedCloseDate)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-400 text-xs">
                                  {deal.assignedTo}
                                </span>
                              </div>
                            </div>

                            {deal.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {deal.tags.slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {deal.tags.length > 2 && (
                                  <span className="text-gray-400 text-xs">
                                    +{deal.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Contacts View */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Contacts Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar contatos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>
                
                <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300">
                  <option value="all" className="bg-[#2D0B55]">Todos os status</option>
                  <option value="lead" className="bg-[#2D0B55]">Lead</option>
                  <option value="prospect" className="bg-[#2D0B55]">Prospect</option>
                  <option value="customer" className="bg-[#2D0B55]">Cliente</option>
                  <option value="inactive" className="bg-[#2D0B55]">Inativo</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white transition-colors p-2">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors p-2">
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={contact.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full border-2 border-white/20"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{contact.name}</h3>
                        <p className="text-gray-400 text-sm">{contact.position}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                      {contact.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{contact.company}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-[#FF7A00]" />
                      <span className="text-white font-semibold">{contact.score}</span>
                      <span className="text-gray-400 text-sm">Score</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {formatDate(contact.lastContact)}
                    </span>
                  </div>

                  {contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">
                          +{contact.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pipeline Performance */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Performance do Pipeline</h3>
                <div className="space-y-4">
                  {currentPipeline.stages.map((stage) => {
                    const stageDeals = getDealsForStage(stage.id);
                    const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
                    const percentage = metrics.totalValue > 0 ? (stageValue / metrics.totalValue) * 100 : 0;
                    
                    return (
                      <div key={stage.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
                            <span className="text-white font-medium">{stage.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">{formatCurrency(stageValue)}</div>
                            <div className="text-gray-400 text-sm">{stageDeals.length} negócios</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`${stage.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Top Performers</h3>
                <div className="space-y-4">
                  {teamMembers.map((member, index) => {
                    const memberDeals = deals.filter(d => d.assignedTo === member.name);
                    const memberValue = memberDeals.reduce((sum, deal) => sum + deal.value, 0);
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-[#FF7A00] font-bold">#{index + 1}</span>
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full border border-white/20"
                            />
                          </div>
                          <span className="text-white font-medium">{member.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{formatCurrency(memberValue)}</div>
                          <div className="text-gray-400 text-sm">{memberDeals.length} negócios</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Funil de Conversão</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {currentPipeline.stages.filter(s => !s.isClosedLost).map((stage, index) => {
                  const stageDeals = getDealsForStage(stage.id);
                  const conversionRate = index === 0 ? 100 : 
                    (stageDeals.length / getDealsForStage(currentPipeline.stages[0].id).length) * 100;
                  
                  return (
                    <div key={stage.id} className="text-center">
                      <div className={`w-16 h-16 ${stage.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-white font-bold">{stageDeals.length}</span>
                      </div>
                      <h4 className="text-white font-medium mb-1">{stage.name}</h4>
                      <p className="text-gray-400 text-sm">{conversionRate.toFixed(1)}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Activities View */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            {/* Activities Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300">
                  <option value="all" className="bg-[#2D0B55]">Todas as atividades</option>
                  <option value="call" className="bg-[#2D0B55]">Ligações</option>
                  <option value="email" className="bg-[#2D0B55]">Emails</option>
                  <option value="meeting" className="bg-[#2D0B55]">Reuniões</option>
                  <option value="whatsapp" className="bg-[#2D0B55]">WhatsApp</option>
                </select>
                
                <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300">
                  <option value="all" className="bg-[#2D0B55]">Todos os membros</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name} className="bg-[#2D0B55]">
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300">
                <Plus className="w-4 h-4" />
                <span>Nova Atividade</span>
              </button>
            </div>

            {/* Activities Timeline */}
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.completed ? 'bg-green-500' : 'bg-[#FF7A00]'
                    }`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{activity.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-sm">
                            {formatDate(activity.date)}
                          </span>
                          {activity.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-[#FF7A00]" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-3">{activity.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400 text-sm">{activity.assignedTo}</span>
                          </div>
                          {activity.contactId && (
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400 text-sm">
                                {contacts.find(c => c.id === activity.contactId)?.name}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deal Detail Modal */}
        {selectedDeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{selectedDeal.title}</h3>
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Deal Info */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Valor</label>
                        <div className="text-2xl font-bold text-[#FF7A00]">
                          {formatCurrency(selectedDeal.value)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Probabilidade</label>
                        <div className="text-2xl font-bold text-white">
                          {selectedDeal.probability}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Data Esperada</label>
                        <div className="text-white">{formatDate(selectedDeal.expectedCloseDate)}</div>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Responsável</label>
                        <div className="text-white">{selectedDeal.assignedTo}</div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Observações</label>
                    <div className="bg-white/10 rounded-lg p-4 text-white">
                      {selectedDeal.notes}
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Informações Adicionais</label>
                    <div className="space-y-2">
                      {Object.entries(selectedDeal.customFields).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400 capitalize">{key}:</span>
                          <span className="text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Contato</h4>
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={selectedDeal.contact.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                        alt={selectedDeal.contact.name}
                        className="w-10 h-10 rounded-full border border-white/20"
                      />
                      <div>
                        <div className="text-white font-medium">{selectedDeal.contact.name}</div>
                        <div className="text-gray-400 text-sm">{selectedDeal.contact.position}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{selectedDeal.contact.email}</span>
                      </div>
                      {selectedDeal.contact.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{selectedDeal.contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDeal.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>Enviar WhatsApp</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                      <Mail className="w-4 h-4" />
                      <span>Enviar Email</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span>Agendar Reunião</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CRMPage;