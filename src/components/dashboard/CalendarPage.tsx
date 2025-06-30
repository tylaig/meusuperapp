import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Users,
  MapPin,
  Bell,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Upload,
  Settings,
  Filter,
  Search,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  MoreVertical,
  X,
  Check,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Link,
  Target,
  RefreshCw,
  Star,
  Archive,
  Tag,
  User,
  Globe,
  Zap
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'demo' | 'follow-up' | 'personal' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  location?: string;
  meetingLink?: string;
  attendees: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'pending' | 'accepted' | 'declined' | 'tentative';
  }[];
  organizer: string;
  reminders: {
    id: string;
    time: number; // minutos antes
    type: 'email' | 'push' | 'sms';
    sent: boolean;
  }[];
  tags: string[];
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarView {
  type: 'month' | 'week' | 'day';
  date: Date;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<CalendarView>({ type: 'month', date: new Date() });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMiniCalendar, setShowMiniCalendar] = useState(true);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['meeting', 'call', 'demo', 'follow-up', 'personal', 'reminder']);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting' as CalendarEvent['type'],
    priority: 'medium' as CalendarEvent['priority'],
    location: '',
    meetingLink: '',
    attendees: [] as { name: string; email: string }[],
    tags: [] as string[],
    notes: '',
    reminders: [{ id: '1', time: 15, type: 'email' as const, sent: false }],
    isRecurring: false,
    recurringPattern: 'weekly'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    // Mock data para eventos
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Reunião de Vendas',
        description: 'Reunião semanal da equipe de vendas para revisar metas',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:30',
        type: 'meeting',
        priority: 'high',
        status: 'confirmed',
        location: 'Sala de Reuniões A',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        attendees: [
          {
            id: '1',
            name: 'João Santos',
            email: 'joao@empresa.com',
            avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
            status: 'accepted'
          },
          {
            id: '2',
            name: 'Maria Silva',
            email: 'maria@empresa.com',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
            status: 'pending'
          }
        ],
        organizer: 'Você',
        reminders: [
          { id: '1', time: 15, type: 'email', sent: false },
          { id: '2', time: 60, type: 'push', sent: true }
        ],
        tags: ['vendas', 'equipe'],
        notes: 'Revisar números do mês e definir estratégias',
        isRecurring: true,
        recurringPattern: 'weekly',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Demo para Cliente Premium',
        description: 'Demonstração completa da plataforma',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '15:00',
        type: 'demo',
        priority: 'urgent',
        status: 'scheduled',
        meetingLink: 'https://zoom.us/j/123456789',
        attendees: [
          {
            id: '3',
            name: 'Pedro Oliveira',
            email: 'pedro@cliente.com',
            status: 'accepted'
          }
        ],
        organizer: 'Maria Santos',
        reminders: [
          { id: '1', time: 30, type: 'email', sent: false }
        ],
        tags: ['demo', 'cliente-premium'],
        notes: 'Focar em funcionalidades de automação',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Call de Follow-up',
        description: 'Acompanhar proposta enviada',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '11:00',
        endTime: '11:30',
        type: 'call',
        priority: 'medium',
        status: 'scheduled',
        attendees: [
          {
            id: '4',
            name: 'Ana Costa',
            email: 'ana@prospect.com',
            status: 'pending'
          }
        ],
        organizer: 'Pedro Costa',
        reminders: [
          { id: '1', time: 15, type: 'push', sent: false }
        ],
        tags: ['follow-up', 'proposta'],
        notes: 'Verificar feedback da proposta',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setEvents(mockEvents);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500 border-blue-600';
      case 'call':
        return 'bg-green-500 border-green-600';
      case 'demo':
        return 'bg-purple-500 border-purple-600';
      case 'follow-up':
        return 'bg-orange-500 border-orange-600';
      case 'personal':
        return 'bg-pink-500 border-pink-600';
      case 'reminder':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-l-red-500';
      case 'high':
        return 'border-l-4 border-l-orange-500';
      case 'medium':
        return 'border-l-4 border-l-yellow-500';
      case 'low':
        return 'border-l-4 border-l-green-500';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-3 h-3 text-green-500" />;
      case 'cancelled':
        return <X className="w-3 h-3 text-red-500" />;
      case 'completed':
        return <Check className="w-3 h-3 text-blue-500" />;
      default:
        return <Clock className="w-3 h-3 text-yellow-500" />;
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(view.date);
    
    switch (view.type) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setView({ ...view, date: newDate });
  };

  const goToToday = () => {
    setView({ ...view, date: new Date() });
    setSelectedDate(new Date());
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      startDate: selectedDate.toISOString().split('T')[0],
      endDate: selectedDate.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      priority: 'medium',
      location: '',
      meetingLink: '',
      attendees: [],
      tags: [],
      notes: '',
      reminders: [{ id: '1', time: 15, type: 'email', sent: false }],
      isRecurring: false,
      recurringPattern: 'weekly'
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type,
      priority: event.priority,
      location: event.location || '',
      meetingLink: event.meetingLink || '',
      attendees: event.attendees.map(a => ({ name: a.name, email: a.email })),
      tags: event.tags,
      notes: event.notes || '',
      reminders: event.reminders,
      isRecurring: event.isRecurring || false,
      recurringPattern: event.recurringPattern || 'weekly'
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    const newEvent: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: eventForm.title,
      description: eventForm.description,
      startDate: eventForm.startDate,
      endDate: eventForm.endDate,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      type: eventForm.type,
      priority: eventForm.priority,
      status: editingEvent?.status || 'scheduled',
      location: eventForm.location,
      meetingLink: eventForm.meetingLink,
      attendees: eventForm.attendees.map((a, index) => ({
        id: (index + 1).toString(),
        name: a.name,
        email: a.email,
        status: 'pending' as const
      })),
      organizer: 'Você',
      reminders: eventForm.reminders,
      tags: eventForm.tags,
      notes: eventForm.notes,
      isRecurring: eventForm.isRecurring,
      recurringPattern: eventForm.recurringPattern,
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? newEvent : e));
    } else {
      setEvents(prev => [...prev, newEvent]);
    }

    setShowEventModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setShowEventDetails(false);
    }
  };

  const exportCalendar = () => {
    const data = {
      events: events,
      exportedAt: new Date().toISOString(),
      view: view
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

  const generateCalendarDays = () => {
    const year = view.date.getFullYear();
    const month = view.date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.startDate === dateString && 
      selectedEventTypes.includes(event.type) &&
      (filterStatus === 'all' || event.status === filterStatus) &&
      (searchTerm === '' || 
       event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    
    switch (view.type) {
      case 'month':
        return view.date.toLocaleDateString('pt-BR', options);
      case 'week':
        const weekStart = new Date(view.date);
        weekStart.setDate(view.date.getDate() - view.date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
      case 'day':
        return view.date.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      default:
        return '';
    }
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  return (
    <DashboardLayout currentPage="calendar">
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-[#2D0B55] p-4' : ''}`}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Calendário</h1>
              <p className="text-gray-300">Visualize e gerencie seus eventos e compromissos</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/agenda'}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Target className="w-4 h-4" />
                <span>Ver Agenda</span>
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{isFullscreen ? 'Sair' : 'Tela Cheia'}</span>
              </button>
              
              <button
                onClick={handleCreateEvent}
                className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Evento</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            {showMiniCalendar && (
              <div className="lg:col-span-1 space-y-6">
                {/* Mini Calendar */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">
                      {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setShowMiniCalendar(false)}
                      className="text-gray-400 hover:text-white transition-colors lg:hidden"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                      <div key={day} className="py-1">{day}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.slice(0, 35).map((day, index) => {
                      const dayString = day.toISOString().split('T')[0];
                      const hasEvents = getEventsForDate(day).length > 0;
                      const isToday = dayString === todayString;
                      const isCurrentMonth = day.getMonth() === view.date.getMonth();
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedDate(day);
                            setView({ type: 'day', date: day });
                          }}
                          className={`w-8 h-8 text-xs rounded-lg transition-all duration-200 ${
                            isToday 
                              ? 'bg-[#FF7A00] text-white font-bold' 
                              : isCurrentMonth
                                ? hasEvents
                                  ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                                  : 'text-gray-300 hover:bg-white/10'
                                : 'text-gray-600 hover:bg-white/5'
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event Types Filter */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <h3 className="text-white font-semibold mb-4">Tipos de Evento</h3>
                  <div className="space-y-2">
                    {[
                      { type: 'meeting', label: 'Reuniões', icon: Users },
                      { type: 'call', label: 'Ligações', icon: Phone },
                      { type: 'demo', label: 'Demonstrações', icon: Eye },
                      { type: 'follow-up', label: 'Follow-ups', icon: RefreshCw },
                      { type: 'personal', label: 'Pessoal', icon: User },
                      { type: 'reminder', label: 'Lembretes', icon: Bell }
                    ].map(({ type, label, icon: Icon }) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEventTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEventTypes(prev => [...prev, type]);
                            } else {
                              setSelectedEventTypes(prev => prev.filter(t => t !== type));
                            }
                          }}
                          className="w-4 h-4 text-[#FF7A00] bg-white/10 border-white/20 rounded focus:ring-[#FF7A00] focus:ring-2"
                        />
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <h3 className="text-white font-semibold mb-4">Ações Rápidas</h3>
                  <div className="space-y-2">
                    <button
                      onClick={goToToday}
                      className="w-full text-left text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                    >
                      Ir para Hoje
                    </button>
                    <button
                      onClick={exportCalendar}
                      className="w-full text-left text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                    >
                      Exportar Calendário
                    </button>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-full text-left text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                    >
                      Filtros Avançados
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Calendar */}
            <div className={`${showMiniCalendar ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                
                {/* Calendar Header */}
                <div className="p-4 border-b border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigateDate('prev')}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-white min-w-[200px] text-center">
                          {formatDateHeader()}
                        </h2>
                        <button
                          onClick={() => navigateDate('next')}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <button
                        onClick={goToToday}
                        className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300"
                      >
                        Hoje
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar eventos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 w-48"
                        />
                      </div>

                      {/* View Selector */}
                      <div className="flex bg-white/10 rounded-lg p-1">
                        {[
                          { key: 'month', label: 'Mês' },
                          { key: 'week', label: 'Semana' },
                          { key: 'day', label: 'Dia' }
                        ].map((viewType) => (
                          <button
                            key={viewType.key}
                            onClick={() => setView({ ...view, type: viewType.key as any })}
                            className={`px-3 py-1 rounded-md transition-all duration-300 text-sm ${
                              view.type === viewType.key
                                ? 'bg-[#FF7A00] text-white'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {viewType.label}
                          </button>
                        ))}
                      </div>

                      {!showMiniCalendar && (
                        <button
                          onClick={() => setShowMiniCalendar(true)}
                          className="text-gray-400 hover:text-white transition-colors p-2 lg:hidden"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <div className="flex items-center space-x-4 pt-4 border-t border-white/20">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="all" className="bg-[#2D0B55]">Todos os status</option>
                        <option value="scheduled" className="bg-[#2D0B55]">Agendado</option>
                        <option value="confirmed" className="bg-[#2D0B55]">Confirmado</option>
                        <option value="cancelled" className="bg-[#2D0B55]">Cancelado</option>
                        <option value="completed" className="bg-[#2D0B55]">Concluído</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="p-4">
                  {view.type === 'month' && (
                    <div className="space-y-4">
                      {/* Days Header */}
                      <div className="grid grid-cols-7 gap-2">
                        {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(day => (
                          <div key={day} className="text-center text-gray-400 font-semibold py-2 text-sm">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, index) => {
                          const dayString = day.toISOString().split('T')[0];
                          const dayEvents = getEventsForDate(day);
                          const isToday = dayString === todayString;
                          const isCurrentMonth = day.getMonth() === view.date.getMonth();
                          const isSelected = dayString === selectedDate.toISOString().split('T')[0];

                          return (
                            <div
                              key={index}
                              onClick={() => setSelectedDate(day)}
                              className={`min-h-[120px] p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                isToday 
                                  ? 'border-[#FF7A00] bg-[#FF7A00]/10' 
                                  : isSelected
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : isCurrentMonth
                                      ? 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                                      : 'border-white/10 bg-white/5 opacity-50'
                              }`}
                            >
                              <div className={`text-sm font-semibold mb-2 ${
                                isToday 
                                  ? 'text-[#FF7A00]' 
                                  : isCurrentMonth 
                                    ? 'text-white' 
                                    : 'text-gray-500'
                              }`}>
                                {day.getDate()}
                              </div>
                              
                              <div className="space-y-1">
                                {dayEvents.slice(0, 3).map((event) => (
                                  <div
                                    key={event.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEvent(event);
                                      setShowEventDetails(true);
                                    }}
                                    className={`text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.type)} ${getPriorityColor(event.priority)}`}
                                  >
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(event.status)}
                                      <span className="truncate">{event.startTime} {event.title}</span>
                                    </div>
                                  </div>
                                ))}
                                {dayEvents.length > 3 && (
                                  <div className="text-xs text-gray-400 text-center">
                                    +{dayEvents.length - 3} mais
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {view.type === 'week' && (
                    <div className="space-y-4">
                      {/* Week Header */}
                      <div className="grid grid-cols-8 gap-2">
                        <div className="text-center text-gray-400 font-semibold py-2"></div>
                        {Array.from({ length: 7 }, (_, i) => {
                          const date = new Date(view.date);
                          date.setDate(date.getDate() - date.getDay() + i);
                          const isToday = date.toISOString().split('T')[0] === todayString;
                          
                          return (
                            <div key={i} className={`text-center py-2 ${isToday ? 'text-[#FF7A00] font-bold' : 'text-gray-400'}`}>
                              <div className="text-sm">{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i]}</div>
                              <div className="text-lg">{date.getDate()}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Week Grid */}
                      <div className="grid grid-cols-8 gap-2">
                        {/* Time Column */}
                        <div className="space-y-12">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className="text-xs text-gray-400 text-right pr-2">
                              {String(8 + i).padStart(2, '0')}:00
                            </div>
                          ))}
                        </div>

                        {/* Days Columns */}
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const date = new Date(view.date);
                          date.setDate(date.getDate() - date.getDay() + dayIndex);
                          const dayEvents = getEventsForDate(date);

                          return (
                            <div key={dayIndex} className="space-y-1 min-h-[600px] border-l border-white/10 pl-2">
                              {dayEvents.map((event) => {
                                const startHour = parseInt(event.startTime.split(':')[0]);
                                const topPosition = (startHour - 8) * 48; // 48px per hour
                                
                                return (
                                  <div
                                    key={event.id}
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setShowEventDetails(true);
                                    }}
                                    className={`absolute text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.type)} ${getPriorityColor(event.priority)} w-24`}
                                    style={{ top: `${topPosition}px` }}
                                  >
                                    <div className="flex items-center space-x-1 mb-1">
                                      {getStatusIcon(event.status)}
                                      <span className="font-semibold">{event.startTime}</span>
                                    </div>
                                    <div className="truncate">{event.title}</div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {view.type === 'day' && (
                    <div className="space-y-4">
                      {/* Day Header */}
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white">
                          {view.date.toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </h3>
                      </div>

                      {/* Day Events */}
                      <div className="space-y-3">
                        {getEventsForDate(view.date).length === 0 ? (
                          <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">Nenhum evento hoje</h3>
                            <p className="text-gray-400 mb-6">Que tal criar um novo evento?</p>
                            <button
                              onClick={handleCreateEvent}
                              className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
                            >
                              Criar Evento
                            </button>
                          </div>
                        ) : (
                          getEventsForDate(view.date)
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((event) => (
                              <div
                                key={event.id}
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowEventDetails(true);
                                }}
                                className={`bg-white/5 rounded-xl p-4 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-pointer ${getPriorityColor(event.priority)}`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getEventColor(event.type)}`}>
                                      {event.type === 'meeting' && <Users className="w-6 h-6 text-white" />}
                                      {event.type === 'call' && <Phone className="w-6 h-6 text-white" />}
                                      {event.type === 'demo' && <Eye className="w-6 h-6 text-white" />}
                                      {event.type === 'follow-up' && <RefreshCw className="w-6 h-6 text-white" />}
                                      {event.type === 'personal' && <User className="w-6 h-6 text-white" />}
                                      {event.type === 'reminder' && <Bell className="w-6 h-6 text-white" />}
                                    </div>

                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                                        {getStatusIcon(event.status)}
                                      </div>
                                      
                                      <div className="flex items-center space-x-4 text-gray-300 text-sm mb-2">
                                        <div className="flex items-center space-x-1">
                                          <Clock className="w-4 h-4" />
                                          <span>{event.startTime} - {event.endTime}</span>
                                        </div>
                                        
                                        {event.location && (
                                          <div className="flex items-center space-x-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.location}</span>
                                          </div>
                                        )}
                                        
                                        {event.attendees.length > 0 && (
                                          <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{event.attendees.length} participantes</span>
                                          </div>
                                        )}
                                      </div>

                                      {event.description && (
                                        <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                                      )}

                                      {event.tags.length > 0 && (
                                        <div className="flex items-center space-x-2">
                                          <Tag className="w-4 h-4 text-gray-400" />
                                          <div className="flex flex-wrap gap-1">
                                            {event.tags.map((tag, index) => (
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
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    {event.meetingLink && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(event.meetingLink, '_blank');
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center space-x-1"
                                      >
                                        <Video className="w-3 h-3" />
                                        <span>Entrar</span>
                                      </button>
                                    )}
                                    
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditEvent(event);
                                      }}
                                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
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
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    placeholder="Ex: Reunião de vendas"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-2">Descrição</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Descreva o evento..."
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Data Início *</label>
                    <input
                      type="date"
                      value={eventForm.startDate}
                      onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Data Fim</label>
                    <input
                      type="date"
                      value={eventForm.endDate}
                      onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Hora Início *</label>
                    <input
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Hora Fim *</label>
                    <input
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Tipo</label>
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="meeting" className="bg-[#2D0B55]">Reunião</option>
                      <option value="call" className="bg-[#2D0B55]">Ligação</option>
                      <option value="demo" className="bg-[#2D0B55]">Demonstração</option>
                      <option value="follow-up" className="bg-[#2D0B55]">Follow-up</option>
                      <option value="personal" className="bg-[#2D0B55]">Pessoal</option>
                      <option value="reminder" className="bg-[#2D0B55]">Lembrete</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Prioridade</label>
                    <select
                      value={eventForm.priority}
                      onChange={(e) => setEventForm(prev => ({ ...prev, priority: e.target.value as CalendarEvent['priority'] }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    >
                      <option value="low" className="bg-[#2D0B55]">Baixa</option>
                      <option value="medium" className="bg-[#2D0B55]">Média</option>
                      <option value="high" className="bg-[#2D0B55]">Alta</option>
                      <option value="urgent" className="bg-[#2D0B55]">Urgente</option>
                    </select>
                  </div>
                </div>

                {/* Location and Meeting Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Local</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      placeholder="Ex: Sala de reuniões A"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Link da Reunião</label>
                    <input
                      type="url"
                      value={eventForm.meetingLink}
                      onChange={(e) => setEventForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-white font-semibold mb-2">Observações</label>
                  <textarea
                    value={eventForm.notes}
                    onChange={(e) => setEventForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Observações adicionais..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEvent}
                    disabled={!eventForm.title.trim()}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingEvent ? 'Salvar Alterações' : 'Criar Evento'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {showEventDetails && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Detalhes do Evento</h3>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">{selectedEvent.title}</h4>
                  {selectedEvent.description && (
                    <p className="text-gray-300">{selectedEvent.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Data:</span>
                    <div className="text-white">{new Date(selectedEvent.startDate).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Horário:</span>
                    <div className="text-white">{selectedEvent.startTime} - {selectedEvent.endTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Tipo:</span>
                    <div className="text-white capitalize">{selectedEvent.type}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(selectedEvent.status)}
                      <span className="text-white capitalize">{selectedEvent.status}</span>
                    </div>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div>
                    <span className="text-gray-400 text-sm">Local:</span>
                    <div className="text-white">{selectedEvent.location}</div>
                  </div>
                )}

                {selectedEvent.attendees.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Participantes:</span>
                    <div className="space-y-2 mt-2">
                      {selectedEvent.attendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center space-x-2">
                          {attendee.avatar ? (
                            <img src={attendee.avatar} alt={attendee.name} className="w-6 h-6 rounded-full" />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                          <span className="text-white">{attendee.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            attendee.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            attendee.status === 'declined' ? 'bg-red-500/20 text-red-400' :
                            attendee.status === 'tentative' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {attendee.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.notes && (
                  <div>
                    <span className="text-gray-400 text-sm">Observações:</span>
                    <div className="text-white bg-white/5 rounded-lg p-3 mt-2">{selectedEvent.notes}</div>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  {selectedEvent.meetingLink && (
                    <button
                      onClick={() => window.open(selectedEvent.meetingLink, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Entrar na Reunião</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowEventDetails(false);
                      handleEditEvent(selectedEvent);
                    }}
                    className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default CalendarPage;