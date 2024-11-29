/* eslint-disable @typescript-eslint/no-explicit-any */
// app/types/agent.ts
export interface AgentUIState {
    currentView: 'default' | 'thinking' | 'action' | 'approval';
    actions: string[];
    context: Record<string, unknown>;
  }
  
  export interface ActionResult {
    success: boolean;
    data?: any;
    error?: string;
    timestamp: string;
  }
  
  export interface ActionContext {
    type: string;
    payload: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
  
  export interface SharedState {
    currentAction?: string;
    lastAction?: ActionResult;
    lastError?: {
      action: string;
      error: string;
      timestamp: string;
    };
    isProcessing: boolean;
  }