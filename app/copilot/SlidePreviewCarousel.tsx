/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/copilot/SlidePreviewCarousel.tsx

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { SlidePreview } from './SlidePreview';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { usePowerPointState } from '../../hooks/usePowerPointState';
import { SlideData } from '../types/copilot';
import { SlideThumbnail } from './SlideThumbnail';
import { VirtualizedThumbnails } from './VirtualizedThumbnails';

export interface SlidePreviewCarouselProps {
  slides: SlideData[];
  backgroundImageUrl: string;
}

export const SlidePreviewCarousel: React.FC<SlidePreviewCarouselProps> = ({ 
  slides,
  backgroundImageUrl
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const {
    currentSlideIndex,
    setCurrentSlideIndex,
    addSlide,
    updateSlide,
    deleteSlide,
    nextSlide,
    prevSlide,
  } = usePowerPointState(slides);

  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (event.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    const currentCarouselRef = carouselRef.current;
    currentCarouselRef?.addEventListener('keydown', handleKeyDown);
    currentCarouselRef?.focus();

    return () => {
      currentCarouselRef?.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      autoplayRef.current = setInterval(() => {
        handleNextSlide();
      }, 5000); // Change slide every 5 seconds
    } else {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isPlaying]);

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSlide = () => {
    setDirection(1);
    nextSlide();
  };

  const handlePrevSlide = () => {
    setDirection(-1);
    prevSlide();
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextSlide,
    onSwipedRight: handlePrevSlide,
    trackMouse: true
  });

  return (
    <div className="space-y-4">
      <div 
        {...handlers}
        ref={carouselRef} 
        className="relative w-full max-w-4xl mx-auto h-[400px]"
        tabIndex={0} 
        aria-label="Slide Preview Carousel"
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlideIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <SlidePreview
              {...slides[currentSlideIndex]}
              slides={slides}
              done={true}
              onNavigate={(direction) => direction === 'next' ? handleNextSlide() : handlePrevSlide()}
              backgroundImageUrl={backgroundImageUrl}
              currentSlideIndex={currentSlideIndex}
              currentSlide={currentSlideIndex}
              direction={direction}
              nextSlide={handleNextSlide}
              prevSlide={handlePrevSlide}
              addSlide={addSlide}
              setCurrentSlide={setCurrentSlideIndex}
              setDirection={setDirection}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentSlideIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`Slide ${index + 1} ${index === currentSlideIndex ? '(Current)' : ''}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={toggleAutoplay}
          className="absolute left-4 bottom-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
        </Button>
      </div>
      
      <div className="flex justify-center space-x-2 overflow-x-auto py-2">
        <VirtualizedThumbnails 
          slides={slides} 
          currentSlideIndex={currentSlideIndex} 
          setCurrentSlideIndex={setCurrentSlideIndex} 
        />
      </div>
    </div>
  );
};