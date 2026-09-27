import React from 'react';
import Button from '../../shared/Button';
import './EmptyEstablishments.scss';
import Skeleton from 'react-loading-skeleton';

interface EmptyEstablishmentsProps {
  mainLabel: string;
  secondLabel: string;
  onClick?: () => void;
  buttonText?: string;
  imagePath?: string;
}

const EmptyEstablishments: React.FC<EmptyEstablishmentsProps> = ({
                                                                   mainLabel,
                                                                   secondLabel,
                                                                   onClick,
                                                                   buttonText = 'Посмотреть места',
                                                                   imagePath = '/empty_reservation.gif'
                                                                 }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  return (
    <div className="empty-state">
      <div className="empty-state--container">
        {!isLoaded && (
          <Skeleton
            height="112px"
            width="96px"
            className="establishment-image-skeleton"
          />
        )}
        <img
          className="empty-state--container-image"
          src={imagePath}
          alt="Empty state"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
        <div className="empty-state--container-empty">
          {mainLabel}
        </div>
        <div className="empty-state--container-empty-label">
          {secondLabel}
        </div>
        {onClick && (
          <div className="empty-state--container-button">
            <Button onClick={onClick} type="primary">
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyEstablishments;