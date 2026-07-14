import { useState, useCallback, useEffect } from 'react';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  immediate = true
): UseApiState<T> & {
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, [apiCall]);

  // Trigger immediate fetch if enabled
  useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);

  return { ...state, refetch };
}
