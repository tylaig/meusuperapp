import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Bell,
  Users,
  Tag,
  ArrowRight,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Star,
  Archive,
  Send,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'meeting' | 'follow-up' | 'demo' | 'proposal' | 'task';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  dueDate: string;
  dueTime?: string;
  assignedTo: string;
  contact?: {
    name: string;
    phone?: string;
    email?: string;
    avatar?: string;
  };
  tags: string[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
  estimatedDuration?: number; // em minutos
  actualDuration?: number;
  linkedConversation?: string;
  reminders: {
    id: string;
    time: number; // minutos antes
    sent: boolean;
  }[];
}

interface AgendaStats {
  totalTasks: number;
  completedToday: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  avgCompletionTime: number;
}

const AgendaPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<AgendaStats>({
    totalTasks: 0,
    completedToday: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    avgCompletionTime: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status' | 'created'>('dueDate');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    type: 'task' as Task['type'],
    priority: 'medium' as Task['priority'],
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
    assignedTo: 'Você',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    tags: [] as string[],
    notes: '',
    estimatedDuration: 30,
    reminders: [{ id: '1', time: 15, sent: false }]
  });

  useEffect(() => {
    loadTasks();
    calculateStats();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [tasks]);

  const loadTasks = () => {
    // Mock data para tarefas
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Call de follow-up com Maria Silva',
        description: 'Acompanhar interesse nos planos Pro',
        type: 'call',
        priority: 'high',
        status: 'pending',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '14:30',
        assignedTo: 'João Santos',
        contact: {
          name: 'Maria Silva',
          phone: '+55 11 99999-0001',
          email: 'maria@empresa.com',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
        },
        tags: ['lead-quente', 'planos'],
        notes: 'Cliente demonstrou muito interesse, mencionar desconto Black Friday',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 30,
        linkedConversation: 'conv-1',
        reminders: [
          { id: '1', time: 15, sent: false },
          { id: '2', time: 60, sent: true }
        ]
      },
      {
        id: '2',
        title: 'Demonstração do produto',
        description: 'Demo completa da plataforma para Pedro Oliveira',
        type: 'demo',
        priority: 'urgent',
        status: 'in-progress',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '16:00',
        assignedTo: 'Maria Santos',
        contact: {
          name: 'Pedro Oliveira',
          phone: '+55 11 99999-0004',
          email: 'pedro@empresa.com',
          avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
        },
        tags: ['demo', 'urgente'],
        notes: 'Preparar casos de uso específicos para e-commerce',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 60,
        reminders: [
          { id: '1', time: 30, sent: false }
        ]
      },
      {
        id: '3',
        title: 'Enviar proposta comercial',
        description: 'Elaborar e enviar proposta personalizada',
        type: 'proposal',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueTime: '10:00',
        assignedTo: 'Ana Costa',
        contact: {
          name: 'Carlos Mendes',
          email: 'carlos@empresa.com'
        },
        tags: ['proposta', 'fechamento'],
        notes: 'Proposta enviada e aceita pelo cliente',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 45,
        actualDuration: 38,
        reminders: []
      },
      {
        id: '4',
        title: 'Reunião de alinhamento',
        description: 'Reunião semanal da equipe de vendas',
        type: 'meeting',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueTime: '09:00',
        assignedTo: 'Equipe',
        tags: ['reuniao', 'equipe'],
        notes: 'Revisar metas do mês e estratégias',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 90,
        reminders: [
          { id: '1', time: 60, sent: false }
        ]
      },
      {
        id: '5',
        title: 'Follow-up email Ana Costa',
        description: 'Enviar email de acompanhamento pós-venda',
        type: 'follow-up',
        priority: 'low',
        status: 'overdue',
        dueDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueTime: '15:00',
        assignedTo: 'Pedro Costa',
        contact: {
          name: 'Ana Costa',
          email: 'ana@empresa.com',
          avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
        },
        tags: ['follow-up', 'pos-venda'],
        notes: 'Verificar satisfação e possíveis upsells',
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 15,
        reminders: []
      }
    ];

    setTasks(mockTasks);
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = tasks.filter(t => 
      t.status === 'completed' && 
      t.completedAt && 
      t.completedAt.split('T')[0] === today
    ).length;

    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
    const overdue = tasks.filter(t => {
      if (t.status === 'completed' || t.status === 'cancelled') return false;
      const taskDate = new Date(t.dueDate);
      const now = new Date();
      return taskDate < now;
    }).length;

    const completed = tasks.filter(t => t.status === 'completed').length;
    const completionRate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

    const completedTasks = tasks.filter(t => t.status === 'completed' && t.actualDuration);
    const avgTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0) / completedTasks.length 
      : 0;

    setStats({
      totalTasks: tasks.length,
      completedToday,
      pendingTasks: pending,
      overdueTasks: overdue,
      completionRate,
      avgCompletionTime: avgTime
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'follow-up':
        return <RefreshCw className="w-4 h-4" />;
      case 'demo':
        return <Eye className="w-4 h-4" />;
      case 'proposal':
        return <Send className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in-progress':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'overdue':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'cancelled':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const formatTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel = '';
    if (date.toDateString() === today.toDateString()) {
      dateLabel = 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateLabel = 'Amanhã';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateLabel = 'Ontem';
    } else {
      dateLabel = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }

    return timeString ? `${dateLabel} às ${timeString}` : dateLabel;
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      type: 'task',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '',
      assignedTo: 'Você',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      tags: [],
      notes: '',
      estimatedDuration: 30,
      reminders: [{ id: '1', time: 15, sent: false }]
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      dueDate: task.dueDate,
      dueTime: task.dueTime || '',
      assignedTo: task.assignedTo,
      contactName: task.contact?.name || '',
      contactPhone: task.contact?.phone || '',
      contactEmail: task.contact?.email || '',
      tags: task.tags,
      notes: task.notes || '',
      estimatedDuration: task.estimatedDuration || 30,
      reminders: task.reminders
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = () => {
    const newTask: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      type: taskForm.type,
      priority: taskForm.priority,
      status: editingTask?.status || 'pending',
      dueDate: taskForm.dueDate,
      dueTime: taskForm.dueTime || undefined,
      assignedTo: taskForm.assignedTo,
      contact: taskForm.contactName ? {
        name: taskForm.contactName,
        phone: taskForm.contactPhone || undefined,
        email: taskForm.contactEmail || undefined
      } : undefined,
      tags: taskForm.tags,
      notes: taskForm.notes || undefined,
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      estimatedDuration: taskForm.estimatedDuration,
      reminders: taskForm.reminders
    };

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? newTask : t));
    } else {
      setTasks(prev => [...prev, newTask]);
    }

    setShowTaskModal(false);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: 'completed' as const,
            completedAt: new Date().toISOString(),
            actualDuration: task.estimatedDuration // Simular duração real
          }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.contact?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo === filterAssignee;

    let matchesDate = true;
    if (viewMode !== 'all') {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      
      switch (viewMode) {
        case 'today':
          matchesDate = taskDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = taskDate >= weekStart && taskDate <= weekEnd;
          break;
        case 'month':
          matchesDate = taskDate.getMonth() === today.getMonth() && 
                       taskDate.getFullYear() === today.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesAssignee && matchesDate;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        const dateA = new Date(a.dueDate + (a.dueTime ? ` ${a.dueTime}` : ''));
        const dateB = new Date(b.dueDate + (b.dueTime ? ` ${b.dueTime}` : ''));
        return dateA.getTime() - dateB.getTime();
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        const statusOrder = { overdue: 4, pending: 3, 'in-progress': 2, completed: 1, cancelled: 0 };
        return statusOrder[b.status] - statusOrder[a.status];
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const teamMembers = ['Você', 'João Santos', 'Maria Santos', 'Pedro Costa', 'Ana Costa', 'Equipe'];
  const availableTags = ['lead-quente', 'lead-frio', 'demo', 'proposta', 'follow-up', 'reuniao', 'urgente', 'pos-venda', 'fechamento'];

  return (
    <DashboardLayout currentPage="agenda">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Agenda de Tarefas</h1>
            <p className="text-gray-300">Gerencie suas tarefas, compromissos e follow-ups</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = '/calendar'}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Ver Calendário</span>
            </button>
            
            <button
              onClick={handleCreateTask}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">Total</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalTasks}</div>
            <div className="text-gray-300 text-sm">Tarefas Criadas</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">Hoje</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.completedToday}</div>
            <div className="text-gray-300 text-sm">Concluídas Hoje</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-yellow-400 text-sm font-semibold">Pendentes</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.pendingTasks}</div>
            <div className="text-gray-300 text-sm">Em Andamento</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <span className="text-red-400 text-sm font-semibold">Atrasadas</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.overdueTasks}</div>
            <div className="text-gray-300 text-sm">Precisam Atenção</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* View Mode */}
            <div className="flex bg-white/10 rounded-lg p-1">
              {[
                { key: 'today', label: 'Hoje' },
                { key: 'week', label: 'Semana' },
                { key: 'month', label: 'Mês' },
                { key: 'all', label: 'Todas' }
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setViewMode(mode.key as any)}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    viewMode === mode.key
                      ? 'bg-[#FF7A00] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="all" className="bg-[#2D0B55]">Todos os tipos</option>
                <option value="call" className="bg-[#2D0B55]">Ligações</option>
                <option value="meeting" className="bg-[#2D0B55]">Reuniões</option>
                <option value="follow-up" className="bg-[#2D0B55]">Follow-up</option>
                <option value="demo" className="bg-[#2D0B55]">Demonstrações</option>
                <option value="proposal" className="bg-[#2D0B55]">Propostas</option>
                <option value="task" className="bg-[#2D0B55]">Tarefas</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="all" className="bg-[#2D0B55]">Todos status</option>
                <option value="pending" className="bg-[#2D0B55]">Pendente</option>
                <option value="in-progress" className="bg-[#2D0B55]">Em andamento</option>
                <option value="completed" className="bg-[#2D0B55]">Concluída</option>
                <option value="overdue" className="bg-[#2D0B55]">Atrasada</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              >
                <option value="dueDate" className="bg-[#2D0B55]">Data de vencimento</option>
                <option value="priority" className="bg-[#2D0B55]">Prioridade</option>
                <option value="status" className="bg-[#2D0B55]">Status</option>
                <option value="created" className="bg-[#2D0B55]">Data de criação</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Crie sua primeira tarefa para começar'
                }
              </p>
              <button
                onClick={handleCreateTask}
                className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Nova Tarefa
              </button>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Task Icon & Status */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        task.type === 'call' ? 'from-green-500 to-green-600' :
                        task.type === 'meeting' ? 'from-blue-500 to-blue-600' :
                        task.type === 'demo' ? 'from-purple-500 to-purple-600' :
                        task.type === 'proposal' ? 'from-orange-500 to-orange-600' :
                        task.type === 'follow-up' ? 'from-cyan-500 to-cyan-600' :
                        'from-gray-500 to-gray-600'
                      } rounded-xl flex items-center justify-center`}>
                        {getTaskIcon(task.type)}
                      </div>
                      {getStatusIcon(task.status)}
                    </div>

                    {/* Task Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-3">{task.description}</p>

                      {/* Task Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{formatTime(task.dueDate, task.dueTime)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{task.assignedTo}</span>
                        </div>

                        {task.contact && (
                          <div className="flex items-center space-x-2">
                            {task.contact.avatar ? (
                              <img
                                src={task.contact.avatar}
                                alt={task.contact.name}
                                className="w-4 h-4 rounded-full"
                              />
                            ) : (
                              <User className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-gray-300 text-sm">{task.contact.name}</span>
                          </div>
                        )}

                        {task.estimatedDuration && (
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">{task.estimatedDuration}min</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mb-4">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, index) => (
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

                      {/* Notes */}
                      {task.notes && (
                        <div className="bg-white/5 rounded-lg p-3 mb-4">
                          <p className="text-gray-300 text-sm">{task.notes}</p>
                        </div>
                      )}

                      {/* Contact Actions */}
                      {task.contact && (
                        <div className="flex items-center space-x-2">
                          {task.contact.phone && (
                            <button className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300">
                              <Phone className="w-3 h-3" />
                              <span>Ligar</span>
                            </button>
                          )}
                          {task.contact.email && (
                            <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300">
                              <Mail className="w-3 h-3" />
                              <span>Email</span>
                            </button>
                          )}
                          {task.linkedConversation && (
                            <button
                              onClick={() => window.location.href = '/conversations'}
                              className="flex items-center space-x-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Chat</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Actions */}
                  <div className="flex items-center space-x-2">
                    {task.status === 'pending' || task.status === 'in-progress' ? (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Concluir</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => handleEditTask(task)}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                    >
                      <Edit className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-white font-semibold mb-2">Título *</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    placeholder="Ex: Call de follow-up com cliente"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-2">Descrição</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Descreva os detalhes da tarefa..."
                  />
                </div>

                {/* Type, Priority, Assignee */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Tipo</label>
                    <select
                      value={taskForm.type}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, type: e.target.value as Task['type'] }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="task" className="bg-[#2D0B55]">Tarefa</option>
                      <option value="call" className="bg-[#2D0B55]">Ligação</option>
                      <option value="meeting" className="bg-[#2D0B55]">Reunião</option>
                      <option value="follow-up" className="bg-[#2D0B55]">Follow-up</option>
                      <option value="demo" className="bg-[#2D0B55]">Demonstração</option>
                      <option value="proposal" className="bg-[#2D0B55]">Proposta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Prioridade</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="low" className="bg-[#2D0B55]">Baixa</option>
                      <option value="medium" className="bg-[#2D0B55]">Média</option>
                      <option value="high" className="bg-[#2D0B55]">Alta</option>
                      <option value="urgent" className="bg-[#2D0B55]">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Responsável</label>
                    <select
                      value={taskForm.assignedTo}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      {teamMembers.map(member => (
                        <option key={member} value={member} className="bg-[#2D0B55]">{member}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Data *</label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Horário</label>
                    <input
                      type="time"
                      value={taskForm.dueTime}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, dueTime: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-white font-semibold mb-2">Contato (Opcional)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={taskForm.contactName}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Nome do contato"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                    <input
                      type="tel"
                      value={taskForm.contactPhone}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="Telefone"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                    <input
                      type="email"
                      value={taskForm.contactEmail}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="Email"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-white font-semibold mb-2">Observações</label>
                  <textarea
                    value={taskForm.notes}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Observações adicionais..."
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-white font-semibold mb-2">Duração Estimada (minutos)</label>
                  <input
                    type="number"
                    value={taskForm.estimatedDuration}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                    min="5"
                    step="5"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowTaskModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveTask}
                    disabled={!taskForm.title.trim()}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
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