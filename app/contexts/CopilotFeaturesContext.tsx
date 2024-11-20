/* eslint-disable @typescript-eslint/no-explicit-any */
// CopilotFeaturesContext.tsx

import { createContext, useContext } from 'react';

interface CopilotFeaturesContextType {
  appState: any;
  actions: Record<string, (...args: any[]) => Promise<any>>;
  suggestions: string[];
}

export const CopilotFeaturesContext = createContext<CopilotFeaturesContextType>({
  appState: {},
  actions: {},
  suggestions: [],
});

export const useCopilotFeatures = () => useContext(CopilotFeaturesContext);