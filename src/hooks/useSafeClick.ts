import React, { useRef, useCallback } from 'react';

type SafeClickHandlers = {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
};
export function useSafeClick(onSafeClick: (e: React.MouseEvent | React.TouchEvent) => void): SafeClickHandlers {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const DRAG_THRESHOLD = 5;

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    startX.current = e.clientX;
    startY.current = e.clientY;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - startX.current);
    const dy = Math.abs(e.clientY - startY.current);
    if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
      isDragging.current = true;
    }
  }, []);

  const onClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) {
      onSafeClick(e);
    }
  }, [onSafeClick]);

  return {
    onPointerDown,
    onPointerMove,
    onClick,
  };
}
