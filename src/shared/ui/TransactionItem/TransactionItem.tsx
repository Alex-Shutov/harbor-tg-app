import React from 'react';
import { UrbanOrangeIcon } from '@shared/ui';
import classNames from 'classnames';
import './transaction-item.scss';

export interface TransactionItemProps {
  title: string;
  description: string;
  date: string;
  amount: number;
  isPositive: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  date,
  amount,
  isPositive,
}) => {
  return (
    <div className="transaction-item">
      <div className="transaction-item__content">
        <div className="transaction-item__title">{title}</div>
        <div className="transaction-item__date">{date}</div>
      </div>
      <div
        className={classNames('transaction-item__amount', {
          'transaction-item__amount--positive': isPositive,
          'transaction-item__amount--negative': !isPositive,
        })}
      >
        {isPositive ? '+' : '-'}
        {amount}
        <UrbanOrangeIcon size={20} viewBox={'0 0 16 18'} />
      </div>
    </div>
  );
};

