// app/providers/AgentUIProvider.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AgentUIState } from '@/app/types/agent';
import { useCoAgentStateRender } from '@/hooks/useCoAgentStateRender';
import { ENDPOINTS } from '@/app/configs/endpoints';

interface AgentUIContextType {
  uiState: AgentUIState;
  updateUIState: (newState: Partial<AgentUIState>) => void;
  weatherAgent: ReturnType<typeof useCoAgentStateRender>;
}

const AgentUIContext = createContext<AgentUIContextType | undefined>(undefined);

export const AgentUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiState, setUIState] = useState<AgentUIState>({
    currentView: 'default',
    actions: [],
    context: {},
  });

  // Create a single instance of the weather agent
  const weatherAgent = useCoAgentStateRender({
    name: 'weather_agent',
    streamEndpoint: `${ENDPOINTS.LOCAL.BASE}${ENDPOINTS.LOCAL.ACTIONS}`,
    render: () => null, // Base render function, components will provide their own
  });

  const updateUIState = useCallback((newState: Partial<AgentUIState>) => {
    setUIState(prev => ({
      ...prev,
      ...newState,
    }));
  }, []);

  return (
    <AgentUIContext.Provider value={{ uiState, updateUIState, weatherAgent }}>
      {children}
    </AgentUIContext.Provider>
  );
};

export const useAgentUIContext = () => {
  const context = useContext(AgentUIContext);
  if (!context) {
    throw new Error('useAgentUIContext must be used within AgentUIProvider');
  }
  return context;
};