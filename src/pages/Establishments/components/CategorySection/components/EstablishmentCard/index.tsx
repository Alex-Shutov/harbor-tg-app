import React, { useEffect, useState } from 'react';
import './EstablishmentCard.scss';
import { EventType, FoodEstablishmentInfoDto } from '../../categorySection.types.ts';
import classNames from 'classnames';
import { formatDateTime, formatPeriod } from '../../../../../../utils/date.ts';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LikeButton from '../../../../../../shared/LikeButton';
import { useAppDispatch } from '@/store/hooks';
import { setFavorite } from '@/features/spot-card/manageLike/model/store/favorites.slice';
import { useToggleFavoriteMutation } from '@/features/spot-card/manageLike/model/api/like.api.ts';
import { EObjectType } from '@shared/constants';

interface EstablishmentCardProps {
  establishment: FoodEstablishmentInfoDto;
  isDetailed?: boolean;
  onLikeClick: (el:FoodEstablishmentInfoDto) => void;
  type: 'establishments' | 'events' | 'favorites' | 'leisure';
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
                                                               isDetailed,
                                                               establishment,
                                                               onLikeClick,
                                                               type,
                                                             }) => {
  const dispatch = useAppDispatch();
  const [toggleFavoriteMutation] = useToggleFavoriteMutation();
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false);
  const flatCategories = establishment.categories.map(el=>el.title)
  const createCaptionFromFlattenCategories = () => {
    return (flatCategories.reduce((acc,currValue,index)=>index!==flatCategories.length-1 ? acc + `${currValue} • ` : acc + `${currValue}`,''))
  }

  const [isLiked, setIsLiked] = useState(establishment.inFavorites);

  useEffect (() => {
    if (establishment ){
      setIsLiked(establishment.inFavorites)
    }
  }, [establishment]);
  const getDateForCaption = () => {
    if (!establishment.type) return null;

    switch (establishment.type) {
      case EventType.WORKING_HOURS:
        return '';
      case EventType.DATE_TIME:
        return establishment.dateTime && <span>{formatDateTime(establishment.dateTime)}</span>;
      case EventType.PERIOD:
        return establishment.startDate && establishment.endDate &&
          <span>{formatPeriod(establishment.startDate, establishment.endDate)}</span>;
      case EventType.PERIOD_WITH_WORKING_HOURS:
        return establishment.startDate && establishment.endDate &&
          <span>{formatPeriod(establishment.startDate, establishment.endDate)}</span>;

      default:
        return null;
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);

    // Определяем тип объекта
    const apiObjectType =
      type === 'establishments' ? 'ESTABLISHMENT' :
        type === 'events' ? 'EVENT' :
          type === 'leisure' ? 'LEISURE' :
            'ESTABLISHMENT';

    // Определяем objectType для Redux
    const objectType =
      type === 'establishments' ? EObjectType.FOOD_ESTABLISHMENT :
        type === 'events' ? EObjectType.EVENT :
          type === 'leisure' ? EObjectType.LEISURE :
            EObjectType.FOOD_ESTABLISHMENT;

    // Оптимистичное обновление Redux состояния
    dispatch(setFavorite({
      id: establishment.id,
      objectType,
      isLiked: newLikeStatus,
    }));

    // Отправляем запрос
    try {
      await toggleFavoriteMutation({ id: establishment.id, object_type: apiObjectType as EObjectType }).unwrap();
      onLikeClick?.({...establishment,inFavorites:newLikeStatus});
    } catch (e) {
      // Если запрос не удался, возвращаем предыдущее состояние
      setIsLiked(!newLikeStatus);
      dispatch(setFavorite({
        id: establishment.id,
        objectType,
        isLiked: !newLikeStatus,
      }));
    }
  };

  const handleNavigate = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (establishment.entityType === 'FOOD_ESTABLISHMENT') {
      return navigate(`/establishment/${establishment.id}`);
    } else if (establishment.entityType === 'EVENTS') {
      return navigate(`/event/${establishment.id}`);
    } else {
      return navigate(`/leisure/${establishment.id}`);
    }
  }

  return (
    <div onClick={handleNavigate} className="establishment-card">
      <div className={classNames (`image-container`, { 'detailed': isDetailed, 'image-container__event':type==='events' })}>
        {!imageLoaded && (
          <Skeleton
            height="100%"
            width="100%"
            className="establishment-image-skeleton"
          />
        )}
        <img
          style={{ display: imageLoaded ? 'block' : 'none' }}
          src={establishment.imgUrl}
          alt={establishment.title}
          className="establishment-image"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          onDragStart={(e) => e.preventDefault ()}
        />

        {establishment.promotionExist && <div className="promotion">Harbor Codes</div>}

        <div className="like-container">
          <LikeButton className={'like-button'} onClick={handleLikeClick} isLiked={isLiked} />
        </div>
      </div>

      <div className="details">
        <div className={'categories'}>
          {createCaptionFromFlattenCategories()}
        </div>
        <div className="name">{establishment.title}</div>
        <div className="details__time">{getDateForCaption()}</div>
      </div>
    </div>
  );
};

export default EstablishmentCard;
