// app/providers/AgentUIProvider.tsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AgentUIState, ViewTypeEnum } from '@/app/types/agent';
import { useCoAgentStateRender } from '@/hooks/useCoAgentStateRender';
import { ENDPOINTS } from '@/app/configs/endpoints';

interface AgentUIContextType {
  uiState: AgentUIState;
  updateUIState: (newState: Partial<AgentUIState>) => void;
  setView: (view: ViewTypeEnum) => void;
  resetState: () => void;
  weatherAgent: ReturnType<typeof useCoAgentStateRender>;
}

const initialState: AgentUIState = {
  currentView: ViewTypeEnum.DEFAULT,
  actions: [],
  context: {},
};

const AgentUIContext = createContext<AgentUIContextType | undefined>(undefined);

export const AgentUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiState, setUIState] = useState<AgentUIState>(initialState);

  // Create a single instance of the weather agent
  const weatherAgent = useCoAgentStateRender({
    name: 'weather_agent',
    streamEndpoint: `${ENDPOINTS.PRODUCTION.BASE}${ENDPOINTS.PRODUCTION.ACTIONS}`,
    render: () => null, // Base render function, components will provide their own
  });

   const updateUIState = useCallback((newState: Partial<AgentUIState>) => {
    setUIState(prev => ({
      ...prev,
      ...newState,
    }));
  }, []);

  const setView = useCallback((view: ViewTypeEnum) => {
    setUIState(prev => ({
      ...prev,
      currentView: view,
    }));
  }, []);

  const resetState = useCallback(() => {
    setUIState(initialState);
  }, []);

  const value = useMemo(
    () => ({
      uiState,
      updateUIState,
      setView,
      resetState,
      weatherAgent,
    }),
    [uiState, updateUIState, setView, resetState, weatherAgent]
  );

  return (
    <AgentUIContext.Provider value={value}>
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