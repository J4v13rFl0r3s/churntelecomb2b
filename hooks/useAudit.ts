import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { AuditLogsResponse } from '@/lib/types';
import { useApi } from './useApi';
import { demoAuditData } from '@/lib/demo-data';

export function useAudit(params?: any) {
  const apiCall = useCallback(async () => {
    try {
      return await apiClient.getAuditLogs(params);
    } catch (err) {
      return demoAuditData;
    }
  }, [params]);
  return useApi<AuditLogsResponse>(apiCall);
}
