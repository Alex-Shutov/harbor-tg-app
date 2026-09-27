import React from 'react';
import { Title } from '@shared/ui';
import { BonusesBadge } from '@/entities/bonuses';
import {
  BonusesActionsWidget,
  BonusesHistoryWidget,
  BonusesFAQWidget,
} from '@/widgets/bonuses';
import { useAutoBackNavigation } from '@/hooks/useAutoBackNavigation';
import './bonuses-page.scss';

export const BonusesPage: React.FC = () => {
  useAutoBackNavigation();

  return (
    <div className="bonuses-page">
      <div className="bonuses-page__header">
        <Title>Мои бонусы</Title>
      </div>

      <div className="bonuses-page__balance">
        <BonusesBadge />
      </div>

      <div className="bonuses-page__actions">
        <BonusesActionsWidget />
      </div>

      <div className="bonuses-page__history">
        <BonusesHistoryWidget />
      </div>

      <div className="bonuses-page__faq">
        <BonusesFAQWidget />
      </div>
    </div>
  );
};

