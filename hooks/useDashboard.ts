import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { DashboardData } from '@/lib/types';
import { useApi } from './useApi';
import { demoDashboardData } from '@/lib/demo-data';

export function useDashboard() {
  const apiCall = useCallback(async () => {
    try {
      return await apiClient.getDashboard();
    } catch (err) {
      // Fallback to demo data if API fails
      return demoDashboardData;
    }
  }, []);
  return useApi<DashboardData>(apiCall);
}
