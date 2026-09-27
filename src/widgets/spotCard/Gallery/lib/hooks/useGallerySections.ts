import { useMemo } from 'react';
import { IGallerySection } from '@/widgets/spotCard/Gallery/types.ts';
import { ISectionWithImages } from '@shared/types';



export const useGallerySections = (sections: ISectionWithImages[]) => {
  return useMemo<IGallerySection[]>(() => {
    if (!sections.length) return [];

    const allImages = sections.flatMap((section) => section.images);

    if (sections.length === 1) {
      return sections;
    }

    const allPhotosSection: IGallerySection = {
      id: -1,
      title: 'Все фото',
      images: allImages,
    };

    return [allPhotosSection, ...sections];
  }, [sections]);
};

