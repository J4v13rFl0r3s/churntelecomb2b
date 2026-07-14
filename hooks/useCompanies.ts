import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { CompaniesResponse } from '@/lib/types';
import { useApi } from './useApi';
import { demoCompaniesData } from '@/lib/demo-data';

export function useCompanies(params?: any) {
  const apiCall = useCallback(async () => {
    try {
      return await apiClient.getCompanies(params);
    } catch (err) {
      return demoCompaniesData;
    }
  }, [params]);
  return useApi<CompaniesResponse>(apiCall);
}
