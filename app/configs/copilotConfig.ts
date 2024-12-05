// config/copilotConfig.ts
import { CopilotState } from '../types/copilot';
import { ENDPOINTS } from './endpoints';

export const initialCopilotState: CopilotState = {
  actions: [],
  context: {},
  isInitialized: false
};

export const copilotConfig = {
  baseURL: ENDPOINTS.PRODUCTION.ACTIONS,
  defaultActions: [
    {
      name: "sendMessage",
      description: "Send a message in the chat",
      parameters: [
        {
          name: "message",
          type: "string",
          description: "The message content"
        }
      ]
    }
  ]
};