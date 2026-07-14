import { useState, useCallback } from 'react';

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
  const [initialized, setInitialized] = useState(false);
  if (immediate && !initialized) {
    setInitialized(true);
    // Use a timeout to avoid state update warnings in React 18
    setTimeout(() => refetch(), 0);
  }

  return { ...state, refetch };
}
