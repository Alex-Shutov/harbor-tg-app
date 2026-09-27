import React from 'react';

interface IProps {
  className?: string;
  children?: React.ReactNode;
  imageUrl?: string;
  title?: string;
}

export const TopImage: React.FC<IProps> = ({
                                                         className,
    children,
    imageUrl,
    title,
                                                         }) => {
  return (
    <div className={`banner-image ${className}`}>
      <img
        src={imageUrl}
        alt={title}
        className="banner-image__img"
      />
      {children}
    </div>
  );
};


export default TopImage;