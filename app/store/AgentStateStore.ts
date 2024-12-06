// File: src/app/store/AgentStateStore.ts

import { create } from 'zustand';
import { ViewTypeEnum } from '@/app/types/agent';

interface AgentState {
  currentStep: string;
  intermediateResults: Record<string, unknown>[];
  confidence: number;
  isProcessing: boolean;
  showDynamicUI: boolean;
  isThinking: boolean;
  needsApproval: boolean;
  currentView: ViewTypeEnum;
}

interface AgentStateStore {
  state: AgentState;
  updateState: (partial: Partial<AgentState>) => void;
  resetState: () => void;
  setShowDynamicUI: (value: boolean) => void;
}

const initialState: AgentState = {
  currentStep: '',
  intermediateResults: [],
  confidence: 0,
  isProcessing: false,
  showDynamicUI: false,
  isThinking: false,
  needsApproval: false,
  currentView: ViewTypeEnum.DEFAULT,
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
  setShowDynamicUI: (value: boolean) => set({ state: { ...initialState, showDynamicUI: value } }),
}));