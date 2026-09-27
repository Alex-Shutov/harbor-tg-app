import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
  preloadNext?: boolean;
  preloadPrev?: boolean;
}

export const useLazyImage = (
  imageUrl: string | undefined | null,
  options: UseLazyImageOptions = {}
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    preloadNext = false,
    preloadPrev = false
  } = options;

  const loadImage = useCallback((url: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setIsLoaded(true);
        setHasError(false);
        resolve();
      };
      img.onerror = () => {
        setHasError(true);
        resolve();
      };
    });
  }, []);

  // Загрузка изображения при изменении URL
  useEffect(() => {
    if (!imageUrl) {
      setIsLoaded(false);
      setHasError(false);
      return;
    }

    setIsLoaded(false);
    setHasError(false);
    loadImage(imageUrl);
  }, [imageUrl, loadImage]);

  // Настройка Intersection Observer для ленивой загрузки
  useEffect(() => {
    if (!imgRef.current || !imageUrl) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded && !hasError) {
            loadImage(imageUrl);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageUrl, isLoaded, hasError, threshold, rootMargin, loadImage]);

  // Предзагрузка соседних изображений
  const preloadAdjacentImages = useCallback((urls: string[]) => {
    if (!preloadNext && !preloadPrev) return;

    const imagesToPreload: string[] = [];
    
    if (preloadNext && urls.length > 0) {
      imagesToPreload.push(...urls.slice(0, 2)); // Следующие 2 изображения
    }
    
    if (preloadPrev && urls.length > 0) {
      imagesToPreload.push(...urls.slice(-2)); // Предыдущие 2 изображения
    }

    // Загружаем с небольшой задержкой для снижения нагрузки
    imagesToPreload.forEach((url, index) => {
      setTimeout(() => {
        const img = new Image();
        img.src = url;
      }, index * 100);
    });
  }, [preloadNext, preloadPrev]);

  return {
    isLoaded,
    hasError,
    imgRef,
    preloadAdjacentImages
  };
};

// Хук для ленивой загрузки массива изображений
export const useLazyImageArray = (
  imageUrls: (string | undefined | null)[]
) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const loadImage = useCallback((url: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (loadedImages.has(url)) {
        resolve();
        return;
      }

      setLoadingImages(prev => new Set(prev).add(url));
      
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(url));
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
        resolve();
      };
      img.onerror = () => {
        setErrorImages(prev => new Set(prev).add(url));
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
        resolve();
      };
    });
  }, [loadedImages]);

  useEffect(() => {
    if (!containerRef.current || imageUrls.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgUrl = entry.target.getAttribute('data-img-url');
            if (imgUrl && !loadedImages.has(imgUrl) && !loadingImages.has(imgUrl)) {
              loadImage(imgUrl);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const sliderItems = containerRef.current.querySelectorAll('[data-img-url]');
    sliderItems.forEach((item) => {
      if (observerRef.current) {
        observerRef.current.observe(item);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageUrls, loadedImages, loadingImages, loadImage]);

  useEffect(() => {
    if (imageUrls.length > 0 && imageUrls[0]) {
      loadImage(imageUrls[0]);
    }
  }, [imageUrls, loadImage]);

  // Функция для загрузки изображения по требованию
  const loadImageOnDemand = useCallback((url: string) => {
    if (!loadedImages.has(url) && !loadingImages.has(url)) {
      loadImage(url);
    }
  }, [loadedImages, loadingImages, loadImage]);

  // Функция для предзагрузки изображений
  const preloadImages = useCallback((urls: string[]) => {
    urls.forEach((url, index) => {
      setTimeout(() => {
        loadImage(url);
      }, index * 50); // Небольшая задержка между загрузками
    });
  }, [loadImage]);

  return {
    loadedImages,
    loadingImages,
    errorImages,
    loadImageOnDemand,
    preloadImages,
    containerRef,
    isImageLoaded: (url: string) => loadedImages.has(url),
    isImageLoading: (url: string) => loadingImages.has(url),
    isImageError: (url: string) => errorImages.has(url)
  };
};

