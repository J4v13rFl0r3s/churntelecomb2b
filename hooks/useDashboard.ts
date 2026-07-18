import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { DashboardData } from '@/lib/types';
import { useApi } from './useApi';

export function useDashboard() {
  const apiCall = useCallback(async () => {
    return await apiClient.getDashboard();
  }, []);
  return useApi<DashboardData>(apiCall);
}

export function useDashboardRegions() {
  const apiCall = useCallback(async () => {
    return await apiClient.getDashboardRegions();
  }, []);
  return useApi<string[]>(apiCall);
}
