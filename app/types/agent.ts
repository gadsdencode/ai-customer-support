/* eslint-disable @typescript-eslint/no-explicit-any */
// app/types/agent.ts
import { ReactNode } from 'react';

export interface AgentUIState {
    currentView: 'default' | 'thinking' | 'action' | 'approval';
    actions: string[];
    context: Record<string, unknown>;
  }

  export interface CoAgentState {
    render: () => ReactNode;
    needsApproval: boolean;
    setNeedsApproval: (value: boolean) => void;
    pendingAction: string | null;
    setPendingAction: (action: string | null) => void;
    executeAction: (action: ActionContext, context: ActionContext) => Promise<void>;
    renderDynamicUI: () => ReactNode;
    status: string;
    state: Record<string, unknown> | null;
    streamState: {
      intermediateResults: Record<string, unknown>[];
      currentStep: string;
      confidence: number;
    };
  }
  
  export interface ActionResult {
    success: boolean;
    data?: Record<string, unknown>;
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