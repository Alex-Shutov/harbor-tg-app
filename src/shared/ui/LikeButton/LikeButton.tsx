import React from 'react';
import './like.button.scss';
import { LikeIcon } from '@shared/ui/icons';

interface ILikeButtonProps {
  isLiked: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const LikeButton: React.FC<ILikeButtonProps> = ({
                                                         isLiked,
                                                         onClick,
                                                         size = 'medium',
                                                         disabled = false,
                                                       }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onClick(e);
    }
  };

  return (
    <button
      className={`like-button like-button--${size} ${isLiked ? 'like-button--liked' : ''} ${disabled ? 'like-button--disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      <LikeIcon isLiked={isLiked} />
    </button>
  );
};
