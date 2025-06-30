import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  QrCode, 
  Wifi, 
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Plus,
  RefreshCw,
  Trash2,
  Settings,
  MessageSquare,
  Clock,
  Activity,
  Search,
  Filter,
  Instagram,
  Mail,
  Phone,
  Facebook,
  Send,
  Globe,
  Key,
  Webhook,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
  Shield,
  Database,
  Bot,
  Server,
  Link,
  User,
  Lock
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import DemoAlert from '../common/DemoAlert';
import { useDemoMode } from '../../hooks/useDemoMode';
import { WhatsAppConnection } from '../../types';

interface ChannelIntegration {
  id: string;
  name: string;
  type: 'whatsapp-qr' | 'whatsapp-business' | 'instagram' | 'facebook' | 'telegram' | 'email' | 'sms' | 'webhook';
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error' | 'pending' | 'connecting';
  description: string;
  config?: any;
  metrics?: {
    messagesReceived: number;
    messagesSent: number;
    lastActivity: string;
  };
}

const ConnectionsPage: React.FC = () => {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [integrations, setIntegrations] = useState<ChannelIntegration[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [configForm, setConfigForm] = useState<any>({});
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});
  
  const { showDemoAlert, demoAlertConfig, triggerDemoAlert, closeDemoAlert } = useDemoMode();

  useEffect(() => {
    // Mock data for WhatsApp connections (QR Code)
    setConnections([
      {
        id: '1',
        serverId: '1',
        sessionName: 'Vendas Principal',
        phoneNumber: '+55 11 99999-0001',
        status: 'connected',
        lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        messagesCount: {
          sent: 1247,
          received: 892,
          failed: 3
        },
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        serverId: '1',
        sessionName: 'Suporte Técnico',
        phoneNumber: '+55 11 99999-0002',
        status: 'connected',
        lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        messagesCount: {
          sent: 856,
          received: 1203,
          failed: 1
        },
        createdAt: '2024-01-16T14:30:00Z'
      },
      {
        id: '3',
        serverId: '2',
        sessionName: 'Marketing Bot',
        phoneNumber: '+55 11 99999-0003',
        status: 'connecting',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        messagesCount: {
          sent: 0,
          received: 0,
          failed: 0
        },
        createdAt: '2024-01-20T09:15:00Z'
      }
    ]);

    // Mock data for channel integrations
    setIntegrations([
      {
        id: 'whatsapp-business',
        name: 'WhatsApp Business API',
        type: 'whatsapp-business',
        icon: MessageSquare,
        status: 'connected',
        description: 'API oficial do WhatsApp para empresas',
        config: {
          phoneNumberId: '123456789012345',
          accessToken: 'EAAG...hidden',
          webhookVerifyToken: 'verify_token_123',
          webhookUrl: 'https://api.meusuper.app/webhook/whatsapp',
          businessAccountId: '987654321098765'
        },
        metrics: {
          messagesReceived: 2139,
          messagesSent: 3247,
          lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'instagram-direct',
        name: 'Instagram Direct',
        type: 'instagram',
        icon: Instagram,
        status: 'connected',
        description: 'Mensagens diretas do Instagram',
        config: {
          pageId: '123456789',
          accessToken: 'IGQVJ...hidden',
          appId: '987654321',
          appSecret: 'secret...hidden',
          webhookUrl: 'https://api.meusuper.app/webhook/instagram',
          verifyToken: 'ig_verify_token'
        },
        metrics: {
          messagesReceived: 856,
          messagesSent: 1203,
          lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'facebook-messenger',
        name: 'Facebook Messenger',
        type: 'facebook',
        icon: Facebook,
        status: 'disconnected',
        description: 'Mensagens do Facebook Messenger',
        config: {
          pageId: '',
          pageAccessToken: '',
          appId: '',
          appSecret: '',
          webhookUrl: '',
          verifyToken: ''
        }
      },
      {
        id: 'telegram-bot',
        name: 'Telegram Bot',
        type: 'telegram',
        icon: Send,
        status: 'connected',
        description: 'Bot do Telegram para mensagens',
        config: {
          botToken: '123456789:ABCD...hidden',
          botUsername: '@meusuper_bot',
          webhookUrl: 'https://api.meusuper.app/webhook/telegram',
          allowedUpdates: ['message', 'callback_query']
        },
        metrics: {
          messagesReceived: 423,
          messagesSent: 567,
          lastActivity: new Date(Date.now() - 8 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'email-smtp',
        name: 'Email SMTP',
        type: 'email',
        icon: Mail,
        status: 'connected',
        description: 'Integração via SMTP para emails',
        config: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: '587',
          smtpUser: 'contato@meusuper.app',
          smtpPassword: 'password...hidden',
          fromName: 'MeuSuper App',
          fromEmail: 'contato@meusuper.app',
          encryption: 'tls'
        },
        metrics: {
          messagesReceived: 234,
          messagesSent: 789,
          lastActivity: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'sms-twilio',
        name: 'SMS via Twilio',
        type: 'sms',
        icon: Phone,
        status: 'error',
        description: 'Mensagens SMS via Twilio API',
        config: {
          accountSid: 'AC1234567890abcdef',
          authToken: 'auth...hidden',
          fromNumber: '+15551234567',
          webhookUrl: 'https://api.meusuper.app/webhook/sms',
          statusCallback: 'https://api.meusuper.app/callback/sms'
        }
      },
      {
        id: 'custom-webhook',
        name: 'Webhook Personalizado',
        type: 'webhook',
        icon: Webhook,
        status: 'pending',
        description: 'Integração customizada via webhook',
        config: {
          webhookUrl: 'https://meusite.com/webhook',
          method: 'POST',
          headers: '{"Authorization": "Bearer token123"}',
          secretKey: 'webhook_secret_key'
        }
      }
    ]);
  }, []);

  const getChannelConfig = (type: string) => {
    const configs = {
      'whatsapp-business': {
        fields: [
          { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text', required: true, placeholder: '123456789012345' },
          { key: 'accessToken', label: 'Access Token', type: 'password', required: true, placeholder: 'EAAG...' },
          { key: 'businessAccountId', label: 'Business Account ID', type: 'text', required: true, placeholder: '987654321098765' },
          { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, placeholder: 'https://api.meusuper.app/webhook/whatsapp' },
          { key: 'webhookVerifyToken', label: 'Webhook Verify Token', type: 'password', required: true, placeholder: 'verify_token_123' }
        ],
        docs: 'https://developers.facebook.com/docs/whatsapp/cloud-api'
      },
      'instagram': {
        fields: [
          { key: 'pageId', label: 'Page ID', type: 'text', required: true, placeholder: '123456789' },
          { key: 'accessToken', label: 'Page Access Token', type: 'password', required: true, placeholder: 'IGQVJ...' },
          { key: 'appId', label: 'App ID', type: 'text', required: true, placeholder: '987654321' },
          { key: 'appSecret', label: 'App Secret', type: 'password', required: true, placeholder: 'app_secret_key' },
          { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, placeholder: 'https://api.meusuper.app/webhook/instagram' },
          { key: 'verifyToken', label: 'Verify Token', type: 'password', required: true, placeholder: 'ig_verify_token' }
        ],
        docs: 'https://developers.facebook.com/docs/instagram-api'
      },
      'facebook': {
        fields: [
          { key: 'pageId', label: 'Page ID', type: 'text', required: true, placeholder: '123456789' },
          { key: 'pageAccessToken', label: 'Page Access Token', type: 'password', required: true, placeholder: 'EAAG...' },
          { key: 'appId', label: 'App ID', type: 'text', required: true, placeholder: '987654321' },
          { key: 'appSecret', label: 'App Secret', type: 'password', required: true, placeholder: 'app_secret_key' },
          { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, placeholder: 'https://api.meusuper.app/webhook/facebook' },
          { key: 'verifyToken', label: 'Verify Token', type: 'password', required: true, placeholder: 'fb_verify_token' }
        ],
        docs: 'https://developers.facebook.com/docs/messenger-platform'
      },
      'telegram': {
        fields: [
          { key: 'botToken', label: 'Bot Token', type: 'password', required: true, placeholder: '123456789:ABCD...' },
          { key: 'botUsername', label: 'Bot Username', type: 'text', required: true, placeholder: '@meubot' },
          { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, placeholder: 'https://api.meusuper.app/webhook/telegram' },
          { key: 'allowedUpdates', label: 'Allowed Updates', type: 'text', required: false, placeholder: 'message,callback_query' }
        ],
        docs: 'https://core.telegram.org/bots/api'
      },
      'email': {
        fields: [
          { key: 'smtpHost', label: 'SMTP Host', type: 'text', required: true, placeholder: 'smtp.gmail.com' },
          { key: 'smtpPort', label: 'SMTP Port', type: 'number', required: true, placeholder: '587' },
          { key: 'smtpUser', label: 'SMTP User', type: 'email', required: true, placeholder: 'user@gmail.com' },
          { key: 'smtpPassword', label: 'SMTP Password', type: 'password', required: true, placeholder: 'app_password' },
          { key: 'fromName', label: 'From Name', type: 'text', required: true, placeholder: 'Minha Empresa' },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true, placeholder: 'contato@empresa.com' },
          { key: 'encryption', label: 'Encryption', type: 'select', required: true, options: ['tls', 'ssl', 'none'] }
        ],
        docs: 'https://nodemailer.com/smtp/'
      },
      'sms': {
        fields: [
          { key: 'accountSid', label: 'Account SID', type: 'text', required: true, placeholder: 'AC1234567890abcdef' },
          { key: 'authToken', label: 'Auth Token', type: 'password', required: true, placeholder: 'auth_token_here' },
          { key: 'fromNumber', label: 'From Number', type: 'tel', required: true, placeholder: '+15551234567' },
          { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: false, placeholder: 'https://api.meusuper.app/webhook/sms' },
          { key: 'statusCallback', label: 'Status Callback URL', type: 'url', required: false, placeholder: 'https://api.meusuper.app/callback/sms' }
        ],
        docs: 'https://www.twilio.com/docs/sms'
      },
      'webhook': {
        fields: [
          { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, placeholder: 'https://meusite.com/webhook' },
          { key: 'method', label: 'HTTP Method', type: 'select', required: true, options: ['POST', 'GET', 'PUT', 'PATCH'] },
          { key: 'headers', label: 'Headers (JSON)', type: 'textarea', required: false, placeholder: '{"Authorization": "Bearer token"}' },
          { key: 'secretKey', label: 'Secret Key', type: 'password', required: false, placeholder: 'webhook_secret_key' }
        ],
        docs: 'https://docs.meusuper.app/webhooks'
      }
    };
    return configs[type as keyof typeof configs] || { fields: [], docs: '' };
  };

  const refreshConnections = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleAdvancedAction = (action: string, itemId?: string) => {
    const actions = {
      'create-connection': {
        title: 'Criar Nova Conexão',
        message: 'A criação de novas conexões requer configuração avançada de servidores e autenticação. Na versão completa, você pode criar conexões ilimitadas com setup automático.'
      },
      'delete-connection': {
        title: 'Excluir Conexão',
        message: 'A exclusão de conexões ativas pode afetar conversas em andamento. Na versão completa, você tem controle total com backups automáticos e migração de dados.'
      },
      'advanced-config': {
        title: 'Configurações Avançadas',
        message: 'As configurações avançadas incluem webhooks personalizados, rate limiting, e integrações customizadas. Disponível na versão completa.'
      },
      'export-data': {
        title: 'Exportar Dados',
        message: 'A exportação completa de dados de conexões e métricas está disponível na versão completa, com formatos CSV, JSON e relatórios personalizados.'
      },
      'bulk-operations': {
        title: 'Operações em Lote',
        message: 'Operações em lote para múltiplas conexões, como backup, migração e configuração simultânea estão disponíveis na versão completa.'
      }
    };

    const config = actions[action as keyof typeof actions];
    if (config) {
      triggerDemoAlert(config.title, config.message);
    }
  };

  const handleAddIntegration = () => {
    setShowAddModal(true);
  };

  const handleConfigureIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      setConfigForm(integration.config || {});
      setShowConfigModal(integrationId);
    }
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update integration config
    setIntegrations(prev => prev.map(integration => 
      integration.id === showConfigModal 
        ? {
            ...integration,
            config: { ...integration.config, ...configForm },
            status: 'connected' as const
          }
        : integration
    ));
    
    setIsLoading(false);
    setShowConfigModal(null);
    setConfigForm({});
  };

  const handleTestConnection = async (integrationId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate test result
    const success = Math.random() > 0.3;
    
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: success ? 'connected' : 'error' }
        : integration
    ));
    
    setIsLoading(false);
    
    if (success) {
      alert('✅ Conexão testada com sucesso!');
    } else {
      alert('❌ Erro na conexão. Verifique as configurações.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('📋 Copiado para a área de transferência!');
  };

  const toggleSecretVisibility = (fieldKey: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      case 'connecting':
      case 'pending':
        return <Activity className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'disconnected':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'connecting':
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatLastActivity = (timestamp: string) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conn.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || conn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalMessages = integrations.reduce((sum, integration) => 
    sum + (integration.metrics?.messagesReceived || 0) + (integration.metrics?.messagesSent || 0), 0
  );
  const errorCount = integrations.filter(i => i.status === 'error').length;

  const currentIntegration = integrations.find(i => i.id === showConfigModal);
  const channelConfig = currentIntegration ? getChannelConfig(currentIntegration.type) : { fields: [], docs: '' };

  return (
    <DashboardLayout currentPage="connections">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Conexões & Integrações</h1>
            <p className="text-gray-300">Gerencie todas as suas conexões e integrações de canais</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshConnections}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
            
            <button
              onClick={handleAddIntegration}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Integração</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+2 hoje</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{connectedCount}</div>
            <div className="text-gray-300 text-sm">Canais Conectados</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">+15% hoje</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalMessages.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Mensagens Total</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#FF7A00] text-sm font-semibold">Real-time</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{integrations.length}</div>
            <div className="text-gray-300 text-sm">Integrações Ativas</div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <span className="text-red-400 text-sm font-semibold">{errorCount > 0 ? 'Atenção' : 'OK'}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{errorCount}</div>
            <div className="text-gray-300 text-sm">Conexões com Erro</div>
          </div>
        </div>

        {/* Channel Integrations */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Integrações de Canais</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAdvancedAction('bulk-operations')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleAdvancedAction('export-data')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Database className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#FF7A00]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${
                      integration.status === 'connected' ? 'from-green-500 to-green-600' :
                      integration.status === 'error' ? 'from-red-500 to-red-600' :
                      integration.status === 'pending' ? 'from-yellow-500 to-yellow-600' :
                      'from-gray-500 to-gray-600'
                    } rounded-xl flex items-center justify-center`}>
                      <integration.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{integration.name}</h4>
                      <p className="text-gray-400 text-sm">{integration.description}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(integration.status)}`}>
                    {integration.status.toUpperCase()}
                  </div>
                </div>

                {/* Metrics */}
                {integration.metrics && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-green-400 text-lg font-bold">{integration.metrics.messagesReceived}</div>
                      <div className="text-gray-400 text-xs">Recebidas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 text-lg font-bold">{integration.metrics.messagesSent}</div>
                      <div className="text-gray-400 text-xs">Enviadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-sm font-bold">{formatLastActivity(integration.metrics.lastActivity)}</div>
                      <div className="text-gray-400 text-xs">Última atividade</div>
                    </div>
                  </div>
                )}

                {/* Configuration Status */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Configuração</span>
                    <div className="flex items-center space-x-2">
                      {integration.config && Object.keys(integration.config).length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-xs text-gray-400">
                        {integration.config && Object.keys(integration.config).length > 0 ? 'Configurado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleConfigureIntegration(integration.id)}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Configurar</span>
                  </button>
                  
                  {integration.status === 'connected' && (
                    <button
                      onClick={() => handleTestConnection(integration.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Testar</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleAdvancedAction('advanced-config', integration.id)}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp QR Code Connections */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Conexões WhatsApp (QR Code)</h3>
            <button
              onClick={() => handleAdvancedAction('create-connection')}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Conexão</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
            >
              <option value="all" className="bg-[#2D0B55]">Todos os Status</option>
              <option value="connected" className="bg-[#2D0B55]">Conectado</option>
              <option value="disconnected" className="bg-[#2D0B55]">Desconectado</option>
              <option value="connecting" className="bg-[#2D0B55]">Conectando</option>
              <option value="error" className="bg-[#2D0B55]">Erro</option>
            </select>
          </div>

          {/* Connections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#FF7A00]/50 transition-all duration-300"
              >
                {/* Connection Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(connection.status)}
                    <div>
                      <h3 className="text-white font-semibold">{connection.sessionName}</h3>
                      <p className="text-gray-400 text-sm">{connection.phoneNumber}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(connection.status)}`}>
                    {connection.status.toUpperCase()}
                  </div>
                </div>

                {/* QR Code for connecting sessions */}
                {connection.status === 'connecting' && connection.qrCode && (
                  <div className="mb-4 p-4 bg-white rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-800 text-sm font-semibold">Escaneie o QR Code</span>
                      <button
                        onClick={() => setShowQRCode(showQRCode === connection.id ? null : connection.id)}
                        className="text-[#FF7A00] hover:text-[#FF9500] transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                    {showQRCode === connection.id && (
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}

                {/* Message Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-green-400 text-lg font-bold">{connection.messagesCount.sent}</div>
                    <div className="text-gray-400 text-xs">Enviadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 text-lg font-bold">{connection.messagesCount.received}</div>
                    <div className="text-gray-400 text-xs">Recebidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 text-lg font-bold">{connection.messagesCount.failed}</div>
                    <div className="text-gray-400 text-xs">Falhas</div>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Última atividade</span>
                  </div>
                  <span className="text-white text-sm">{formatLastActivity(connection.lastActivity)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {connection.status === 'connected' && (
                    <button
                      onClick={() => window.location.href = '/conversations'}
                      className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Mensagens</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleAdvancedAction('advanced-config', connection.id)}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => handleAdvancedAction('delete-connection', connection.id)}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Modal */}
        {showConfigModal && currentIntegration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <currentIntegration.icon className="w-8 h-8 text-[#FF7A00]" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Configurar {currentIntegration.name}</h3>
                    <p className="text-gray-400 text-sm">{currentIntegration.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {channelConfig.docs && (
                    <a
                      href={channelConfig.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF7A00] hover:text-[#FF9500] transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => setShowConfigModal(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {channelConfig.fields.map((field) => (
                  <div key={field.key} className={field.type === 'textarea' ? 'lg:col-span-2' : ''}>
                    <label className="block text-white font-semibold mb-2">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={configForm[field.key] || ''}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                      >
                        <option value="" className="bg-[#2D0B55]">Selecione...</option>
                        {field.options?.map(option => (
                          <option key={option} value={option} className="bg-[#2D0B55]">{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={configForm[field.key] || ''}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                      />
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type === 'password' && !showSecrets[field.key] ? 'password' : 'text'}
                          value={configForm[field.key] || ''}
                          onChange={(e) => setConfigForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                          {field.type === 'password' && (
                            <button
                              onClick={() => toggleSecretVisibility(field.key)}
                              className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                              {showSecrets[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                          <button
                            onClick={() => copyToClipboard(configForm[field.key] || '')}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-blue-300 font-semibold">Segurança & Privacidade</div>
                    <div className="text-blue-200 text-sm">
                      Todas as credenciais são criptografadas com AES-256 e armazenadas com segurança. 
                      Nunca compartilhamos suas informações com terceiros.
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Link */}
              {channelConfig.docs && (
                <div className="mt-4 bg-[#FF7A00]/20 border border-[#FF7A00]/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5 text-[#FF7A00]" />
                    <div>
                      <div className="text-[#FF7A00] font-semibold">Documentação Oficial</div>
                      <a 
                        href={channelConfig.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-200 text-sm hover:text-white transition-colors"
                      >
                        Consulte a documentação oficial para obter suas credenciais →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowConfigModal(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleTestConnection(currentIntegration.id)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Testar</span>
                </button>
                <button
                  onClick={handleSaveConfig}
                  disabled={isLoading}
                  className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    'Salvar Configuração'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Integration Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Adicionar Nova Integração</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'WhatsApp QR Code', icon: QrCode, type: 'whatsapp-qr', popular: true, description: 'Conexão via QR Code' },
                  { name: 'WhatsApp Business API', icon: MessageSquare, type: 'whatsapp-business', popular: true, description: 'API oficial do WhatsApp' },
                  { name: 'Instagram Direct', icon: Instagram, type: 'instagram', popular: true, description: 'Mensagens diretas do Instagram' },
                  { name: 'Facebook Messenger', icon: Facebook, type: 'facebook', popular: false, description: 'Chat do Facebook' },
                  { name: 'Telegram Bot', icon: Send, type: 'telegram', popular: true, description: 'Bot do Telegram' },
                  { name: 'Email SMTP', icon: Mail, type: 'email', popular: true, description: 'Integração de email' },
                  { name: 'SMS Gateway', icon: Phone, type: 'sms', popular: false, description: 'Mensagens SMS' },
                  { name: 'Webhook Custom', icon: Webhook, type: 'webhook', popular: false, description: 'Integração customizada' },
                ].map((channel, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setShowAddModal(false);
                      if (channel.type === 'whatsapp-qr') {
                        handleAdvancedAction('create-connection');
                      } else {
                        const existingIntegration = integrations.find(i => i.type === channel.type);
                        if (existingIntegration) {
                          handleConfigureIntegration(existingIntegration.id);
                        } else {
                          handleAdvancedAction('create-connection');
                        }
                      }
                    }}
                    className="relative bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 hover:border-[#FF7A00]/50 transition-all duration-300 text-left group"
                  >
                    {channel.popular && (
                      <div className="absolute -top-2 -right-2 bg-[#FF7A00] text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <channel.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">{channel.name}</h4>
                    <p className="text-gray-400 text-sm">{channel.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Não encontrou o que procura? 
                  <button 
                    onClick={() => handleAdvancedAction('advanced-config')}
                    className="text-[#FF7A00] hover:text-[#FF9500] ml-1 transition-colors"
                  >
                    Solicite uma integração customizada
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Demo Alert */}
        <DemoAlert
          isOpen={showDemoAlert}
          onClose={closeDemoAlert}
          title={demoAlertConfig.title}
          message={demoAlertConfig.message}
        />
      </div>
    </DashboardLayout>
  );
};

export default ConnectionsPage;