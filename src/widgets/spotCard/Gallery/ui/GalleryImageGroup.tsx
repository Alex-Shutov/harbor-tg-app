import React from 'react';
import { GalleryImage } from './GalleryImage';
import { IImageGroup, IGalleryImage } from '../types';

interface IGalleryImageGroupProps {
  group: IImageGroup;
  images: IGalleryImage[];
  onImageClick: (index: number) => void;
}


export const GalleryImageGroup: React.FC<IGalleryImageGroupProps> = ({
                                                                       group,
                                                                       images,
                                                                       onImageClick,
                                                                     }) => {
  const getImageIndex = (img: IGalleryImage): number => {
    return images.findIndex((image) => image.id === img.id);
  };

  if (group.type === 'regular') {
    return (
      <div className="gallery__group gallery__group--regular">
        <GalleryImage
          image={group.images[0]}
          onClick={() => onImageClick(getImageIndex(group.images[0]))}
        />
        <div className="gallery__group-small">
          {group.images[1] && (
            <GalleryImage
              image={group.images[1]}
              onClick={() => onImageClick(getImageIndex(group.images[1]))}
            />
          )}
          {group.images[2] && (
            <GalleryImage
              image={group.images[2]}
              onClick={() => onImageClick(getImageIndex(group.images[2]))}
            />
          )}
        </div>
      </div>
    );
  }

  if (group.type === 'full') {
    return (
      <div className="gallery__group gallery__group--full">
        <GalleryImage
          image={group.images[0]}
          onClick={() => onImageClick(getImageIndex(group.images[0]))}
        />
      </div>
    );
  }

  if (group.type === 'pair') {
    return (
      <div className="gallery__group gallery__group--pair">
        <GalleryImage
          image={group.images[0]}
          onClick={() => onImageClick(getImageIndex(group.images[0]))}
        />
        {group.images[1] && (
          <GalleryImage
            image={group.images[1]}
            onClick={() => onImageClick(getImageIndex(group.images[1]))}
          />
        )}
      </div>
    );
  }

  return null;
};
