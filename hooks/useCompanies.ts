import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { CompaniesResponse } from '@/lib/types';
import { useApi } from './useApi';

export function useCompanies(params?: any) {
  const apiCall = useCallback(() => apiClient.getCompanies(params), [params]);
  return useApi<CompaniesResponse>(apiCall);
}
