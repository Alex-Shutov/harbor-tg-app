import React from 'react';
import { BannerImage, LikeButton, ShareButton } from '@shared/ui';
import { useLike } from '@/features/spot-card/manageLike';
import { useShare } from '@/features/spot-card/shareEstablishment';
import { EPageType } from '@shared/constants';
import { IBaseDetails } from '@/entities/lib';
import { useBackButtonStack } from '@hooks/useBackButtonStack.ts';
import { useNavigate } from 'react-router-dom';


interface ITopBannerConfig<T extends IBaseDetails> {
  type: EPageType;
  renderInfoComponent?: (data: T) => React.ReactNode;
  renderOpeningStatus?: (data: T) => React.ReactNode;
}

export function withTopBanner<T extends IBaseDetails>(
  config: ITopBannerConfig<T>
) {

  return function TopBannerWrapper({ data }: { data: T }) {
    const navigate = useNavigate();
    useBackButtonStack(()=>{
        navigate(-1)
    })
    const { isLiked, handleLikeClick } = useLike({
      id: data.id,
      objectType: config.type,
      initialLiked: data.inFavorites,
    });

    const { handleShare } = useShare({
      title: data.title,
      text: 'Посмотри, что я нашел!',
      pageType: config.type,
      entityId: data.id,
    });

    if (!data) return null;

    return (
      <BannerImage
        image={data.mainImg}
        title={data.title}
        subtitle={data.mapLocation?.pointTitle ?? data.mapPoint?.addressTitle}
        infoComponent={config.renderInfoComponent?.(data)}
        openingStatus={config.renderOpeningStatus?.(data)}
      >
        <ShareButton onClick={handleShare} size={'small'} />
        <LikeButton isLiked={isLiked} onClick={handleLikeClick} size="small" />
      </BannerImage>
    );
  };
}
