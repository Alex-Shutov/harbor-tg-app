export interface IGallerySection {
  id: number;
  title: string;
  images: IGalleryImage[];
}

export interface IGalleryImage {
  id: number;
  url: string;
}

export interface IGalleryProps {
  sections: IGallerySection[];
  mainImage: IGalleryImage;
}

export type ImageLayoutType = '1' | '2' | '3' | '4-scroll';

export interface IImageGroup {
  type: 'regular' | 'full' | 'pair';
  images: IGalleryImage[];
}
