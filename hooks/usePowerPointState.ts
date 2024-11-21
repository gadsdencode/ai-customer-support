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

  const currentSlide = slides[currentSlideIndex];

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

  const setCurrentSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  const setDirection = useCallback((direction: number) => {
    setDirection(direction);
  }, []);

  const direction = 0;

  return {
    slides,
    setSlides,
    initialSlides,
    currentSlideIndex,
    currentSlide,
    addSlide,
    updateSlide,
    deleteSlide,
    nextSlide,
    prevSlide,
    setCurrentSlideIndex,
    setCurrentSlide,
    direction,
    setDirection,
  };
};