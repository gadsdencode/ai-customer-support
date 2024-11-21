// hooks/usePowerPointState.ts
import { useState, useCallback } from 'react';

export interface Slide {
  title: string;
  content: string;
  spokenNarration?: string;
}

export const usePowerPointState = (initialSlides: Slide[] = []) => {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const addSlide = useCallback((newSlide: Slide) => {
    setSlides(prevSlides => [...prevSlides, newSlide]);
  }, []);

  const updateSlide = useCallback((index: number, updatedSlide: Partial<Slide>) => {
    setSlides(prevSlides => 
      prevSlides.map((slide, i) => i === index ? { ...slide, ...updatedSlide } : slide)
    );
  }, []);

  const deleteSlide = useCallback((index: number) => {
    setSlides(prevSlides => prevSlides.filter((_, i) => i !== index));
    setCurrentSlideIndex(prevIndex => Math.min(prevIndex, slides.length - 2));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex(prevIndex => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex(prevIndex => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  return {
    slides,
    currentSlideIndex,
    addSlide,
    updateSlide,
    deleteSlide,
    nextSlide,
    prevSlide,
    setCurrentSlideIndex,
  };
};