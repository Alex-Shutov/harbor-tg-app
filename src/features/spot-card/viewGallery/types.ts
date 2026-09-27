export interface IGalleryImage {
  id: number;
  url: string;
}

export interface IGalleryLightboxProps {
  images: IGalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectImage?: (index: number) => void;
}
