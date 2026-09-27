import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { CloseButton } from '../CloseButton';
import './bottom-sheet-with-image.scss';
import { ShareButton } from '@shared/ui';
import { GalleryLightbox, useLightbox } from '@/features/spot-card/viewGallery';
import { IGalleryImage } from '@/features/spot-card/viewGallery/types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLazyImageArray } from '@/hooks/useLazyImage';
import { useBackButtonStack } from '@/hooks/useBackButtonStack';

const AUTO_SLIDE_INTERVAL = 5000; // 5 секунд

export interface BottomSheetWithImageProps {
  isOpen: boolean;
  onClose: () => void;
  mainImage: string;
  additionalImages?: string[];
  imageAlt?: string;
  title?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  onShare?: () => void;
}

export const BottomSheetWithImage: React.FC<BottomSheetWithImageProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            mainImage,
                                                                            additionalImages = [],
                                                                            imageAlt = 'Image',
                                                                            title,
                                                                            children,
                                                                            closeOnOverlayClick = true,
                                                                            onShare,
                                                                          }) => {
  const { lightboxState, openLightbox, closeLightbox, goToNext, goToPrev, selectImage } = useLightbox();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);
  const [nextImageIndex, setNextImageIndex] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const onceLoadedImagesRef = useRef<Set<string>>(new Set());
  const currentImageRef = useRef<HTMLImageElement | null>(null);

  const allImages: IGalleryImage[] = useMemo(() => {
    const images: IGalleryImage[] = [{ id: 0, url: mainImage }];
    additionalImages.forEach((url, index) => {
      images.push({ id: index + 1, url });
    });
    return images;
  }, [mainImage, additionalImages]);

  const imageUrls = useMemo(() => allImages.map(img => img.url), [allImages]);
  
  const {
    isImageLoaded,
    isImageLoading,
    loadImageOnDemand,
    preloadImages,
    containerRef: lazyImageContainerRef
  } = useLazyImageArray(imageUrls);

  const totalImages = allImages.length;
  const showDots = totalImages > 1;
  const dotsCount = Math.min(totalImages, 4);
  const currentImage = allImages[currentImageIndex];
  const isCurrentImageLoaded = isImageLoaded(currentImage.url);
  const isCurrentImageLoading = isImageLoading(currentImage.url);
  const wasImageLoadedBefore = onceLoadedImagesRef.current.has(currentImage.url);
  
  // Проверяем, загружено ли изображение (включая кэш браузера)
  // Используем состояние для отслеживания готовности изображения из кэша
  const [imageReadyFromCache, setImageReadyFromCache] = useState(false);
  
  const isImageReady = isCurrentImageLoaded || wasImageLoadedBefore || imageReadyFromCache;

  // Функция для плавного перехода к следующему изображению
  const goToNextImage = useCallback((nextIndex: number, direction: 'next' | 'prev' = 'next') => {
    if (nextIndex === currentIndexRef.current || isTransitioning) return;
    
    // Предзагружаем следующее изображение
    const nextImage = allImages[nextIndex];
    if (nextImage) {
      loadImageOnDemand(nextImage.url);
    }
    
    setNextImageIndex(nextIndex);
    setSlideDirection(direction);
    setIsTransitioning(true);
    
    // После завершения анимации обновляем индекс
    setTimeout(() => {
      setCurrentImageIndex(nextIndex);
      currentIndexRef.current = nextIndex;
      setIsTransitioning(false);
      setNextImageIndex(null);
      setSlideDirection(null);
    }, 400); // Время анимации slide
  }, [allImages, loadImageOnDemand, isTransitioning]);

  // Автоматическое листание
  const startAutoSlide = useCallback(() => {
    if (totalImages <= 1) return;
    
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % totalImages;
      goToNextImage(nextIndex, 'next');
    }, AUTO_SLIDE_INTERVAL);
  }, [totalImages, goToNextImage]);

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Обработка свайпов
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    stopAutoSlide();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Свайп вправо - следующее изображение
        const nextIndex = (currentIndexRef.current + 1) % totalImages;
        goToNextImage(nextIndex, 'next');
      } else {
        // Свайп влево - предыдущее изображение
        const prevIndex = currentIndexRef.current === 0 ? totalImages - 1 : currentIndexRef.current - 1;
        goToNextImage(prevIndex, 'prev');
      }
    }
    setTouchStart(null);
    
    // Перезапускаем автолистание после свайпа
    if (totalImages > 1) {
      startAutoSlide();
    }
  };

  const handleBackButton = useCallback(() => {
    closeLightbox();
  }, [closeLightbox]);

  
  useBackButtonStack(handleBackButton, 100, lightboxState.isOpen);

  // Предзагрузка изображений при открытии
  useEffect(() => {
    if (isOpen && allImages.length > 0) {
      // Загружаем первое изображение сразу, если еще не загружено
      const firstImageUrl = allImages[0].url;
      if (!isImageLoaded(firstImageUrl) && !isImageLoading(firstImageUrl)) {
        loadImageOnDemand(firstImageUrl);
      }
      // Предзагружаем остальные изображения
      if (allImages.length > 1) {
        const remainingUrls = allImages.slice(1).map(img => img.url);
        preloadImages(remainingUrls);
      }
    }
  }, [isOpen, allImages, loadImageOnDemand, preloadImages, isImageLoaded, isImageLoading]);

  // Отслеживаем загруженные изображения
  useEffect(() => {
    if (isCurrentImageLoaded && !onceLoadedImagesRef.current.has(currentImage.url)) {
      onceLoadedImagesRef.current.add(currentImage.url);
    }
    // Сбрасываем состояние кэша при смене изображения
    setImageReadyFromCache(false);
  }, [isCurrentImageLoaded, currentImage.url]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Сбрасываем индекс при открытии
      setCurrentImageIndex(0);
      setIsTransitioning(false);
      // Запускаем автолистание если есть несколько изображений
      if (totalImages > 1) {
        // Небольшая задержка перед запуском автолистания
        const timeout = setTimeout(() => {
          startAutoSlide();
        }, AUTO_SLIDE_INTERVAL);
        return () => clearTimeout(timeout);
      }
    } else {
      document.body.style.overflow = '';
      stopAutoSlide();
    }

    return () => {
      document.body.style.overflow = '';
      stopAutoSlide();
    };
  }, [isOpen, totalImages, startAutoSlide, stopAutoSlide]);

  // Перезапускаем автолистание после закрытия лайтбокса
  useEffect(() => {
    if (!lightboxState.isOpen && isOpen && totalImages > 1) {
      startAutoSlide();
    }
  }, [lightboxState.isOpen, isOpen, totalImages, startAutoSlide]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = () => {
    stopAutoSlide();
    openLightbox(currentImageIndex);
  };

  return (
    <div className="bottom-sheet-image-overlay" onClick={handleOverlayClick} ref={lazyImageContainerRef}>
      <div className="bottom-sheet-image">
        <div 
          ref={imageContainerRef}
          className="bottom-sheet-image__image-wrapper"
          style={{position:'relative'}}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          data-img-url={currentImage.url}
        >
          {/* Показываем skeleton только если изображение еще не загружено, не было загружено ранее, и не в процессе перехода */}
          {(isCurrentImageLoading || !isCurrentImageLoaded) && !isTransitioning && !isImageReady && (
            <div className="bottom-sheet-image__skeleton">
              <Skeleton height="148px" width="100%" />
            </div>
          )}
          {/* Текущее изображение */}
          <img
            ref={(el) => {
              currentImageRef.current = el;
              // Проверяем, загружено ли изображение из кэша браузера
              if (el?.complete && el.naturalWidth > 0) {
                onceLoadedImagesRef.current.add(currentImage.url);
                setImageReadyFromCache(true);
              }
            }}
            key={`current-${currentImageIndex}-${currentImage.url}`}
            src={currentImage.url}
            alt={imageAlt}
            className={`bottom-sheet-image__image bottom-sheet-image__image--clickable bottom-sheet-image__image--current ${
              isImageReady ? 'bottom-sheet-image__image--loaded' : 'bottom-sheet-image__image--hidden'
            } ${isTransitioning && slideDirection ? `bottom-sheet-image__image--slide-${slideDirection === 'next' ? 'out' : 'out-prev'}` : ''}`}
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.complete && img.naturalWidth > 0) {
                onceLoadedImagesRef.current.add(currentImage.url);
                setImageReadyFromCache(true);
              }
            }}
          />
          {/* Следующее изображение во время перехода */}
          {isTransitioning && nextImageIndex !== null && (
            <>
              {(!isImageLoaded(allImages[nextImageIndex].url) || isImageLoading(allImages[nextImageIndex].url)) && (
                <div className="bottom-sheet-image__skeleton bottom-sheet-image__skeleton--next">
                  <Skeleton height="148px" width="100%" />
                </div>
              )}
              <img
                key={`next-${nextImageIndex}-${allImages[nextImageIndex].url}`}
                src={allImages[nextImageIndex].url}
                alt={imageAlt}
                className={`bottom-sheet-image__image bottom-sheet-image__image--next ${
                  isImageLoaded(allImages[nextImageIndex].url) ? 'bottom-sheet-image__image--loaded' : 'bottom-sheet-image__image--hidden'
                } ${slideDirection ? `bottom-sheet-image__image--slide-${slideDirection === 'next' ? 'in' : 'in-prev'}` : ''} bottom-sheet-image__image--slide-start-${slideDirection === 'next' ? 'right' : 'left'}`}
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
              />
            </>
          )}
          {onShare && (
            <div className="bottom-sheet-image__share-button">
              <ShareButton onClick={onShare} size="small" />
            </div>
          )}
          {showDots && (
            <div className="bottom-sheet-image__dots">
              {Array.from({ length: dotsCount }).map((_, index) => {
                // Если изображений больше 4, показываем активную точку только для первых 4
                const isActive = index === currentImageIndex && currentImageIndex < dotsCount;
                return (
                  <div
                    key={index}
                    className={`bottom-sheet-image__dot ${isActive ? 'bottom-sheet-image__dot--active' : ''}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className={"bottom-sheet-image__container"}>
          <div className="bottom-sheet-image__header">
            {title && <h2 className="bottom-sheet-image__title">{title}</h2>}
            <CloseButton
              onClick={onClose}
              className="bottom-sheet-image__close"
              aria-label="Закрыть"
              size="medium"
            />
          </div>

          <div className="bottom-sheet-image__content">{children}</div>
        </div>
      </div>

      {lightboxState.isOpen && allImages.length > 0 && (
        <GalleryLightbox
          images={allImages}
          currentIndex={lightboxState.imageIndex}
          onClose={closeLightbox}
          onNext={() => goToNext(allImages.length)}
          onPrev={() => goToPrev(allImages.length)}
          onSelectImage={selectImage}
        />
      )}
    </div>
  );
};
