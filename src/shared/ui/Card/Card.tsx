import React from 'react';
import './card.scss';
import { StatusBadge } from '@shared/ui';

interface ICardProps {
  imgUrl: string;
  imgAlt?: string;
  title: string;
  subtitle?: string;
  description?: string;
  status?: {value:string,type:'success' | 'error' | 'warning'};
  isExpired?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
  winnerMessage?: string;
}

export const Card: React.FC<ICardProps> = ({
                                             imgUrl,
                                             imgAlt = 'Card image',
                                             title,
                                             subtitle,
                                             description, status,
                                             isExpired = false,
                                             onClick,
                                             badge,
                                             winnerMessage,
                                           }) => {
  return (
    <div
      className={`card ${isExpired ? 'card--expired' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={'card__header'}>
        <h3 className="card__title">{title}</h3>
        <div className="card__image-wrapper">
          <img src={imgUrl} alt={imgAlt} className="card__image" />
          {badge && <div className="card__badge">{badge}</div>}
        </div>

      </div>

      <div className="card__content">
        <div className={'card__info'}>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        {winnerMessage && <p className="card__winner-message">{winnerMessage}</p>}
        {description && <div className="card__description"><span className={'description'}>{description}</span></div>}
          {status && <div className={'card__status'}><StatusBadge value={status.value} type={status.type}/></div>}
        </div>
        <div className="card__arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>


    </div>
  );
};
