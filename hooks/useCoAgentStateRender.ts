/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import type { CoAgentState, ActionContext } from '@/app/types/agent';
import { WeatherResponse } from '@/app/types/copilot';
import { useAgentStore } from '@/app/store/AgentStateStore';

export interface RenderState {
  status: string;
  state: WeatherAgentState;
  metadata?: {
    step: string;
    confidence: number;
    error?: string;
  };
}

export interface WeatherAgentState extends Record<string, unknown> {
  final_response: WeatherResponse;
}

interface UseCoAgentStateRenderOptions {
  name: string;
  streamEndpoint: string;
  render: (state: RenderState) => React.ReactNode;
}

export function useCoAgentStateRender({
  name,
  streamEndpoint,
  render,
}: UseCoAgentStateRenderOptions): CoAgentState {
  const [currentState, setCurrentState] = useState<RenderState>({
    status: 'idle',
    state: { final_response: {} as WeatherResponse } as WeatherAgentState,
    metadata: {
      step: '',
      confidence: 0
    }
  });

  const [needsApproval, setNeedsApproval] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  
  const updateAgentState = useAgentStore(state => state.updateState);
  const resetAgentState = useAgentStore(state => state.resetState);
  
  const processingRef = useRef<boolean>(false);
  const activeStreamRef = useRef<boolean>(false);
  
  const cleanup = useCallback(() => {
    processingRef.current = false;
    activeStreamRef.current = false;
  }, []);

  const renderDynamicUI = useCallback(() => {
    return render(currentState);
  }, [currentState, render]);
  
  const executeAction = useCallback(async (action: ActionContext, context: ActionContext): Promise<void> => {
    if (processingRef.current) return;

    try {
      // Add abort controller for clean timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(streamEndpoint, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          agent_name: name,
          action: action.type,
          context: context.payload,
          stream: true
        })
      });
      clearTimeout(timeoutId);

      // Enhanced error logging
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorBody.slice(0, 100)}`);
      }

      // Ensure response body exists before accessing it
      if (!response.body) {
        throw new Error('Response body is missing');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalResponseSet = false;

      while (activeStreamRef.current) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const event = JSON.parse(line);
              if (event.type === 'update' && event.data) {
                const weatherData = {
                  conditions: event.data.conditions || 'Unknown',
                  temperature: parseFloat(event.data.temperature) || 0,
                  wind_speed: parseFloat(event.data.wind_speed) || 0,
                  wind_direction: event.data.wind_direction || 'N/A'
                } as WeatherResponse;
              }
              // Check for other event types like 'thinking' or 'response'
              else if (event.type === 'thinking') {  
                setCurrentState({
                  status: 'thinking',
                  state: { final_response: {} as WeatherResponse } as WeatherAgentState,
                  metadata: {
                    step: 'Processing request...',
                    confidence: 0.5
                  }
                });

                updateAgentState({
                  currentStep: event.data?.step || 'Thinking...', 
                  confidence: event.data?.confidence || 0.5,
                  isProcessing: true,
                  intermediateResults: []
                });
              } else if (event.type === 'response') {
                setCurrentState({
                  status: 'response',
                  state: { final_response: {} as WeatherResponse } as WeatherAgentState,
                  metadata: {
                    step: 'Received weather data',
                    confidence: 1
                  }
                });

                const newState = {
                  status: 'response',
                  state: {
                    final_response: {} as WeatherResponse
                  } as WeatherAgentState,
                  metadata: {
                    step: 'Received weather data',
                    confidence: 1
                  }
                };

                setCurrentState(newState);
                updateAgentState({
                  currentStep: 'Received weather data',
                  confidence: 1,
                  isProcessing: false,
                  intermediateResults: [{} as WeatherResponse]
                });

                updateAgentState({
                  currentStep: event.data?.step || 'Response received', 
                  confidence: event.data?.confidence || 1,
                  isProcessing: false,
                  intermediateResults: [{} as WeatherResponse]
                });
                
                finalResponseSet = true;
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Action error:', error);
      setCurrentState(prev => ({
        ...prev,
        status: 'error',
        metadata: {
          step: error instanceof Error ? error.message : 'Network failure',
          confidence: 0
        }
      }));
    } finally {
      cleanup();
      // Ensure thinking state is reset
      updateAgentState({
        isThinking: false,
        isProcessing: false
      });
    }
  }, [name, streamEndpoint, updateAgentState, cleanup]);

  useEffect(() => {
    return () => {
      cleanup();
      resetAgentState();
    };
  }, [resetAgentState, cleanup]);

  return {
    render: renderDynamicUI,
    needsApproval,
    setNeedsApproval,
    pendingAction,
    setPendingAction,
    executeAction,
    renderDynamicUI,
    status: currentState.status,
    state: currentState.state,
    streamState: {
      intermediateResults: [],
      currentStep: currentState.metadata?.step || '',
      confidence: currentState.metadata?.confidence || 0
    }
  };
} 