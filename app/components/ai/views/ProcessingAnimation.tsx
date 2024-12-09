// File: src/components/ai/views/ProcessingAnimation.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const processingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const ProcessingAnimation: React.FC = () => {
  return (
    <motion.div
      variants={processingVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex items-start space-x-4 mb-4 w-full"
      style={{ 
        zIndex: 1000,
        position: 'relative',
        pointerEvents: 'none'
      }}
    >
      <Avatar className="border-2 border-blue-500 shadow-glow-blue">
        <AvatarImage src="/support-avatar.png" alt="AI" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div
        className={`rounded-lg p-3 max-w-[70%] bg-gray-800/30 text-gray-200 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg relative overflow-hidden backdrop-blur-sm`}
      >
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-blue-500 font-medium">Processing...</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-shimmer" />
      </div>
    </motion.div>
  );
};