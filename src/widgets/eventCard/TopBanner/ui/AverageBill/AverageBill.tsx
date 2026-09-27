import React from 'react';
import './index.scss';
import { BillIcon } from '@shared/ui/icons/variants/bill.tsx';

interface IAverageBillProps {
  amount: number;
}

export const AverageBill: React.FC<IAverageBillProps> = ({ amount }) => {
  const formattedAmount = new Intl.NumberFormat('ru-RU').format(amount);

  return (
    <div className="average-bill">
      <div className="average-bill__icon">
       <BillIcon />
      </div>
      <div className="average-bill__content">
        <span className="average-bill__amount">{formattedAmount} ₽</span>
        <span className="average-bill__label">Средний чек</span>
      </div>
    </div>
  );
};
