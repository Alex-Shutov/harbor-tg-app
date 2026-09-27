import { useMemo } from 'react';
import { ImageLayoutType } from '@/widgets/spotCard/Gallery/types.ts';

export const useImageLayout = (imageCount: number): ImageLayoutType => {
  return useMemo(() => {
    if (imageCount === 1) return '1';
    if (imageCount === 2) return '2';
    if (imageCount === 3) return '3';
    if (imageCount >= 4) return '4-scroll';
    return '1';
  }, [imageCount]);
};
