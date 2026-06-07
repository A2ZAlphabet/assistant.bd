export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Health
  health: '/health',
  
  // Todos
  todos: '/api/todos',
  
  // Auth
  login: '/auth/login',
  logout: '/auth/logout',
  register: '/auth/register',
};

export const APP_CONFIG = {
  name: 'Assistant.BD',
  description: 'AI Operating System: No-code automation + AI agents + CRM',
  appVersion: '1.0.0',
  locale: 'en-US',
};
