// components/DynamicUIRenderer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAgentUIContext } from '@/app/providers/AGUIProvider';
import { ViewTypeEnum } from '@/app/types/agent';

export const DynamicUIRenderer: React.FC = () => {
  const { uiState } = useAgentUIContext();

  const renderContent = () => {
    switch (uiState.currentView) {
      case 'thinking':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2 p-4 bg-gray-800/30 rounded-lg"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </motion.div>
        );
      case ViewTypeEnum.ACTION:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-blue-500/10 rounded-lg"
          >
            {/* Render action-specific UI based on context */}
            {JSON.stringify(uiState.context, null, 2)}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {renderContent()}
    </div>
  );
};