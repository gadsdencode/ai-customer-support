/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/copilot/SlidePreview.tsx

import React, { useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Presentation } from './Presentation';
import { SlideData } from '../types/copilot';
interface SlidePreviewProps extends SlideData {
    done: boolean;
    backgroundImageUrl?: string;
    onNavigate: (direction: 'next' | 'prev') => void;
    currentSlide: number;
    direction: number;
    nextSlide: () => void;
    prevSlide: () => void;
    setCurrentSlide: (slide: number) => void;
    setDirection: (direction: number) => void;
    currentSlideIndex: number;
    slides: SlideData[];
    addSlide: (slide: SlideData) => void;
  }

export const SlidePreview: React.FC<SlidePreviewProps> = ({
  title,
  content,
  spokenNarration,
  done = false,
  backgroundImageUrl,
  onNavigate,
  currentSlide,
  direction,
  nextSlide,
  prevSlide,
  setCurrentSlide,
  setDirection,
  currentSlideIndex,
  slides,
  addSlide,
}) => {
  const { theme } = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const gradientColors = useMemo(() => {
    return theme === 'dark'
      ? ['from-blue-700', 'to-teal-700', 'bg-gray-900', 'border-gray-800']
      : ['from-blue-300', 'to-teal-300', 'bg-white', 'border-gray-200'];
  }, [theme]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      onNavigate('next');
    } else if (event.key === 'ArrowLeft') {
      onNavigate('prev');
    }
  }, [onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleAddSlide = () => {
    addSlide({ title: '', content: '', spokenNarration: '' });
  };

  return (
    <div className="w-full h-full">
      <div className="relative h-full">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors[0]} ${gradientColors[1]} transform scale-[0.80] rounded-full blur-3xl`} />
        <div 
          className={`relative shadow-xl ${gradientColors[2]} border ${gradientColors[3]} px-6 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-between`}
          style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <h2 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 relative z-50`}>
            {done ? (title || "Slide Preview") : "Generating Slide..."}
          </h2>
          {!done && (
            <motion.div
              className="w-full h-2 bg-blue-300 rounded-full mb-4 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
            >
              <motion.div
                className="h-full bg-blue-700 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
              />
            </motion.div>
          )}
          <p className={`font-normal text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4 relative z-50 whitespace-pre-wrap flex-grow overflow-auto`}>
            {content}
          </p>
          {spokenNarration && (
            <details className="mt-2 relative z-50">
              <summary className={`cursor-pointer ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:underline`}>
                View Narration
              </summary>
              <p className={`mt-2 font-normal text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {spokenNarration}
              </p>
            </details>
          )}
          <div className="flex justify-left mt-4">
            <div className="flex flex-row space-x-2">
              <Button variant="default" onClick={prevSlide}>Prev</Button>
              <Button variant="default" onClick={nextSlide}>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};