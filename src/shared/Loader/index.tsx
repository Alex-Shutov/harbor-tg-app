import React, { HTMLAttributes } from 'react';
import './Loader.scss';

const Loader: React.FC<HTMLAttributes<HTMLDivElement>> = ({...props}) => {
  return (
    <div className={`loader`} {...props}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
