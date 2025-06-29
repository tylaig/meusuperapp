export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'user';
  organizationId: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  maxServers: number;
  maxConnections: number;
  createdAt: string;
  settings: {
    timezone: string;
    language: string;
    notifications: boolean;
    autoBackup: boolean;
  };
}

export interface Server {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  region: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  organizationId: string;
  resources: {
    cpu: {
      usage: number;
      cores: number;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    storage: {
      used: number;
      total: number;
      percentage: number;
    };
    network: {
      inbound: number;
      outbound: number;
    };
  };
  whatsapp: {
    activeConnections: number;
    maxConnections: number;
    queuedMessages: number;
    sentToday: number;
    receivedToday: number;
  };
  uptime: number;
  lastUpdate: string;
  createdAt: string;
}

export interface WhatsAppConnection {
  id: string;
  serverId: string;
  sessionName: string;
  phoneNumber: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  qrCode?: string;
  lastActivity: string;
  messagesCount: {
    sent: number;
    received: number;
    failed: number;
  };
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  serverId?: string;
  connectionId?: string;
  organizationId: string;
  userId: string;
  action: string;
  description: string;
  level: 'info' | 'warning' | 'error' | 'success';
  metadata?: any;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  organizationId: string;
  userId?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  salesCompleted: number;
  salesLost: number;
  salesRecovered: number;
  roi: number;
  responseTime: number;
  cac: number;
  messagesReceived: number;
  messagesSent: number;
  tokenUsage: number;
}

export interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  metrics?: any;
}

export interface Subscription {
  id: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  features: string[];
}

export interface Message {
  id: string;
  channel: 'whatsapp' | 'instagram' | 'email' | 'sms';
  content: string;
  sender: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  isBot: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'user';
  permissions: string[];
  status: 'active' | 'pending' | 'suspended';
  lastLogin?: string;
  invitedAt?: string;
  invitedBy?: string;
}

export interface Invite {
  id: string;
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
  organizationId: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
  createdAt: string;
}