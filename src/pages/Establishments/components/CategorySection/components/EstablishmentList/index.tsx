import React, { useRef, useEffect, useState } from 'react';
import { FoodEstablishmentInfoDto } from '../../categorySection.types.ts';
import EstablishmentCard from '../EstablishmentCard';
import '../../CategorySection.scss';
import { motion, useMotionValue } from 'framer-motion';
import EmptyEstablishments from '@components/EmptyEstablishments';

interface EstablishmentListProps {
  establishments: FoodEstablishmentInfoDto[];
  direction: 'x' | 'y';
  type: 'establishments' | 'events' | 'favorites' | 'leisure';
  isDetailed?: boolean;
  onEmptyCategory?: () => void;
  onLikeClick?: (el:any) => void;
}

const EstablishmentList: React.FC<EstablishmentListProps> = ({
                                                               establishments:initialEstablishments,
                                                               type,
                                                               direction,
                                                               isDetailed,
                                                               onLikeClick, onEmptyCategory
                                                             }) => {
  const [establishments, setEstablishments] = useState(initialEstablishments);
  const containerRef = useRef<HTMLDivElement|null>(null);
  const contentRef = useRef<HTMLDivElement|null>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);
  const SCROLL_END_PADDING = 16;
  const getCurrentType = (establishment: FoodEstablishmentInfoDto) => {
    if (type === 'favorites') {
      // @ts-expect-error
      return establishment.entityType === 'FOOD_ESTABLISHMENT' || establishment?.type === 'FOOD_ESTABLISHMENT'
        ? 'establishments'
        // @ts-expect-error
        : establishment.entityType === 'LEISURE' || establishment?.type === 'LEISURE'
          ? 'leisure'
          : 'events';
    }
    return type;
  };

  const handleLikeClick = (establishment: FoodEstablishmentInfoDto) => {

    onLikeClick && onLikeClick(establishment)
    if (type === 'favorites') {
      setEstablishments(prev => {
        const newEstablishments = prev.filter(e => e.id !== establishment.id);

        if (newEstablishments.length === 0 && prev.length > 0) {
          if (onEmptyCategory) {
            onEmptyCategory();
          }
        }

        return newEstablishments;
      });
    }
  };


  useEffect(() => {
    if (type === 'favorites' && Array.isArray(initialEstablishments)) {
      setEstablishments(initialEstablishments?.filter(e => e.inFavorites));
    }
  }, [initialEstablishments, type]);


  useEffect(() => {
    if (type !== 'favorites') {
      setEstablishments(initialEstablishments);
    }
  }, [initialEstablishments, type]);

  useEffect(() => {
    const updateDragConstraints = () => {
      if (containerRef.current && contentRef.current && direction === 'x') {
        const containerWidth = containerRef?.current?.clientWidth;
        const contentWidth = contentRef?.current?.scrollWidth;
        const maxDragLeft = Math.min(0, containerWidth - contentWidth - SCROLL_END_PADDING);

        setDragConstraints({
          left: maxDragLeft,
          right: 0
        });
      }
    };

    updateDragConstraints();
    window.addEventListener('resize', updateDragConstraints);

    return () => {
      window.removeEventListener('resize', updateDragConstraints);
    };
  }, [establishments, direction]);

  const handleWheel = (event: WheelEvent) => {
    if (direction !== 'x') return;

    event.preventDefault();

    if (contentRef.current && containerRef.current) {
      const containerWidth = containerRef?.current?.clientWidth;
      const contentWidth = contentRef?.current?.scrollWidth;
      const maxDragLeft = Math.min(0, containerWidth - contentWidth - SCROLL_END_PADDING);

      const currentX = x.get();
      let newX = currentX - event.deltaY;

      newX = Math.min(0, Math.max(maxDragLeft, newX));

      x.set(newX);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && direction === 'x') {
      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [direction]);

  if (isDetailed && establishments && Array.isArray(establishments) && establishments.length  === 0) {
    return <div className={'empty-cont'}>
      <EmptyEstablishments
        mainLabel={'По данным фильтрам ничего не найдено'}
        secondLabel={'Попробуйте изменить фильтры'}
        // onClick={() => navigate('/')}
      />
    </div>
  }

  return (
    <div ref={containerRef} className="establishment-list-container">
      <motion.div
        ref={contentRef}
        className={`establishment-list detailed establishment-list__${type}`}
        drag={direction === 'x' ? 'x' : false}
        style={direction === 'x' ? { x } : undefined}
        dragConstraints={direction === 'x' ? dragConstraints : undefined}
        dragElastic={0.05}
        whileTap={{ cursor: 'grabbing' }}
      >
        {establishments &&
          Array.isArray(establishments) &&
          establishments?.map((establishment) => {

            return (
              <EstablishmentCard
                key={establishment.id}
                type={getCurrentType(establishment)}
                onLikeClick={(est) => handleLikeClick(est)}
                isDetailed={isDetailed}
                establishment={establishment}
              />
            );
          })}
      </motion.div>
    </div>
  );
};

export default EstablishmentList;