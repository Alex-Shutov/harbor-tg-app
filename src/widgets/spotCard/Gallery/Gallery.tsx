import React, { useState, useMemo, useCallback } from 'react';
import { useLightbox, GalleryLightbox } from '../../../features/spot-card/viewGallery';
import { GalleryImage } from './ui/GalleryImage';
import { GalleryImageGroup } from './ui/GalleryImageGroup';
import { GalleryTabs } from './ui/GalleryTabs';
import { GallerySkeleton } from './ui/GallerySkeleton';
import { useImageLayout } from './lib/hooks/useImageLayout';
import { useImageGroups } from './lib/hooks/useImageGroups';
import { IGalleryProps, IGallerySection, IGalleryImage } from './types';
import './gallery.scss';
import { Title } from '@shared/ui';
import { useBackButtonStack } from '@hooks/useBackButtonStack.ts';

export const Gallery: React.FC<IGalleryProps> = ({ sections,mainImage }) => {



  const allImages: IGalleryImage[] = useMemo(
    () => sections.flatMap((s) => s.images),
    [sections]
  );
  const allSection: IGallerySection = {
    id: -1,
    title: 'Все фото',
    images:  [mainImage,...allImages]
  };

  const tabSections: IGallerySection[] = useMemo(
    () =>
      [allSection, ...sections.filter((s) => s.images.length > 0)],
    [allSection, sections]
  );

  // Активный таб по умолчанию — "Все фото"
  const [activeTabId, setActiveTabId] = useState<number>(tabSections[0]?.id || -1);

  const { lightboxState, openLightbox, closeLightbox, goToNext, goToPrev, selectImage } =
    useLightbox();

  const handleBackButton = useCallback(() => {
    closeLightbox();
  }, [closeLightbox]);

  // Регистрируем обработчик только когда лайтбокс открыт
  useBackButtonStack(handleBackButton, 100, lightboxState.isOpen);

  const activeSection = tabSections.find((s) => s.id === activeTabId);
  const images = activeSection?.images || [];

  const layout = useImageLayout(images.length);
  const imageGroups = useImageGroups(images, layout);

  if (tabSections.length === 0) return null;

  return (
    <section className="gallery">
      <div className="gallery__header">
        <Title className="gallery__title">Галерея</Title>

        {tabSections.length > 1 && (
          <GalleryTabs
            sections={tabSections}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
          />
        )}
      </div>

      {images.length > 0 ? (
        <div className="gallery__content">
          {layout === '4-scroll' ? (
            <div className="gallery__images gallery__images--4-scroll">
              {imageGroups.map((group) => (
                <GalleryImageGroup
                  group={group}
                  images={images}
                  onImageClick={openLightbox}
                />
              ))}
            </div>
          ) : (
            <div className={`gallery__images gallery__images--${layout}`}>
              {images.map((image, idx) => (
                <GalleryImage
                  image={image}
                  onClick={() => openLightbox(idx)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <GallerySkeleton layout={layout} />
      )}

      {lightboxState.isOpen && images.length > 0 && (
        <GalleryLightbox
          images={images}
          currentIndex={lightboxState.imageIndex}
          onClose={closeLightbox}
          onNext={() => goToNext(images.length)}
          onPrev={() => goToPrev(images.length)}
          onSelectImage={selectImage}
        />
      )}
    </section>
  );
};
