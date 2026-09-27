import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './urban-balance.scss';
import { useGetUserBalanceQuery } from '@/entities/user-balance/api';
import { UserBalanceBadge } from '@/entities/user-balance/ui';

export const UrbanBonusBalanceWidget: React.FC = () => {
  const { data, isLoading, error } = useGetUserBalanceQuery();

  if (isLoading || error) {
    return (
      <Skeleton
        height="44px"
        width="200px"
        className="urban-bonus-balance-skeleton"
      />
    );
  }

  if (!data) {
    return (
      <Skeleton
        height="44px"
        width="200px"
        className="urban-bonus-balance-skeleton"
      />
    );
  }

  return <UserBalanceBadge balance={data.urbanBonusBalance} />;
};
