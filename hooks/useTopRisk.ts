import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { TopRiskResponse } from '@/lib/types';
import { useApi } from './useApi';

export function useTopRisk() {
  const apiCall = useCallback(async () => {
    return await apiClient.getTopRisk();
  }, []);

  return useApi<TopRiskResponse>(apiCall);
}
