/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/services/actionService.ts
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ENDPOINTS } from '@/app/configs/endpoints';
import { useAgentStore } from '@/app/store/AgentStateStore';
import { WeatherResponse } from '@/app/types/copilot';

export class ActionExecutionError extends Error {
  constructor(message: string, public readonly context: Record<string, unknown>) {
    super(message);
    this.name = 'ActionExecutionError';
  }
}

export const useExecuteAction = () => {
  const updateAgentState = useAgentStore(state => state.updateState);
  const { toast } = useToast();

  return async (actionName: string, parameters: Record<string, any>) => {
    try {
      updateAgentState({
        currentStep: 'Initiating request...',
        confidence: 0.1,
        isProcessing: true,
        intermediateResults: []
      });

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Server error: ${errorData.message || response.statusText || 'Unexpected error'}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let result;
      if (data.status === "success" && data.result) {
        result = data.result;
      } else if (data.weather) {
        // Handle weather-specific response
        result = {
          conditions: data.weather.conditions || 'Unknown',
          temperature: parseFloat(data.weather.temperature) || 0,
          wind_speed: parseFloat(data.weather.wind_speed) || 0,
          wind_direction: data.weather.wind_direction || 'N/A'
        } as WeatherResponse;
      } else if (data.error) {
        throw new Error(`Action failed: ${data.error}`);
      } else {
        throw new Error('Invalid response format');
      }

      // Update state with successful response
      updateAgentState({
        currentStep: 'Processing response...',
        confidence: 1,
        isProcessing: false,
        intermediateResults: [result]
      });

      return result;
    } catch (error) {
      console.error("Error executing action:", error);
      
      // Update state with error
      updateAgentState({
        currentStep: 'Error occurred',
        confidence: 0,
        isProcessing: false,
        intermediateResults: []
      });

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });

      throw error;
    }
  };
};

