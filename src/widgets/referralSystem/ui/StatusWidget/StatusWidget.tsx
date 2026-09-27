import React from 'react';
import { StatusBadge } from '@shared/ui';
import { ReferralStatus } from '@/entities/referral/types/referral.types';
import './status-widget.scss';

interface IStatusWidgetProps {
  status: ReferralStatus;
}

const getStatusConfig = (status: ReferralStatus): { label: string; type: 'success' | 'warning' | 'error' } => {
  switch (status) {
    case 'ACCRUED':
      return { label: 'Начислено', type: 'success' };
    case 'UNDER_REVIEW':
      return { label: 'На проверке', type: 'warning' };
    case 'REJECTED':
      return { label: 'Отклонено', type: 'error' };
    default:
      return { label: status, type: 'warning' };
  }
};

export const StatusWidget: React.FC<IStatusWidgetProps> = ({ status }) => {
  const config = getStatusConfig(status);

  return (
    <StatusBadge value={config.label} type={config.type} />
  );
};


