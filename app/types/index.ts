/* eslint-disable @typescript-eslint/no-explicit-any */
// app/types/index.ts
// TODO: Intended to be a single file that exports all the types used in the app. Will require some refactoring to make it work.

// types/index.ts
export * from './agent';
export * from './copilot';
// export * from './weather';

// types/agent.ts
export interface AgentUIState {
  currentView: 'default' | 'thinking' | 'action';
  actions: string[];
  context: Record<string, unknown>;
}

export interface ActionContext {
  type: string;
  payload: Record<string, unknown>;
}

export interface ActionResult {
  success: boolean;
  data?: {
    response: string;
    metadata?: Record<string, unknown>;
  };
  error?: string;
  timestamp: string;
}

// types/copilot.ts
export interface WeatherResponse {
  conditions: string;
  temperature: number;
  wind_speed: number;
  wind_direction: string;
}

export interface CopilotAction {
  name: string;
  description: string;
  parameters: ActionParameter[];
  handler: (args: any) => Promise<any>;
}

interface ActionParameter {
  name: string;
  type: string;
  description: string;
}