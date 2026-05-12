/**
 * Shared type definitions for assistant.bd
 */

// User & Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: User[];
  createdAt: Date;
}

// Workflows
export interface Workflow {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  definition: WorkflowDefinition;
  enabled: boolean;
  createdAt: Date;
}

export interface WorkflowDefinition {
  triggers: Trigger[];
  conditions?: Condition[];
  actions: Action[];
}

export interface Trigger {
  id: string;
  type: 'webhook' | 'schedule' | 'event' | 'message';
  config: Record<string, any>;
}

export interface Condition {
  id: string;
  type: 'if' | 'switch' | 'loop';
  expression: string;
}

export interface Action {
  id: string;
  type: 'send_message' | 'api_call' | 'create_task' | 'run_agent';
  config: Record<string, any>;
}

// Agents
export type AgentType = 'support' | 'sales' | 'voice' | 'booking' | 'custom';

export interface Agent {
  id: string;
  teamId: string;
  name: string;
  type: AgentType;
  config: AgentConfig;
  createdAt: Date;
}

export interface AgentConfig {
  systemPrompt: string;
  model: string;
  temperature: number;
  tools: AgentTool[];
  memory?: MemoryConfig;
}

export interface AgentTool {
  name: string;
  description: string;
  schema: Record<string, any>;
}

export interface MemoryConfig {
  type: 'short-term' | 'long-term' | 'hybrid';
  size: number;
}

// Conversations & Messages
export interface Conversation {
  id: string;
  teamId: string;
  customerId: string;
  channel: 'whatsapp' | 'facebook' | 'email' | 'api';
  messages: Message[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// CRM & Customer Data
export interface Customer {
  id: string;
  teamId: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Integrations
export interface Integration {
  id: string;
  teamId: string;
  type: string;
  name: string;
  config: Record<string, any>;
  enabled: boolean;
  createdAt: Date;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
