// /app/copilot/SlideThumbnail.tsx

import React from 'react';
import { SlideData } from '../types/copilot';
import { Button } from '@/components/ui/button';

interface SlideThumbnailProps {
  slide: SlideData;
  isActive: boolean;
  onClick: () => void;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ slide, isActive, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className={`w-36 h-16 border-2 ${
        isActive ? 'border-primary' : 'border-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-primary rounded-md overflow-hidden`}
      aria-label={`Go to slide: ${slide.title}`}
    >
      <div className="w-full h-full p-1 text-xs overflow-hidden">
        <p className="font-bold truncate text-white">{slide.title}</p>
        <p className="text-white line-clamp-2">{slide.content}</p>
      </div>
    </Button>
  );
};