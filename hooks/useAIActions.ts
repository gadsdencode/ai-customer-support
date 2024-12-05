// hooks/useAgentActions.ts

'use client';

// TODO: This is a potential evolution of the useAgentActions hook. Needs polish.
import { useCallback } from 'react';
import { useAgentStore } from '@/app/store/AgentStateStore';
import { ActionResult } from '@/app/types';

export const useAIActions = () => {
  const { updateState } = useAgentStore();

  const executeAction = useCallback(async (
    actionName: string, 
    params: Record<string, unknown>
  ): Promise<ActionResult> => {
    try {
      updateState({ isProcessing: true });
      
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionName, params })
      });

      const result = await response.json();
      
      updateState({ isProcessing: false });
      
      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      updateState({ isProcessing: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }, [updateState]);

  return { executeAction };
};