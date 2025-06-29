import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Camera,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  Clock,
  Activity,
  Smartphone,
  Globe,
  AlertTriangle
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar: string;
  };
  security: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    language: string;
    timezone: string;
  };
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'activity'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    personal: {
      name: user?.name || 'João Silva',
      email: user?.email || 'joao@meusuper.app',
      phone: '+55 11 99999-9999',
      location: 'São Paulo, SP',
      bio: 'CEO e Fundador da MeuSuper Tecnologia. Especialista em automação e IA para vendas.',
      avatar: user?.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
  };

  const handlePasswordChange = async () => {
    if (profileData.security.newPassword !== profileData.security.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    // Clear password fields
    setProfileData(prev => ({
      ...prev,
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            avatar: e.target?.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const recentActivity = [
    {
      id: '1',
      action: 'Login realizado',
      description: 'Acesso via navegador Chrome',
      timestamp: '2 minutos atrás',
      ip: '192.168.1.100',
      device: 'Desktop - Windows',
      icon: User,
      color: 'text-green-400'
    },
    {
      id: '2',
      action: 'Senha alterada',
      description: 'Senha da conta foi atualizada',
      timestamp: '2 dias atrás',
      ip: '192.168.1.100',
      device: 'Desktop - Windows',
      icon: Key,
      color: 'text-yellow-400'
    },
    {
      id: '3',
      action: 'Nova conexão WhatsApp',
      description: 'Conexão "Vendas Principal" criada',
      timestamp: '3 dias atrás',
      ip: '192.168.1.100',
      device: 'Mobile - Android',
      icon: Smartphone,
      color: 'text-blue-400'
    },
    {
      id: '4',
      action: 'Login de novo dispositivo',
      description: 'Primeiro acesso via iPhone',
      timestamp: '1 semana atrás',
      ip: '192.168.1.105',
      device: 'Mobile - iOS',
      icon: AlertTriangle,
      color: 'text-red-400'
    }
  ];

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'preferences', name: 'Preferências', icon: Globe },
    { id: 'activity', name: 'Atividade', icon: Activity },
  ];

  return (
    <DashboardLayout currentPage="profile">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={profileData.personal.avatar}
              alt={profileData.personal.name}
              className="w-16 h-16 rounded-full border-4 border-[#FF7A00]"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{profileData.personal.name}</h1>
              <p className="text-gray-300">{user?.role === 'owner' ? 'Proprietário' : 'Administrador'}</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-[#FF7A00] text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Informações Pessoais</h2>
                  
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={profileData.personal.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-[#FF7A00]"
                      />
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FF9500] transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Foto do Perfil</h3>
                      <p className="text-gray-400 text-sm">Clique no ícone para alterar sua foto</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={profileData.personal.name}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, name: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.personal.email}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, email: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={profileData.personal.phone}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, phone: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Localização</label>
                      <input
                        type="text"
                        value={profileData.personal.location}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, location: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Biografia</label>
                    <textarea
                      value={profileData.personal.bio}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, bio: e.target.value }
                      }))}
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      placeholder="Conte um pouco sobre você..."
                    />
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Segurança da Conta</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Senha Atual</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={profileData.security.currentPassword}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            security: { ...prev.security, currentPassword: e.target.value }
                          }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          placeholder="Digite sua senha atual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-semibold mb-2">Nova Senha</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={profileData.security.newPassword}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              security: { ...prev.security, newPassword: e.target.value }
                            }))}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                            placeholder="Digite a nova senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">Confirmar Nova Senha</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={profileData.security.confirmPassword}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              security: { ...prev.security, confirmPassword: e.target.value }
                            }))}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                            placeholder="Confirme a nova senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={!profileData.security.currentPassword || !profileData.security.newPassword || !profileData.security.confirmPassword}
                      className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Alterar Senha
                    </button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-xl font-bold text-white mb-4">Autenticação de Dois Fatores</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold">2FA não configurado</div>
                          <div className="text-gray-400 text-sm">Adicione uma camada extra de segurança à sua conta</div>
                        </div>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                          Configurar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Preferências</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Notificações</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white font-semibold">Notificações por Email</div>
                            <div className="text-gray-400 text-sm">Receber notificações importantes por email</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profileData.preferences.emailNotifications}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, emailNotifications: e.target.checked }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white font-semibold">Notificações Push</div>
                            <div className="text-gray-400 text-sm">Notificações em tempo real no navegador</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profileData.preferences.pushNotifications}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, pushNotifications: e.target.checked }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white font-semibold">Emails de Marketing</div>
                            <div className="text-gray-400 text-sm">Receber novidades e promoções</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profileData.preferences.marketingEmails}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, marketingEmails: e.target.checked }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Localização e Idioma</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white font-semibold mb-2">Idioma</label>
                          <select
                            value={profileData.preferences.language}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, language: e.target.value }
                            }))}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          >
                            <option value="pt-BR" className="bg-[#2D0B55]">Português (Brasil)</option>
                            <option value="en-US" className="bg-[#2D0B55]">English (US)</option>
                            <option value="es-ES" className="bg-[#2D0B55]">Español</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-white font-semibold mb-2">Fuso Horário</label>
                          <select
                            value={profileData.preferences.timezone}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, timezone: e.target.value }
                            }))}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          >
                            <option value="America/Sao_Paulo" className="bg-[#2D0B55]">São Paulo (GMT-3)</option>
                            <option value="America/New_York" className="bg-[#2D0B55]">Nova York (GMT-5)</option>
                            <option value="Europe/London" className="bg-[#2D0B55]">Londres (GMT+0)</option>
                            <option value="Asia/Tokyo" className="bg-[#2D0B55]">Tóquio (GMT+9)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Atividade Recente</h2>
                  
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.color === 'text-green-400' ? 'bg-green-500/20' :
                            activity.color === 'text-yellow-400' ? 'bg-yellow-500/20' :
                            activity.color === 'text-blue-400' ? 'bg-blue-500/20' :
                            'bg-red-500/20'
                          }`}>
                            <activity.icon className={`w-5 h-5 ${activity.color}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-white font-semibold">{activity.action}</h3>
                              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{activity.timestamp}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-2">{activity.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span>IP: {activity.ip}</span>
                              <span>Dispositivo: {activity.device}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button className="text-[#FF7A00] hover:text-[#FF9500] font-semibold transition-colors duration-300">
                      Ver Mais Atividades
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;