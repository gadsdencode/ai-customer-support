/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import type { CoAgentState, ActionContext } from '@/app/types/agent';

interface RenderState {
  status: string;
  state: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

interface CopilotKitEvent extends CustomEvent {
  detail: {
    agentName: string;
    type: string;
    data: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  };
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
  const [currentState, setCurrentState] = useState<RenderState | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [intermediateResults, setIntermediateResults] = useState<Record<string, unknown>[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const executeAction = useCallback(async (action: ActionContext, context: ActionContext): Promise<void> => {
    try {
      console.log('Executing action:', action);
      console.log('Context:', context);
      
      // Update state to thinking when processing a message
      if (action.type === 'processMessage') {
        setCurrentState(prev => ({
          status: 'thinking',
          state: prev?.state || {},
          metadata: {
            step: 'Processing user message...',
            confidence: 0.5
          }
        }));
      }

      // Close existing EventSource if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create new EventSource with proper configuration
      const response = await fetch(streamEndpoint, {
        method: 'POST',
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const buffer = '';

      await new Promise<void>((resolve, reject) => {
        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const text = decoder.decode(value, { stream: true });
              const lines = text.split('\n');

              for (const line of lines) {
                if (line.trim() === '') continue;
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    console.log('Stream data:', data);
                    
                    setCurrentState(prevState => ({
                      status: data.type || prevState?.status || 'idle',
                      state: data.data || prevState?.state || {},
                      metadata: {
                        ...prevState?.metadata,
                        ...data.metadata,
                        step: data.metadata?.step || 'Processing...',
                        confidence: data.metadata?.confidence || 0.5
                      }
                    }));
                    
                    setIntermediateResults(prev => [...prev, data]);

                    // Dispatch event for other components
                    const customEvent = new CustomEvent('copilotkit:state', {
                      detail: {
                        agentName: name,
                        type: data.type,
                        data: data.data,
                        metadata: data.metadata
                      }
                    });
                    window.dispatchEvent(customEvent);

                    if (data.type === 'complete') {
                      resolve();
                      return;
                    }
                  } catch (e) {
                    console.error('Error parsing stream data:', e);
                  }
                }
              }
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        processStream().catch(reject);
      });

    } catch (error) {
      console.error('Error executing action:', error);
      setCurrentState(prev => ({
        status: 'error',
        state: prev?.state || {},
        metadata: {
          step: 'Error occurred',
          confidence: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      throw error;
    }
  }, [name, streamEndpoint]);

  const renderDynamicUI = useCallback(() => {
    if (!currentState) return null;
    return render(currentState);
  }, [currentState, render]);

  // Listen for state updates from Copilotkit
  useEffect(() => {
    const handleStateUpdate = (event: CopilotKitEvent) => {
      if (event.detail.agentName === name) {
        console.log('Received state update:', event.detail);
        setCurrentState({
          status: event.detail.type,
          state: event.detail.data,
          metadata: event.detail.metadata
        });
        setIntermediateResults(prev => [...prev, event.detail]);
      }
    };

    window.addEventListener('copilotkit:state', handleStateUpdate as EventListener);
    return () => window.removeEventListener('copilotkit:state', handleStateUpdate as EventListener);
  }, [name]);

  return {
    render: renderDynamicUI,
    needsApproval,
    setNeedsApproval,
    pendingAction,
    setPendingAction,
    executeAction,
    renderDynamicUI,
    status: currentState?.status || 'idle',
    state: currentState?.state || null,
    streamState: {
      intermediateResults,
      currentStep: currentState?.metadata?.step as string || '',
      confidence: currentState?.metadata?.confidence as number || 0
    }
  };
} 