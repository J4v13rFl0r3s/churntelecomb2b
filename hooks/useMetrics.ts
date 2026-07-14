import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { ModelMetrics } from '@/lib/types';
import { useApi } from './useApi';

export function useMetrics() {
  const apiCall = useCallback(() => apiClient.getModelMetrics(), []);
  return useApi<ModelMetrics>(apiCall);
}
