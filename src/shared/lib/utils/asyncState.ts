import { AsyncState } from '@shared/types/common.types';

interface RtkQueryLikeResult<T> {
  data?: T;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  error?: unknown;
}

export function toAsyncState<T>(result: RtkQueryLikeResult<T>): AsyncState<T> {
  if (result.data !== undefined) {
    return { state: 'hasData', data: result.data };
  }
  if (result.isError) {
    return { state: 'hasError', error: result.error };
  }
  return { state: 'loading' };
}
