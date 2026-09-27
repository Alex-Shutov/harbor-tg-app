import { useMemo } from 'react';
import {
  IImageGroup,
  ImageLayoutType,
} from '@/widgets/spotCard/Gallery/types.ts';
import { IGalleryImage } from '@/features/spot-card/viewGallery';

export const useImageGroups = (
  images: IGalleryImage[],
  layout: ImageLayoutType
): IImageGroup[] => {
  return useMemo(() => {
    if (layout !== '4-scroll') {
      return [{ type: 'regular', images }];
    }

    const groups: IImageGroup[] = [];
    let idx = 0;

    while (idx + 3 <= images.length) {
      groups.push({
        type: 'regular',
        images: images.slice(idx, idx + 3),
      });
      idx += 3;
    }

    const remaining = images.length - idx;
    if (remaining === 1) {
      groups.push({
        type: 'full',
        images: [images[idx]],
      });
    } else if (remaining === 2) {
      groups.push({
        type: 'pair',
        images: [images[idx], images[idx + 1]],
      });
    }

    return groups;
  }, [images, layout]);
};
