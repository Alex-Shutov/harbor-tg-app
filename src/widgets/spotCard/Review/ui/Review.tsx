import React from 'react';
import { useViewReview } from '../../../../features/spot-card/viewReview';
import { ReviewButton } from '../../../../features/spot-card/viewReview';
import { Image } from '@/shared/ui';
import { Title } from '@shared/ui';
import './review-section.scss';
import { IReview } from '@shared/types';

interface ReviewSectionProps {
  review: IReview;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ review }) => {

  const { handleOpenReview } = useViewReview({ videoUrl: review.videoUrl });

  if (!review) return null;

  return (
    <section className="review-section">
    <Title className="review-section__title">Обзор</Title>

      <div className="review-section__content">
    <div className="review-section__image-container">
  <Image
    src={review.img.url}
  alt={review.title}
  className="review-section__image"
    />
    </div>

  <div className="review-section__info">
  <h3 className="review-section__review-title">{review.title}</h3>
    <p className="review-section__description">{review.content}</p>

  <ReviewButton
    onClick={handleOpenReview}
  label="Смотреть"
  disabled={!review.videoUrl}
  />
  </div>
  </div>
  </section>
);
};
