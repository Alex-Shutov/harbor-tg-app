import React from 'react';
import { Title } from '@/shared/ui';
import { RafflesList } from '@/widgets/raffles';
import './raffles.scss';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';

export const Raffles: React.FC = () => {
  useAutoBackNavigation()


  return (
    <div className="raffles-page">
      <div className="raffles-page__header">
        <Title>Розыгрыши</Title>
      </div>

      <div className="raffles-page__content">
        <RafflesList />
      </div>
    </div>
  );
};


