import React, { useEffect, useState, useRef } from 'react';
import { IGalleryLightboxProps } from '../types.ts';
import './lightbox.scss';
import { CloseButton } from '@shared/ui';

export const GalleryLightbox: React.FC<IGalleryLightboxProps> = ({
                                                                   images,
                                                                   currentIndex,
                                                                   onClose,
                                                                   onNext,
                                                                   onPrev,
                                                                   onSelectImage,
                                                                 }) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const currentImage = images[currentIndex];

  // Обработчик кнопки назад теперь в родительском компоненте Gallery
  // для лучшего контроля над состоянием лайтбокса

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onNext();
      } else {
        onPrev();
      }
    }
    setTouchStart(null);
  };

  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.querySelector(
        '.gallery__lightbox-thumbnail--active'
      ) as HTMLElement;

      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentIndex]);

  return (
    <div
      className="gallery__lightbox"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      <div
        className="gallery__lightbox-overlay"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        aria-label="Close lightbox"
      />
      <CloseButton className={'gallery__lightbox__close-button'} onClick={onClose} size="large" />

      <div className="gallery__lightbox-content">
        <div className="gallery__lightbox-image-wrapper">
          <img
            src={currentImage.url}
            alt={`Image ${currentIndex + 1}`}
            className="gallery__lightbox-image"
          />
        </div>

        <div className="gallery__lightbox-thumbnails" ref={thumbnailsRef}>
          {images.map((img, idx) => (
            <button
              key={img.id}
              className={`gallery__lightbox-thumbnail ${
                idx === currentIndex ? 'gallery__lightbox-thumbnail--active' : ''
              }`}
              onClick={() => {
                if (onSelectImage) {
                  onSelectImage(idx);
                }
              }}
              aria-label={`Go to image ${idx + 1}`}
              aria-current={idx === currentIndex ? 'true' : 'false'}
            >
              <img src={img.url} alt={`Thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
