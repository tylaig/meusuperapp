import React, { useState } from 'react';
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
  User
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { Message } from '../../types';

const ConversationsPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');

  const conversations = [
    {
      id: '1',
      contact: 'Maria Silva',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      channel: 'whatsapp',
      lastMessage: 'Gostaria de saber mais sobre os planos',
      timestamp: '2 min',
      unread: 2,
      status: 'active'
    },
    {
      id: '2',
      contact: 'João Santos',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      channel: 'instagram',
      lastMessage: 'Qual o preço do produto?',
      timestamp: '5 min',
      unread: 0,
      status: 'waiting'
    },
    {
      id: '3',
      contact: 'Ana Costa',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      channel: 'email',
      lastMessage: 'Obrigada pelo atendimento!',
      timestamp: '1h',
      unread: 0,
      status: 'resolved'
    },
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
  ];

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
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'waiting':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterChannel === 'all' || conv.channel === filterChannel;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout currentPage="conversations">
      <div className="h-[calc(100vh-12rem)] flex bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        
        {/* Conversations List */}
        <div className="w-1/3 border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Conversas</h2>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* Channel Filter */}
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
            >
              <option value="all" className="bg-[#2D0B55]">Todos os canais</option>
              <option value="whatsapp" className="bg-[#2D0B55]">WhatsApp</option>
              <option value="instagram" className="bg-[#2D0B55]">Instagram</option>
              <option value="email" className="bg-[#2D0B55]">Email</option>
              <option value="sms" className="bg-[#2D0B55]">SMS</option>
            </select>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
                  selectedConversation === conversation.id ? 'bg-white/10 border-l-4 border-l-[#FF7A00]' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.contact}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(conversation.status)} rounded-full border-2 border-[#2D0B55]`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-medium truncate">{conversation.contact}</h3>
                      <div className="flex items-center space-x-2">
                        {getChannelIcon(conversation.channel)}
                        <span className="text-gray-400 text-xs">{conversation.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm truncate">{conversation.lastMessage}</p>
                  </div>
                  
                  {conversation.unread > 0 && (
                    <div className="w-5 h-5 bg-[#FF7A00] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{conversation.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={conversations.find(c => c.id === selectedConversation)?.avatar}
                    alt="Contact"
                    className="w-10 h-10 rounded-full border-2 border-white/20"
                  />
                  <div>
                    <h3 className="text-white font-medium">
                      {conversations.find(c => c.id === selectedConversation)?.contact}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getChannelIcon(conversations.find(c => c.id === selectedConversation)?.channel || '')}
                      <span className="text-gray-400 text-sm">Online</span>
                    </div>
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isBot
                        ? 'bg-white/10 text-white'
                        : 'bg-[#FF7A00] text-white'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {message.isBot ? (
                          <Bot className="w-4 h-4 text-[#FF7A00]" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        <span className="text-xs opacity-75">{message.sender}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end space-x-1 mt-2">
                        <span className="text-xs opacity-75">{message.timestamp}</span>
                        {!message.isBot && (
                          <CheckCheck className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-[#FF7A00] hover:bg-[#FF9500] text-white p-3 rounded-lg transition-colors duration-300"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Selecione uma conversa</h3>
                <p className="text-gray-400">Escolha uma conversa para começar a responder</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationsPage;