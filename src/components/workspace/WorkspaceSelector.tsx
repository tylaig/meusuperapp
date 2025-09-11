import React, { useState } from 'react';
import { 
  Building, 
  ChevronDown, 
  Plus, 
  Check, 
  Settings, 
  Users,
  Crown,
  Shield,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../contexts/AuthContext';

const WorkspaceSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    industry: '',
    company_size: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const { 
    workspaces, 
    currentWorkspace, 
    selectWorkspace, 
    createWorkspace,
    isLoading 
  } = useWorkspace();
  
  const { logout } = useAuth();

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const newWorkspace = await createWorkspace(createForm);
      await selectWorkspace(newWorkspace.id);
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', industry: '', company_size: '' });
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Erro ao criar workspace');
    } finally {
      setIsCreating(false);
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'member':
        return <UserIcon className="w-4 h-4 text-gray-400" />;
      default:
        return <UserIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'text-purple-400';
      case 'pro':
        return 'text-[#FF7A00]';
      case 'starter':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF7A00]"></div>
        <span className="text-white text-sm">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Workspace Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-all duration-300 min-w-48"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-lg flex items-center justify-center flex-shrink-0">
          <Building className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-white font-medium text-sm truncate">
            {currentWorkspace?.name || 'Selecionar Workspace'}
          </div>
          <div className={`text-xs ${getPlanColor(currentWorkspace?.plan || 'starter')}`}>
            {currentWorkspace?.plan?.toUpperCase() || 'Nenhum selecionado'}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl z-50">
          <div className="p-4">
            <div className="text-white font-semibold mb-3">Seus Workspaces</div>
            
            {/* Workspace List */}
            <div className="space-y-2 mb-4">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => {
                    selectWorkspace(workspace.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    currentWorkspace?.id === workspace.id
                      ? 'bg-[#FF7A00] text-white'
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-lg flex items-center justify-center flex-shrink-0">
                    {workspace.logo_url ? (
                      <img
                        src={workspace.logo_url}
                        alt={workspace.name}
                        className="w-8 h-8 rounded-md"
                      />
                    ) : (
                      <Building className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium truncate">{workspace.name}</div>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(workspace.role)}
                      <span className="text-xs capitalize">{workspace.role}</span>
                      <span className="text-xs">•</span>
                      <span className={`text-xs ${getPlanColor(workspace.plan)}`}>
                        {workspace.plan.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {currentWorkspace?.id === workspace.id && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Novo Workspace</span>
              </button>
              
              {currentWorkspace && (
                <button
                  onClick={() => {
                    window.location.href = '/organization';
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300"
                >
                  <Settings className="w-5 h-5" />
                  <span>Configurações do Workspace</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Criar Novo Workspace</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Nome do Workspace</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  placeholder="Nome da empresa ou projeto"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Descrição (Opcional)</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Descreva seu workspace..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !createForm.name.trim()}
                  className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;