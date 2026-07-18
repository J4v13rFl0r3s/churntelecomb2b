import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { AuditLogsResponse } from '@/lib/types';
import { useApi } from './useApi';

export function useAudit(params?: any) {
  const apiCall = useCallback(async () => {
    return await apiClient.getAuditLogs(params);
  }, [params]);
  return useApi<AuditLogsResponse>(apiCall);
}
