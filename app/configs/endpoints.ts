// /app/configs/endpoints.ts

export const ENDPOINTS = {
  LOCAL: {
    BASE: 'http://localhost:8000/copilotkit_remote',
    ACTIONS: '/info',  // Endpoint to fetch actions
    STREAM: '/stream',  // For state streaming
    HEALTH: '/health',
  },
  PRODUCTION: {
    BASE: 'https://web-production-7cd0b.up.railway.app/copilotkit_remote',
    ACTIONS: '/info',
    STREAM: '/stream',
    HEALTH: '/health',
  },
} as const;

export const getEndpoints = (environment: 'LOCAL' | 'PRODUCTION') => {
  return ENDPOINTS[environment];
};
