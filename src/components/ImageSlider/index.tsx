import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageSlider.scss';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import LikeButton from "../../shared/LikeButton";
import Rating from "../../shared/Rating";
import { CloseButton } from '@shared/ui';
import { Banner } from '@shared/types';
import Skeleton from 'react-loading-skeleton';
import { useLazyImageArray } from '../../hooks/useLazyImage';

const SlideIntervalConst = 5000;

type ImageSliderProps = {
  images: Banner[] | string[] | undefined | null;
  rating?: number;
  canLike?: boolean;
  isLiked?: boolean;
  onClose?: () => void;
  onCapture?: (banner: Banner) => void;
  onLikeClick?: (e: React.MouseEvent) => void;
  haveMargin?: boolean;
  isLoading?: boolean;
};

const ImageSlider: React.FC<ImageSliderProps> = ({
                                                   images,
                                                   rating,
                                                   canLike,
                                                   isLiked,
                                                   onClose,
                                                   onCapture,
                                                   onLikeClick,
                                                   isLoading = false
                                                 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const prevImagesRef = useRef<Banner[] | string[] | null | undefined>(null);
  const sliderRef = useRef<Slider | null>(null);

  // Извлекаем URL изображений
  const imageUrls = useMemo(() => images?.map(img => typeof img === 'string' ? img : img.imgUrl) || [], [images]);

  // Используем хук для ленивой загрузки изображений
  const {
    isImageLoaded,
    loadImageOnDemand,
    preloadImages,
    containerRef: lazyImageContainerRef
  } = useLazyImageArray(imageUrls);

  // Обработчик изменения слайда
  const handleSlideChange = useCallback((_: never, newIndex: number) => {
    setCurrentIndex(newIndex);
    stopSlideShow();
    
    // Загружаем изображения для текущего и соседних слайдов
    const currentUrl = imageUrls[newIndex];
    const nextUrl = imageUrls[newIndex + 1];
    const prevUrl = imageUrls[newIndex - 1];
    
    if (currentUrl) loadImageOnDemand(currentUrl);
    if (nextUrl) loadImageOnDemand(nextUrl);
    if (prevUrl) loadImageOnDemand(prevUrl);
  }, [setCurrentIndex, imageUrls, loadImageOnDemand]);

  // Инициализация и предзагрузка
  useEffect(() => {
    if (!images || isLoading || images.length === 0) {
      return;
    }

    // Сбросить состояние при смене набора изображений
    if (images !== prevImagesRef.current) {
      prevImagesRef.current = images;
      setTriggerAnimation(false);
    }

    // Предзагружаем изображения в фоне с низким приоритетом
    if (imageUrls.length > 1) {
      const remainingImages = imageUrls.slice(1);
      preloadImages(remainingImages);
    }
  }, [images, isLoading, imageUrls, preloadImages]);

  // Автопрокрутка слайдера
  const startSlideShow = useCallback(() => {
    stopSlideShow();
    intervalRef.current = setInterval(() => {
      sliderRef.current?.slickNext();
    }, SlideIntervalConst);
  }, []);

  const stopSlideShow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  useEffect(() => {
    if (images?.length && !isLoading) {
      setCurrentIndex(0);
      startSlideShow();

      // Запускаем анимацию после небольшой задержки
      setTimeout(() => setTriggerAnimation(true), 100);
    }

    return () => {
      stopSlideShow();
      setCurrentIndex(0);
    };
  }, [setCurrentIndex, startSlideShow, images?.length, isLoading]);

  const renderImage = (item: Banner | string, index: number) => {
    const isBanner = typeof item !== 'string';
    const imgSrc = isBanner ? item?.imgUrl : item;
    const link = isBanner ? item?.linkToFollow : null;
    const imageIsLoaded = imgSrc ? isImageLoaded(imgSrc) : false;

    return (
      <div
        key={index}
        onClick={() => isBanner && onCapture?.(item as Banner)}
        className="slider-image-wrapper"
        data-img-url={imgSrc}
      >
        {Boolean(rating) && (
          <div className="rating-container">
            <Rating rating={rating} />
          </div>
        )}
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {imageIsLoaded ? (
              <img src={imgSrc} alt={`Image ${index + 1}`} className="slider-image" />
            ) : (
              <div className="slider-image-placeholder">
                <Skeleton height="100%" width="100%" />
              </div>
            )}
          </a>
        ) : (
          <>
            {imageIsLoaded ? (
              <img src={imgSrc} alt={`Image ${index + 1}`} className="slider-image" />
            ) : (
              <div className="slider-image-placeholder">
                <Skeleton height="100%" width="100%" />
              </div>
            )}
          </>
        )}

        {onClose && (
          <div className="close-container">
            <CloseButton
              onClick={onClose}
              aria-label="Закрыть"
              size="medium"
            />
          </div>
        )}
      </div>
    );
  };

  // Отображаем лоадер, пока загружаются данные
  if (isLoading) {
    return (
      <div className="image-slider">
        <Skeleton
          height={292}
          width="100%"
          className="slider-skeleton-main"
        />
      </div>
    );
  }

  // Отображаем плейсхолдер если нет изображений
  if (!images || images.length === 0) {
    return (
      <div className="image-slider">
        <div className="slider-placeholder">
          Нет доступных изображений
        </div>
      </div>
    );
  }

  return (
    <div className="image-slider" ref={lazyImageContainerRef}>
      <Slider
        ref={sliderRef}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={false}
        draggable={true}
        beforeChange={handleSlideChange}
        afterChange={startSlideShow}
      >
        {images.map(renderImage)}
      </Slider>

      {canLike && (
        <div className="like-container">
          <LikeButton
            isLiked={isLiked}
            iconSrc={'/like-big.svg'}
            onClick={onLikeClick}
          />
        </div>
      )}

      <div className="progress-indicator">
        {images.length > 1 && images.map((_, index) => (
          <div key={index} className="progress-segment">
            <div
              className={`progress-bar ${currentIndex === index ? 'active' : ''}`}
              style={{
                width: currentIndex === index && triggerAnimation ? '100%' : '0%',
                transition: currentIndex === index && triggerAnimation
                  ? `width ${SlideIntervalConst}ms linear`
                  : 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;