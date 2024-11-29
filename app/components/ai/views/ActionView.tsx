import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export interface ActionViewProps {
  actions: string[];
  onActionSelect: (action: string) => void;
}

export const ActionView: React.FC<ActionViewProps> = ({ actions, onActionSelect }) => {
  return (
    <div className="flex flex-col space-y-2">
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              // Handle action click
              console.log('Action clicked:', action);
              onActionSelect(action);
            }}
          >
            {action}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};