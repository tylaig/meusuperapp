import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Crown, 
  Mail, 
  Clock, 
  Check, 
  X, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Send
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { TeamMember, Invite, Organization } from '../../types';

const OrganizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'settings'>('members');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'user' as 'admin' | 'user',
    permissions: [] as string[]
  });

  useEffect(() => {
    // Mock data
    setOrganization({
      id: 'org-1',
      name: 'MeuSuper Tecnologia',
      slug: 'meusuper-tech',
      logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      plan: 'pro',
      maxServers: 10,
      maxConnections: 1000,
      createdAt: '2024-01-01T00:00:00Z',
      settings: {
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        notifications: true,
        autoBackup: true
      }
    });

    setMembers([
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@meusuper.app',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'owner',
        permissions: ['*'],
        status: 'active',
        lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@meusuper.app',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'admin',
        permissions: ['servers.manage', 'connections.manage', 'analytics.view'],
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@meusuper.app',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'user',
        permissions: ['connections.view', 'messages.send'],
        status: 'active',
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Ana Oliveira',
        email: 'ana@meusuper.app',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'user',
        permissions: ['analytics.view'],
        status: 'suspended',
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);

    setInvites([
      {
        id: '1',
        email: 'carlos@empresa.com',
        role: 'admin',
        permissions: ['servers.view', 'connections.manage'],
        organizationId: 'org-1',
        invitedBy: 'João Silva',
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        email: 'lucia@empresa.com',
        role: 'user',
        permissions: ['connections.view'],
        organizationId: 'org-1',
        invitedBy: 'Maria Santos',
        status: 'pending',
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'user':
        return <Users className="w-4 h-4 text-gray-400" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'admin':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'user':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'suspended':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatLastLogin = (timestamp: string) => {
    const now = new Date();
    const login = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - login.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const handleInvite = async () => {
    if (!inviteForm.email) return;
    
    const newInvite: Invite = {
      id: Date.now().toString(),
      email: inviteForm.email,
      role: inviteForm.role,
      permissions: inviteForm.permissions,
      organizationId: 'org-1',
      invitedBy: 'João Silva',
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };

    setInvites(prev => [newInvite, ...prev]);
    setInviteForm({ email: '', role: 'user', permissions: [] });
    setShowInviteModal(false);
  };

  const copyInviteLink = (inviteId: string) => {
    const link = `${window.location.origin}/invite/${inviteId}`;
    navigator.clipboard.writeText(link);
    // Show toast notification
  };

  const resendInvite = (inviteId: string) => {
    // Resend invite logic
    console.log('Resending invite:', inviteId);
  };

  const cancelInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(invite => invite.id !== inviteId));
  };

  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingInvites = invites.filter(i => i.status === 'pending').length;

  return (
    <DashboardLayout currentPage="organization">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {organization?.logo && (
              <img
                src={organization.logo}
                alt={organization.name}
                className="w-16 h-16 rounded-xl border-2 border-[#FF7A00]"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{organization?.name}</h1>
              <p className="text-gray-300">Gerencie sua organização e equipe</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            <UserPlus className="w-4 h-4" />
            <span>Convidar Membro</span>
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">+1 este mês</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{activeMembers}</div>
            <div className="text-gray-300 text-sm">Membros Ativos</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-yellow-400 text-sm font-semibold">{pendingInvites > 0 ? 'Pendente' : 'OK'}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{pendingInvites}</div>
            <div className="text-gray-300 text-sm">Convites Pendentes</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">Pro</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{organization?.plan.toUpperCase()}</div>
            <div className="text-gray-300 text-sm">Plano Atual</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">Ativo</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <div className="text-gray-300 text-sm">Segurança</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-300 ${
              activeTab === 'members'
                ? 'bg-[#FF7A00] text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Membros
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-300 ${
              activeTab === 'invites'
                ? 'bg-[#FF7A00] text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Convites
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-300 ${
              activeTab === 'settings'
                ? 'bg-[#FF7A00] text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Configurações
          </button>
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={member.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}
                      alt={member.name}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-semibold">{member.name}</h3>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-gray-400 text-sm">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRoleColor(member.role)}`}>
                        {member.role.toUpperCase()}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold border mt-1 ${getStatusColor(member.status)}`}>
                        {member.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-white text-sm">Último acesso</div>
                      <div className="text-gray-400 text-sm">{formatLastLogin(member.lastLogin || '')}</div>
                    </div>

                    {member.role !== 'owner' && (
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {member.permissions.length > 0 && member.permissions[0] !== '*' && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-gray-300 text-sm mb-2">Permissões:</div>
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Invites Tab */}
        {activeTab === 'invites' && (
          <div className="space-y-4">
            {invites.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Nenhum convite pendente</h3>
                <p className="text-gray-400 mb-6">Convide novos membros para sua organização</p>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  Enviar Convite
                </button>
              </div>
            ) : (
              invites.map((invite) => (
                <div
                  key={invite.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{invite.email}</h3>
                        <p className="text-gray-400 text-sm">Convidado por {invite.invitedBy}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRoleColor(invite.role)}`}>
                          {invite.role.toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold border mt-1 ${getStatusColor(invite.status)}`}>
                          {invite.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyInviteLink(invite.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copiar Link</span>
                        </button>
                        
                        <button
                          onClick={() => resendInvite(invite.id)}
                          className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center space-x-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reenviar</span>
                        </button>
                        
                        <button
                          onClick={() => cancelInvite(invite.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {invite.permissions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-gray-300 text-sm mb-2">Permissões:</div>
                      <div className="flex flex-wrap gap-2">
                        {invite.permissions.map((permission, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && organization && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Informações da Organização</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Nome da Organização</label>
                  <input
                    type="text"
                    value={organization.name}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Slug</label>
                  <input
                    type="text"
                    value={organization.slug}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Configurações</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Notificações</div>
                    <div className="text-gray-400 text-sm">Receber notificações por email</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={organization.settings.notifications}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Backup Automático</div>
                    <div className="text-gray-400 text-sm">Backup diário dos dados</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={organization.settings.autoBackup}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Convidar Membro</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@empresa.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Função</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  >
                    <option value="user" className="bg-[#2D0B55]">Usuário</option>
                    <option value="admin" className="bg-[#2D0B55]">Administrador</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleInvite}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300"
                  >
                    Enviar Convite
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

export default OrganizationPage;