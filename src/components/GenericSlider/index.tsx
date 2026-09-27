import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import './slider.scss';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.ts';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useLazyImageArray } from '../../hooks/useLazyImage';

interface SliderItem {
  id: number;
  title: string;
  imgUrl?: string;
  imageUrl?: string;
}

interface GenericSliderProps {
  label: string;
  itemConstraints:{
    left?:number
    right?:number
    top?:number
    bottom?:number
  }
  items?: SliderItem[];
    type:'events'|'establishments' | 'leisure'
}

const GenericSlider: FC<GenericSliderProps> = ({ label, items, itemConstraints, type }) => {
  const { containerRef: scrollContainerRef, contentRef, x, constraints } = useHorizontalScroll();
  const navigate = useNavigate();

  // Извлекаем URL изображений с поддержкой разных названий полей
  const imageUrls = items?.map(item => item.imgUrl || item.imageUrl).filter(Boolean) || [];

  // Используем хук для ленивой загрузки изображений
  const { 
    isImageLoaded, 
    containerRef: lazyImageContainerRef 
  } = useLazyImageArray(imageUrls);

  const handleClick = (item:SliderItem) => {
    navigate(`/selection/${type}/${item.id}`)
  }

  const renderedItems = useMemo(() => {
    return items?.map((item) => {
      const imageUrl = item.imgUrl || item.imageUrl;
      const imageIsLoaded = imageUrl ? isImageLoaded(imageUrl) : false;
      
      return (
        <div 
          onClick={()=>handleClick(item)} 
          key={item.id} 
          className="slider-item"
          data-img-url={imageUrl}
        >
          <div className="slider-image-wrapper">
            {imageUrl && imageIsLoaded ? (
              <img
                src={imageUrl}
                alt={item.title}
                className="slider-image"
                onDragStart={(e) => e.preventDefault()}
              />
            ) : (
              <div className="slider-image-placeholder">
                <Skeleton height="100%" width="100%" />
              </div>
            )}
            <p className="slider-title">{item.title}</p>
          </div>
        </div>
      );
    });
  }, [items, isImageLoaded]);

  return (
    <div className="generic-slider" ref={lazyImageContainerRef}>
      <div ref={scrollContainerRef} className="slider-label">{label}</div>
      <motion.div
        className="slider-container"
        ref={contentRef}
        drag="x"
        dragConstraints={{...constraints,...itemConstraints}}
        dragElastic={0.1}
        style={{ x }}
        whileTap={{ cursor: 'grabbing' }}

      >
        {renderedItems}
      </motion.div>
    </div>
  );
};

export default GenericSlider;
