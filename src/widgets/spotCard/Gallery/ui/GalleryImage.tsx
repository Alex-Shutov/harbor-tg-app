import { useEffect, useState } from 'react';
import { IGalleryImage } from '../../../../features/spot-card/viewGallery';

interface IGalleryImageProps {
  image: IGalleryImage;
  onClick: () => void;
}

export const GalleryImage: React.FC<IGalleryImageProps> = ({
                                                             image,
                                                             onClick,
                                                           }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [image.url]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={`gallery__image-item ${
        isLoading ? 'is-loading' : ''
      } ${hasError ? 'has-error' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {!hasError && (
        <img
          src={image.url}
          alt={`Gallery image ${image.id}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {hasError && (
        <div className="gallery__image-error">
          <span>Ошибка загрузки</span>
        </div>
      )}
    </div>
  );
};
