import React, { useState } from 'react';
import { Title, TransactionItem } from '@shared/ui';
import { useGetTransactionsQuery } from '@/entities/bonuses';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './bonuses-history-widget.scss';

const INITIAL_DISPLAY_COUNT = 6;

export const BonusesHistoryWidget: React.FC = () => {
  const { data: transactions, isLoading } = useGetTransactionsQuery();
  const [showAll, setShowAll] = useState(false);

  const displayedTransactions = showAll
    ? transactions || []
    : (transactions || []).slice(0, INITIAL_DISPLAY_COUNT);

  const hasMore = (transactions || []).length > INITIAL_DISPLAY_COUNT;

  if (isLoading) {
    return (
      <div className="bonuses-history-widget">
        <div className="bonuses-history-widget__header">
          <Title>История</Title>
        </div>
        <div className="bonuses-history-widget__skeleton">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height="80px" width="100%" style={{ marginBottom: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bonuses-history-widget">
        <div className="bonuses-history-widget__header">
          <Title>История</Title>
        </div>
        <div className="bonuses-history-widget__empty">
          <p>История транзакций пуста</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bonuses-history-widget">
      <div className="bonuses-history-widget__header">
        <Title>История</Title>
        {hasMore && (
          <button
            type="button"
            className="bonuses-history-widget__show-all"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Скрыть' : 'Все'}
          </button>
        )}
      </div>
      <div className="bonuses-history-widget__list">
        {displayedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            title={transaction.title}
            description={transaction.description}
            date={transaction.formattedDate}
            amount={transaction.amount}
            isPositive={transaction.isPositive}
          />
        ))}
      </div>
    </div>
  );
};

