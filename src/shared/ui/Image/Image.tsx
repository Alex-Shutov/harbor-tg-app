import React, { useState } from 'react';
import './image.scss';

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const Image: React.FC<ImageProps> = ({
                                              src,
                                              alt = 'Image',
                                              className = '',
                                              onLoad,
                                              onError,
                                            }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`image-wrapper ${className}`}>
      {isLoading && <div className="image-wrapper__skeleton" />}
      {hasError && <div className="image-wrapper__error">Ошибка загрузки</div>}
      <img
        src={src}
        alt={alt}
        className={`image-wrapper__img ${isLoading ? 'image-wrapper__img--loading' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
