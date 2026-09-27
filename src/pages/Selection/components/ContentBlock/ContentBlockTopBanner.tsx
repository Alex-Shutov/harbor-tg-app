import React from 'react';
import { BannerImage, LikeButton, ShareButton } from '@shared/ui';
import { useLike } from '@/features/spot-card/manageLike';
import { useShare } from '@/features/spot-card/shareEstablishment';
import { EPageType } from '@shared/constants';
import { useBackButtonStack } from '@hooks/useBackButtonStack.ts';
import { useNavigate } from 'react-router-dom';
import { ContentObject } from '../../selection.types';
import { CategoriesInfo } from './CategoriesInfo';

interface IContentBlockTopBannerProps {
  contentBlock: ContentObject;
  pageType: EPageType;
}

export const ContentBlockTopBanner: React.FC<IContentBlockTopBannerProps> = ({
  contentBlock,
  pageType,
}) => {
  const navigate = useNavigate();
  useBackButtonStack(() => {
    navigate(-1);
  });

  const { isLiked, handleLikeClick } = useLike({
    id: contentBlock.id,
    objectType: pageType,
    initialLiked: contentBlock.inFavorites,
  });

  const { handleShare } = useShare({
    title: contentBlock.title,
    text: 'Посмотри, что я нашел!',
    pageType: pageType,
    entityId: contentBlock.id,
  });
  if (!contentBlock) return null;

  return (
    <BannerImage
      image={contentBlock.mainImg}
      title={contentBlock.title}
      subtitle={<CategoriesInfo contentBlock={contentBlock} />}
    >
      <ShareButton onClick={handleShare} size={'small'} />
      <LikeButton isLiked={isLiked} onClick={handleLikeClick} size="small" />
    </BannerImage>
  );
};

