// hooks/useActionHandler.ts
import { useCallback } from 'react';
import { ActionContext, ActionResult } from '@/app/types/agent';
import { useToast } from '@/hooks/use-toast';

export const useActionHandler = () => {
  const { toast } = useToast();

  const handleAction = useCallback(async (
    action: ActionContext,
    endpoint: string
  ): Promise<ActionResult> => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: 'Action Failed',
        description: errorMessage,
        variant: 'destructive',
        duration: 2500,
      });

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };
    }
  }, [toast]);

  return { handleAction };
};