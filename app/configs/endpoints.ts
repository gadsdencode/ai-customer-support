// /app/configs/endpoints.ts

export const ENDPOINTS = {
  LOCAL: {
    BASE: 'http://localhost:8000',  // Removed /copilotkit_remote from base
    BASE_ASSISTANTS: 'http://localhost:8000',
    ASSISTANTS: '/copilotkit_remote/assistants/search',
    ACTIONS: '/copilotkit_remote/info',  // Keep the path segment
    STREAM: '/copilotkit_remote',
    HEALTH: '/health',
    TEST: '/test',
    ROOT: '/'
  },
  PRODUCTION: {
    BASE: 'https://web-dev-461a.up.railway.app',  // Removed /copilotkit_remote from base
    BASE_ASSISTANTS: 'https://web-dev-461a.up.railway.app',
    ASSISTANTS: '/copilotkit_remote/assistants/search',
    ACTIONS: '/copilotkit_remote/info',  // Keep the path segment
    STREAM: '/copilotkit_remote',
    HEALTH: '/health'
  },
} as const;

export type Environment = keyof typeof ENDPOINTS;

export const getEndpoints = (environment: Environment) => {
  return ENDPOINTS[environment];
};

// Helper to get full URLs
export const getFullUrl = (environment: Environment, endpoint: keyof typeof ENDPOINTS[Environment]) => {
  const config = ENDPOINTS[environment];
  return endpoint.startsWith('/') ? 
    `${config.BASE}${endpoint}` : 
    `${config.BASE}/${endpoint}`;
};