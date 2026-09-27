import React from 'react';
import './title.scss';

interface ITitleProps {
  children: string;
  className?: string;
}

export const Title: React.FC<ITitleProps> = ({
                                                           children,
                                                           className = ''
                                                         }) => {
  return (
    <h1 className={`${className} title`}>
      {children}
    </h1>
  );
};
