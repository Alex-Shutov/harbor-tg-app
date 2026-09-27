import React from 'react';
import './badge.scss'

interface IBadgeProps {
  icon?: React.ReactNode;
  value: number | string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Badge: React.FC<IBadgeProps> = ({
                                               icon,
                                               value,
                                               variant = 'primary',
  onClick=undefined,
                                             }) => {
  return (
    <div onClick={onClick} className={`badge badge__${variant}`}>
      <span className={`value`}>{value}</span>
      {icon && <div className={`icon`}>{icon}</div>}

    </div>
  );
};
