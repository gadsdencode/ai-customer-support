// /app/hooks/useSlideTransition.ts

import { useState, useCallback } from 'react';
import { SlideData } from '@/app/types/copilot';

export const useSlideTransition = (initialSlides: SlideData[] = []) => {
  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const addSlide = useCallback((newSlide: SlideData) => {
    setSlides((prevSlides) => [...prevSlides, newSlide]);
  }, []);

  return { 
    currentSlide, 
    direction, 
    nextSlide, 
    prevSlide, 
    setCurrentSlide, 
    setDirection, 
    slides, 
    setSlides,
    addSlide
  };
};