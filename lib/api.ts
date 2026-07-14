import axios, { AxiosInstance, AxiosError } from 'axios';
import * as types from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://churnbackend-production.up.railway.app';

class ApiClient {
  private client: AxiosInstance;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear auth state and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
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
    return status === 408 || status === 429 || (status! >= 500 && status! < 600);
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<types.AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    return this.retryRequest(() =>
      axios
        .post<types.AuthResponse>('/api/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          // Backend returns access_token, normalize to token
          const data = res.data;
          if (data.access_token && !data.token) {
            data.token = data.access_token;
          }
          // If no user data from backend, create a basic user object
          if (!data.user) {
            data.user = { id: username, email: username, name: username };
          }
          return data;
        })
    );
  }

  // Dashboard endpoints
  async getDashboard(): Promise<types.DashboardData> {
    return this.retryRequest(() =>
      this.client.get<types.DashboardData>('/dashboard').then((res) => res.data)
    );
  }

  // Companies endpoints
  async getCompanies(params?: any): Promise<types.CompaniesResponse> {
    return this.retryRequest(() =>
      this.client
        .get<types.CompaniesResponse>('/companies', { params })
        .then((res) => res.data)
    );
  }

  // Predictions endpoints
  async getPredictions(params?: any): Promise<types.PredictionsResponse> {
    return this.retryRequest(() =>
      this.client
        .get<types.PredictionsResponse>('/predictions', { params })
        .then((res) => res.data)
    );
  }

  // Metrics endpoints
  async getModelMetrics(): Promise<types.ModelMetrics> {
    return this.retryRequest(() =>
      this.client
        .get<types.ModelMetrics>('/metrics/model')
        .then((res) => res.data)
    );
  }

  // Audit endpoints
  async getAuditLogs(params?: any): Promise<types.AuditLogsResponse> {
    return this.retryRequest(() =>
      this.client
        .get<types.AuditLogsResponse>('/logs', { params })
        .then((res) => res.data)
    );
  }

  // Check API health
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
