import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Key, 
  Globe, 
  Palette, 
  Database, 
  Zap,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface SettingsData {
  general: {
    timezone: string;
    language: string;
    dateFormat: string;
    theme: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
    security: boolean;
    system: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginNotifications: boolean;
  };
  api: {
    webhookUrl: string;
    apiKey: string;
    rateLimitPerMinute: number;
    enableLogging: boolean;
  };
  integrations: {
    whatsapp: boolean;
    instagram: boolean;
    facebook: boolean;
    telegram: boolean;
    email: boolean;
    sms: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    retentionDays: number;
    includeMedia: boolean;
  };
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'api' | 'integrations' | 'backup'>('general');
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      theme: 'dark'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      security: true,
      system: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginNotifications: true
    },
    api: {
      webhookUrl: 'https://api.meusuper.app/webhook',
      apiKey: 'sk_live_1234567890abcdef',
      rateLimitPerMinute: 100,
      enableLogging: true
    },
    integrations: {
      whatsapp: true,
      instagram: true,
      facebook: false,
      telegram: false,
      email: true,
      sms: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      includeMedia: true
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
  };

  const generateNewApiKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSettings(prev => ({
      ...prev,
      api: { ...prev.api, apiKey: newKey }
    }));
  };

  const copyApiKey = async () => {
    await navigator.clipboard.writeText(settings.api.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'general', name: 'Geral', icon: Settings },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'api', name: 'API', icon: Key },
    { id: 'integrations', name: 'Integrações', icon: Zap },
    { id: 'backup', name: 'Backup', icon: Database },
  ];

  return (
    <DashboardLayout currentPage="settings">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
            <p className="text-gray-300">Gerencie as configurações do sistema</p>
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
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Configurações Gerais</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Fuso Horário</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, timezone: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="America/Sao_Paulo" className="bg-[#2D0B55]">São Paulo (GMT-3)</option>
                        <option value="America/New_York" className="bg-[#2D0B55]">Nova York (GMT-5)</option>
                        <option value="Europe/London" className="bg-[#2D0B55]">Londres (GMT+0)</option>
                        <option value="Asia/Tokyo" className="bg-[#2D0B55]">Tóquio (GMT+9)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Idioma</label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, language: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="pt-BR" className="bg-[#2D0B55]">Português (Brasil)</option>
                        <option value="en-US" className="bg-[#2D0B55]">English (US)</option>
                        <option value="es-ES" className="bg-[#2D0B55]">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Formato de Data</label>
                      <select
                        value={settings.general.dateFormat}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, dateFormat: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="DD/MM/YYYY" className="bg-[#2D0B55]">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY" className="bg-[#2D0B55]">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD" className="bg-[#2D0B55]">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Tema</label>
                      <select
                        value={settings.general.theme}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, theme: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="dark" className="bg-[#2D0B55]">Escuro</option>
                        <option value="light" className="bg-[#2D0B55]">Claro</option>
                        <option value="auto" className="bg-[#2D0B55]">Automático</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Configurações de Notificações</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-semibold capitalize">
                            {key === 'email' && 'Notificações por Email'}
                            {key === 'push' && 'Notificações Push'}
                            {key === 'sms' && 'Notificações por SMS'}
                            {key === 'marketing' && 'Emails de Marketing'}
                            {key === 'security' && 'Alertas de Segurança'}
                            {key === 'system' && 'Notificações do Sistema'}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {key === 'email' && 'Receber notificações importantes por email'}
                            {key === 'push' && 'Notificações em tempo real no navegador'}
                            {key === 'sms' && 'Alertas críticos por SMS'}
                            {key === 'marketing' && 'Novidades e promoções'}
                            {key === 'security' && 'Tentativas de login e alterações de segurança'}
                            {key === 'system' && 'Atualizações e manutenções do sistema'}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, [key]: e.target.checked }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Configurações de Segurança</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">Autenticação de Dois Fatores</div>
                        <div className="text-gray-400 text-sm">Adicione uma camada extra de segurança</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactor}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, twoFactor: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-semibold mb-2">Timeout da Sessão (minutos)</label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                          }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">Expiração da Senha (dias)</label>
                        <input
                          type="number"
                          value={settings.security.passwordExpiry}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, passwordExpiry: parseInt(e.target.value) }
                          }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">Notificações de Login</div>
                        <div className="text-gray-400 text-sm">Receber alertas sobre novos logins</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.loginNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, loginNotifications: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* API Settings */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Configurações da API</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">URL do Webhook</label>
                      <input
                        type="url"
                        value={settings.api.webhookUrl}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          api: { ...prev.api, webhookUrl: e.target.value }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        placeholder="https://api.exemplo.com/webhook"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Chave da API</label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={settings.api.apiKey}
                            readOnly
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-20 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={copyApiKey}
                              className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={generateNewApiKey}
                          className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300"
                        >
                          Gerar Nova
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Limite de Taxa (por minuto)</label>
                      <input
                        type="number"
                        value={settings.api.rateLimitPerMinute}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          api: { ...prev.api, rateLimitPerMinute: parseInt(e.target.value) }
                        }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">Logging da API</div>
                        <div className="text-gray-400 text-sm">Registrar todas as chamadas da API</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.api.enableLogging}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            api: { ...prev.api, enableLogging: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Integrações</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(settings.integrations).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            value ? 'bg-green-500' : 'bg-gray-500'
                          }`}>
                            {key === 'whatsapp' && '📱'}
                            {key === 'instagram' && '📷'}
                            {key === 'facebook' && '👥'}
                            {key === 'telegram' && '✈️'}
                            {key === 'email' && '📧'}
                            {key === 'sms' && '💬'}
                          </div>
                          <div>
                            <div className="text-white font-semibold capitalize">{key}</div>
                            <div className="text-gray-400 text-sm">
                              {value ? 'Conectado' : 'Desconectado'}
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              integrations: { ...prev.integrations, [key]: e.target.checked }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Backup Settings */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Configurações de Backup</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">Backup Automático</div>
                        <div className="text-gray-400 text-sm">Realizar backups automaticamente</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.backup.autoBackup}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            backup: { ...prev.backup, autoBackup: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-semibold mb-2">Frequência do Backup</label>
                        <select
                          value={settings.backup.backupFrequency}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            backup: { ...prev.backup, backupFrequency: e.target.value }
                          }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        >
                          <option value="hourly" className="bg-[#2D0B55]">A cada hora</option>
                          <option value="daily" className="bg-[#2D0B55]">Diário</option>
                          <option value="weekly" className="bg-[#2D0B55]">Semanal</option>
                          <option value="monthly" className="bg-[#2D0B55]">Mensal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">Retenção (dias)</label>
                        <input
                          type="number"
                          value={settings.backup.retentionDays}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            backup: { ...prev.backup, retentionDays: parseInt(e.target.value) }
                          }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">Incluir Mídia</div>
                        <div className="text-gray-400 text-sm">Fazer backup de imagens e arquivos</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.backup.includeMedia}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            backup: { ...prev.backup, includeMedia: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                      </label>
                    </div>

                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-blue-300 font-semibold">Último Backup</div>
                          <div className="text-blue-200 text-sm">Hoje às 03:00 - 2.5GB</div>
                        </div>
                      </div>
                    </div>
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

export default SettingsPage;