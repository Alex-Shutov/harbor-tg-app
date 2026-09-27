import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFloating, arrow, offset, shift, Placement } from '@floating-ui/react';
import './tooltipped-element.scss';

export interface TooltippedElementProps {
  children: React.ReactNode;
  tooltip: string;
  showTooltip: boolean;
  position?: Placement;
}

export const TooltippedElement: React.FC<TooltippedElementProps> = ({
  children,
  tooltip,
  showTooltip,
  position = 'bottom',
}) => {
  const arrowRef = useRef<HTMLDivElement>(null);
  
  const getArrowPosition = () => {
    if (!position) return 'bottom';
    if (position.includes('top')) return 'top';
    if (position.includes('bottom')) return 'bottom';
    if (position.includes('left')) return 'left';
    if (position.includes('right')) return 'right';
    return 'bottom';
  };

  const arrowPosition = getArrowPosition();
  
  const { refs, floatingStyles, middlewareData } = useFloating({
    open: showTooltip,
    placement: position,
    strategy: 'fixed',
    middleware: [
      offset(8),
      shift({ padding: 8 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const arrowStyle: React.CSSProperties = middlewareData.arrow
    ? {
        left: middlewareData.arrow.x != null ? `${middlewareData.arrow.x}px` : undefined,
        top: middlewareData.arrow.y != null ? `${middlewareData.arrow.y}px` : undefined,
      }
    : {};

  const tooltipContent = showTooltip ? (
    <div
      ref={refs.setFloating}
      className={`tooltipped-element__tooltip tooltipped-element__tooltip--${arrowPosition}`}
      style={floatingStyles}
    >
      {tooltip}
      <div
        ref={arrowRef}
        className={`tooltipped-element__arrow tooltipped-element__arrow--${arrowPosition}`}
        style={arrowStyle}
      >
        <img 
          src="/tooltip-arrow.svg" 
          alt="" 
          className="tooltipped-element__arrow-icon"
        />
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="tooltipped-element" ref={refs.setReference}>
        {children}
      </div>
      {showTooltip && createPortal(tooltipContent, document.body)}
    </>
  );
};
