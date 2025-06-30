import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload, 
  Search, 
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Bug,
  GitBranch,
  Clock,
  Zap,
  Database,
  Mail,
  Globe,
  Code,
  Workflow,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Info,
  Maximize2,
  Minimize2,
  Move,
  MoreVertical,
  Link,
  Unlink,
  FileText,
  Terminal,
  Layers,
  Grid,
  MousePointer,
  Hand,
  MessageSquare,
  Edit,
  ArrowLeft,
  History,
  Share2,
  FolderOpen,
  CreditCard
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

// Types for the flow builder
interface FlowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'loop' | 'integration' | 'code';
  category: string;
  name: string;
  description: string;
  icon: React.ElementType;
  position: { x: number; y: number };
  data: any;
  inputs: string[];
  outputs: string[];
  status?: 'idle' | 'running' | 'success' | 'error';
  config?: any;
}

interface FlowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  variables: { [key: string]: any };
  environment: 'development' | 'staging' | 'production';
  version: string;
  status: 'draft' | 'active' | 'paused' | 'error';
  lastModified: string;
  createdAt: string;
  tags: string[];
  category: string;
}

interface FlowVersion {
  id: string;
  version: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

const AutomationPage: React.FC = () => {
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [currentFlow, setCurrentFlow] = useState<AutomationFlow | null>(null);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProperties, setShowProperties] = useState(true);
  const [showTesting, setShowTesting] = useState(false);
  const [draggedNode, setDraggedNode] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [environment, setEnvironment] = useState<'development' | 'staging' | 'production'>('development');
  const [viewMode, setViewMode] = useState<'list' | 'builder'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [copiedNodes, setCopiedNodes] = useState<FlowNode[]>([]);
  const [flowVersions, setFlowVersions] = useState<FlowVersion[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCanvasDragging, setIsCanvasDragging] = useState(false);
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 });

  // Node templates
  const nodeTemplates = {
    triggers: [
      { type: 'trigger', category: 'time', name: 'Schedule', description: 'Time-based trigger', icon: Clock },
      { type: 'trigger', category: 'webhook', name: 'Webhook', description: 'HTTP webhook trigger', icon: Globe },
      { type: 'trigger', category: 'event', name: 'Event', description: 'System event trigger', icon: Zap },
      { type: 'trigger', category: 'email', name: 'Email Received', description: 'New email trigger', icon: Mail },
      { type: 'trigger', category: 'form', name: 'Form Submit', description: 'Form submission trigger', icon: FileText },
    ],
    actions: [
      { type: 'action', category: 'api', name: 'HTTP Request', description: 'Make API call', icon: Globe },
      { type: 'action', category: 'email', name: 'Send Email', description: 'Send email message', icon: Mail },
      { type: 'action', category: 'database', name: 'Database Query', description: 'Execute database query', icon: Database },
      { type: 'action', category: 'crm', name: 'Update CRM', description: 'Update CRM record', icon: Database },
      { type: 'action', category: 'notification', name: 'Send Notification', description: 'Send push notification', icon: MessageSquare },
    ],
    logic: [
      { type: 'condition', category: 'logic', name: 'If/Then/Else', description: 'Conditional logic', icon: GitBranch },
      { type: 'condition', category: 'logic', name: 'Switch', description: 'Multiple conditions', icon: Layers },
      { type: 'loop', category: 'logic', name: 'For Each', description: 'Loop through items', icon: RotateCcw },
      { type: 'loop', category: 'logic', name: 'While Loop', description: 'Conditional loop', icon: RotateCcw },
      { type: 'condition', category: 'logic', name: 'Filter', description: 'Filter data', icon: Filter },
    ],
    integrations: [
      { type: 'integration', category: 'crm', name: 'Salesforce', description: 'Salesforce integration', icon: Database },
      { type: 'integration', category: 'email', name: 'Gmail', description: 'Gmail integration', icon: Mail },
      { type: 'integration', category: 'storage', name: 'Google Drive', description: 'File storage', icon: FileText },
      { type: 'integration', category: 'social', name: 'Slack', description: 'Slack messaging', icon: MessageSquare },
      { type: 'integration', category: 'payment', name: 'Stripe', description: 'Payment processing', icon: CreditCard },
    ],
    code: [
      { type: 'code', category: 'javascript', name: 'JavaScript', description: 'Custom JavaScript code', icon: Code },
      { type: 'code', category: 'python', name: 'Python', description: 'Custom Python code', icon: Terminal },
      { type: 'code', category: 'transform', name: 'Data Transform', description: 'Transform data', icon: Workflow },
      { type: 'code', category: 'validation', name: 'Validate Data', description: 'Validate input data', icon: CheckCircle },
    ]
  };

  useEffect(() => {
    loadFlows();
    loadFlowVersions();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && currentFlow && viewMode === 'builder') {
      const timer = setTimeout(() => {
        handleSaveFlow();
      }, 5000); // Auto-save every 5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentFlow, autoSave]);

  const loadFlows = () => {
    // Mock data for automation flows
    const mockFlows: AutomationFlow[] = [
      {
        id: '1',
        name: 'Lead Qualification Flow',
        description: 'Automatically qualify and route new leads based on score and behavior',
        nodes: [
          {
            id: 'trigger-1',
            type: 'trigger',
            category: 'webhook',
            name: 'New Lead Webhook',
            description: 'Receives new lead data',
            icon: Globe,
            position: { x: 100, y: 100 },
            data: { url: 'https://api.example.com/webhook/leads' },
            inputs: [],
            outputs: ['lead_data'],
            status: 'idle'
          },
          {
            id: 'condition-1',
            type: 'condition',
            category: 'logic',
            name: 'Check Lead Score',
            description: 'Evaluate lead quality',
            icon: GitBranch,
            position: { x: 350, y: 100 },
            data: { condition: 'lead_score > 70' },
            inputs: ['lead_data'],
            outputs: ['high_quality', 'low_quality'],
            status: 'idle'
          },
          {
            id: 'action-1',
            type: 'action',
            category: 'crm',
            name: 'Update CRM',
            description: 'Add lead to CRM',
            icon: Database,
            position: { x: 600, y: 50 },
            data: { operation: 'create_lead' },
            inputs: ['high_quality'],
            outputs: ['crm_record'],
            status: 'idle'
          },
          {
            id: 'action-2',
            type: 'action',
            category: 'email',
            name: 'Send Welcome Email',
            description: 'Send welcome email to high-quality leads',
            icon: Mail,
            position: { x: 850, y: 50 },
            data: { template: 'welcome_template' },
            inputs: ['crm_record'],
            outputs: ['email_sent'],
            status: 'idle'
          }
        ],
        connections: [
          { id: 'conn-1', source: 'trigger-1', target: 'condition-1' },
          { id: 'conn-2', source: 'condition-1', target: 'action-1', sourceHandle: 'high_quality' },
          { id: 'conn-3', source: 'action-1', target: 'action-2' }
        ],
        variables: { lead_score_threshold: 70, welcome_template: 'template_001' },
        environment: 'production',
        version: '1.2.0',
        status: 'active',
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-15T10:00:00Z',
        tags: ['sales', 'lead-management', 'crm'],
        category: 'Sales'
      },
      {
        id: '2',
        name: 'Email Campaign Automation',
        description: 'Automated email sequences based on user behavior and engagement',
        nodes: [
          {
            id: 'trigger-2',
            type: 'trigger',
            category: 'event',
            name: 'User Signup',
            description: 'Triggered when user signs up',
            icon: Zap,
            position: { x: 100, y: 100 },
            data: { event: 'user_signup' },
            inputs: [],
            outputs: ['user_data'],
            status: 'idle'
          }
        ],
        connections: [],
        variables: {},
        environment: 'development',
        version: '0.1.0',
        status: 'draft',
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        tags: ['marketing', 'email', 'automation'],
        category: 'Marketing'
      },
      {
        id: '3',
        name: 'Customer Support Ticket Routing',
        description: 'Automatically route support tickets based on priority and category',
        nodes: [],
        connections: [],
        variables: {},
        environment: 'staging',
        version: '0.5.0',
        status: 'paused',
        lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-10T08:00:00Z',
        tags: ['support', 'tickets', 'routing'],
        category: 'Support'
      },
      {
        id: '4',
        name: 'E-commerce Order Processing',
        description: 'Process new orders, update inventory, and send confirmations',
        nodes: [],
        connections: [],
        variables: {},
        environment: 'production',
        version: '2.1.0',
        status: 'active',
        lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-05T14:30:00Z',
        tags: ['ecommerce', 'orders', 'inventory'],
        category: 'E-commerce'
      },
      {
        id: '5',
        name: 'Social Media Content Scheduler',
        description: 'Schedule and publish content across multiple social media platforms',
        nodes: [],
        connections: [],
        variables: {},
        environment: 'production',
        version: '1.0.0',
        status: 'error',
        lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-20T11:15:00Z',
        tags: ['social-media', 'content', 'scheduling'],
        category: 'Marketing'
      }
    ];

    setFlows(mockFlows);
  };

  const loadFlowVersions = () => {
    const mockVersions: FlowVersion[] = [
      {
        id: 'v1',
        version: '1.2.0',
        description: 'Added welcome email automation',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdBy: 'João Silva'
      },
      {
        id: 'v2',
        version: '1.1.0',
        description: 'Improved lead scoring logic',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'Maria Santos'
      },
      {
        id: 'v3',
        version: '1.0.0',
        description: 'Initial version',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'João Silva'
      }
    ];

    setFlowVersions(mockVersions);
  };

  const handleNodeDragStart = (e: React.DragEvent, nodeTemplate: any) => {
    setDraggedNode(nodeTemplate);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNode || !currentFlow) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - canvasPosition.x) / (zoom / 100);
    const y = (e.clientY - rect.top - canvasPosition.y) / (zoom / 100);

    const newNode: FlowNode = {
      id: `${draggedNode.type}-${Date.now()}`,
      type: draggedNode.type,
      category: draggedNode.category,
      name: draggedNode.name,
      description: draggedNode.description,
      icon: draggedNode.icon,
      position: { x, y },
      data: {},
      inputs: draggedNode.type === 'trigger' ? [] : ['input'],
      outputs: ['output'],
      status: 'idle'
    };

    setCurrentFlow({
      ...currentFlow,
      nodes: [...currentFlow.nodes, newNode],
      lastModified: new Date().toISOString()
    });

    setDraggedNode(null);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleNodeSelect = (node: FlowNode) => {
    setSelectedNode(node);
    setShowProperties(true);
  };

  const handleNodeDelete = (nodeId: string) => {
    if (!currentFlow) return;

    if (confirm('Are you sure you want to delete this node?')) {
      setCurrentFlow({
        ...currentFlow,
        nodes: currentFlow.nodes.filter(n => n.id !== nodeId),
        connections: currentFlow.connections.filter(c => c.source !== nodeId && c.target !== nodeId),
        lastModified: new Date().toISOString()
      });

      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    }
  };

  const handleNodeCopy = () => {
    if (selectedNode) {
      setCopiedNodes([selectedNode]);
    }
  };

  const handleNodePaste = () => {
    if (copiedNodes.length > 0 && currentFlow) {
      const newNodes = copiedNodes.map(node => ({
        ...node,
        id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: { x: node.position.x + 50, y: node.position.y + 50 }
      }));

      setCurrentFlow({
        ...currentFlow,
        nodes: [...currentFlow.nodes, ...newNodes],
        lastModified: new Date().toISOString()
      });
    }
  };

  const handleRunFlow = async () => {
    if (!currentFlow) return;

    setIsRunning(true);
    setExecutionLog(['[INFO] Flow execution started']);
    
    // Simulate flow execution
    for (let i = 0; i < currentFlow.nodes.length; i++) {
      const node = currentFlow.nodes[i];
      node.status = 'running';
      setCurrentFlow({ ...currentFlow });
      setExecutionLog(prev => [...prev, `[DEBUG] Processing ${node.name}`]);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.1;
      node.status = success ? 'success' : 'error';
      setCurrentFlow({ ...currentFlow });
      
      if (success) {
        setExecutionLog(prev => [...prev, `[SUCCESS] ${node.name} completed`]);
      } else {
        setExecutionLog(prev => [...prev, `[ERROR] ${node.name} failed`]);
        break;
      }
    }

    setExecutionLog(prev => [...prev, '[INFO] Flow execution completed']);
    setIsRunning(false);
  };

  const handleSaveFlow = () => {
    if (!currentFlow) return;

    const updatedFlow = {
      ...currentFlow,
      lastModified: new Date().toISOString()
    };

    setFlows(prev => prev.map(f => f.id === currentFlow.id ? updatedFlow : f));
    setCurrentFlow(updatedFlow);
    setLastSaved(new Date());
  };

  const handleExportFlow = () => {
    if (!currentFlow) return;

    const dataStr = JSON.stringify(currentFlow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentFlow.name.replace(/\s+/g, '_')}_v${currentFlow.version}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportFlow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedFlow = JSON.parse(e.target?.result as string);
        importedFlow.id = Date.now().toString();
        importedFlow.name = `${importedFlow.name} (Imported)`;
        importedFlow.createdAt = new Date().toISOString();
        importedFlow.lastModified = new Date().toISOString();
        
        setFlows(prev => [...prev, importedFlow]);
      } catch (error) {
        alert('Error importing flow: Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleResetView = () => {
    setZoom(100);
    setCanvasPosition({ x: 0, y: 0 });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left click
      setIsCanvasDragging(true);
      setCanvasDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
      e.preventDefault();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isCanvasDragging) {
      setCanvasPosition({
        x: e.clientX - canvasDragStart.x,
        y: e.clientY - canvasDragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsCanvasDragging(false);
  };

  const handleCreateFlow = () => {
    const newFlow: AutomationFlow = {
      id: Date.now().toString(),
      name: 'New Automation Flow',
      description: 'Description for the new flow',
      nodes: [],
      connections: [],
      variables: {},
      environment: 'development',
      version: '0.1.0',
      status: 'draft',
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: [],
      category: 'General'
    };

    setFlows(prev => [...prev, newFlow]);
    setCurrentFlow(newFlow);
    setViewMode('builder');
    setShowCreateModal(false);
  };

  const filteredNodeTemplates = Object.entries(nodeTemplates).reduce((acc, [category, nodes]) => {
    if (selectedCategory !== 'all' && category !== selectedCategory) return acc;
    
    const filtered = nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    
    return acc;
  }, {} as typeof nodeTemplates);

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || flow.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || flow.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getNodeStatusColor = (status?: string) => {
    switch (status) {
      case 'running':
        return 'border-blue-500 bg-blue-500/20 shadow-blue-500/50';
      case 'success':
        return 'border-green-500 bg-green-500/20 shadow-green-500/50';
      case 'error':
        return 'border-red-500 bg-red-500/20 shadow-red-500/50';
      default:
        return 'border-white/20 bg-white/10 hover:border-[#FF7A00]/50';
    }
  };

  const getNodeStatusIcon = (status?: string) => {
    switch (status) {
      case 'running':
        return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'draft':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatLastModified = (timestamp: string) => {
    const now = new Date();
    const modified = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - modified.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'builder' && currentFlow) {
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 's':
              e.preventDefault();
              handleSaveFlow();
              break;
            case 'c':
              if (selectedNode) {
                e.preventDefault();
                handleNodeCopy();
              }
              break;
            case 'v':
              if (copiedNodes.length > 0) {
                e.preventDefault();
                handleNodePaste();
              }
              break;
            case 'z':
              e.preventDefault();
              // Undo functionality would go here
              break;
          }
        }
        
        if (e.key === 'Delete' && selectedNode) {
          handleNodeDelete(selectedNode.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentFlow, selectedNode, copiedNodes]);

  if (viewMode === 'list') {
    return (
      <DashboardLayout currentPage="automation">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Automation Flows</h1>
              <p className="text-gray-300">Create and manage your automation workflows</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFlow}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </div>
              </label>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Automação</span>
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar automações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todos os status</option>
                  <option value="active" className="bg-[#2D0B55]">Ativo</option>
                  <option value="draft" className="bg-[#2D0B55]">Rascunho</option>
                  <option value="paused" className="bg-[#2D0B55]">Pausado</option>
                  <option value="error" className="bg-[#2D0B55]">Erro</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="all" className="bg-[#2D0B55]">Todas categorias</option>
                  <option value="Sales" className="bg-[#2D0B55]">Sales</option>
                  <option value="Marketing" className="bg-[#2D0B55]">Marketing</option>
                  <option value="Support" className="bg-[#2D0B55]">Support</option>
                  <option value="E-commerce" className="bg-[#2D0B55]">E-commerce</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flows Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFlows.map((flow) => (
              <div
                key={flow.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setCurrentFlow(flow);
                  setViewMode('builder');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                      <Workflow className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold group-hover:text-[#FF7A00] transition-colors">
                        {flow.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{flow.category}</p>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(flow.status)}`}>
                    {flow.status.toUpperCase()}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{flow.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>v{flow.version}</span>
                  <span>{formatLastModified(flow.lastModified)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {flow.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#FF7A00]/20 text-[#FF7A00] rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {flow.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                        +{flow.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-xs">{flow.nodes.length} nodes</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF7A00] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFlows.length === 0 && (
            <div className="text-center py-12">
              <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Nenhuma automação encontrada</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie sua primeira automação para começar'
                }
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Nova Automação
              </button>
            </div>
          )}

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Nova Automação</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Nome</label>
                    <input
                      type="text"
                      placeholder="Nome da automação"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Descrição</label>
                    <textarea
                      placeholder="Descreva o que esta automação faz"
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Categoria</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300">
                      <option value="Sales" className="bg-[#2D0B55]">Sales</option>
                      <option value="Marketing" className="bg-[#2D0B55]">Marketing</option>
                      <option value="Support" className="bg-[#2D0B55]">Support</option>
                      <option value="E-commerce" className="bg-[#2D0B55]">E-commerce</option>
                      <option value="General" className="bg-[#2D0B55]">General</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateFlow}
                      className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300"
                    >
                      Criar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Builder Mode
  return (
    <DashboardLayout currentPage="automation">
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Workflow className="w-6 h-6 text-[#FF7A00]" />
              <h1 className="text-xl font-bold text-white">Flow Builder</h1>
            </div>
            
            {currentFlow && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">/</span>
                <span className="text-white font-medium">{currentFlow.name}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(currentFlow.status)}`}>
                  {currentFlow.status}
                </div>
                {lastSaved && (
                  <span className="text-gray-400 text-sm">
                    Salvo {formatLastModified(lastSaved.toISOString())}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Auto-save toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded"
              />
              <span className="text-white text-sm">Auto-save</span>
            </label>

            {/* Environment Selector */}
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF7A00] focus:outline-none"
            >
              <option value="development" className="bg-[#2D0B55]">Development</option>
              <option value="staging" className="bg-[#2D0B55]">Staging</option>
              <option value="production" className="bg-[#2D0B55]">Production</option>
            </select>

            {/* Control Buttons */}
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={`p-2 rounded-lg transition-colors ${
                debugMode ? 'bg-[#FF7A00] text-white' : 'bg-white/10 text-gray-300 hover:text-white'
              }`}
              title="Debug Mode"
            >
              <Bug className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowVersions(!showVersions)}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Version History"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportFlow}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Export Flow"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleSaveFlow}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Save (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </button>

            <button
              onClick={handleRunFlow}
              disabled={isRunning || !currentFlow}
              className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Running...' : 'Run Flow'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Node Library (30% width) */}
          <div className="w-80 bg-gradient-to-b from-white/10 to-white/5 border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
              >
                <option value="all" className="bg-[#2D0B55]">All Categories</option>
                <option value="triggers" className="bg-[#2D0B55]">Triggers</option>
                <option value="actions" className="bg-[#2D0B55]">Actions</option>
                <option value="logic" className="bg-[#2D0B55]">Logic</option>
                <option value="integrations" className="bg-[#2D0B55]">Integrations</option>
                <option value="code" className="bg-[#2D0B55]">Code</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.entries(filteredNodeTemplates).map(([category, nodes]) => (
                <div key={category}>
                  <h3 className="text-white font-semibold mb-2 capitalize">{category}</h3>
                  <div className="space-y-2">
                    {nodes.map((node, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleNodeDragStart(e, node)}
                        className="bg-white/10 rounded-lg p-3 border border-white/20 hover:border-[#FF7A00]/50 cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-white/20 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#FF7A00] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <node.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{node.name}</div>
                            <div className="text-gray-400 text-xs">{node.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Canvas Area (70% width) */}
          <div className="flex-1 flex flex-col">
            {/* Canvas Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-white text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-1 rounded bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowMinimap(!showMinimap)}
                  className={`p-1 rounded transition-colors ${
                    showMinimap ? 'bg-[#FF7A00] text-white' : 'bg-white/10 text-gray-300 hover:text-white'
                  }`}
                  title="Toggle Minimap"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowTesting(!showTesting)}
                  className={`p-1 rounded transition-colors ${
                    showTesting ? 'bg-[#FF7A00] text-white' : 'bg-white/10 text-gray-300 hover:text-white'
                  }`}
                  title="Toggle Testing Panel"
                >
                  <Play className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowProperties(!showProperties)}
                  className={`p-1 rounded transition-colors ${
                    showProperties ? 'bg-[#FF7A00] text-white' : 'bg-white/10 text-gray-300 hover:text-white'
                  }`}
                  title="Toggle Properties Panel"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#2D0B55] to-[#1A0633]">
              <div
                ref={canvasRef}
                className="w-full h-full relative cursor-move"
                onDrop={handleCanvasDrop}
                onDragOver={handleCanvasDragOver}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255, 122, 0, 0.1) 1px, transparent 1px)`,
                  backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
                  backgroundPosition: `${canvasPosition.x}px ${canvasPosition.y}px`,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: '0 0'
                }}
              >
                {/* Render Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)` }}>
                  {currentFlow?.connections.map((connection) => {
                    const sourceNode = currentFlow.nodes.find(n => n.id === connection.source);
                    const targetNode = currentFlow.nodes.find(n => n.id === connection.target);
                    
                    if (!sourceNode || !targetNode) return null;

                    const x1 = sourceNode.position.x + 192; // Node width
                    const y1 = sourceNode.position.y + 40;
                    const x2 = targetNode.position.x;
                    const y2 = targetNode.position.y + 40;

                    const midX = (x1 + x2) / 2;

                    return (
                      <g key={connection.id}>
                        <path
                          d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                          stroke="#FF7A00"
                          strokeWidth="3"
                          fill="none"
                          className="drop-shadow-sm"
                        />
                        <circle
                          cx={x2}
                          cy={y2}
                          r="4"
                          fill="#FF7A00"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Render Nodes */}
                <div style={{ transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)` }}>
                  {currentFlow?.nodes.map((node) => (
                    <div
                      key={node.id}
                      className={`absolute w-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 shadow-lg ${getNodeStatusColor(node.status)} ${
                        selectedNode?.id === node.id ? 'ring-2 ring-[#FF7A00] ring-offset-2 ring-offset-transparent' : ''
                      }`}
                      style={{
                        left: node.position.x,
                        top: node.position.y,
                      }}
                      onClick={() => handleNodeSelect(node)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#FF7A00] rounded-lg flex items-center justify-center">
                              <node.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-white font-medium text-sm truncate">{node.name}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getNodeStatusIcon(node.status)}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNodeDelete(node.id);
                              }}
                              className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-300 text-xs truncate">{node.description}</div>
                        
                        {/* Connection Points */}
                        {node.inputs.length > 0 && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-[#FF7A00] rounded-full border-2 border-white shadow-lg"></div>
                        )}
                        {node.outputs.length > 0 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-[#FF7A00] rounded-full border-2 border-white shadow-lg"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {currentFlow && currentFlow.nodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)` }}>
                    <div className="text-center">
                      <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">Start Building Your Flow</h3>
                      <p className="text-gray-400 mb-4">Drag nodes from the sidebar to begin</p>
                      <div className="text-gray-500 text-sm">
                        <p>💡 Tips:</p>
                        <p>• Start with a trigger node</p>
                        <p>• Use Alt+Click to pan the canvas</p>
                        <p>• Press Ctrl+S to save</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimap */}
              {showMinimap && currentFlow && currentFlow.nodes.length > 0 && (
                <div className="absolute bottom-4 right-4 w-48 h-32 bg-black/50 backdrop-blur-md rounded-lg border border-white/20 p-2">
                  <div className="text-white text-xs mb-2 flex items-center justify-between">
                    <span>Minimap</span>
                    <button
                      onClick={() => setShowMinimap(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="relative w-full h-full bg-gradient-to-br from-[#2D0B55] to-[#1A0633] rounded overflow-hidden">
                    {currentFlow.nodes.map((node) => (
                      <div
                        key={node.id}
                        className="absolute w-2 h-2 bg-[#FF7A00] rounded cursor-pointer hover:scale-150 transition-transform"
                        style={{
                          left: `${Math.min(95, (node.position.x / 1200) * 100)}%`,
                          top: `${Math.min(95, (node.position.y / 800) * 100)}%`,
                        }}
                        onClick={() => {
                          setCanvasPosition({
                            x: -node.position.x + 200,
                            y: -node.position.y + 200
                          });
                        }}
                      />
                    ))}
                    {/* Viewport indicator */}
                    <div
                      className="absolute border border-white/50 bg-white/10"
                      style={{
                        left: `${Math.max(0, (-canvasPosition.x / 1200) * 100)}%`,
                        top: `${Math.max(0, (-canvasPosition.y / 800) * 100)}%`,
                        width: `${Math.min(100, (800 / 1200) * 100)}%`,
                        height: `${Math.min(100, (600 / 800) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          {showProperties && (
            <div className="w-80 bg-gradient-to-b from-white/10 to-white/5 border-l border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-semibold">Properties</h3>
                <button
                  onClick={() => setShowProperties(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Node Name</label>
                      <input
                        type="text"
                        value={selectedNode.name}
                        onChange={(e) => {
                          const updatedNode = { ...selectedNode, name: e.target.value };
                          setSelectedNode(updatedNode);
                          if (currentFlow) {
                            setCurrentFlow({
                              ...currentFlow,
                              nodes: currentFlow.nodes.map(n => n.id === selectedNode.id ? updatedNode : n),
                              lastModified: new Date().toISOString()
                            });
                          }
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Description</label>
                      <textarea
                        value={selectedNode.description}
                        onChange={(e) => {
                          const updatedNode = { ...selectedNode, description: e.target.value };
                          setSelectedNode(updatedNode);
                          if (currentFlow) {
                            setCurrentFlow({
                              ...currentFlow,
                              nodes: currentFlow.nodes.map(n => n.id === selectedNode.id ? updatedNode : n),
                              lastModified: new Date().toISOString()
                            });
                          }
                        }}
                        rows={3}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none"
                      />
                    </div>

                    {/* Node-specific configuration */}
                    {selectedNode.type === 'trigger' && selectedNode.category === 'webhook' && (
                      <div>
                        <label className="block text-white font-medium mb-2">Webhook URL</label>
                        <input
                          type="url"
                          placeholder="https://api.example.com/webhook"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                        />
                      </div>
                    )}

                    {selectedNode.type === 'action' && selectedNode.category === 'api' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">HTTP Method</label>
                          <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none">
                            <option value="GET" className="bg-[#2D0B55]">GET</option>
                            <option value="POST" className="bg-[#2D0B55]">POST</option>
                            <option value="PUT" className="bg-[#2D0B55]">PUT</option>
                            <option value="DELETE" className="bg-[#2D0B55]">DELETE</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">URL</label>
                          <input
                            type="url"
                            placeholder="https://api.example.com/endpoint"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">Headers</label>
                          <textarea
                            placeholder='{"Authorization": "Bearer token"}'
                            rows={3}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {selectedNode.type === 'code' && (
                      <div>
                        <label className="block text-white font-medium mb-2">Code</label>
                        <textarea
                          placeholder="// Enter your code here"
                          rows={10}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none font-mono text-sm"
                        />
                      </div>
                    )}

                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-2">Advanced Settings</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-gray-300 text-sm">Enable error handling</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-gray-300 text-sm">Log execution details</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-gray-300 text-sm">Retry on failure</span>
                        </label>
                      </div>
                    </div>

                    {/* Node Actions */}
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-2">Actions</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleNodeCopy}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => handleNodeDelete(selectedNode.id)}
                          className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Settings className="w-12 h-12 mx-auto mb-2" />
                    <p>Select a node to configure its properties</p>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Keyboard shortcuts:</p>
                      <p>• Ctrl+C: Copy node</p>
                      <p>• Ctrl+V: Paste node</p>
                      <p>• Delete: Remove node</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Testing Panel */}
          {showTesting && (
            <div className="w-80 bg-gradient-to-b from-white/10 to-white/5 border-l border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-semibold">Testing</h3>
                <button
                  onClick={() => setShowTesting(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <button
                    onClick={handleRunFlow}
                    disabled={isRunning}
                    className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isRunning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Test Flow</span>
                      </>
                    )}
                  </button>

                  <div>
                    <h4 className="text-white font-medium mb-2">Test Data</h4>
                    <textarea
                      placeholder='{"test": "data", "user_id": 123}'
                      rows={6}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none font-mono text-sm"
                    />
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Execution Log</h4>
                    <div className="bg-black/50 rounded-lg p-3 h-48 overflow-y-auto font-mono text-sm">
                      {executionLog.map((log, index) => (
                        <div
                          key={index}
                          className={`${
                            log.includes('[ERROR]') ? 'text-red-400' :
                            log.includes('[SUCCESS]') ? 'text-green-400' :
                            log.includes('[DEBUG]') ? 'text-blue-400' :
                            'text-gray-300'
                          }`}
                        >
                          {log}
                        </div>
                      ))}
                      {executionLog.length === 0 && (
                        <div className="text-gray-500">No execution logs yet. Run the flow to see logs here.</div>
                      )}
                    </div>
                  </div>

                  {debugMode && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Debug Info</h4>
                      <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-gray-300">
                        <div>Nodes: {currentFlow?.nodes.length || 0}</div>
                        <div>Connections: {currentFlow?.connections.length || 0}</div>
                        <div>Environment: {environment}</div>
                        <div>Version: {currentFlow?.version}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AutomationPage;