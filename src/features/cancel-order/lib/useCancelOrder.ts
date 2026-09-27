import { useState, useCallback } from 'react';
import { useCancelOrderMutation } from '@/entities/orders';

interface IUseCancelOrderReturn {
  cancelOrder: (orderId: number, comment: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useCancelOrder = (): IUseCancelOrderReturn => {
  const [cancelOrderMutation, { isLoading }] = useCancelOrderMutation();
  const [error, setError] = useState<string | null>(null);

  const cancelOrder = useCallback(
    async (orderId: number, comment: string) => {
      setError(null);
      try {
        await cancelOrderMutation({ orderId, comment }).unwrap();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось отменить заказ';
        setError(errorMessage);
        throw err;
      }
    },
    [cancelOrderMutation]
  );

  return {
    cancelOrder,
    isLoading,
    error,
  };
};


