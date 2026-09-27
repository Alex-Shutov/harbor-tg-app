import React from 'react';
import './banner.scss';
import { Subtitle, Title, TopImage } from '@shared/ui';

export interface IBannerImageEntity {
  id: number;
  url: string;
}

export interface IBannerImageProps {
  image: IBannerImageEntity;
  title: string;
  subtitle: string | React.ReactNode;
  infoComponent?: React.ReactNode;
  openingStatus?: React.ReactNode;
  children?: React.ReactNode;
}


export const BannerImage: React.FC<IBannerImageProps> = ({
                                                           image,
                                                           title,
                                                           subtitle,
                                                           infoComponent,
                                                           openingStatus,
                                                           children,
                                                         }) => {
  return (
    <div className="banner-image">
    <TopImage imageUrl={image.url} title={title} />

      <div className="banner-image__overlay">
        <div className="banner-image__content">
          <Title className="banner-image__title">{title}</Title>
          {typeof subtitle === 'string' ? (
            <Subtitle className="banner-image__subtitle">{subtitle}</Subtitle>
          ) : (
            <div className="banner-image__subtitle">{subtitle}</div>
          )}

          {(infoComponent || openingStatus) && (
            <div className="banner-image__info-bar">
              {infoComponent}
              {infoComponent && openingStatus && (
                <div className="banner-image__divider" />
              )}
              {openingStatus}
            </div>
          )}
        </div>

        <div className="banner-image__actions">
          {children}
        </div>
      </div>
    </div>
  );
};
