// File: src/app/store/AgentStateStore.ts

import { create } from 'zustand';

interface AgentState {
  currentStep: string;
  intermediateResults: Record<string, unknown>[];
  confidence: number;
  isProcessing: boolean;
}

interface AgentStateStore {
  state: AgentState;
  updateState: (partial: Partial<AgentState>) => void;
  resetState: () => void;
}

const initialState: AgentState = {
  currentStep: '',
  intermediateResults: [],
  confidence: 0,
  isProcessing: false,
};

export const useAgentStore = create<AgentStateStore>((set) => ({
  state: initialState,
  updateState: (partial) => 
    set((state) => ({
      state: {
        ...state.state,
        ...partial,
        intermediateResults: partial.intermediateResults
          ? [...state.state.intermediateResults, ...partial.intermediateResults]
          : state.state.intermediateResults,
      }
    })),
  resetState: () => set({ state: initialState }),
}));