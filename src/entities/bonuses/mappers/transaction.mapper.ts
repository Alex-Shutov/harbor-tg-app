import { IApiTransaction, ITransaction } from '../types';

export const mapTransactionFromApi = (apiTransaction: IApiTransaction): ITransaction => {
  const date = new Date(apiTransaction.dateTime);
  const formattedDate = date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return {
    id: apiTransaction.id,
    dateTime: apiTransaction.dateTime,
    formattedDate,
    title: apiTransaction.title,
    description: apiTransaction.description,
    amount: apiTransaction.amount,
    direction: apiTransaction.direction,
    isPositive: apiTransaction.direction === 'INCREASE',
  };
};

