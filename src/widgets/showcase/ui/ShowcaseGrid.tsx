import React, { useEffect } from 'react';
import { IShowcaseItem } from '@/entities/main';
import EstablishmentCard from '@/pages/Establishments/components/CategorySection/components/EstablishmentCard';
import { FoodEstablishmentInfoDto, EventType } from '@/pages/Establishments/components/CategorySection/categorySection.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFavorite, selectIsFavorite, initializeFavorites } from '@/features/spot-card/manageLike/model/store/favorites.slice';
import { EObjectType } from '@shared/constants';
import './showcase-grid.scss';

interface IShowcaseGridProps {
  items: IShowcaseItem[];
}

// Компонент для отдельной карточки с доступом к Redux
interface ShowcaseCardProps {
  item: IShowcaseItem;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const getCardType = (item: IShowcaseItem): 'establishments' | 'events' | 'leisure' => {
    switch (item.type) {
      case 'establishment':
        return 'establishments';
      case 'leisure':
        return 'leisure';
      case 'event':
        return 'events';
      default:
        return 'establishments';
    }
  };

  const mapToFoodEstablishmentInfoDto = (item: IShowcaseItem, isLikedFromRedux?: boolean): FoodEstablishmentInfoDto => {
    // Определяем EventType для событий
    let eventType: EventType | undefined;
    if (item.type === 'event') {
      if (item.dateTime) {
        eventType = EventType.DATE_TIME;
      } else if (item.startDate && item.endDate && item.periodDaysInfo) {
        eventType = EventType.PERIOD_WITH_WORKING_HOURS;
      } else if (item.startDate && item.endDate) {
        eventType = EventType.PERIOD;
      } else if (item.openingHours) {
        eventType = EventType.WORKING_HOURS;
      }
    }

    const entityType =
      item.type === 'establishment' ? 'FOOD_ESTABLISHMENT' :
      item.type === 'leisure' ? 'LEISURE' :
      item.type === 'event' ? 'EVENTS' :
      'FOOD_ESTABLISHMENT';

    // Определяем promotionExist
    const promotionExist = 
      item.promotionExist !== undefined ? item.promotionExist :
      item.isPromotionExist !== undefined ? item.isPromotionExist :
      false;

    return {
      id: item.id,
      title: item.title,
      imgUrl: item.imgUrl,
      serialNumber: item.serialNumber,
      categories: item.categories.map(cat => ({
        id: cat.id,
        title: cat.title,
        priority: cat.priority,
        innerCategories: cat.innerCategories || [],
      })),
      promotionExist,
      inFavorites: isLikedFromRedux !== undefined ? isLikedFromRedux : item.inFavorites,
      type: eventType,
      dateTime: item.dateTime,
      startDate: item.startDate,
      endDate: item.endDate,
      entityType: entityType as 'FOOD_ESTABLISHMENT' | 'EVENT' | 'LEISURE' | 'EVENTS',
    };
  };

  const cardType = getCardType(item);
  const objectType =
    item.type === 'establishment' ? EObjectType.FOOD_ESTABLISHMENT :
    item.type === 'leisure' ? EObjectType.LEISURE :
    item.type === 'event' ? EObjectType.EVENT :
    EObjectType.FOOD_ESTABLISHMENT;

  // Получаем состояние лайка из Redux
  const isLikedFromRedux = useAppSelector(selectIsFavorite(item.id, objectType));
  // Используем Redux значение, если оно есть, иначе item.inFavorites
  debugger
  const finalIsLiked = isLikedFromRedux !== undefined ? isLikedFromRedux : item.inFavorites;
  const establishmentDto = mapToFoodEstablishmentInfoDto(item, finalIsLiked);

  // Обработчик лайка - синхронизируем с Redux после того, как EstablishmentCard обновит лайк
  const handleLikeClick = (establishment: FoodEstablishmentInfoDto) => {
    dispatch(setFavorite({
      id: establishment.id,
      objectType,
      isLiked: !!establishment.inFavorites,
    }));
  };

  return (
    <div className="showcase-grid__card-wrapper">
      <EstablishmentCard
        establishment={establishmentDto}
        type={cardType}
        onLikeClick={handleLikeClick}
        isDetailed={true}
      />
    </div>
  );
};

export const ShowcaseGrid: React.FC<IShowcaseGridProps> = ({ items }) => {
  const dispatch = useAppDispatch();

  // Инициализируем состояние лайков из items при монтировании
  useEffect(() => {
    const favoritesData = items.map((item) => {
      const objectType =
        item.type === 'establishment' ? EObjectType.FOOD_ESTABLISHMENT :
        item.type === 'leisure' ? EObjectType.LEISURE :
        item.type === 'event' ? EObjectType.EVENT :
        EObjectType.FOOD_ESTABLISHMENT;
      
      return {
        id: item.id,
        objectType,
        isLiked: item.inFavorites,
      };
    });
    
    dispatch(initializeFavorites(favoritesData));
  }, [items, dispatch]);

  return (
    <div className="showcase-grid">
      {items.map((item) => (
        <ShowcaseCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
};

