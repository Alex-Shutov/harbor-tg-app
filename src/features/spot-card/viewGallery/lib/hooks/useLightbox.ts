import { useState, useCallback } from 'react';

interface LightboxState {
  isOpen: boolean;
  imageIndex: number;
}


export const useLightbox = () => {
  const [lightboxState, setLightboxState] = useState<LightboxState>({
    isOpen: false,
    imageIndex: 0,
  });

  const openLightbox = useCallback((index: number) => {
    setLightboxState({
      isOpen: true,
      imageIndex: index,
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxState({
      isOpen: false,
      imageIndex: 0,
    });
  }, []);

  const goToNext = useCallback((totalImages: number) => {
    setLightboxState((prev) => ({
      isOpen: true,
      imageIndex: (prev.imageIndex + 1) % totalImages,
    }));
  }, []);

  const goToPrev = useCallback((totalImages: number) => {
    setLightboxState((prev) => ({
      isOpen: true,
      imageIndex: prev.imageIndex === 0 ? totalImages - 1 : prev.imageIndex - 1,
    }));
  }, []);

  const selectImage = useCallback((index: number) => {
    setLightboxState({
      isOpen: true,
      imageIndex: index,
    });
  }, []);

  return {
    lightboxState,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrev,
    selectImage,
  };
};
