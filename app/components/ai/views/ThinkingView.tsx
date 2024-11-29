// app/components/ai/views/ThinkingView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ThinkingViewProps {
  context: Record<string, unknown>;
}

export const ThinkingView: React.FC<ThinkingViewProps> = ({ context }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-2 p-4"
    >
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Processing {context.currentTask as string}...</span>
    </motion.div>
  );
};