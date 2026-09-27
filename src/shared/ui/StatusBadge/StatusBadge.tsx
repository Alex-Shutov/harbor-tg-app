import React from 'react';
import './status-badge.scss';

interface IStatusBadgeProps {
  value: string;
  type: 'success' | 'warning' | 'error' | 'complete';
}

export const StatusBadge: React.FC<IStatusBadgeProps> = ({
  value,
  type,
}) => {
  return (
    <div className={`status-badge status-badge--${type}`}>
      <span className="status-badge__value">{value}</span>
    </div>
  );
};


