import React from 'react';

interface LikeButtonProps {
  className?: string;
  iconSrc?: string;
  isLiked?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  className,
                                                 iconSrc = '/like.svg',
                                                 isLiked = false,
                                                 onClick
                                               }) => {
  const currentTypeOfIcon = iconSrc.split('.');
  const finalSrc = `${currentTypeOfIcon[0]}${isLiked ? '-true' : ''}.${currentTypeOfIcon[1]}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <div className={`like-button ${className}`} onClick={handleClick}>
      <img src={finalSrc} alt="Like" />
    </div>
  );
};

export default LikeButton;