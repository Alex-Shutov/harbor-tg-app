import React, { useState } from 'react';
import './tabs.scss';
import Skeleton from 'react-loading-skeleton';

export type TTabSize = 'large' | 'small';

export interface ITabProps {
  title: string;
  iconSrc?: string;
  icon?: React.ReactNode;
  size?: TTabSize;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Tab: React.FC<ITabProps> = ({
                                           title,
                                           iconSrc,
                                           icon,
                                           size = 'small',
                                           isActive = false,
                                           className = '',
                                           onClick,
                                         }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const classNames = [
    'tab-card',
    `tab-card--${size}`,
    isActive ? 'tab-card--active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
  return (
    <button type="button" className={classNames} onClick={onClick}>
      {isLoading && !icon
        && <Skeleton
          height="100%"
          width="100%"
        />}
          <span className="tab-card__title">{title}</span>
          {icon ? (
            <span className="tab-card__icon tab-card__icon--glyph" aria-hidden>
              {icon}
            </span>
          ) : (
            <img
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              onLoadedDataCapture={() => setIsLoading(false)}
              className="tab-card__icon"
              src={iconSrc}
              alt={title}
            />
          )}
    </button>
  );
};

