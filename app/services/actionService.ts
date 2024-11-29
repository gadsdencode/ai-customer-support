/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/services/actionService.ts
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ENDPOINTS } from '@/app/configs/endpoints';

export class ActionExecutionError extends Error {
  constructor(message: string, public readonly context: Record<string, unknown>) {
    super(message);
    this.name = 'ActionExecutionError';
  }
}

export const useExecuteAction = () => {
  return async (actionName: string, parameters: Record<string, any>) => {
    try {
      const response = await fetch(`${ENDPOINTS.PRODUCTION.BASE}${ENDPOINTS.PRODUCTION.ACTIONS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action_name: actionName,
          parameters: parameters || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.message || 'Unexpected error'}`);
      }

      const data = await response.json();
      if (data.status !== "success") {
        throw new Error(`Action failed: ${data.message}`);
      }

      return data.result;
    } catch (error) {
      console.error("Error executing action:", error);
      throw error;
    }
  };
};

