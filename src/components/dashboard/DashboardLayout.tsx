import React, { useState } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Users, 
  CreditCard, 
  Zap, 
  Menu, 
  X, 
  Bell,
  Search,
  LogOut,
  User,
  Server,
  Smartphone,
  Building,
  FileText,
  Target,
  Calendar,
  RefreshCw,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DemoModeIndicator from '../common/DemoModeIndicator';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, current: currentPage === 'dashboard' },
    { name: 'CRM & Vendas', href: '/crm', icon: Target, current: currentPage === 'crm' },
    { name: 'Agenda', href: '/agenda', icon: Calendar, current: currentPage === 'agenda' },
    { name: 'Calendário', href: '/calendar', icon: CalendarDays, current: currentPage === 'calendar' },
    { name: 'Follow-up', href: '/follow-up', icon: RefreshCw, current: currentPage === 'follow-up' },
    { name: '---', href: '#', icon: null, current: false }, // Divider
    { name: 'Servidores', href: '/servers', icon: Server, current: currentPage === 'servers' },
    { name: 'Conexões', href: '/connections', icon: Smartphone, current: currentPage === 'connections' },
    { name: 'Conversas', href: '/conversations', icon: MessageSquare, current: currentPage === 'conversations' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, current: currentPage === 'analytics' },
    { name: 'Logs', href: '/logs', icon: FileText, current: currentPage === 'logs' },
    { name: '---', href: '#', icon: null, current: false }, // Divider
    { name: 'Organização', href: '/organization', icon: Building, current: currentPage === 'organization' },
    { name: 'Assinatura', href: '/subscription', icon: CreditCard, current: currentPage === 'subscription' },
    { name: 'Configurações', href: '/settings', icon: Settings, current: currentPage === 'settings' },
  ];

  const notifications = [
    {
      id: '1',
      title: 'Nova conexão WhatsApp',
      message: 'Conexão "Vendas Principal" foi estabelecida com sucesso',
      time: '2 min atrás',
      type: 'success'
    },
    {
      id: '2',
      title: 'Limite de mensagens',
      message: 'Você atingiu 80% do limite mensal de mensagens',
      time: '1h atrás',
      type: 'warning'
    },
    {
      id: '3',
      title: 'Backup concluído',
      message: 'Backup automático realizado com sucesso',
      time: '3h atrás',
      type: 'info'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D0B55] via-[#3D1565] to-[#2D0B55]">
      <DemoModeIndicator />
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#2D0B55] to-[#1A0633] border-r border-white/10 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">meusuper.app</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigation.map((item) => {
              if (item.name === '---') {
                return <div key={item.href} className="h-px bg-white/10 my-4"></div>;
              }
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    item.current
                      ? 'bg-[#FF7A00] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="h-full bg-gradient-to-b from-[#2D0B55] to-[#1A0633] border-r border-white/10 flex flex-col">
          <div className="flex items-center space-x-3 p-6 border-b border-white/10 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">meusuper.app</span>
          </div>
          <nav className="flex-1 overflow-y-auto p-6 space-y-2">
            {navigation.map((item) => {
              if (item.name === '---') {
                return <div key={item.href} className="h-px bg-white/10 my-4"></div>;
              }
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    item.current
                      ? 'bg-[#FF7A00] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-300 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Search */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-300 hover:text-white transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF7A00] rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-white font-semibold">Notificações</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                              <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                              <span className="text-gray-400 text-xs">{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4">
                      <button className="w-full text-[#FF7A00] hover:text-[#FF9500] text-sm font-semibold transition-colors">
                        Ver todas as notificações
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-[#FF7A00]"
                  />
                  <span className="hidden sm:block font-medium">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl">
                    <div className="p-2">
                      <a
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                      >
                        <User className="w-4 h-4" />
                        <span>Perfil</span>
                      </a>
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;