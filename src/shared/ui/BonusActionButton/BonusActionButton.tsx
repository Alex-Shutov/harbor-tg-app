import React from 'react';
import classNames from 'classnames';
import './bonus-action-button.scss';

export interface BonusActionButtonProps {
  title: string;
  onClick: () => void;
  image: React.ReactNode;
  className?: string;
}

export const BonusActionButton: React.FC<BonusActionButtonProps> = ({
  title,
  onClick,
  image,
  className,
}) => {
  return (
    <button
      type="button"
      className={classNames('bonus-action-button', className)}
      onClick={onClick}
    >
      <span className="bonus-action-button__title">{title}</span>
      <div className="bonus-action-button__image">{
         <img src={image as string} alt="" aria-hidden />
      }</div>
    </button>
  );
};

