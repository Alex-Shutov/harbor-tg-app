import { useEffect, useRef, useState, useCallback } from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';

interface ScrollConstraints {
  left: number;
  right: number;
}

const SCROLL_END_PADDING = 16;

export function useHorizontalScroll(): {
  containerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  x: MotionValue<number>;
  constraints: ScrollConstraints;
  recalculate: () => void;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [constraints, setConstraints] = useState<ScrollConstraints>({ left: 0, right: 0 });

  const updateConstraints = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const maxDragLeft = Math.min(0, containerWidth - contentWidth - SCROLL_END_PADDING);
      setConstraints({ left: maxDragLeft, right: 0 });

      // Проверим текущую позицию и подправим если надо
      const currentX = x.get();
      const newX = Math.min(0, Math.max(maxDragLeft, currentX));
      if (currentX !== newX) {
        x.set(newX);
      }
    }
  }, [x]);

  // Public API for manual recalculation
  const recalculate = useCallback(() => {
    requestAnimationFrame(updateConstraints);
  }, [updateConstraints]);

  useEffect(() => {
    // Delay initial calculation to allow DOM to render
    requestAnimationFrame(updateConstraints);

    const resizeObserver = new ResizeObserver(() => {
      updateConstraints();
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    window.addEventListener('resize', updateConstraints);
    return () => {
      window.removeEventListener('resize', updateConstraints);
      resizeObserver.disconnect();
    };
  }, [updateConstraints]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (containerRef.current && contentRef.current) {
        e.preventDefault();
        const currentX = x.get();
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;
        const maxDragLeft = Math.min(0, containerWidth - contentWidth - SCROLL_END_PADDING);

        let newX = currentX - e.deltaY;
        newX = Math.min(0, Math.max(maxDragLeft, newX));
        x.set(newX);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [x]);

  return { containerRef, contentRef, x, constraints, recalculate };
}
