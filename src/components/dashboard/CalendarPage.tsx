import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Tag,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Users,
  Video,
  MessageSquare,
  MoreVertical,
  X,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  Target,
  TrendingUp,
  Calendar as CalendarView,
  List,
  Grid3X3
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'meeting' | 'call' | 'task' | 'reminder' | 'follow-up' | 'demo' | 'proposal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  attendees: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    status: 'pending' | 'accepted' | 'declined' | 'tentative';
  }>;
  location?: string;
  meetingLink?: string;
  notes?: string;
  tags: string[];
  reminders: Array<{
    id: string;
    time: number; // minutes before event
    type: 'email' | 'push' | 'sms';
    sent: boolean;
  }>;
  followUp?: {
    required: boolean;
    dueDate?: string;
    status: 'pending' | 'completed' | 'overdue';
    notes?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarFilters {
  types: string[];
  priorities: string[];
  statuses: string[];
  attendees: string[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    types: [],
    priorities: [],
    statuses: [],
    attendees: [],
    dateRange: {
      start: '',
      end: ''
    },
    tags: []
  });

  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting',
    priority: 'medium',
    status: 'scheduled',
    attendees: [],
    location: '',
    meetingLink: '',
    notes: '',
    tags: [],
    reminders: [
      { id: '1', time: 15, type: 'email', sent: false },
      { id: '2', time: 5, type: 'push', sent: false }
    ],
    followUp: {
      required: false,
      status: 'pending'
    }
  });

  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mock data
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Reunião com Cliente - Maria Silva',
        description: 'Apresentação da proposta de IA para vendas',
        startTime: '09:00',
        endTime: '10:00',
        date: new Date().toISOString().split('T')[0],
        type: 'meeting',
        priority: 'high',
        status: 'confirmed',
        attendees: [
          {
            id: '1',
            name: 'Maria Silva',
            email: 'maria@empresa.com',
            phone: '+55 11 99999-0001',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
            status: 'accepted'
          }
        ],
        location: 'Sala de Reuniões 1',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Levar apresentação atualizada com casos de sucesso',
        tags: ['cliente', 'proposta', 'ia-vendas'],
        reminders: [
          { id: '1', time: 15, type: 'email', sent: false },
          { id: '2', time: 5, type: 'push', sent: false }
        ],
        followUp: {
          required: true,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending',
          notes: 'Enviar proposta detalhada'
        },
        createdBy: 'João Santos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Demo Técnica - Pedro Costa',
        description: 'Demonstração da plataforma de IA',
        startTime: '14:00',
        endTime: '15:30',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'demo',
        priority: 'medium',
        status: 'scheduled',
        attendees: [
          {
            id: '2',
            name: 'Pedro Costa',
            email: 'pedro@empresa.com',
            phone: '+55 11 99999-0002',
            status: 'pending'
          }
        ],
        meetingLink: 'https://zoom.us/j/123456789',
        tags: ['demo', 'tecnica'],
        reminders: [
          { id: '1', time: 30, type: 'email', sent: false }
        ],
        followUp: {
          required: true,
          status: 'pending'
        },
        createdBy: 'Maria Santos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Follow-up: Ana Oliveira',
        description: 'Acompanhamento pós-demonstração',
        startTime: '11:00',
        endTime: '11:30',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'follow-up',
        priority: 'high',
        status: 'scheduled',
        attendees: [
          {
            id: '3',
            name: 'Ana Oliveira',
            email: 'ana@empresa.com',
            status: 'accepted'
          }
        ],
        tags: ['follow-up', 'pos-demo'],
        reminders: [
          { id: '1', time: 10, type: 'push', sent: false }
        ],
        followUp: {
          required: false,
          status: 'pending'
        },
        createdBy: 'João Santos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setEvents(mockEvents);
  }, []);

  const eventTypes = [
    { value: 'meeting', label: 'Reunião', color: 'bg-blue-500', icon: Users },
    { value: 'call', label: 'Ligação', color: 'bg-green-500', icon: Phone },
    { value: 'task', label: 'Tarefa', color: 'bg-purple-500', icon: CheckCircle },
    { value: 'reminder', label: 'Lembrete', color: 'bg-yellow-500', icon: Bell },
    { value: 'follow-up', label: 'Follow-up', color: 'bg-orange-500', icon: RefreshCw },
    { value: 'demo', label: 'Demonstração', color: 'bg-pink-500', icon: Video },
    { value: 'proposal', label: 'Proposta', color: 'bg-indigo-500', icon: FileText }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Baixa', color: 'text-green-400' },
    { value: 'medium', label: 'Média', color: 'text-yellow-400' },
    { value: 'high', label: 'Alta', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgente', color: 'text-red-400' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Agendado', color: 'text-blue-400' },
    { value: 'confirmed', label: 'Confirmado', color: 'text-green-400' },
    { value: 'completed', label: 'Concluído', color: 'text-gray-400' },
    { value: 'cancelled', label: 'Cancelado', color: 'text-red-400' },
    { value: 'no-show', label: 'Não compareceu', color: 'text-orange-400' }
  ];

  const availableTags = [
    'cliente', 'prospect', 'demo', 'proposta', 'follow-up', 'urgente',
    'ia-vendas', 'tecnica', 'comercial', 'pos-demo', 'fechamento'
  ];

  const teamMembers = [
    { id: '1', name: 'João Santos', email: 'joao@meusuper.app' },
    { id: '2', name: 'Maria Santos', email: 'maria@meusuper.app' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@meusuper.app' }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeConfig = (type: string) => {
    return eventTypes.find(t => t.value === type) || eventTypes[0];
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleCreateEvent = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
      attendees: newEvent.attendees || [],
      tags: newEvent.tags || [],
      reminders: newEvent.reminders || [],
      followUp: newEvent.followUp || { required: false, status: 'pending' },
      createdBy: 'João Santos',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as CalendarEvent;

    setEvents(prev => [...prev, event]);
    setShowNewEventModal(false);
    setNewEvent({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      priority: 'medium',
      status: 'scheduled',
      attendees: [],
      location: '',
      meetingLink: '',
      notes: '',
      tags: [],
      reminders: [
        { id: '1', time: 15, type: 'email', sent: false },
        { id: '2', time: 5, type: 'push', sent: false }
      ],
      followUp: {
        required: false,
        status: 'pending'
      }
    });
    
    setIsLoading(false);
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    ));
    
    setIsLoading(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setSelectedEvent(null);
      setShowEventModal(false);
      
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date | null) => {
    e.preventDefault();
    if (draggedEvent && date) {
      const newDate = date.toISOString().split('T')[0];
      handleUpdateEvent(draggedEvent.id, { date: newDate });
      setDraggedEvent(null);
    }
  };

  const exportCalendar = () => {
    const data = {
      events: events,
      exportedAt: new Date().toISOString(),
      filters: filters
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendario-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importCalendar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.events && Array.isArray(data.events)) {
            setEvents(prev => [...prev, ...data.events]);
          }
        } catch (error) {
          alert('Erro ao importar arquivo. Verifique o formato.');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.attendees.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filters.types.length === 0 || filters.types.includes(event.type);
    const matchesPriority = filters.priorities.length === 0 || filters.priorities.includes(event.priority);
    const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(event.status);
    const matchesTags = filters.tags.length === 0 || filters.tags.some(tag => event.tags.includes(tag));
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesTags;
  });

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getHourSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const addAttendee = () => {
    const newAttendee = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      status: 'pending' as const
    };
    setNewEvent(prev => ({
      ...prev,
      attendees: [...(prev.attendees || []), newAttendee]
    }));
  };

  const removeAttendee = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      attendees: prev.attendees?.filter((_, i) => i !== index) || []
    }));
  };

  const addReminder = () => {
    const newReminder = {
      id: Date.now().toString(),
      time: 15,
      type: 'email' as const,
      sent: false
    };
    setNewEvent(prev => ({
      ...prev,
      reminders: [...(prev.reminders || []), newReminder]
    }));
  };

  const removeReminder = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      reminders: prev.reminders?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <DashboardLayout currentPage="agenda">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Agenda</h1>
            <p className="text-gray-300">Gerencie seus compromissos e follow-ups</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className="flex bg-white/10 rounded-lg p-1">
              {[
                { mode: 'day', icon: CalendarView, label: 'Dia' },
                { mode: 'week', icon: List, label: 'Semana' },
                { mode: 'month', icon: Grid3X3, label: 'Mês' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center space-x-2 ${
                    viewMode === mode
                      ? 'bg-[#FF7A00] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{label}</span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportCalendar}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:block">Exportar</span>
              </button>
              
              <label className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:block">Importar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importCalendar}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={() => setShowNewEventModal(true)}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Evento</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-white font-semibold mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar eventos, participantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Event Types */}
              <div>
                <label className="block text-white font-semibold mb-2">Tipos</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {eventTypes.map((type) => (
                    <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, types: [...prev.types, type.value] }));
                          } else {
                            setFilters(prev => ({ ...prev, types: prev.types.filter(t => t !== type.value) }));
                          }
                        }}
                        className="w-4 h-4 text-[#FF7A00] bg-white/10 border-white/20 rounded focus:ring-[#FF7A00] focus:ring-2"
                      />
                      <div className={`w-3 h-3 ${type.color} rounded-full`}></div>
                      <span className="text-white text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-white font-semibold mb-2">Status</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {statusOptions.map((status) => (
                    <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.statuses.includes(status.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, statuses: [...prev.statuses, status.value] }));
                          } else {
                            setFilters(prev => ({ ...prev, statuses: prev.statuses.filter(s => s !== status.value) }));
                          }
                        }}
                        className="w-4 h-4 text-[#FF7A00] bg-white/10 border-white/20 rounded focus:ring-[#FF7A00] focus:ring-2"
                      />
                      <span className={`text-sm ${status.color}`}>{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-gray-400 text-sm">
                {filteredEvents.length} eventos encontrados
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setFilters({
                      types: [],
                      priorities: [],
                      statuses: [],
                      attendees: [],
                      dateRange: { start: '', end: '' },
                      tags: []
                    });
                    setSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (viewMode === 'month') handlePreviousMonth();
                else if (viewMode === 'week') handlePreviousWeek();
                else handlePreviousDay();
              }}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white">
              {viewMode === 'month' && currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              {viewMode === 'week' && `Semana de ${getWeekDays()[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${getWeekDays()[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`}
              {viewMode === 'day' && formatDate(currentDate)}
            </h2>
            
            <button
              onClick={() => {
                if (viewMode === 'month') handleNextMonth();
                else if (viewMode === 'week') handleNextWeek();
                else handleNextDay();
              }}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Hoje
          </button>
        </div>

        {/* Calendar Views */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          {/* Month View */}
          {viewMode === 'month' && (
            <div className="p-6">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-gray-400 font-semibold py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const isToday = date && date.toDateString() === new Date().toDateString();
                  const isSelected = date && selectedDate === date.toISOString().split('T')[0];

                  return (
                    <div
                      key={index}
                      className={`min-h-24 p-2 border border-white/10 rounded-lg transition-all duration-300 cursor-pointer ${
                        date ? 'hover:bg-white/10' : ''
                      } ${isToday ? 'bg-[#FF7A00]/20 border-[#FF7A00]/50' : ''} ${
                        isSelected ? 'bg-white/20' : ''
                      }`}
                      onClick={() => {
                        if (date) {
                          setSelectedDate(date.toISOString().split('T')[0]);
                          setNewEvent(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
                        }
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, date)}
                    >
                      {date && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-[#FF7A00]' : 'text-white'
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event) => {
                              const typeConfig = getEventTypeConfig(event.type);
                              return (
                                <div
                                  key={event.id}
                                  draggable
                                  onDragStart={() => handleDragStart(event)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                    setShowEventModal(true);
                                  }}
                                  className={`${typeConfig.color} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate`}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-gray-400">
                                +{dayEvents.length - 3} mais
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Week View */}
          {viewMode === 'week' && (
            <div className="p-6">
              <div className="grid grid-cols-8 gap-1">
                {/* Time Column */}
                <div className="space-y-12">
                  <div className="h-12"></div> {/* Header spacer */}
                  {getHourSlots().filter((_, index) => index % 2 === 0).map((time) => (
                    <div key={time} className="text-xs text-gray-400 text-right pr-2">
                      {formatTime(time)}
                    </div>
                  ))}
                </div>

                {/* Days Columns */}
                {getWeekDays().map((date) => {
                  const dayEvents = getEventsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div key={date.toISOString()} className="space-y-1">
                      {/* Day Header */}
                      <div className={`text-center p-2 rounded-lg ${
                        isToday ? 'bg-[#FF7A00] text-white' : 'text-gray-300'
                      }`}>
                        <div className="text-xs">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                        <div className="text-lg font-bold">{date.getDate()}</div>
                      </div>

                      {/* Events */}
                      <div className="space-y-1 min-h-96">
                        {dayEvents.map((event) => {
                          const typeConfig = getEventTypeConfig(event.type);
                          return (
                            <div
                              key={event.id}
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowEventModal(true);
                              }}
                              className={`${typeConfig.color} text-white text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                            >
                              <div className="font-medium">{formatTime(event.startTime)}</div>
                              <div className="truncate">{event.title}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Time Slots */}
                <div className="space-y-4">
                  {getHourSlots().map((time) => {
                    const dayEvents = getEventsForDate(currentDate).filter(event => 
                      event.startTime <= time && event.endTime > time
                    );

                    return (
                      <div key={time} className="flex items-start space-x-4 min-h-12">
                        <div className="text-sm text-gray-400 w-16 text-right">
                          {formatTime(time)}
                        </div>
                        <div className="flex-1 border-l border-white/10 pl-4">
                          {dayEvents.map((event) => {
                            const typeConfig = getEventTypeConfig(event.type);
                            return (
                              <div
                                key={event.id}
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowEventModal(true);
                                }}
                                className={`${typeConfig.color} text-white p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity mb-2`}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs opacity-75">
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </div>
                                {event.attendees.length > 0 && (
                                  <div className="text-xs opacity-75 mt-1">
                                    {event.attendees.map(a => a.name).join(', ')}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Day Summary */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-4">Resumo do Dia</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Total de eventos</span>
                        <span className="text-white font-semibold">{getEventsForDate(currentDate).length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Reuniões</span>
                        <span className="text-white font-semibold">
                          {getEventsForDate(currentDate).filter(e => e.type === 'meeting').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Follow-ups</span>
                        <span className="text-white font-semibold">
                          {getEventsForDate(currentDate).filter(e => e.type === 'follow-up').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-4">Próximos Eventos</h3>
                    <div className="space-y-3">
                      {events
                        .filter(e => new Date(e.date) > currentDate)
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 3)
                        .map((event) => {
                          const typeConfig = getEventTypeConfig(event.type);
                          return (
                            <div key={event.id} className="flex items-center space-x-3">
                              <div className={`w-3 h-3 ${typeConfig.color} rounded-full`}></div>
                              <div className="flex-1">
                                <div className="text-white text-sm font-medium">{event.title}</div>
                                <div className="text-gray-400 text-xs">
                                  {new Date(event.date).toLocaleDateString('pt-BR')} às {formatTime(event.startTime)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Event Modal */}
        {showNewEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Novo Evento</h3>
                <button
                  onClick={() => setShowNewEventModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Título *</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      placeholder="Ex: Reunião com cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Descrição</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Descrição do evento..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Data *</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Início *</label>
                      <input
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Fim *</label>
                      <input
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Tipo *</label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        {eventTypes.map((type) => (
                          <option key={type.value} value={type.value} className="bg-[#2D0B55]">
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Prioridade</label>
                      <select
                        value={newEvent.priority}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        {priorityLevels.map((priority) => (
                          <option key={priority.value} value={priority.value} className="bg-[#2D0B55]">
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Local</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      placeholder="Ex: Sala de reuniões 1"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Link da Reunião</label>
                    <input
                      type="url"
                      value={newEvent.meetingLink}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, meetingLink: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                </div>

                {/* Attendees and Advanced Options */}
                <div className="space-y-4">
                  {/* Attendees */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white font-semibold">Participantes</label>
                      <button
                        onClick={addAttendee}
                        className="text-[#FF7A00] hover:text-[#FF9500] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {newEvent.attendees?.map((attendee, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={attendee.name}
                            onChange={(e) => {
                              const updatedAttendees = [...(newEvent.attendees || [])];
                              updatedAttendees[index] = { ...attendee, name: e.target.value };
                              setNewEvent(prev => ({ ...prev, attendees: updatedAttendees }));
                            }}
                            placeholder="Nome"
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          />
                          <input
                            type="email"
                            value={attendee.email}
                            onChange={(e) => {
                              const updatedAttendees = [...(newEvent.attendees || [])];
                              updatedAttendees[index] = { ...attendee, email: e.target.value };
                              setNewEvent(prev => ({ ...prev, attendees: updatedAttendees }));
                            }}
                            placeholder="Email"
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          />
                          <button
                            onClick={() => removeAttendee(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reminders */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white font-semibold">Lembretes</label>
                      <button
                        onClick={addReminder}
                        className="text-[#FF7A00] hover:text-[#FF9500] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {newEvent.reminders?.map((reminder, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={reminder.time}
                            onChange={(e) => {
                              const updatedReminders = [...(newEvent.reminders || [])];
                              updatedReminders[index] = { ...reminder, time: parseInt(e.target.value) };
                              setNewEvent(prev => ({ ...prev, reminders: updatedReminders }));
                            }}
                            className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          />
                          <span className="text-gray-300 text-sm">min antes</span>
                          <select
                            value={reminder.type}
                            onChange={(e) => {
                              const updatedReminders = [...(newEvent.reminders || [])];
                              updatedReminders[index] = { ...reminder, type: e.target.value as any };
                              setNewEvent(prev => ({ ...prev, reminders: updatedReminders }));
                            }}
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          >
                            <option value="email" className="bg-[#2D0B55]">Email</option>
                            <option value="push" className="bg-[#2D0B55]">Push</option>
                            <option value="sms" className="bg-[#2D0B55]">SMS</option>
                          </select>
                          <button
                            onClick={() => removeReminder(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Follow-up */}
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={newEvent.followUp?.required}
                        onChange={(e) => setNewEvent(prev => ({
                          ...prev,
                          followUp: { ...prev.followUp, required: e.target.checked, status: 'pending' }
                        }))}
                        className="w-4 h-4 text-[#FF7A00] bg-white/10 border-white/20 rounded focus:ring-[#FF7A00] focus:ring-2"
                      />
                      <span className="text-white font-semibold">Requer Follow-up</span>
                    </label>
                    {newEvent.followUp?.required && (
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={newEvent.followUp.dueDate || ''}
                          onChange={(e) => setNewEvent(prev => ({
                            ...prev,
                            followUp: { ...prev.followUp, dueDate: e.target.value, required: true, status: 'pending' }
                          }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        />
                        <textarea
                          value={newEvent.followUp.notes || ''}
                          onChange={(e) => setNewEvent(prev => ({
                            ...prev,
                            followUp: { ...prev.followUp, notes: e.target.value, required: true, status: 'pending' }
                          }))}
                          placeholder="Notas do follow-up..."
                          rows={2}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            const currentTags = newEvent.tags || [];
                            if (currentTags.includes(tag)) {
                              setNewEvent(prev => ({
                                ...prev,
                                tags: currentTags.filter(t => t !== tag)
                              }));
                            } else {
                              setNewEvent(prev => ({
                                ...prev,
                                tags: [...currentTags, tag]
                              }));
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            newEvent.tags?.includes(tag)
                              ? 'bg-[#FF7A00] text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Notas</label>
                    <textarea
                      value={newEvent.notes}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Notas adicionais..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNewEventModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime || isLoading}
                  className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    'Criar Evento'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${getEventTypeConfig(selectedEvent.type).color} rounded-full`}></div>
                  <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setNewEvent(selectedEvent);
                      setShowEventModal(false);
                      setShowNewEventModal(true);
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Data e Hora</label>
                    <div className="text-white">
                      {new Date(selectedEvent.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-white">
                      {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedEvent.status}
                        onChange={(e) => handleUpdateEvent(selectedEvent.id, { status: e.target.value as any })}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value} className="bg-[#2D0B55]">
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <label className="text-gray-400 text-sm">Descrição</label>
                    <div className="text-white">{selectedEvent.description}</div>
                  </div>
                )}

                {/* Location and Meeting Link */}
                {(selectedEvent.location || selectedEvent.meetingLink) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEvent.location && (
                      <div>
                        <label className="text-gray-400 text-sm">Local</label>
                        <div className="text-white flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      </div>
                    )}
                    {selectedEvent.meetingLink && (
                      <div>
                        <label className="text-gray-400 text-sm">Link da Reunião</label>
                        <div className="text-white">
                          <a
                            href={selectedEvent.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF7A00] hover:text-[#FF9500] transition-colors flex items-center space-x-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Abrir reunião</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Attendees */}
                {selectedEvent.attendees.length > 0 && (
                  <div>
                    <label className="text-gray-400 text-sm">Participantes</label>
                    <div className="space-y-2">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          {attendee.avatar ? (
                            <img
                              src={attendee.avatar}
                              alt={attendee.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-white font-medium">{attendee.name}</div>
                            <div className="text-gray-400 text-sm">{attendee.email}</div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            attendee.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            attendee.status === 'declined' ? 'bg-red-500/20 text-red-400' :
                            attendee.status === 'tentative' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {attendee.status === 'accepted' ? 'Confirmado' :
                             attendee.status === 'declined' ? 'Recusou' :
                             attendee.status === 'tentative' ? 'Talvez' : 'Pendente'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedEvent.tags.length > 0 && (
                  <div>
                    <label className="text-gray-400 text-sm">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
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

                {/* Follow-up */}
                {selectedEvent.followUp?.required && (
                  <div>
                    <label className="text-gray-400 text-sm">Follow-up</label>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white">Status do Follow-up</span>
                        <select
                          value={selectedEvent.followUp.status}
                          onChange={(e) => handleUpdateEvent(selectedEvent.id, {
                            followUp: { ...selectedEvent.followUp, status: e.target.value as any }
                          })}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        >
                          <option value="pending" className="bg-[#2D0B55]">Pendente</option>
                          <option value="completed" className="bg-[#2D0B55]">Concluído</option>
                          <option value="overdue" className="bg-[#2D0B55]">Atrasado</option>
                        </select>
                      </div>
                      {selectedEvent.followUp.dueDate && (
                        <div className="text-gray-300 text-sm">
                          Prazo: {new Date(selectedEvent.followUp.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      {selectedEvent.followUp.notes && (
                        <div className="text-gray-300 text-sm mt-2">
                          {selectedEvent.followUp.notes}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedEvent.notes && (
                  <div>
                    <label className="text-gray-400 text-sm">Notas</label>
                    <div className="text-white bg-white/5 rounded-lg p-4">
                      {selectedEvent.notes}
                    </div>
                  </div>
                )}

                {/* Reminders */}
                {selectedEvent.reminders.length > 0 && (
                  <div>
                    <label className="text-gray-400 text-sm">Lembretes</label>
                    <div className="space-y-2">
                      {selectedEvent.reminders.map((reminder, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-[#FF7A00]" />
                            <span className="text-white">
                              {reminder.time} minutos antes via {reminder.type}
                            </span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            reminder.sent ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {reminder.sent ? 'Enviado' : 'Pendente'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;