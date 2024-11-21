import { useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { SlideThumbnail } from './SlideThumbnail';
import { SlideData } from '../types/copilot';

interface VirtualizedThumbnailsProps {
  slides: SlideData[];
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
}

export const VirtualizedThumbnails: React.FC<VirtualizedThumbnailsProps> = ({ 
  slides, 
  currentSlideIndex, 
  setCurrentSlideIndex 
}) => {
    const listRef = useRef<List>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(currentSlideIndex, 'center');
    }
  }, [currentSlideIndex]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <SlideThumbnail
        slide={slides[index]}
        isActive={index === currentSlideIndex}
        onClick={() => setCurrentSlideIndex(index)}
      />
    </div>
  );

  return (
    <List
      height={100}
      itemCount={slides.length}
      itemSize={150}
      layout="horizontal"
      width={600}
    >
      {Row}
    </List>
  );
};