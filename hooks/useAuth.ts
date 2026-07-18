import { useEffect, useCallback } from 'react';
import { useAuthStore, saveAuthToStorage } from '@/lib/auth';
import { apiClient } from '@/lib/api';

export function useAuth() {
  const { user, token, isLoading, error, setLoading, setError, loadFromStorage } =
    useAuthStore();

  // Load auth from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.login(username, password);
        const token = (response as any).token || (response as any).access_token;
        if (!token) {
          throw new Error('No token returned from login');
        }
        saveAuthToStorage(token, (response as any).user ?? null);
        setLoading(false);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || err.message || 'Login failed';
        setError(errorMessage);
        setLoading(false);
        return false;
      }
    },
    [setLoading, setError]
  );

  const logout = useCallback(() => {
    useAuthStore.setState({ user: null, token: null });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    logout,
  };
}
