import React from 'react';
import { LikeButton as LikeButtonUI } from '@shared/ui';

interface ILikeButtonProps {
  isLiked: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'small' | 'medium' | 'large' ;
  disabled?: boolean;
}


export const LikeButton: React.FC<ILikeButtonProps> = ({
                                                         isLiked,
                                                         onClick,
                                                         size,
                                                         disabled = false,
                                                       }) => {
  return (
    <LikeButtonUI
      isLiked={isLiked}
      onClick={onClick}
      size={size}
      disabled={disabled}
    />
  );
};
