import React from 'react';
import { ImageLayoutType } from '../types';

interface IGallerySkeletonProps {
  layout: ImageLayoutType;
}

export const GallerySkeleton: React.FC<IGallerySkeletonProps> = ({ layout }) => {
  const skeletonCount = (() => {
    switch (layout) {
      case '1':
        return 1;
      case '2':
        return 2;
      case '3':
        return 3;
      case '4-scroll':
        return 4;
    }
  })();

  return (
    <div className={`gallery__skeleton gallery__skeleton--${layout}`}>
      {Array.from({ length: skeletonCount }).map((_, idx) => (
        <div
          key={idx}
          className={`gallery__skeleton-item gallery__skeleton-item--${idx}`}
        >
          <div className="gallery__skeleton-img" />
        </div>
      ))}
    </div>
  );
};
