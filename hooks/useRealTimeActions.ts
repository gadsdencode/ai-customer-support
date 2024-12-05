// app/hooks/useRealtimeActions.ts
import { useCallback, useContext } from 'react';
import { InteleosSharedStateContext } from '@/app/contexts/InteleosContext';
import { ActionContext, ActionResult } from '@/app/types/agent';
import { useExecuteAction } from '@/app/services/actionService';

export const useRealtimeActions = () => {
  const { sharedState, updateState } = useContext(InteleosSharedStateContext);
  const executeAction = useExecuteAction();

  const handleRealtimeAction = useCallback(async (
    action: string,
    context: ActionContext
  ): Promise<ActionResult> => {
    const timestamp = new Date().toISOString();

    try {
      // Pre-action state update
      updateState({
        currentAction: action,
        isProcessing: true
      }, { merge: true });

      // Execute the action
      const result = await executeAction(action, context.payload as Record<string, unknown>);

      // Post-action state update
      updateState({
        lastAction: {
          success: true,
          data: result,
          timestamp
        },
        currentAction: undefined,
        isProcessing: false
      }, { merge: true });

      return {
        success: true,
        data: result,
        timestamp
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Error state update
      updateState({
        lastError: {
          action,
          error: errorMessage,
          timestamp
        },
        currentAction: undefined,
        isProcessing: false
      }, { merge: true });

      return {
        success: false,
        error: errorMessage,
        timestamp
      };
    }
  }, [executeAction, updateState]);

  return {
    handleRealtimeAction,
    isProcessing: sharedState.isProcessing
  };
};