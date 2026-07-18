import { create } from 'zustand';
import type { User } from './types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null });
  },
  loadFromStorage: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token) {
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ token, user });
        } catch (e) {
          localStorage.removeItem('auth_user');
          set({ token, user: null });
        }
      } else {
        set({ token, user: null });
      }
    }
  },
}));

export const saveAuthToStorage = (token: string, user?: User | null) => {
  localStorage.setItem('auth_token', token);
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth_user');
  }
  useAuthStore.setState({ token, user: user ?? null });
};

export const clearAuthFromStorage = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  useAuthStore.setState({ token: null, user: null });
};
