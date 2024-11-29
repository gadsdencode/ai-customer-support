/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/hooks/useCoAgentStateRender.ts

"use client"; // Ensure this is at the top if using Next.js with the App Router.

import { ENDPOINTS } from '@/app/configs/endpoints';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

interface UseCoAgentStateRenderOptions<T> {
  name: string;
  nodeName?: string;
  streamEndpoint?: string;
  render: (params: {
    status: string;
    state: T;
    nodeName?: string;
    streamState?: StreamState;
  }) => JSX.Element;
}

interface StreamState {
    intermediateResults: any[];
    currentStep: string;
    confidence: number;
  }

export function useCoAgentStateRender<T>({
  name,
  nodeName,
  streamEndpoint,
  render,
}: UseCoAgentStateRenderOptions<T>) {
  const [status, setStatus] = useState<string>('');
  const [state, setState] = useState<T | null>(null);
  const [currentNodeName, setCurrentNodeName] = useState<string | undefined>(undefined);
  const [root, setRoot] = useState<ReactDOM.Root | null>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const [streamState, setStreamState] = useState<StreamState>({
    intermediateResults: [],
    currentStep: '',
    confidence: 0
  });

  useEffect(() => {
    // Create a div for the portal
    const div = document.createElement('div');
    document.body.appendChild(div);
    setElement(div);

    // Create a React root
    const reactRoot = ReactDOM.createRoot(div);
    setRoot(reactRoot);

    // Clean up on unmount
    return () => {
      reactRoot.unmount();
      document.body.removeChild(div);
    };
  }, []);

  useEffect(() => {
    // Set up both event sources if needed
    const eventSources: EventSource[] = [];
    
    // Main coagent event source
    const mainEventSource = new EventSource(`${ENDPOINTS.PRODUCTION.BASE}${ENDPOINTS.PRODUCTION.ACTIONS}`);
    eventSources.push(mainEventSource);

    const handleMainMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const { agentName, node, status: eventStatus, state: eventState } = data;

        if (agentName !== name) return;
        if (nodeName && node !== nodeName) return;

        setStatus(eventStatus);
        setState(eventState);
        setCurrentNodeName(node);
      } catch (error) {
        console.error('Error parsing event data:', error);
      }
    };

    mainEventSource.addEventListener('message', handleMainMessage);

    // Set up streaming event source if endpoint provided
    if (streamEndpoint) {
      const streamEventSource = new EventSource(streamEndpoint);
      eventSources.push(streamEventSource);

      const handleStreamUpdate = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          setStreamState(prev => ({
            ...prev,
            intermediateResults: [...prev.intermediateResults, data],
            currentStep: data.step || prev.currentStep,
            confidence: data.confidence || prev.confidence
          }));
        } catch (error) {
          console.error('Error parsing stream data:', error);
        }
      };

      streamEventSource.addEventListener('message', handleStreamUpdate);
    }

    // Clean up function
    return () => {
      eventSources.forEach(es => es.close());
    };
  }, [name, nodeName, streamEndpoint]);

  useEffect(() => {
    if (root && state) {
      const content = render({
        status,
        state,
        nodeName: currentNodeName,
        streamState,
      });
      root.render(content);
    }
  }, [root, status, state, currentNodeName, streamState, render]);

  return null;
}
