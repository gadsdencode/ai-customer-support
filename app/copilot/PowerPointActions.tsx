// /app/copilot/PowerPointActions.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePowerPointState, Slide } from '../../hooks/usePowerPointState';

interface PowerPointActionsProps {
  onGenerateSlide: () => Promise<Slide>;
}

export const PowerPointActions: React.FC<PowerPointActionsProps> = ({ onGenerateSlide }) => {
  const { addSlide, deleteSlide, currentSlideIndex } = usePowerPointState();

  const handleGenerateSlide = async () => {
    const newSlide = await onGenerateSlide();
    addSlide(newSlide);
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={handleGenerateSlide}>Generate Slide</Button>
      <Button onClick={() => deleteSlide(currentSlideIndex)}>Delete Current Slide</Button>
    </div>
  );
};