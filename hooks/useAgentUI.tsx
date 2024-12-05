/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useAgentUI.ts
import { useState, useCallback, useRef } from 'react';
import { AgentUIState } from '@/app/types/agent';
import { motion } from 'framer-motion';
import { ThinkingView } from '@/app/components/ai/views/ThinkingView';
import { ActionView } from '@/app/components/ai/views/ActionView';
import { HumanApprovalModal } from '@/app/components/ai/HumanApprovalModal';
import { actionRequiresApproval } from "@/app/utils/actionUtils";
import { useRealtimeActions } from '@/hooks/useRealTimeActions';

export const useAgentUI = () => {
  const [uiState, setUIState] = useState<AgentUIState>({
    currentView: 'default',
    actions: [],
    context: {}
  });
  
  const { handleRealtimeAction } = useRealtimeActions();
  const prevStateRef = useRef<AgentUIState>(uiState);

  const updateUIState = useCallback((
    newState: Partial<AgentUIState>
  ) => {
    setUIState(prev => {
      const merged = {
        ...prev,
        ...newState
      };
      
      // Only update if the state has actually changed
      if (JSON.stringify(prevStateRef.current) === JSON.stringify(merged)) {
        return prev;
      }
      
      prevStateRef.current = merged;
      return merged;
    });
  }, []);

  const renderDynamicUI = useCallback(() => {
    const { currentView, context, actions } = uiState;

    const commonProps = {
      className: "mt-4 w-full",
      animate: { opacity: 1, y: 0 },
      initial: { opacity: 0, y: 20 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 }
    };

    switch(currentView) {
      case 'thinking':
        return (
          <motion.div {...commonProps}>
            <ThinkingView 
              context={context}
              key="thinking-view"
            />
          </motion.div>
        );
      case 'action':
        return (
          <motion.div {...commonProps}>
            <ActionView 
              actions={actions}
              key="action-view"
              onActionSelect={async (action) => {
                if (actionRequiresApproval(action)) {
                  updateUIState({ currentView: 'approval', context: { ...context, pendingAction: action } });
                } else {
                  await handleRealtimeAction(action, { type: action, payload: context });
                  updateUIState({ currentView: 'default' });
                }
              }}
            />
          </motion.div>
        );
      case 'approval':
        return (
          <motion.div {...commonProps}>
            <HumanApprovalModal
              isOpen={true}
              onClose={() => updateUIState({ currentView: 'default' })}
              onApprove={async () => {
                const pendingAction = context.pendingAction as string;
                await handleRealtimeAction(pendingAction, { type: pendingAction, payload: context });
                updateUIState({ currentView: 'default' });
              }}
              onReject={() => updateUIState({ currentView: 'default' })}
              data={context.pendingAction as any}
            />
          </motion.div>
        );
      default:
        return null;
    }
  }, [uiState, handleRealtimeAction, updateUIState]);

  return {
    uiState,
    updateUIState,
    renderDynamicUI
  };
};