// /app/configs/endpoints.ts

export const ENDPOINTS = {
  LOCAL: {
    BASE: 'http://localhost:8000/copilotkit_remote',
    ACTIONS: '/info',  // Endpoint to fetch actions
    STREAM: '/stream',  // For state streaming
    HEALTH: '/health',
  },
  PRODUCTION: {
    BASE: 'https://coagentserver-production.up.railway.app/copilotkit_remote',
    ACTIONS: '/info',
    STREAM: '/stream',
    HEALTH: '/health',
  },
} as const;
