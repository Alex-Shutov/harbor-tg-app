import React from 'react';
import './subtitle.scss';

interface ISubtitleProps {
  children: string;
  className?: string;
}

export const Subtitle: React.FC<ISubtitleProps> = ({
                                                                 children,
                                                                 className = ''
                                                               }) => {
  return (
    <p className={`subtitle ${className}`}>
      {children}
    </p>
  );
};
