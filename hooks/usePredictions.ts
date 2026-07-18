import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { PredictionsResponse } from '@/lib/types';
import { useApi } from './useApi';

export function usePredictions(params?: any) {
  const apiCall = useCallback(async () => {
    return await apiClient.getPredictions(params);
  }, [params]);
  return useApi<PredictionsResponse>(apiCall);
}
