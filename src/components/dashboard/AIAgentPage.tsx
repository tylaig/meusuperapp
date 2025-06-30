import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Settings, 
  Save, 
  Play, 
  Pause, 
  Upload, 
  Download, 
  Eye, 
  EyeOff,
  Copy,
  RefreshCw,
  Mic,
  FileText,
  Code,
  Globe,
  Zap,
  BarChart3,
  MessageSquare,
  Smartphone,
  Monitor,
  Share2,
  Key,
  TestTube,
  GitBranch,
  Activity,
  Database,
  Brain,
  Sliders,
  Palette,
  Languages,
  Volume2,
  FileAudio,
  Cpu,
  Network,
  Link,
  Webhook,
  Search,
  Filter,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Target,
  Layers,
  Sparkles,
  Wand2,
  BookOpen,
  GraduationCap,
  Lightbulb
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  pricing: string;
  contextWindow: number;
  maxTokens: number;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'http' | 'function' | 'integration';
  config: any;
  enabled: boolean;
}

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  prompt: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  personality: {
    tone: string;
    style: string;
    formality: string;
  };
  context: string;
  language: string;
  locale: string;
  capabilities: {
    rag: boolean;
    speechToText: boolean;
    textToSpeech: boolean;
    fineTuning: boolean;
  };
  tools: string[];
  distribution: {
    channels: string[];
    widget: any;
    apiKeys: string[];
  };
  version: string;
  status: 'draft' | 'training' | 'active' | 'paused';
  createdAt: string;
  lastModified: string;
}

interface TestResult {
  id: string;
  input: string;
  output: string;
  timestamp: string;
  responseTime: number;
  tokensUsed: number;
  rating?: number;
}

const AIAgentPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AgentConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'personality' | 'capabilities' | 'tools' | 'distribution'>('basic');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testInput, setTestInput] = useState('');
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [showToolSearch, setShowToolSearch] = useState(false);
  const [toolSearchTerm, setToolSearchTerm] = useState('');
  const [selectedToolCategory, setSelectedToolCategory] = useState('all');
  const [showVersions, setShowVersions] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const aiModels: AIModel[] = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      description: 'Most capable model with 128k context window',
      capabilities: ['text', 'code', 'analysis', 'reasoning'],
      pricing: '$0.01/1K tokens',
      contextWindow: 128000,
      maxTokens: 4096
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'Excellent for complex reasoning and analysis',
      capabilities: ['text', 'analysis', 'reasoning', 'creative'],
      pricing: '$0.015/1K tokens',
      contextWindow: 200000,
      maxTokens: 4096
    },
    {
      id: 'llama-2-70b',
      name: 'LLaMA 2 70B',
      provider: 'Meta',
      description: 'Open source model with strong performance',
      capabilities: ['text', 'code', 'reasoning'],
      pricing: '$0.0007/1K tokens',
      contextWindow: 4096,
      maxTokens: 2048
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Multimodal capabilities with strong reasoning',
      capabilities: ['text', 'vision', 'code', 'reasoning'],
      pricing: '$0.0005/1K tokens',
      contextWindow: 32000,
      maxTokens: 2048
    }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Profissional', description: 'Tom corporativo e respeitoso' },
    { value: 'friendly', label: 'Amigável', description: 'Caloroso e acolhedor' },
    { value: 'casual', label: 'Casual', description: 'Descontraído e informal' },
    { value: 'technical', label: 'Técnico', description: 'Preciso e especializado' },
    { value: 'empathetic', label: 'Empático', description: 'Compreensivo e solidário' },
    { value: 'enthusiastic', label: 'Entusiasmado', description: 'Energético e motivador' }
  ];

  const styleOptions = [
    { value: 'concise', label: 'Conciso', description: 'Respostas diretas e objetivas' },
    { value: 'detailed', label: 'Detalhado', description: 'Explicações completas e abrangentes' },
    { value: 'conversational', label: 'Conversacional', description: 'Diálogo natural e fluido' },
    { value: 'educational', label: 'Educativo', description: 'Ensina e explica conceitos' },
    { value: 'persuasive', label: 'Persuasivo', description: 'Convincente e orientado a vendas' }
  ];

  const distributionChannels = [
    { id: 'web', name: 'Website Widget', icon: Globe, description: 'Chat widget para seu site' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, description: 'Integração com WhatsApp Business' },
    { id: 'instagram', name: 'Instagram', icon: MessageSquare, description: 'Direct messages do Instagram' },
    { id: 'api', name: 'API REST', icon: Code, description: 'Acesso via API para desenvolvedores' },
    { id: 'mobile', name: 'App Mobile', icon: Smartphone, description: 'SDK para aplicativos móveis' },
    { id: 'slack', name: 'Slack', icon: MessageSquare, description: 'Bot para equipes no Slack' }
  ];

  useEffect(() => {
    loadAgents();
    loadAvailableTools();
  }, []);

  const loadAgents = () => {
    const mockAgents: AgentConfig[] = [
      {
        id: '1',
        name: 'Assistente de Vendas',
        description: 'IA especializada em qualificação de leads e vendas consultivas',
        model: 'gpt-4-turbo',
        prompt: `Você é um assistente de vendas especializado em qualificar leads e conduzir vendas consultivas. 

Seu objetivo é:
1. Entender as necessidades do cliente
2. Qualificar o lead (orçamento, autoridade, necessidade, tempo)
3. Apresentar soluções adequadas
4. Conduzir para o fechamento

Mantenha sempre um tom profissional mas amigável, faça perguntas abertas para entender melhor o cliente e sempre busque agregar valor na conversa.`,
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 1000,
        personality: {
          tone: 'professional',
          style: 'conversational',
          formality: 'balanced'
        },
        context: 'Empresa de tecnologia que oferece soluções de IA para automação de vendas e atendimento ao cliente.',
        language: 'pt-BR',
        locale: 'Brazil',
        capabilities: {
          rag: true,
          speechToText: true,
          textToSpeech: false,
          fineTuning: false
        },
        tools: ['crm-integration', 'calendar-booking', 'product-catalog'],
        distribution: {
          channels: ['web', 'whatsapp', 'api'],
          widget: {
            theme: 'modern',
            position: 'bottom-right',
            color: '#FF7A00'
          },
          apiKeys: ['sk_live_123...', 'sk_test_456...']
        },
        version: '2.1.0',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        lastModified: new Date().toISOString()
      }
    ];

    setAgents(mockAgents);
    if (mockAgents.length > 0) {
      setCurrentAgent(mockAgents[0]);
    }
  };

  const loadAvailableTools = () => {
    const mockTools: Tool[] = [
      {
        id: 'crm-integration',
        name: 'CRM Integration',
        description: 'Integração com sistemas CRM para buscar e atualizar dados de clientes',
        category: 'crm',
        type: 'integration',
        config: { endpoint: 'https://api.crm.com', auth: 'bearer' },
        enabled: true
      },
      {
        id: 'calendar-booking',
        name: 'Agendamento de Reuniões',
        description: 'Permite agendar reuniões automaticamente',
        category: 'scheduling',
        type: 'integration',
        config: { calendar: 'google', timezone: 'America/Sao_Paulo' },
        enabled: true
      },
      {
        id: 'product-catalog',
        name: 'Catálogo de Produtos',
        description: 'Busca informações detalhadas sobre produtos e serviços',
        category: 'ecommerce',
        type: 'function',
        config: { database: 'products', searchFields: ['name', 'description', 'category'] },
        enabled: true
      },
      {
        id: 'payment-processor',
        name: 'Processamento de Pagamentos',
        description: 'Gera links de pagamento e processa transações',
        category: 'payment',
        type: 'integration',
        config: { provider: 'stripe', currency: 'BRL' },
        enabled: false
      },
      {
        id: 'email-sender',
        name: 'Envio de Emails',
        description: 'Envia emails personalizados e campanhas',
        category: 'communication',
        type: 'integration',
        config: { provider: 'sendgrid', templates: true },
        enabled: false
      }
    ];

    setAvailableTools(mockTools);
  };

  const handleSaveAgent = () => {
    if (!currentAgent) return;

    const updatedAgent = {
      ...currentAgent,
      lastModified: new Date().toISOString()
    };

    setAgents(prev => prev.map(a => a.id === currentAgent.id ? updatedAgent : a));
    setCurrentAgent(updatedAgent);
  };

  const handleTestAgent = async () => {
    if (!testInput.trim() || !currentAgent) return;

    setIsTesting(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResponse = `Olá! Entendi que você tem interesse em nossos serviços de IA. Para que eu possa te ajudar da melhor forma, me conte um pouco mais sobre:

1. Qual é o principal desafio que você está enfrentando atualmente?
2. Quantos leads vocês recebem por mês aproximadamente?
3. Qual é o seu orçamento estimado para uma solução de automação?

Com essas informações, posso apresentar a solução mais adequada para o seu negócio.`;

    const newResult: TestResult = {
      id: Date.now().toString(),
      input: testInput,
      output: mockResponse,
      timestamp: new Date().toISOString(),
      responseTime: 1.8,
      tokensUsed: 156
    };

    setTestResults(prev => [newResult, ...prev]);
    setTestInput('');
    setIsTesting(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
      if (currentAgent) {
        setCurrentAgent({
          ...currentAgent,
          status: 'active',
          version: '2.2.0'
        });
      }
    }, 5000);
  };

  const generatePromptPreview = () => {
    if (!currentAgent) return '';

    return `${currentAgent.prompt}

CONFIGURAÇÕES:
- Tom: ${currentAgent.personality.tone}
- Estilo: ${currentAgent.personality.style}
- Idioma: ${currentAgent.language}
- Contexto: ${currentAgent.context}

FERRAMENTAS DISPONÍVEIS:
${currentAgent.tools.map(toolId => {
  const tool = availableTools.find(t => t.id === toolId);
  return tool ? `- ${tool.name}: ${tool.description}` : '';
}).filter(Boolean).join('\n')}`;
  };

  const filteredTools = availableTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(toolSearchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(toolSearchTerm.toLowerCase());
    const matchesCategory = selectedToolCategory === 'all' || tool.category === selectedToolCategory;
    return matchesSearch && matchesCategory;
  });

  const toolCategories = [...new Set(availableTools.map(tool => tool.category))];

  return (
    <DashboardLayout currentPage="ai-agent">
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-[#FF7A00]" />
              <h1 className="text-xl font-bold text-white">Configuração de Agente IA</h1>
            </div>
            
            {currentAgent && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">/</span>
                <span className="text-white font-medium">{currentAgent.name}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  currentAgent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  currentAgent.status === 'training' ? 'bg-blue-500/20 text-blue-400' :
                  currentAgent.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {currentAgent.status}
                </div>
                <span className="text-gray-400 text-sm">v{currentAgent.version}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <GitBranch className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isPreviewOpen ? 'bg-[#FF7A00] text-white' : 'bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleSaveAgent}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Treinando...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Treinar Agente</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Configuration Area */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-white/5">
              {[
                { id: 'basic', label: 'Configurações Básicas', icon: Settings },
                { id: 'personality', label: 'Personalidade', icon: Palette },
                { id: 'capabilities', label: 'Capacidades', icon: Zap },
                { id: 'tools', label: 'Ferramentas', icon: Layers },
                { id: 'distribution', label: 'Distribuição', icon: Share2 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FF7A00]/10'
                      : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentAgent && (
                <>
                  {/* Basic Configuration */}
                  {activeTab === 'basic' && (
                    <div className="space-y-8 max-w-4xl">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Agent Info */}
                        <div className="space-y-6">
                          <div>
                            <label className="block text-white font-semibold mb-3">Nome do Agente</label>
                            <input
                              type="text"
                              value={currentAgent.name}
                              onChange={(e) => setCurrentAgent({...currentAgent, name: e.target.value})}
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none"
                              placeholder="Ex: Assistente de Vendas"
                            />
                          </div>

                          <div>
                            <label className="block text-white font-semibold mb-3">Descrição</label>
                            <textarea
                              value={currentAgent.description}
                              onChange={(e) => setCurrentAgent({...currentAgent, description: e.target.value})}
                              rows={3}
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none resize-none"
                              placeholder="Descreva o propósito e função do agente..."
                            />
                          </div>

                          <div>
                            <label className="block text-white font-semibold mb-3">Modelo de IA</label>
                            <select
                              value={currentAgent.model}
                              onChange={(e) => setCurrentAgent({...currentAgent, model: e.target.value})}
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none"
                            >
                              {aiModels.map((model) => (
                                <option key={model.id} value={model.id} className="bg-[#2D0B55]">
                                  {model.name} - {model.provider}
                                </option>
                              ))}
                            </select>
                            <div className="mt-2 p-3 bg-white/5 rounded-lg">
                              {(() => {
                                const selectedModel = aiModels.find(m => m.id === currentAgent.model);
                                return selectedModel ? (
                                  <div className="text-sm text-gray-300">
                                    <p className="mb-2">{selectedModel.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                      <span className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded text-xs">
                                        {selectedModel.pricing}
                                      </span>
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                        {selectedModel.contextWindow.toLocaleString()} tokens
                                      </span>
                                    </div>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Model Parameters */}
                        <div className="space-y-6">
                          <div>
                            <label className="block text-white font-semibold mb-3">
                              Temperatura: {currentAgent.temperature}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="2"
                              step="0.1"
                              value={currentAgent.temperature}
                              onChange={(e) => setCurrentAgent({...currentAgent, temperature: parseFloat(e.target.value)})}
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>Conservador</span>
                              <span>Criativo</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-white font-semibold mb-3">
                              Top-p: {currentAgent.topP}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={currentAgent.topP}
                              onChange={(e) => setCurrentAgent({...currentAgent, topP: parseFloat(e.target.value)})}
                              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>Focado</span>
                              <span>Diverso</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-white font-semibold mb-3">Máximo de Tokens</label>
                            <input
                              type="number"
                              value={currentAgent.maxTokens}
                              onChange={(e) => setCurrentAgent({...currentAgent, maxTokens: parseInt(e.target.value)})}
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none"
                              min="100"
                              max="4096"
                            />
                          </div>

                          <div>
                            <label className="block text-white font-semibold mb-3">Idioma e Localização</label>
                            <div className="grid grid-cols-2 gap-3">
                              <select
                                value={currentAgent.language}
                                onChange={(e) => setCurrentAgent({...currentAgent, language: e.target.value})}
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none"
                              >
                                <option value="pt-BR" className="bg-[#2D0B55]">Português (BR)</option>
                                <option value="en-US" className="bg-[#2D0B55]">English (US)</option>
                                <option value="es-ES" className="bg-[#2D0B55]">Español</option>
                                <option value="fr-FR" className="bg-[#2D0B55]">Français</option>
                              </select>
                              <select
                                value={currentAgent.locale}
                                onChange={(e) => setCurrentAgent({...currentAgent, locale: e.target.value})}
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none"
                              >
                                <option value="Brazil" className="bg-[#2D0B55]">Brasil</option>
                                <option value="US" className="bg-[#2D0B55]">Estados Unidos</option>
                                <option value="Spain" className="bg-[#2D0B55]">Espanha</option>
                                <option value="France" className="bg-[#2D0B55]">França</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prompt Editor */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-white font-semibold">Prompt Principal</label>
                          <button
                            onClick={() => setShowPromptPreview(!showPromptPreview)}
                            className="flex items-center space-x-2 text-[#FF7A00] hover:text-[#FF9500] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                          </button>
                        </div>
                        <textarea
                          value={currentAgent.prompt}
                          onChange={(e) => setCurrentAgent({...currentAgent, prompt: e.target.value})}
                          rows={12}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none resize-none font-mono text-sm"
                          placeholder="Defina o comportamento, personalidade e instruções para o agente..."
                        />
                        {showPromptPreview && (
                          <div className="mt-4 p-4 bg-black/50 rounded-lg">
                            <h4 className="text-white font-semibold mb-2">Preview do Prompt Completo</h4>
                            <pre className="text-gray-300 text-sm whitespace-pre-wrap">{generatePromptPreview()}</pre>
                          </div>
                        )}
                      </div>

                      {/* Context */}
                      <div>
                        <label className="block text-white font-semibold mb-3">Contexto e Conhecimento Base</label>
                        <textarea
                          value={currentAgent.context}
                          onChange={(e) => setCurrentAgent({...currentAgent, context: e.target.value})}
                          rows={4}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none resize-none"
                          placeholder="Informações sobre sua empresa, produtos, serviços e contexto de negócio..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Personality Configuration */}
                  {activeTab === 'personality' && (
                    <div className="space-y-8 max-w-4xl">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tone of Voice */}
                        <div>
                          <label className="block text-white font-semibold mb-4">Tom de Voz</label>
                          <div className="grid grid-cols-1 gap-3">
                            {toneOptions.map((tone) => (
                              <label
                                key={tone.value}
                                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  currentAgent.personality.tone === tone.value
                                    ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                                    : 'border-white/20 hover:border-white/40'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="tone"
                                  value={tone.value}
                                  checked={currentAgent.personality.tone === tone.value}
                                  onChange={(e) => setCurrentAgent({
                                    ...currentAgent,
                                    personality: { ...currentAgent.personality, tone: e.target.value }
                                  })}
                                  className="mt-1"
                                />
                                <div>
                                  <div className="text-white font-medium">{tone.label}</div>
                                  <div className="text-gray-400 text-sm">{tone.description}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Response Style */}
                        <div>
                          <label className="block text-white font-semibold mb-4">Estilo de Resposta</label>
                          <div className="grid grid-cols-1 gap-3">
                            {styleOptions.map((style) => (
                              <label
                                key={style.value}
                                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  currentAgent.personality.style === style.value
                                    ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                                    : 'border-white/20 hover:border-white/40'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="style"
                                  value={style.value}
                                  checked={currentAgent.personality.style === style.value}
                                  onChange={(e) => setCurrentAgent({
                                    ...currentAgent,
                                    personality: { ...currentAgent.personality, style: e.target.value }
                                  })}
                                  className="mt-1"
                                />
                                <div>
                                  <div className="text-white font-medium">{style.label}</div>
                                  <div className="text-gray-400 text-sm">{style.description}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Preview Examples */}
                      <div className="bg-white/5 rounded-lg p-6">
                        <h3 className="text-white font-semibold mb-4">Exemplos de Resposta</h3>
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-gray-400 text-sm mb-2">Pergunta: "Quanto custa seu produto?"</div>
                            <div className="text-white">
                              {currentAgent.personality.tone === 'professional' && currentAgent.personality.style === 'concise' && 
                                "Nossos planos começam em R$ 497/mês. Posso agendar uma demonstração para mostrar qual seria o melhor para seu negócio?"
                              }
                              {currentAgent.personality.tone === 'friendly' && currentAgent.personality.style === 'detailed' && 
                                "Oi! Que bom que você tem interesse! Nossos preços variam conforme suas necessidades específicas. Temos planos a partir de R$ 497/mês, mas o ideal é conversarmos para entender melhor seu cenário e encontrar a solução perfeita. Que tal marcarmos uma conversa rápida?"
                              }
                              {currentAgent.personality.tone === 'casual' && currentAgent.personality.style === 'conversational' && 
                                "Olha, depende do que você precisa! Nossos planos começam em R$ 497/mês, mas posso te ajudar a encontrar algo que caiba no seu orçamento. Me conta um pouco mais sobre seu negócio?"
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Capabilities Configuration */}
                  {activeTab === 'capabilities' && (
                    <div className="space-y-8 max-w-4xl">
                      {/* Advanced Capabilities */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold text-white">Capacidades Avançadas</h3>
                          
                          {/* RAG */}
                          <div className="bg-white/5 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <Database className="w-6 h-6 text-[#FF7A00]" />
                                <div>
                                  <h4 className="text-white font-semibold">RAG (Retrieval-Augmented Generation)</h4>
                                  <p className="text-gray-400 text-sm">Conhecimento personalizado via documentos</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={currentAgent.capabilities.rag}
                                  onChange={(e) => setCurrentAgent({
                                    ...currentAgent,
                                    capabilities: { ...currentAgent.capabilities, rag: e.target.checked }
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                              </label>
                            </div>
                            
                            {currentAgent.capabilities.rag && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-white font-medium mb-2">Upload de Documentos</label>
                                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      multiple
                                      accept=".pdf,.txt,.docx,.md"
                                      onChange={handleFileUpload}
                                      className="hidden"
                                    />
                                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-300 mb-2">Arraste arquivos ou clique para fazer upload</p>
                                    <button
                                      onClick={() => fileInputRef.current?.click()}
                                      className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                      Selecionar Arquivos
                                    </button>
                                  </div>
                                  
                                  {uploadedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                      {uploadedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                                          <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 text-[#FF7A00]" />
                                            <span className="text-white text-sm">{file.name}</span>
                                            <span className="text-gray-400 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                                          </div>
                                          <button
                                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-white font-medium mb-2">Modelo de Embedding</label>
                                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                                      <option value="text-embedding-ada-002" className="bg-[#2D0B55]">OpenAI Ada-002</option>
                                      <option value="sentence-transformers" className="bg-[#2D0B55]">Sentence Transformers</option>
                                      <option value="cohere-embed" className="bg-[#2D0B55]">Cohere Embed</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-white font-medium mb-2">Chunk Size</label>
                                    <input
                                      type="number"
                                      defaultValue="1000"
                                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Speech-to-Text */}
                          <div className="bg-white/5 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <Mic className="w-6 h-6 text-[#FF7A00]" />
                                <div>
                                  <h4 className="text-white font-semibold">Speech-to-Text</h4>
                                  <p className="text-gray-400 text-sm">Conversão de áudio para texto</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={currentAgent.capabilities.speechToText}
                                  onChange={(e) => setCurrentAgent({
                                    ...currentAgent,
                                    capabilities: { ...currentAgent.capabilities, speechToText: e.target.checked }
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                              </label>
                            </div>
                            
                            {currentAgent.capabilities.speechToText && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-white font-medium mb-2">Modelo STT</label>
                                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                                    <option value="whisper-1" className="bg-[#2D0B55]">OpenAI Whisper</option>
                                    <option value="google-stt" className="bg-[#2D0B55]">Google Speech-to-Text</option>
                                    <option value="azure-stt" className="bg-[#2D0B55]">Azure Speech</option>
                                  </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-white font-medium mb-2">Idioma</label>
                                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                                      <option value="pt-BR" className="bg-[#2D0B55]">Português (BR)</option>
                                      <option value="en-US" className="bg-[#2D0B55]">English (US)</option>
                                      <option value="es-ES" className="bg-[#2D0B55]">Español</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-white font-medium mb-2">Qualidade</label>
                                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                                      <option value="standard" className="bg-[#2D0B55]">Padrão</option>
                                      <option value="enhanced" className="bg-[#2D0B55]">Aprimorada</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-6">
                          {/* Text-to-Speech */}
                          <div className="bg-white/5 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <Volume2 className="w-6 h-6 text-[#FF7A00]" />
                                <div>
                                  <h4 className="text-white font-semibold">Text-to-Speech</h4>
                                  <p className="text-gray-400 text-sm">Síntese de voz natural</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={currentAgent.capabilities.textToSpeech}
                                  onChange={(e) => setCurrentAgent({
                                    ...currentAgent,
                                    capabilities: { ...currentAgent.capabilities, textToSpeech: e.target.checked }
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                              </label>
                            </div>
                            
                            {currentAgent.capabilities.textToSpeech && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-white font-medium mb-2">Voz</label>
                                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                                    <option value="alloy" className="bg-[#2D0B55]">Alloy (Neutro)</option>
                                    <option value="echo" className="bg-[#2D0B55]">Echo (Masculino)</option>
                                    <option value="fable" className="bg-[#2D0B55]">Fable (Feminino)</option>
                                    <option value="onyx" className="bg-[#2D0B55]">Onyx (Grave)</option>
                                    <option value="nova" className="bg-[#2D0B55]">Nova (Jovem)</option>
                                    <option value="shimmer" className="bg-[#2D0B55]">Shimmer (Suave)</option>
                                  </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-white font-medium mb-2">Velocidade</label>
                                    <input
                                      type="range"
                                      min="0.25"
                                      max="4.0"
                                      step="0.25"
                                      defaultValue="1.0"
                                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-white font-medium mb-2">Formato</label>
                                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                                      <option value="mp3" className="bg-[#2D0B55]">MP3</option>
                                      <option value="opus" className="bg-[#2D0B55]">Opus</option>
                                      <option value="aac" className="bg-[#2D0B55]">AAC</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Fine-tuning */}
                          <div className="bg-white/5 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <GraduationCap className="w-6 h-6 text-[#FF7A00]" />
                                <div>
                                  <h4 className="text-white font-semibold">Fine-tuning</h4>
                                  <p className="text-gray-400 text-sm">Treinamento personalizado</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={currentAgent.capabilities.fineTuning}
                                  onChange={(e) => setCurrentAgent({
                                    ...currentAgent,
                                    capabilities: { ...currentAgent.capabilities, fineTuning: e.target.checked }
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
                              </label>
                            </div>
                            
                            {currentAgent.capabilities.fineTuning && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-white font-medium mb-2">Dataset de Treinamento</label>
                                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center">
                                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-300 text-sm mb-2">Upload do dataset (JSONL)</p>
                                    <button className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-3 py-2 rounded text-sm transition-colors">
                                      Selecionar Arquivo
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-white font-medium mb-2">Épocas</label>
                                    <input
                                      type="number"
                                      defaultValue="3"
                                      min="1"
                                      max="10"
                                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-white font-medium mb-2">Learning Rate</label>
                                    <input
                                      type="number"
                                      defaultValue="0.0001"
                                      step="0.0001"
                                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tools Configuration */}
                  {activeTab === 'tools' && (
                    <div className="space-y-8 max-w-6xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Ferramentas e Integrações</h3>
                        <button
                          onClick={() => setShowToolSearch(!showToolSearch)}
                          className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar Ferramenta</span>
                        </button>
                      </div>

                      {/* Tool Search Modal */}
                      {showToolSearch && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-white">Biblioteca de Ferramentas</h3>
                              <button
                                onClick={() => setShowToolSearch(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="flex gap-4 mb-6">
                              <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="text"
                                  placeholder="Buscar ferramentas..."
                                  value={toolSearchTerm}
                                  onChange={(e) => setToolSearchTerm(e.target.value)}
                                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none"
                                />
                              </div>
                              <select
                                value={selectedToolCategory}
                                onChange={(e) => setSelectedToolCategory(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                              >
                                <option value="all" className="bg-[#2D0B55]">Todas as categorias</option>
                                {toolCategories.map(category => (
                                  <option key={category} value={category} className="bg-[#2D0B55] capitalize">
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {filteredTools.map((tool) => (
                                <div
                                  key={tool.id}
                                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#FF7A00]/50 transition-all"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h4 className="text-white font-semibold">{tool.name}</h4>
                                      <p className="text-gray-400 text-sm">{tool.description}</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        if (!currentAgent.tools.includes(tool.id)) {
                                          setCurrentAgent({
                                            ...currentAgent,
                                            tools: [...currentAgent.tools, tool.id]
                                          });
                                        }
                                      }}
                                      disabled={currentAgent.tools.includes(tool.id)}
                                      className={`px-3 py-1 rounded text-sm transition-colors ${
                                        currentAgent.tools.includes(tool.id)
                                          ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                                          : 'bg-[#FF7A00] hover:bg-[#FF9500] text-white'
                                      }`}
                                    >
                                      {currentAgent.tools.includes(tool.id) ? 'Adicionada' : 'Adicionar'}
                                    </button>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 capitalize">
                                      {tool.category}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                      {tool.type}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Active Tools */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {currentAgent.tools.map((toolId) => {
                          const tool = availableTools.find(t => t.id === toolId);
                          if (!tool) return null;

                          return (
                            <div key={tool.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-[#FF7A00] rounded-lg flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-white font-semibold">{tool.name}</h4>
                                    <p className="text-gray-400 text-sm">{tool.description}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setCurrentAgent({
                                    ...currentAgent,
                                    tools: currentAgent.tools.filter(id => id !== tool.id)
                                  })}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Tool Configuration */}
                              <div className="space-y-4">
                                {tool.type === 'http' && (
                                  <>
                                    <div>
                                      <label className="block text-white font-medium mb-2">Endpoint URL</label>
                                      <input
                                        type="url"
                                        defaultValue={tool.config?.endpoint}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                                        placeholder="https://api.example.com/endpoint"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-white font-medium mb-2">Método HTTP</label>
                                      <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                                        <option value="GET" className="bg-[#2D0B55]">GET</option>
                                        <option value="POST" className="bg-[#2D0B55]">POST</option>
                                        <option value="PUT" className="bg-[#2D0B55]">PUT</option>
                                        <option value="DELETE" className="bg-[#2D0B55]">DELETE</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-white font-medium mb-2">Headers</label>
                                      <textarea
                                        rows={3}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none font-mono text-sm"
                                        placeholder='{"Authorization": "Bearer token"}'
                                      />
                                    </div>
                                  </>
                                )}

                                {tool.type === 'integration' && (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-white font-medium">Status da Conexão</span>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-400 text-sm">Conectado</span>
                                      </div>
                                    </div>
                                    <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                                      Reconfigurar Integração
                                    </button>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                  <span className="text-gray-400 text-sm">Categoria: {tool.category}</span>
                                  <button className="text-[#FF7A00] hover:text-[#FF9500] text-sm transition-colors">
                                    Testar Ferramenta
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Custom Tool Creation */}
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="text-white font-semibold mb-4">Criar Ferramenta Personalizada</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-white font-medium mb-2">Nome da Ferramenta</label>
                              <input
                                type="text"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                                placeholder="Ex: Consulta de Estoque"
                              />
                            </div>
                            <div>
                              <label className="block text-white font-medium mb-2">Descrição</label>
                              <textarea
                                rows={3}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none"
                                placeholder="Descreva o que esta ferramenta faz..."
                              />
                            </div>
                            <div>
                              <label className="block text-white font-medium mb-2">Tipo</label>
                              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                                <option value="http" className="bg-[#2D0B55]">HTTP/REST API</option>
                                <option value="function" className="bg-[#2D0B55]">Função JavaScript</option>
                                <option value="webhook" className="bg-[#2D0B55]">Webhook</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-white font-medium mb-2">Configuração (JSON)</label>
                              <textarea
                                rows={8}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none font-mono text-sm"
                                placeholder={`{
  "endpoint": "https://api.example.com",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer token"
  }
}`}
                              />
                            </div>
                            <button className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors">
                              Criar Ferramenta
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Distribution Configuration */}
                  {activeTab === 'distribution' && (
                    <div className="space-y-8 max-w-6xl">
                      {/* Distribution Channels */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-6">Canais de Distribuição</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {distributionChannels.map((channel) => (
                            <div
                              key={channel.id}
                              className={`bg-white/5 rounded-lg p-6 border-2 cursor-pointer transition-all ${
                                currentAgent.distribution.channels.includes(channel.id)
                                  ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                                  : 'border-white/10 hover:border-white/30'
                              }`}
                              onClick={() => {
                                const channels = currentAgent.distribution.channels.includes(channel.id)
                                  ? currentAgent.distribution.channels.filter(c => c !== channel.id)
                                  : [...currentAgent.distribution.channels, channel.id];
                                
                                setCurrentAgent({
                                  ...currentAgent,
                                  distribution: { ...currentAgent.distribution, channels }
                                });
                              }}
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-[#FF7A00] rounded-lg flex items-center justify-center">
                                  <channel.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">{channel.name}</h4>
                                  <p className="text-gray-400 text-sm">{channel.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  {currentAgent.distribution.channels.includes(channel.id) ? 'Ativo' : 'Inativo'}
                                </span>
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  currentAgent.distribution.channels.includes(channel.id)
                                    ? 'bg-[#FF7A00] border-[#FF7A00]'
                                    : 'border-white/30'
                                }`}>
                                  {currentAgent.distribution.channels.includes(channel.id) && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Widget Customization */}
                      {currentAgent.distribution.channels.includes('web') && (
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="text-white font-semibold mb-6">Personalização do Widget</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <label className="block text-white font-medium mb-3">Tema</label>
                                <div className="grid grid-cols-3 gap-3">
                                  {['modern', 'classic', 'minimal'].map((theme) => (
                                    <button
                                      key={theme}
                                      className={`p-3 rounded-lg border-2 transition-all capitalize ${
                                        currentAgent.distribution.widget.theme === theme
                                          ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                                          : 'border-white/20 hover:border-white/40'
                                      }`}
                                    >
                                      {theme}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-white font-medium mb-3">Posição</label>
                                <select
                                  value={currentAgent.distribution.widget.position}
                                  onChange={(e) => setCurrentAgent({
                                    ...currentAgent,
                                    distribution: {
                                      ...currentAgent.distribution,
                                      widget: { ...currentAgent.distribution.widget, position: e.target.value }
                                    }
                                  })}
                                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                                >
                                  <option value="bottom-right" className="bg-[#2D0B55]">Inferior Direita</option>
                                  <option value="bottom-left" className="bg-[#2D0B55]">Inferior Esquerda</option>
                                  <option value="top-right" className="bg-[#2D0B55]">Superior Direita</option>
                                  <option value="top-left" className="bg-[#2D0B55]">Superior Esquerda</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-white font-medium mb-3">Cor Principal</label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="color"
                                    value={currentAgent.distribution.widget.color}
                                    onChange={(e) => setCurrentAgent({
                                      ...currentAgent,
                                      distribution: {
                                        ...currentAgent.distribution,
                                        widget: { ...currentAgent.distribution.widget, color: e.target.value }
                                      }
                                    })}
                                    className="w-12 h-12 rounded-lg border border-white/20 bg-transparent"
                                  />
                                  <input
                                    type="text"
                                    value={currentAgent.distribution.widget.color}
                                    onChange={(e) => setCurrentAgent({
                                      ...currentAgent,
                                      distribution: {
                                        ...currentAgent.distribution,
                                        widget: { ...currentAgent.distribution.widget, color: e.target.value }
                                      }
                                    })}
                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-white font-medium mb-3">Código de Incorporação</label>
                                <div className="bg-black/50 rounded-lg p-4">
                                  <code className="text-green-400 text-sm">
                                    {`<script src="https://widget.meusuper.app/v1/widget.js"></script>
<script>
  MeuSuperWidget.init({
    agentId: "${currentAgent.id}",
    theme: "${currentAgent.distribution.widget.theme}",
    position: "${currentAgent.distribution.widget.position}",
    color: "${currentAgent.distribution.widget.color}"
  });
</script>`}
                                  </code>
                                </div>
                                <button
                                  onClick={() => navigator.clipboard.writeText(`<script src="https://widget.meusuper.app/v1/widget.js"></script>
<script>
  MeuSuperWidget.init({
    agentId: "${currentAgent.id}",
    theme: "${currentAgent.distribution.widget.theme}",
    position: "${currentAgent.distribution.widget.position}",
    color: "${currentAgent.distribution.widget.color}"
  });
</script>`)}
                                  className="mt-3 flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                  <span>Copiar Código</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-white font-medium mb-3">Preview do Widget</label>
                              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 h-80 relative">
                                <div className="text-gray-800 text-sm mb-4">Seu Website</div>
                                <div 
                                  className={`absolute w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                                    currentAgent.distribution.widget.position.includes('bottom') ? 'bottom-4' : 'top-4'
                                  } ${
                                    currentAgent.distribution.widget.position.includes('right') ? 'right-4' : 'left-4'
                                  }`}
                                  style={{ backgroundColor: currentAgent.distribution.widget.color }}
                                >
                                  <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* API Keys */}
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-white font-semibold">Chaves de API</h4>
                          <button className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            <span>Gerar Nova Chave</span>
                          </button>
                        </div>

                        <div className="space-y-4">
                          {currentAgent.distribution.apiKeys.map((key, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                              <div className="flex items-center space-x-3">
                                <Key className="w-5 h-5 text-[#FF7A00]" />
                                <div>
                                  <div className="text-white font-medium">
                                    {index === 0 ? 'Chave de Produção' : 'Chave de Teste'}
                                  </div>
                                  <div className="text-gray-400 text-sm font-mono">{key}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => navigator.clipboard.writeText(key)}
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button className="text-red-400 hover:text-red-300 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Analytics & Metrics */}
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="text-white font-semibold mb-6">Analytics e Métricas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-[#FF7A00] rounded-full flex items-center justify-center mx-auto mb-3">
                              <Users className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">1,247</div>
                            <div className="text-gray-400 text-sm">Conversas Iniciadas</div>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                              <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">73%</div>
                            <div className="text-gray-400 text-sm">Taxa de Satisfação</div>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Clock className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">1.2s</div>
                            <div className="text-gray-400 text-sm">Tempo de Resposta</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          {isPreviewOpen && (
            <div className="w-96 bg-gradient-to-b from-white/10 to-white/5 border-l border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-semibold">Preview & Teste</h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                {/* Test Interface */}
                <div className="p-4 border-b border-white/10">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Teste o Agente</label>
                      <textarea
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        rows={3}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none"
                        placeholder="Digite uma mensagem para testar..."
                      />
                    </div>
                    <button
                      onClick={handleTestAgent}
                      disabled={isTesting || !testInput.trim()}
                      className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {isTesting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4 mr-2" />
                          Testar Agente
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Test Results */}
                <div className="flex-1 overflow-y-auto p-4">
                  <h4 className="text-white font-medium mb-4">Resultados dos Testes</h4>
                  <div className="space-y-4">
                    {testResults.map((result) => (
                      <div key={result.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </span>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{result.responseTime}s</span>
                            <span>•</span>
                            <span>{result.tokensUsed} tokens</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-blue-400 text-sm font-medium mb-1">Entrada:</div>
                            <div className="text-gray-300 text-sm">{result.input}</div>
                          </div>
                          <div>
                            <div className="text-green-400 text-sm font-medium mb-1">Resposta:</div>
                            <div className="text-white text-sm">{result.output}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAgentPage;