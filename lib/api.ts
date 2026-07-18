import axios, { AxiosInstance, AxiosError } from 'axios';
import * as types from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

class ApiClient {
  private client: AxiosInstance;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    if (!API_BASE_URL) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
    }

    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status;
        if (status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async retryRequest<T>(requestFn: () => Promise<T>, retryCount = 0): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retryCount < this.maxRetries && this.isRetryable(error)) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * Math.pow(2, retryCount))
        );
        return this.retryRequest(requestFn, retryCount + 1);
      }
      throw error;
    }
  }

  private isRetryable(error: any): boolean {
    if (!axios.isAxiosError(error)) return false;
    const status = error.response?.status;
    return (
      status === 408 ||
      status === 429 ||
      (status !== undefined && status >= 500 && status < 600)
    );
  }

  async login(username: string, password: string): Promise<types.AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return this.retryRequest(() =>
      this.client
        .post<types.AuthResponse>('/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          const data = res.data;
          if (data.access_token && !data.token) {
            data.token = data.access_token;
          }
          if (!data.user) {
            data.user = { id: username, email: username, name: username };
          }
          return data;
        })
    );
  }

  async getDashboard(): Promise<types.DashboardData> {
    return this.retryRequest(() =>
      this.client.get<types.DashboardData>('/dashboard').then((res) => res.data)
    );
  }

  async getCompanies(params?: any): Promise<types.CompaniesResponse> {
    return this.retryRequest(() =>
      this.client.get<types.CompaniesResponse>('/companies', { params }).then((res) => res.data)
    );
  }

  async getTopRisk(params?: any): Promise<types.TopRiskResponse> {
    return this.retryRequest(() =>
      this.client.get<types.TopRiskResponse>('/companies/top-risk', { params }).then((res) => res.data)
    );
  }

  async getPredictions(params?: any): Promise<types.PredictionsResponse> {
    return this.retryRequest(() =>
      this.client
        .get<types.PredictionsResponse>('/predictions', { params })
        .then((res) => res.data)
    );
  }

  async getAuditLogs(params?: any): Promise<types.AuditLogsResponse> {
    return this.retryRequest(() =>
      this.client.get<types.AuditLogsResponse>('/logs', { params }).then((res) => res.data)
    );
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.client.get('/health', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
