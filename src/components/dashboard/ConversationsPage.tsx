import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Instagram, 
  Send,
  MoreVertical,
  Clock,
  CheckCheck,
  Bot,
  User,
  Paperclip,
  Mic,
  MicOff,
  Image,
  FileText,
  Download,
  Edit3,
  Trash2,
  ArrowLeft,
  Star,
  Archive,
  Tag,
  Zap,
  AlertCircle,
  CheckCircle,
  Circle,
  Calendar,
  Users,
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Copy,
  Reply,
  Forward,
  Smile,
  X,
  Plus,
  ChevronDown,
  Headphones,
  UserCheck,
  UserX,
  MessageCircle,
  Eye,
  EyeOff,
  Keyboard,
  Maximize2,
  Minimize2,
  Pin,
  PinOff,
  SortAsc,
  SortDesc,
  Loader2
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { Message } from '../../types';

interface Conversation {
  id: string;
  contact: {
    name: string;
    avatar: string;
    phone?: string;
    email?: string;
    status: 'online' | 'offline' | 'away';
  };
  channel: 'whatsapp' | 'instagram' | 'email' | 'sms' | 'telegram';
  lastMessage: {
    content: string;
    timestamp: string;
    isBot: boolean;
    sender: string;
  };
  unread: number;
  status: 'active' | 'resolved' | 'pending' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  assignedTo?: string;
  isTyping?: boolean;
  isPinned?: boolean;
  metadata?: {
    source?: string;
    campaign?: string;
    value?: number;
  };
}

interface QuickReply {
  id: string;
  text: string;
  category: string;
}

interface AttachmentPreview {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  size: number;
  url: string;
}

const ConversationsPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const conversations: Conversation[] = [
    {
      id: '1',
      contact: {
        name: 'Maria Silva',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        phone: '+55 11 99999-0001',
        email: 'maria@empresa.com',
        status: 'online'
      },
      channel: 'whatsapp',
      lastMessage: {
        content: 'Gostaria de saber mais sobre os planos Pro e Enterprise. Qual seria o melhor para uma empresa de 50 funcionários?',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        isBot: false,
        sender: 'Maria Silva'
      },
      unread: 3,
      status: 'active',
      priority: 'high',
      tags: ['lead-quente', 'planos'],
      assignedTo: 'João Santos',
      isTyping: false,
      isPinned: true,
      metadata: {
        source: 'Website',
        campaign: 'Black Friday',
        value: 2500
      }
    },
    {
      id: '2',
      contact: {
        name: 'João Santos',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        phone: '+55 11 99999-0002',
        status: 'away'
      },
      channel: 'instagram',
      lastMessage: {
        content: 'Qual o preço do produto? Vocês fazem desconto para compra em quantidade?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isBot: false,
        sender: 'João Santos'
      },
      unread: 1,
      status: 'pending',
      priority: 'medium',
      tags: ['duvida-preco'],
      isTyping: true,
      isPinned: false
    },
    {
      id: '3',
      contact: {
        name: 'Ana Costa',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        email: 'ana@empresa.com',
        status: 'offline'
      },
      channel: 'email',
      lastMessage: {
        content: 'Obrigada pelo atendimento! Ficou tudo muito claro. Vou conversar com a equipe e retorno em breve.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isBot: false,
        sender: 'Ana Costa'
      },
      unread: 0,
      status: 'resolved',
      priority: 'low',
      tags: ['satisfeito', 'resolvido'],
      isPinned: false
    },
    {
      id: '4',
      contact: {
        name: 'Pedro Oliveira',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        phone: '+55 11 99999-0004',
        status: 'online'
      },
      channel: 'telegram',
      lastMessage: {
        content: 'Preciso de ajuda urgente! O sistema parou de funcionar e tenho uma apresentação importante hoje.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        isBot: false,
        sender: 'Pedro Oliveira'
      },
      unread: 5,
      status: 'active',
      priority: 'urgent',
      tags: ['urgente', 'suporte'],
      assignedTo: 'Maria Santos',
      isPinned: true
    },
    {
      id: '5',
      contact: {
        name: 'Carla Mendes',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        phone: '+55 11 99999-0005',
        status: 'online'
      },
      channel: 'whatsapp',
      lastMessage: {
        content: 'Perfeito! Vou fazer o pagamento agora mesmo. Quando posso esperar o acesso?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isBot: true,
        sender: 'IA Assistant'
      },
      unread: 0,
      status: 'active',
      priority: 'medium',
      tags: ['fechamento', 'pagamento'],
      assignedTo: 'Pedro Costa',
      isPinned: false
    },
    {
      id: '6',
      contact: {
        name: 'Roberto Silva',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        phone: '+55 11 99999-0006',
        status: 'offline'
      },
      channel: 'sms',
      lastMessage: {
        content: 'Recebi o link por email. Vou acessar e testar a plataforma.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isBot: false,
        sender: 'Roberto Silva'
      },
      unread: 0,
      status: 'pending',
      priority: 'low',
      tags: ['teste', 'trial'],
      isPinned: false
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      channel: 'whatsapp',
      content: 'Olá! Gostaria de saber mais sobre os seus serviços.',
      sender: 'Maria Silva',
      timestamp: '14:30',
      status: 'read',
      isBot: false
    },
    {
      id: '2',
      channel: 'whatsapp',
      content: 'Olá Maria! Fico feliz em ajudar. Somos especialistas em IA para vendas 24/7. Qual é o seu principal desafio hoje?',
      sender: 'IA Assistant',
      timestamp: '14:31',
      status: 'read',
      isBot: true
    },
    {
      id: '3',
      channel: 'whatsapp',
      content: 'Perco muitos leads fora do horário comercial. Vocês podem ajudar com isso?',
      sender: 'Maria Silva',
      timestamp: '14:32',
      status: 'read',
      isBot: false
    },
    {
      id: '4',
      channel: 'whatsapp',
      content: 'Perfeito! Esse é exatamente nosso foco. Nossa IA trabalha 24/7 e recupera em média 67% dos leads perdidos. Gostaria de ver uma demonstração?',
      sender: 'IA Assistant',
      timestamp: '14:32',
      status: 'read',
      isBot: true
    },
    {
      id: '5',
      channel: 'whatsapp',
      content: 'Sim, tenho interesse! Como funciona?',
      sender: 'Maria Silva',
      timestamp: '14:35',
      status: 'read',
      isBot: false
    }
  ];

  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Obrigado pelo contato! Como posso ajudar?', category: 'Saudação' },
    { id: '2', text: 'Vou transferir você para um especialista.', category: 'Transferência' },
    { id: '3', text: 'Nossos planos começam em R$ 497/mês.', category: 'Preços' },
    { id: '4', text: 'Você pode agendar uma demonstração gratuita.', category: 'Demonstração' },
    { id: '5', text: 'Precisa de mais alguma informação?', category: 'Encerramento' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
          case 'Enter':
            e.preventDefault();
            handleSendMessage();
            break;
          case '/':
            e.preventDefault();
            setShowQuickReplies(true);
            break;
          case 'e':
            e.preventDefault();
            setShowEmojiPicker(true);
            break;
          case 'f':
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
            break;
        }
      }
      if (e.key === 'Escape') {
        setShowQuickReplies(false);
        setShowEmojiPicker(false);
        setShowKeyboardShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'sms':
        return <Phone className="w-4 h-4 text-purple-500" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-blue-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-blue-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
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

  const getContactStatus = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || attachmentPreviews.length > 0) {
      console.log('Sending message:', newMessage, attachmentPreviews);
      setNewMessage('');
      setAttachmentPreviews([]);
      setShowQuickReplies(false);
      setShowEmojiPicker(false);
      scrollToBottom();
      
      if (isSoundEnabled) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const preview: AttachmentPreview = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('audio/') ? 'audio' :
                file.type.startsWith('video/') ? 'video' : 'document',
          size: file.size,
          url: URL.createObjectURL(file)
        };
        setAttachmentPreviews(prev => [...prev, preview]);
      });
    }
    setShowAttachments(false);
  };

  const removeAttachment = (id: string) => {
    setAttachmentPreviews(prev => prev.filter(p => p.id !== id));
  };

  const handleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  const handleQuickReply = (text: string) => {
    setNewMessage(text);
    setShowQuickReplies(false);
    messageInputRef.current?.focus();
  };

  const handleArchiveConversation = (conversationId: string) => {
    console.log('Archiving conversation:', conversationId);
  };

  const handlePinConversation = (conversationId: string) => {
    console.log('Pinning conversation:', conversationId);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const truncateMessage = (message: string, maxLength: number = 60) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = filterChannel === 'all' || conv.channel === filterChannel;
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const messageDate = new Date(conv.lastMessage.timestamp);
      const now = new Date();
      const diffHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
      
      switch (filterDate) {
        case 'today':
          matchesDate = diffHours <= 24;
          break;
        case 'week':
          matchesDate = diffHours <= 168;
          break;
        case 'month':
          matchesDate = diffHours <= 720;
          break;
      }
    }
    
    return matchesSearch && matchesChannel && matchesStatus && matchesPriority && matchesDate;
  });

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    // Pinned conversations always come first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    let comparison = 0;
    
    switch (sortBy) {
      case 'recent':
        comparison = new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      case 'unread':
        comparison = b.unread - a.unread;
        break;
      case 'name':
        comparison = a.contact.name.localeCompare(b.contact.name);
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'desc' ? comparison : -comparison;
  });

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <DashboardLayout currentPage="conversations">
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-[#2D0B55]' : ''}`}>
        <div className={`${isFullscreen ? 'h-screen' : 'h-[calc(100vh-8rem)]'} flex bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden`}>
          
          {/* Conversations Sidebar - Optimized Width */}
          <div className="w-96 border-r border-white/20 flex flex-col bg-white/5">
            
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Conversas
                  </h2>
                  {totalUnread > 0 && (
                    <div className="bg-[#FF7A00] text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`text-gray-400 hover:text-white transition-colors p-2 rounded-lg ${showFilters ? 'bg-[#FF7A00] text-white' : 'hover:bg-white/10'}`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* Enhanced Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Buscar conversas... (Ctrl+K)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Filters */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    filterStatus === 'active' 
                      ? 'bg-[#FF7A00] text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Ativas
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    filterStatus === 'pending' 
                      ? 'bg-[#FF7A00] text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Pendentes
                </button>
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    filterStatus === 'all' 
                      ? 'bg-[#FF7A00] text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Todas
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={filterChannel}
                      onChange={(e) => setFilterChannel(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF7A00] focus:outline-none"
                    >
                      <option value="all" className="bg-[#2D0B55]">Todos canais</option>
                      <option value="whatsapp" className="bg-[#2D0B55]">WhatsApp</option>
                      <option value="instagram" className="bg-[#2D0B55]">Instagram</option>
                      <option value="email" className="bg-[#2D0B55]">Email</option>
                      <option value="sms" className="bg-[#2D0B55]">SMS</option>
                      <option value="telegram" className="bg-[#2D0B55]">Telegram</option>
                    </select>
                    
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF7A00] focus:outline-none"
                    >
                      <option value="all" className="bg-[#2D0B55]">Prioridade</option>
                      <option value="urgent" className="bg-[#2D0B55]">Urgente</option>
                      <option value="high" className="bg-[#2D0B55]">Alta</option>
                      <option value="medium" className="bg-[#2D0B55]">Média</option>
                      <option value="low" className="bg-[#2D0B55]">Baixa</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF7A00] focus:outline-none flex-1 mr-2"
                    >
                      <option value="recent" className="bg-[#2D0B55]">Mais recente</option>
                      <option value="priority" className="bg-[#2D0B55]">Prioridade</option>
                      <option value="unread" className="bg-[#2D0B55]">Não lidas</option>
                      <option value="name" className="bg-[#2D0B55]">Nome</option>
                    </select>
                    
                    <button
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                      className="bg-white/10 border border-white/20 rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
                    >
                      {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 text-[#FF7A00] animate-spin" />
                </div>
              ) : sortedConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">Nenhuma conversa encontrada</h3>
                  <p className="text-gray-400 text-sm">
                    {searchTerm ? 'Tente ajustar os filtros de busca' : 'Suas conversas aparecerão aqui'}
                  </p>
                </div>
              ) : (
                sortedConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-200 hover:bg-white/5 relative group ${
                      selectedConversation === conversation.id ? 'bg-white/10 border-l-4 border-l-[#FF7A00]' : ''
                    }`}
                  >
                    {/* Pin indicator */}
                    {conversation.isPinned && (
                      <div className="absolute top-2 right-2">
                        <Pin className="w-3 h-3 text-[#FF7A00]" />
                      </div>
                    )}

                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={conversation.contact.avatar}
                          alt={conversation.contact.name}
                          className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getContactStatus(conversation.contact.status)} rounded-full border-2 border-[#2D0B55]`}></div>
                        {conversation.isTyping && (
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#FF7A00] rounded-full flex items-center justify-center">
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-semibold truncate text-sm">{conversation.contact.name}</h3>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(conversation.status)}`}></div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {getChannelIcon(conversation.channel)}
                            <span className="text-gray-400 text-xs">{formatTime(conversation.lastMessage.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {conversation.lastMessage.isBot && <Bot className="w-3 h-3 inline mr-1 text-[#FF7A00]" />}
                              <span className="line-clamp-2">{truncateMessage(conversation.lastMessage.content, 80)}</span>
                            </p>
                          </div>
                          {conversation.unread > 0 && (
                            <div className="bg-[#FF7A00] text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0">
                              {conversation.unread > 99 ? '99+' : conversation.unread}
                            </div>
                          )}
                        </div>

                        {/* Priority and Tags */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(conversation.priority)}`}>
                              {conversation.priority.toUpperCase()}
                            </span>
                            {conversation.assignedTo && (
                              <div className="flex items-center space-x-1">
                                <UserCheck className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-400 text-xs truncate max-w-20">{conversation.assignedTo}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePinConversation(conversation.id);
                              }}
                              className="text-gray-400 hover:text-[#FF7A00] p-1 rounded transition-colors"
                            >
                              {conversation.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchiveConversation(conversation.id);
                              }}
                              className="text-gray-400 hover:text-[#FF7A00] p-1 rounded transition-colors"
                            >
                              <Archive className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Tags */}
                        {conversation.tags.length > 0 && (
                          <div className="flex items-center space-x-1 mt-2">
                            {conversation.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {conversation.tags.length > 2 && (
                              <span className="text-gray-400 text-xs">+{conversation.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area - Expanded Width */}
          <div className="flex-1 flex flex-col">
            {selectedConversation && currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-white/20 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={currentConversation.contact.avatar}
                          alt={currentConversation.contact.name}
                          className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getContactStatus(currentConversation.contact.status)} rounded-full border-2 border-[#2D0B55]`}></div>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{currentConversation.contact.name}</h3>
                        <div className="flex items-center space-x-3">
                          {getChannelIcon(currentConversation.channel)}
                          <span className="text-gray-400 text-sm">
                            {currentConversation.isTyping ? 'Digitando...' : 
                             currentConversation.contact.status === 'online' ? 'Online' :
                             currentConversation.contact.status === 'away' ? 'Ausente' : 'Offline'}
                          </span>
                          {currentConversation.metadata?.value && (
                            <span className="text-[#FF7A00] text-sm font-semibold">
                              R$ {currentConversation.metadata.value.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Priority Selector */}
                      <select
                        value={currentConversation.priority}
                        onChange={(e) => console.log('Changing priority to:', e.target.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold border-0 ${getPriorityColor(currentConversation.priority)}`}
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>

                      {/* Status Selector */}
                      <select
                        value={currentConversation.status}
                        onChange={(e) => console.log('Changing status to:', e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF7A00] focus:outline-none"
                      >
                        <option value="active" className="bg-[#2D0B55]">Ativo</option>
                        <option value="pending" className="bg-[#2D0B55]">Pendente</option>
                        <option value="resolved" className="bg-[#2D0B55]">Resolvido</option>
                        <option value="archived" className="bg-[#2D0B55]">Arquivado</option>
                      </select>

                      <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {currentConversation.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-4">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {currentConversation.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} group`}
                    >
                      <div className={`max-w-lg relative ${
                        message.isBot
                          ? 'bg-white/10 text-white'
                          : 'bg-[#FF7A00] text-white'
                      } px-4 py-3 rounded-2xl ${
                        message.isBot ? 'rounded-bl-sm' : 'rounded-br-sm'
                      } shadow-lg`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {message.isBot ? (
                            <Bot className="w-4 h-4 text-[#FF7A00]" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span className="text-xs opacity-75 font-medium">{message.sender}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-75">{message.timestamp}</span>
                          <div className="flex items-center space-x-1">
                            {!message.isBot && (
                              <CheckCheck className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                        </div>

                        {/* Message Actions */}
                        <div className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md rounded-lg p-1 flex space-x-1">
                          <button
                            onClick={() => navigator.clipboard.writeText(message.content)}
                            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button className="text-gray-400 hover:text-white p-1 rounded transition-colors">
                            <Reply className="w-3 h-3" />
                          </button>
                          {!message.isBot && (
                            <button className="text-red-400 hover:text-red-300 p-1 rounded transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Attachment Previews */}
                {attachmentPreviews.length > 0 && (
                  <div className="px-6 py-3 border-t border-white/20 bg-white/5">
                    <div className="flex flex-wrap gap-3">
                      {attachmentPreviews.map((attachment) => (
                        <div key={attachment.id} className="relative bg-white/10 rounded-lg p-3 flex items-center space-x-3">
                          {attachment.type === 'image' ? (
                            <img src={attachment.url} alt={attachment.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-[#FF7A00] rounded flex items-center justify-center">
                              {attachment.type === 'audio' ? <Volume2 className="w-5 h-5 text-white" /> :
                               attachment.type === 'video' ? <Eye className="w-5 h-5 text-white" /> :
                               <FileText className="w-5 h-5 text-white" />}
                            </div>
                          )}
                          <div>
                            <div className="text-white text-sm font-medium truncate max-w-32">{attachment.name}</div>
                            <div className="text-gray-400 text-xs">{(attachment.size / 1024).toFixed(1)} KB</div>
                          </div>
                          <button
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Replies */}
                {showQuickReplies && (
                  <div className="px-6 py-3 border-t border-white/20 bg-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white text-sm font-medium">Respostas Rápidas</span>
                      <button
                        onClick={() => setShowQuickReplies(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply.id}
                          onClick={() => handleQuickReply(reply.text)}
                          className="text-left p-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <span className="text-[#FF7A00] text-xs font-semibold">{reply.category}:</span>
                          <div className="mt-1">{reply.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-6 border-t border-white/20 bg-white/5">
                  <div className="flex items-end space-x-4">
                    {/* Attachment Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowAttachments(!showAttachments)}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      
                      {showAttachments && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white/10 backdrop-blur-md rounded-lg p-2 flex space-x-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10"
                            title="Anexar arquivo"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = handleFileUpload;
                              input.click();
                            }}
                            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10"
                            title="Anexar imagem"
                          >
                            <Image className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex-1 relative">
                      <textarea
                        ref={messageInputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Digite sua mensagem... (Ctrl+Enter para enviar)"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-24 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                        rows={1}
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                      />
                      
                      {/* Input Actions */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <button
                          onClick={() => setShowQuickReplies(!showQuickReplies)}
                          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                          title="Respostas rápidas (Ctrl+/)"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                          title="Emojis (Ctrl+E)"
                        >
                          <Smile className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Voice Recording */}
                    <button
                      onClick={handleRecording}
                      className={`p-3 rounded-lg transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && attachmentPreviews.length === 0}
                      className="bg-[#FF7A00] hover:bg-[#FF9500] disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-300"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Typing Indicator */}
                  {currentConversation.isTyping && (
                    <div className="flex items-center space-x-2 mt-3 text-gray-400 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span>{currentConversation.contact.name} está digitando...</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-medium text-white mb-3">Selecione uma conversa</h3>
                  <p className="text-gray-400 text-lg">Escolha uma conversa para começar a responder</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="*/*"
        />

        {/* Keyboard Shortcuts Modal */}
        {showKeyboardShortcuts && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Atalhos do Teclado</h3>
                <button
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { keys: 'Ctrl + K', action: 'Buscar conversas' },
                  { keys: 'Ctrl + Enter', action: 'Enviar mensagem' },
                  { keys: 'Ctrl + /', action: 'Respostas rápidas' },
                  { keys: 'Ctrl + E', action: 'Abrir emojis' },
                  { keys: 'Ctrl + F', action: 'Tela cheia' },
                  { keys: 'Esc', action: 'Fechar modais' }
                ].map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white font-mono">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConversationsPage;