import React from 'react';
import { Image } from '@shared/ui';
import { LikeButton } from '@shared/ui';
import './event-card.scss';

export interface EventCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  date?: string;
  inFavorites: boolean;
  onLikeClick?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
                                                      imageUrl,
                                                      title,
                                                      subtitle,
                                                      date,
                                                      inFavorites,
                                                      onLikeClick,
                                                      onClick,
                                                    }) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeClick?.(e);
  };

  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-card__image-container">
        <Image src={imageUrl} alt={title} className="event-card__image" />
        <div
          className="event-card__like-button"
        >
          <LikeButton
            isLiked={inFavorites}
            onClick={handleLikeClick}
            size="medium"
          />
        </div>
      </div>

      <div className="event-card__content">
        {subtitle && (
          <p className="event-card__subtitle">{subtitle}</p>
        )}

        {title && <h3 className="event-card__title">{title}</h3>}

        {date && (
          <p className="event-card__date">{date}</p>
        )}
      </div>
    </div>
  );
};
