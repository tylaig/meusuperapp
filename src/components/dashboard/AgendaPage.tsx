import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Users,
  Tag,
  Bell,
  RefreshCw,
  Download,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Video,
  FileText,
  Star,
  Archive,
  Copy,
  ExternalLink,
  Zap,
  Target,
  TrendingUp,
  Activity,
  User,
  Building,
  DollarSign
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  type: 'task' | 'meeting' | 'call' | 'email' | 'follow-up' | 'deadline';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate?: string;
  allDay?: boolean;
  assignedTo?: string;
  relatedTo?: {
    type: 'contact' | 'deal' | 'conversation';
    id: string;
    name: string;
  };
  tags: string[];
  reminders: Array<{
    type: 'email' | 'push' | 'sms';
    time: number; // minutes before
  }>;
  location?: string;
  attendees?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

const AgendaPage: React.FC = () => {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [calendarView, setCalendarView] = useState<CalendarView>({
    type: 'month',
    date: new Date()
  });
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    dateRange: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AgendaItem>>({
    type: 'task',
    priority: 'medium',
    status: 'pending',
    tags: [],
    reminders: [{ type: 'email', time: 15 }]
  });

  useEffect(() => {
    loadAgendaItems();
  }, []);

  const loadAgendaItems = async () => {
    setIsLoading(true);
    
    // Mock data
    const mockItems: AgendaItem[] = [
      {
        id: '1',
        title: 'Follow-up com Maria Silva',
        description: 'Verificar interesse no plano Pro após demonstração',
        type: 'follow-up',
        status: 'pending',
        priority: 'high',
        startDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'João Santos',
        relatedTo: {
          type: 'contact',
          id: 'contact-1',
          name: 'Maria Silva'
        },
        tags: ['lead-quente', 'demo'],
        reminders: [
          { type: 'email', time: 15 },
          { type: 'push', time: 5 }
        ],
        notes: 'Cliente demonstrou muito interesse durante a demo. Mencionar desconto especial.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Reunião de vendas - Q1',
        description: 'Revisão de metas e estratégias para o primeiro trimestre',
        type: 'meeting',
        status: 'pending',
        priority: 'medium',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Equipe Vendas',
        location: 'Sala de Reuniões A',
        attendees: ['João Santos', 'Maria Santos', 'Pedro Costa'],
        tags: ['reunião', 'vendas', 'estratégia'],
        reminders: [
          { type: 'email', time: 60 },
          { type: 'push', time: 15 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Ligar para Pedro Oliveira',
        description: 'Cliente solicitou contato urgente sobre problema técnico',
        type: 'call',
        status: 'overdue',
        priority: 'urgent',
        startDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        assignedTo: 'Suporte Técnico',
        relatedTo: {
          type: 'contact',
          id: 'contact-3',
          name: 'Pedro Oliveira'
        },
        tags: ['urgente', 'suporte', 'técnico'],
        reminders: [
          { type: 'sms', time: 0 },
          { type: 'push', time: 0 }
        ],
        notes: 'Cliente relatou problemas na integração WhatsApp. Prioridade máxima.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Enviar proposta - Ana Costa',
        description: 'Elaborar e enviar proposta personalizada para plano Enterprise',
        type: 'task',
        status: 'in-progress',
        priority: 'high',
        startDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'João Santos',
        relatedTo: {
          type: 'deal',
          id: 'deal-1',
          name: 'Ana Costa - Enterprise'
        },
        tags: ['proposta', 'enterprise', 'vendas'],
        reminders: [
          { type: 'email', time: 30 }
        ],
        notes: 'Cliente interessado em funcionalidades avançadas de IA e integrações customizadas.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Deadline: Implementação IA - Cliente X',
        description: 'Prazo final para entrega da implementação de IA personalizada',
        type: 'deadline',
        status: 'pending',
        priority: 'urgent',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Equipe Técnica',
        relatedTo: {
          type: 'deal',
          id: 'deal-2',
          name: 'Cliente X - Implementação'
        },
        tags: ['deadline', 'implementação', 'ia'],
        reminders: [
          { type: 'email', time: 1440 }, // 1 day
          { type: 'push', time: 60 },
          { type: 'sms', time: 15 }
        ],
        notes: 'Projeto crítico. Cliente aguarda go-live para início das operações.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setAgendaItems(mockItems);
    setIsLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'follow-up':
        return <RefreshCw className="w-4 h-4" />;
      case 'deadline':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in-progress':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'overdue':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'cancelled':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatDateTime = (dateString: string, showTime = true) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (Math.abs(diffInMinutes) < 60) {
      if (diffInMinutes > 0) return `Em ${diffInMinutes}m`;
      if (diffInMinutes < 0) return `${Math.abs(diffInMinutes)}m atrás`;
      return 'Agora';
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      if (diffInHours > 0) return `Em ${diffInHours}h`;
      if (diffInHours < 0) return `${Math.abs(diffInHours)}h atrás`;
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: showTime ? '2-digit' : undefined,
      minute: showTime ? '2-digit' : undefined
    });
  };

  const handleCreateItem = async () => {
    if (!formData.title) return;
    
    setIsLoading(true);
    
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type || 'task',
      status: formData.status || 'pending',
      priority: formData.priority || 'medium',
      startDate: formData.startDate || new Date().toISOString(),
      endDate: formData.endDate,
      allDay: formData.allDay,
      assignedTo: formData.assignedTo,
      relatedTo: formData.relatedTo,
      tags: formData.tags || [],
      reminders: formData.reminders || [{ type: 'email', time: 15 }],
      location: formData.location,
      attendees: formData.attendees,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAgendaItems(prev => [newItem, ...prev]);
    setShowCreateModal(false);
    setFormData({
      type: 'task',
      priority: 'medium',
      status: 'pending',
      tags: [],
      reminders: [{ type: 'email', time: 15 }]
    });
    setIsLoading(false);
  };

  const updateItemStatus = (itemId: string, newStatus: string) => {
    setAgendaItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: newStatus as any, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteItem = (itemId: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      setAgendaItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const exportAgenda = () => {
    const data = {
      items: agendaItems,
      exportedAt: new Date().toISOString(),
      filters: filters
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenda-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredItems = agendaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'all' || item.type === filters.type;
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
    const matchesAssignee = filters.assignedTo === 'all' || item.assignedTo === filters.assignedTo;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesAssignee;
  });

  const upcomingItems = filteredItems.filter(item => {
    const itemDate = new Date(item.startDate);
    const now = new Date();
    return itemDate > now && item.status !== 'completed' && item.status !== 'cancelled';
  }).slice(0, 5);

  const overdueItems = filteredItems.filter(item => item.status === 'overdue');
  const todayItems = filteredItems.filter(item => {
    const itemDate = new Date(item.startDate);
    const today = new Date();
    return itemDate.toDateString() === today.toDateString();
  });

  const completedToday = filteredItems.filter(item => {
    const itemDate = new Date(item.updatedAt);
    const today = new Date();
    return itemDate.toDateString() === today.toDateString() && item.status === 'completed';
  }).length;

  const teamMembers = [
    { id: '1', name: 'João Santos', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
    { id: '2', name: 'Maria Santos', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
    { id: '3', name: 'Pedro Costa', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' }
  ];

  return (
    <DashboardLayout currentPage="agenda">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Agenda & Tarefas</h1>
            <p className="text-gray-300">Gerencie sua agenda, tarefas e follow-ups</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <button
              onClick={exportAgenda}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">Hoje</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{todayItems.length}</div>
            <div className="text-gray-300 text-sm">Tarefas de Hoje</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <span className="text-red-400 text-sm font-semibold">Urgente</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{overdueItems.length}</div>
            <div className="text-gray-300 text-sm">Tarefas Atrasadas</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">Concluídas</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{completedToday}</div>
            <div className="text-gray-300 text-sm">Finalizadas Hoje</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">Próximas</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{upcomingItems.length}</div>
            <div className="text-gray-300 text-sm">Próximas Tarefas</div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar tarefas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Tipo</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todos</option>
                  <option value="task" className="bg-[#2D0B55]">Tarefa</option>
                  <option value="meeting" className="bg-[#2D0B55]">Reunião</option>
                  <option value="call" className="bg-[#2D0B55]">Ligação</option>
                  <option value="email" className="bg-[#2D0B55]">Email</option>
                  <option value="follow-up" className="bg-[#2D0B55]">Follow-up</option>
                  <option value="deadline" className="bg-[#2D0B55]">Deadline</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todos</option>
                  <option value="pending" className="bg-[#2D0B55]">Pendente</option>
                  <option value="in-progress" className="bg-[#2D0B55]">Em Andamento</option>
                  <option value="completed" className="bg-[#2D0B55]">Concluído</option>
                  <option value="overdue" className="bg-[#2D0B55]">Atrasado</option>
                  <option value="cancelled" className="bg-[#2D0B55]">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Prioridade</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todas</option>
                  <option value="urgent" className="bg-[#2D0B55]">Urgente</option>
                  <option value="high" className="bg-[#2D0B55]">Alta</option>
                  <option value="medium" className="bg-[#2D0B55]">Média</option>
                  <option value="low" className="bg-[#2D0B55]">Baixa</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Responsável</label>
                <select
                  value={filters.assignedTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todos</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name} className="bg-[#2D0B55]">{member.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-gray-400 text-sm">
                {filteredItems.length} tarefas encontradas
              </div>
              <button
                onClick={() => {
                  setFilters({
                    type: 'all',
                    status: 'all',
                    priority: 'all',
                    assignedTo: 'all',
                    dateRange: 'all'
                  });
                  setSearchTerm('');
                }}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Lista de Tarefas</h3>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={loadAgendaItems}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Nenhuma tarefa encontrada</h3>
                    <p className="text-gray-400 mb-4">
                      {searchTerm || Object.values(filters).some(f => f !== 'all') 
                        ? 'Tente ajustar os filtros de busca'
                        : 'Crie sua primeira tarefa para começar'
                      }
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
                    >
                      Nova Tarefa
                    </button>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            item.type === 'task' ? 'bg-blue-500/20 text-blue-400' :
                            item.type === 'meeting' ? 'bg-purple-500/20 text-purple-400' :
                            item.type === 'call' ? 'bg-green-500/20 text-green-400' :
                            item.type === 'email' ? 'bg-cyan-500/20 text-cyan-400' :
                            item.type === 'follow-up' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {getTypeIcon(item.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-white font-semibold">{item.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                                {item.priority.toUpperCase()}
                              </span>
                            </div>
                            
                            {item.description && (
                              <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDateTime(item.startDate)}</span>
                              </div>
                              
                              {item.assignedTo && (
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{item.assignedTo}</span>
                                </div>
                              )}
                              
                              {item.relatedTo && (
                                <div className="flex items-center space-x-1">
                                  {item.relatedTo.type === 'contact' ? <User className="w-3 h-3" /> :
                                   item.relatedTo.type === 'deal' ? <DollarSign className="w-3 h-3" /> :
                                   <MessageSquare className="w-3 h-3" />}
                                  <span>{item.relatedTo.name}</span>
                                </div>
                              )}
                            </div>
                            
                            {item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ').toUpperCase()}
                          </span>
                          
                          <div className="flex items-center space-x-1">
                            {item.status !== 'completed' && item.status !== 'cancelled' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateItemStatus(item.id, 'completed');
                                }}
                                className="text-green-400 hover:text-green-300 p-1"
                                title="Marcar como concluído"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item.id);
                              }}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Tarefa</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/follow-up'}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Gerenciar Follow-ups</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/calendar'}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Ver Calendário</span>
                </button>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Próximas Tarefas</h3>
              <div className="space-y-3">
                {upcomingItems.length === 0 ? (
                  <p className="text-gray-400 text-sm">Nenhuma tarefa próxima</p>
                ) : (
                  upcomingItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/5 rounded-lg p-3 border border-white/10 cursor-pointer hover:border-[#FF7A00]/50 transition-colors"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {getTypeIcon(item.type)}
                        <span className="text-white text-sm font-medium truncate">{item.title}</span>
                      </div>
                      <div className="text-gray-400 text-xs">{formatDateTime(item.startDate)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Equipe</h3>
              <div className="space-y-3">
                {teamMembers.map((member) => {
                  const memberTasks = filteredItems.filter(item => item.assignedTo === member.name);
                  const completedTasks = memberTasks.filter(item => item.status === 'completed').length;
                  
                  return (
                    <div key={member.id} className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-[#FF7A00]"
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{member.name}</div>
                        <div className="text-gray-400 text-xs">
                          {memberTasks.length} tarefas ({completedTasks} concluídas)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Nova Tarefa</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-white font-semibold mb-2">Título *</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      placeholder="Digite o título da tarefa"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Tipo</label>
                    <select
                      value={formData.type || 'task'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="task" className="bg-[#2D0B55]">Tarefa</option>
                      <option value="meeting" className="bg-[#2D0B55]">Reunião</option>
                      <option value="call" className="bg-[#2D0B55]">Ligação</option>
                      <option value="email" className="bg-[#2D0B55]">Email</option>
                      <option value="follow-up" className="bg-[#2D0B55]">Follow-up</option>
                      <option value="deadline" className="bg-[#2D0B55]">Deadline</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Prioridade</label>
                    <select
                      value={formData.priority || 'medium'}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="low" className="bg-[#2D0B55]">Baixa</option>
                      <option value="medium" className="bg-[#2D0B55]">Média</option>
                      <option value="high" className="bg-[#2D0B55]">Alta</option>
                      <option value="urgent" className="bg-[#2D0B55]">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Data/Hora</label>
                    <input
                      type="datetime-local"
                      value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value).toISOString() }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Responsável</label>
                    <select
                      value={formData.assignedTo || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="" className="bg-[#2D0B55]">Selecionar responsável</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.name} className="bg-[#2D0B55]">{member.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-semibold mb-2">Descrição</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Descrição da tarefa (opcional)"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-semibold mb-2">Notas</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Notas adicionais (opcional)"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateItem}
                    disabled={!formData.title || isLoading}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Criando...' : 'Criar Tarefa'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedItem.type === 'task' ? 'bg-blue-500/20 text-blue-400' :
                    selectedItem.type === 'meeting' ? 'bg-purple-500/20 text-purple-400' :
                    selectedItem.type === 'call' ? 'bg-green-500/20 text-green-400' :
                    selectedItem.type === 'email' ? 'bg-cyan-500/20 text-cyan-400' :
                    selectedItem.type === 'follow-up' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {getTypeIcon(selectedItem.type)}
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedItem.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Status and Priority */}
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedItem.status)}`}>
                    {selectedItem.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(selectedItem.priority)}`}>
                    {selectedItem.priority.toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Descrição</h4>
                    <p className="text-gray-300">{selectedItem.description}</p>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Data/Hora</h4>
                    <p className="text-gray-300">{formatDateTime(selectedItem.startDate)}</p>
                  </div>

                  {selectedItem.assignedTo && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Responsável</h4>
                      <p className="text-gray-300">{selectedItem.assignedTo}</p>
                    </div>
                  )}

                  {selectedItem.location && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Local</h4>
                      <p className="text-gray-300">{selectedItem.location}</p>
                    </div>
                  )}

                  {selectedItem.relatedTo && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Relacionado a</h4>
                      <p className="text-gray-300">{selectedItem.relatedTo.name}</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedItem.tags.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedItem.notes && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Notas</h4>
                    <p className="text-gray-300">{selectedItem.notes}</p>
                  </div>
                )}

                {/* Reminders */}
                {selectedItem.reminders.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Lembretes</h4>
                    <div className="space-y-2">
                      {selectedItem.reminders.map((reminder, index) => (
                        <div key={index} className="flex items-center space-x-2 text-gray-300">
                          <Bell className="w-4 h-4" />
                          <span>{reminder.type.toUpperCase()} - {reminder.time} minutos antes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-white/10">
                  {selectedItem.status !== 'completed' && selectedItem.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        updateItemStatus(selectedItem.id, 'completed');
                        setSelectedItem(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Concluir</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      // Edit functionality would go here
                      console.log('Edit item:', selectedItem.id);
                    }}
                    className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      deleteItem(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
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

export default AgendaPage;