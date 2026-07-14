import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { ModelMetrics } from '@/lib/types';
import { useApi } from './useApi';
import { demoMetricsData } from '@/lib/demo-data';

export function useMetrics() {
  const apiCall = useCallback(async () => {
    try {
      return await apiClient.getModelMetrics();
    } catch (err) {
      return demoMetricsData;
    }
  }, []);
  return useApi<ModelMetrics>(apiCall);
}
