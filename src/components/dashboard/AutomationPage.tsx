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
  Hand
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

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node templates
  const nodeTemplates = {
    triggers: [
      { type: 'trigger', category: 'time', name: 'Schedule', description: 'Time-based trigger', icon: Clock },
      { type: 'trigger', category: 'webhook', name: 'Webhook', description: 'HTTP webhook trigger', icon: Globe },
      { type: 'trigger', category: 'event', name: 'Event', description: 'System event trigger', icon: Zap },
      { type: 'trigger', category: 'email', name: 'Email Received', description: 'New email trigger', icon: Mail },
    ],
    actions: [
      { type: 'action', category: 'api', name: 'HTTP Request', description: 'Make API call', icon: Globe },
      { type: 'action', category: 'email', name: 'Send Email', description: 'Send email message', icon: Mail },
      { type: 'action', category: 'database', name: 'Database Query', description: 'Execute database query', icon: Database },
      { type: 'action', category: 'crm', name: 'Update CRM', description: 'Update CRM record', icon: Database },
    ],
    logic: [
      { type: 'condition', category: 'logic', name: 'If/Then/Else', description: 'Conditional logic', icon: GitBranch },
      { type: 'condition', category: 'logic', name: 'Switch', description: 'Multiple conditions', icon: Layers },
      { type: 'loop', category: 'logic', name: 'For Each', description: 'Loop through items', icon: RotateCcw },
      { type: 'loop', category: 'logic', name: 'While Loop', description: 'Conditional loop', icon: RotateCcw },
    ],
    integrations: [
      { type: 'integration', category: 'crm', name: 'Salesforce', description: 'Salesforce integration', icon: Database },
      { type: 'integration', category: 'email', name: 'Gmail', description: 'Gmail integration', icon: Mail },
      { type: 'integration', category: 'storage', name: 'Google Drive', description: 'File storage', icon: FileText },
      { type: 'integration', category: 'social', name: 'Slack', description: 'Slack messaging', icon: MessageSquare },
    ],
    code: [
      { type: 'code', category: 'javascript', name: 'JavaScript', description: 'Custom JavaScript code', icon: Code },
      { type: 'code', category: 'python', name: 'Python', description: 'Custom Python code', icon: Terminal },
      { type: 'code', category: 'transform', name: 'Data Transform', description: 'Transform data', icon: Workflow },
    ]
  };

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = () => {
    // Mock data for automation flows
    const mockFlows: AutomationFlow[] = [
      {
        id: '1',
        name: 'Lead Qualification Flow',
        description: 'Automatically qualify and route new leads',
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
            position: { x: 300, y: 100 },
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
            position: { x: 500, y: 50 },
            data: { operation: 'create_lead' },
            inputs: ['high_quality'],
            outputs: ['crm_record'],
            status: 'idle'
          }
        ],
        connections: [
          { id: 'conn-1', source: 'trigger-1', target: 'condition-1' },
          { id: 'conn-2', source: 'condition-1', target: 'action-1', sourceHandle: 'high_quality' }
        ],
        variables: { lead_score_threshold: 70 },
        environment: 'production',
        version: '1.2.0',
        status: 'active',
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Email Campaign Automation',
        description: 'Automated email sequences based on user behavior',
        nodes: [],
        connections: [],
        variables: {},
        environment: 'development',
        version: '0.1.0',
        status: 'draft',
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];

    setFlows(mockFlows);
    if (mockFlows.length > 0) {
      setCurrentFlow(mockFlows[0]);
    }
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

    const x = e.clientX - rect.left - canvasPosition.x;
    const y = e.clientY - rect.top - canvasPosition.y;

    const newNode: FlowNode = {
      id: `${draggedNode.type}-${Date.now()}`,
      type: draggedNode.type,
      category: draggedNode.category,
      name: draggedNode.name,
      description: draggedNode.description,
      icon: draggedNode.icon,
      position: { x: x / (zoom / 100), y: y / (zoom / 100) },
      data: {},
      inputs: draggedNode.type === 'trigger' ? [] : ['input'],
      outputs: ['output'],
      status: 'idle'
    };

    setCurrentFlow({
      ...currentFlow,
      nodes: [...currentFlow.nodes, newNode]
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

    setCurrentFlow({
      ...currentFlow,
      nodes: currentFlow.nodes.filter(n => n.id !== nodeId),
      connections: currentFlow.connections.filter(c => c.source !== nodeId && c.target !== nodeId)
    });

    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleRunFlow = async () => {
    if (!currentFlow) return;

    setIsRunning(true);
    
    // Simulate flow execution
    for (const node of currentFlow.nodes) {
      node.status = 'running';
      setCurrentFlow({ ...currentFlow });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      node.status = Math.random() > 0.1 ? 'success' : 'error';
      setCurrentFlow({ ...currentFlow });
    }

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

  const getNodeStatusColor = (status?: string) => {
    switch (status) {
      case 'running':
        return 'border-blue-500 bg-blue-500/20';
      case 'success':
        return 'border-green-500 bg-green-500/20';
      case 'error':
        return 'border-red-500 bg-red-500/20';
      default:
        return 'border-white/20 bg-white/10';
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

  return (
    <DashboardLayout currentPage="automation">
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Workflow className="w-6 h-6 text-[#FF7A00]" />
              <h1 className="text-xl font-bold text-white">Automation Builder</h1>
            </div>
            
            {currentFlow && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">/</span>
                <span className="text-white font-medium">{currentFlow.name}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  currentFlow.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  currentFlow.status === 'error' ? 'bg-red-500/20 text-red-400' :
                  currentFlow.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {currentFlow.status}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
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
            >
              <Bug className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowVersions(!showVersions)}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <GitBranch className="w-4 h-4" />
            </button>

            <button
              onClick={handleSaveFlow}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors"
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
          {/* Sidebar - Node Library */}
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
                        className="bg-white/10 rounded-lg p-3 border border-white/20 hover:border-[#FF7A00]/50 cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-white/20"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#FF7A00] rounded-lg flex items-center justify-center">
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

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Canvas Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-white text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-1 rounded bg-white/10 text-gray-300 hover:text-white transition-colors"
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
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowTesting(!showTesting)}
                  className={`p-1 rounded transition-colors ${
                    showTesting ? 'bg-[#FF7A00] text-white' : 'bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#2D0B55] to-[#1A0633]">
              <div
                ref={canvasRef}
                className="w-full h-full relative"
                onDrop={handleCanvasDrop}
                onDragOver={handleCanvasDragOver}
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255, 122, 0, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
                }}
              >
                {/* Render Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {currentFlow?.connections.map((connection) => {
                    const sourceNode = currentFlow.nodes.find(n => n.id === connection.source);
                    const targetNode = currentFlow.nodes.find(n => n.id === connection.target);
                    
                    if (!sourceNode || !targetNode) return null;

                    const x1 = sourceNode.position.x + 100;
                    const y1 = sourceNode.position.y + 40;
                    const x2 = targetNode.position.x;
                    const y2 = targetNode.position.y + 40;

                    const midX = (x1 + x2) / 2;

                    return (
                      <path
                        key={connection.id}
                        d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                        stroke="#FF7A00"
                        strokeWidth="2"
                        fill="none"
                        className="drop-shadow-sm"
                      />
                    );
                  })}
                </svg>

                {/* Render Nodes */}
                {currentFlow?.nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`absolute w-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${getNodeStatusColor(node.status)} ${
                      selectedNode?.id === node.id ? 'ring-2 ring-[#FF7A00]' : ''
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
                          <div className="text-white font-medium text-sm">{node.name}</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getNodeStatusIcon(node.status)}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNodeDelete(node.id);
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-300 text-xs">{node.description}</div>
                      
                      {/* Connection Points */}
                      {node.inputs.length > 0 && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-[#FF7A00] rounded-full border-2 border-white"></div>
                      )}
                      {node.outputs.length > 0 && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-[#FF7A00] rounded-full border-2 border-white"></div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {currentFlow && currentFlow.nodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">Start Building Your Flow</h3>
                      <p className="text-gray-400 mb-4">Drag nodes from the sidebar to begin</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimap */}
              {showMinimap && currentFlow && currentFlow.nodes.length > 0 && (
                <div className="absolute bottom-4 right-4 w-48 h-32 bg-black/50 backdrop-blur-md rounded-lg border border-white/20 p-2">
                  <div className="text-white text-xs mb-2">Minimap</div>
                  <div className="relative w-full h-full bg-gradient-to-br from-[#2D0B55] to-[#1A0633] rounded">
                    {currentFlow.nodes.map((node) => (
                      <div
                        key={node.id}
                        className="absolute w-2 h-2 bg-[#FF7A00] rounded"
                        style={{
                          left: `${(node.position.x / 1000) * 100}%`,
                          top: `${(node.position.y / 600) * 100}%`,
                        }}
                      />
                    ))}
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
                              nodes: currentFlow.nodes.map(n => n.id === selectedNode.id ? updatedNode : n)
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
                              nodes: currentFlow.nodes.map(n => n.id === selectedNode.id ? updatedNode : n)
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
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none"
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
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Settings className="w-12 h-12 mx-auto mb-2" />
                    <p>Select a node to configure its properties</p>
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
                    className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isRunning ? 'Running...' : 'Test Flow'}
                  </button>

                  <div>
                    <h4 className="text-white font-medium mb-2">Test Data</h4>
                    <textarea
                      placeholder='{"test": "data"}'
                      rows={6}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#FF7A00] focus:outline-none resize-none font-mono text-sm"
                    />
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Execution Log</h4>
                    <div className="bg-black/50 rounded-lg p-3 h-48 overflow-y-auto font-mono text-sm">
                      <div className="text-green-400">[INFO] Flow execution started</div>
                      <div className="text-blue-400">[DEBUG] Processing trigger node</div>
                      <div className="text-green-400">[SUCCESS] Trigger completed</div>
                      <div className="text-blue-400">[DEBUG] Processing condition node</div>
                      <div className="text-green-400">[SUCCESS] Condition evaluated to true</div>
                      <div className="text-green-400">[INFO] Flow execution completed</div>
                    </div>
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

export default AutomationPage;