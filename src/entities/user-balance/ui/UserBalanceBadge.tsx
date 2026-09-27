import React from 'react';
import { Badge, UrbanIcon } from '@shared/ui';
import { useNavigate } from 'react-router-dom';

interface IUserBalanceBadgeProps {
  balance: number;
}

export const UserBalanceBadge: React.FC<IUserBalanceBadgeProps> = ({ balance }) => {
  const navigate = useNavigate();
  return (
    <Badge onClick={()=>navigate('/profile/bonuses')} icon={<UrbanIcon viewBox={'-4 0 28 28'} size={32} />} value={balance} />
  );
};
