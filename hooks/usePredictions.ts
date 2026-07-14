import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { PredictionsResponse } from '@/lib/types';
import { useApi } from './useApi';
import { demoPredictionsData } from '@/lib/demo-data';

export function usePredictions(params?: any) {
  const apiCall = useCallback(async () => {
    try {
      return await apiClient.getPredictions(params);
    } catch (err) {
      return demoPredictionsData;
    }
  }, [params]);
  return useApi<PredictionsResponse>(apiCall);
}
