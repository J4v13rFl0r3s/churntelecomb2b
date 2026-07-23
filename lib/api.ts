import axios, { AxiosInstance, AxiosError } from 'axios';
import * as types from './types';
import { extractDashboardRegions } from './utils';

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

    // =====================================================
    // Request Interceptor
    // =====================================================

    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');

          // No enviar Authorization al endpoint Health
          if (
            token &&
            config.headers &&
            config.url !== '/health'
          ) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // =====================================================
    // Response Interceptor
    // =====================================================

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

  // =====================================================
  // Retry Logic
  // =====================================================

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (
        retryCount < this.maxRetries &&
        this.isRetryable(error)
      ) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            this.retryDelay * Math.pow(2, retryCount)
          )
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
      (status !== undefined &&
        status >= 500 &&
        status < 600)
    );
  }

  // =====================================================
  // Authentication
  // =====================================================

  async login(
    username: string,
    password: string
  ): Promise<types.AuthResponse> {
    const formData = new URLSearchParams();

    formData.append('username', username);
    formData.append('password', password);

    return this.retryRequest(() =>
      this.client
        .post<types.AuthResponse>(
          '/auth/login',
          formData,
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded',
            },
          }
        )
        .then((res) => {
          const data = res.data;

          if (data.access_token && !data.token) {
            data.token = data.access_token;
          }

          if (!data.user) {
            data.user = {
              id: username,
              email: username,
              name: username,
            };
          }

          return data;
        })
    );
  }

  // =====================================================
  // Dashboard
  // =====================================================

  async getDashboard(): Promise<types.DashboardData> {
    return this.retryRequest(async () => {
      const response = await this.client.get<any>('/dashboard');
      const data = response.data;
      
      // Handle case where response is wrapped in { data: {...} }
      const dashboardData = data?.data ?? data;
      
      // Transform backend flat structure to frontend nested structure
      const kpis = {
        totalEmpresas: dashboardData?.total_companies ?? 0,
        empresasActivas: dashboardData?.total_companies ?? 0, // Backend doesn't provide active count
        empresasConRiesgo: dashboardData?.predicted_churn ?? 0,
        accuracy: dashboardData?.accuracy ?? 0,
        precision: dashboardData?.precision ?? 0,
        recall: dashboardData?.recall ?? 0,
        f1Score: dashboardData?.f1_score ?? 0,
      };
      
      // Build risk distribution from risk category counts
      const riskDistribution = {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        values: [
          dashboardData?.low_risk ?? 0,
          dashboardData?.medium_risk ?? 0,
          dashboardData?.high_risk ?? 0,
        ],
      };
      
      // Ensure required structure exists
      return {
        kpis,
        riskDistribution,
        customersByRegion: dashboardData?.customersByRegion ?? [],
        customersBySector: dashboardData?.customersBySector ?? [],
        averageRiskScore: dashboardData?.averageRiskScore ?? [],
      };
    });
  }

  async getDashboardRegions(): Promise<string[]> {
    return this.retryRequest(async () => {
      const response = await this.client.get<any>('/dashboard/regions');
      const payload = response.data;
      const regions = extractDashboardRegions(payload);
      return Array.isArray(regions) ? regions : [];
    });
  }

  // =====================================================
  // Companies
  // =====================================================

  async getCompanies(
    params?: any
  ): Promise<types.CompaniesResponse> {
    return this.retryRequest(async () => {
      // Use /companies/top-risk endpoint which is more reliable
      // If we need filtered results, we can add support for /companies/search later
      const response = await this.client.get<any>(
        '/companies/top-risk',
        { params }
      );
      const data = response.data;
      
      // Handle array response from /companies/top-risk
      const companiesData = Array.isArray(data) ? data : data?.data ?? [];
      
      // Transform backend field names to frontend format
      const transformedCompanies = companiesData.map((company: any) => ({
        id: company.company_id,
        nombre: company.razon_social,
        sector: company.sector,
        región: company.region,
        segmento: company.segmento,
        ejecutivoComercial: company.ejecutivo_comercial,
        predicción: company.prediction === 1 ? 'Churn' : 'Activo',
        riskScore: Math.round((company.risk_score ?? 0) * 100),
      }));
      
      return {
        data: transformedCompanies,
        total: transformedCompanies.length,
      };
    });
  }

  async getCompaniesByRegion(region: string): Promise<types.CompaniesResponse> {
    return this.retryRequest(async () => {
      const response = await this.client.get<any>(
        `/companies/region/${encodeURIComponent(region)}`
      );
      const data = response.data;
      
      // Handle case where response is wrapped in { data: {...} }
      const companiesData = data?.data ?? data;
      const companiesArray = Array.isArray(companiesData?.data) 
        ? companiesData.data 
        : Array.isArray(companiesData)
          ? companiesData
          : [];
      
      // Transform backend field names to frontend format
      const transformedCompanies = companiesArray.map((company: any) => ({
        id: company.company_id,
        nombre: company.razon_social,
        sector: company.sector,
        región: company.region,
        segmento: company.segmento,
        ejecutivoComercial: company.ejecutivo_comercial,
        predicción: company.prediction === 1 ? 'Churn' : 'Activo',
        riskScore: Math.round((company.risk_score ?? 0) * 100),
      }));
      
      return {
        data: transformedCompanies,
        total: transformedCompanies.length,
      };
    });
  }

  // =====================================================
  // Top Risk
  // =====================================================

  async getTopRisk(
    params?: any
  ): Promise<types.TopRiskResponse> {
    return this.retryRequest(async () => {
      const response = await this.client.get<any>(
        '/companies/top-risk',
        { params }
      );
      const data = response.data;
      
      // Handle case where response is wrapped in { data: {...} }
      const topRiskData = data?.data ?? data;
      
      return {
        data: Array.isArray(topRiskData?.data) 
          ? topRiskData.data 
          : Array.isArray(topRiskData)
            ? topRiskData
            : [],
      };
    });
  }

  // =====================================================
  // Predictions
  // =====================================================

  async getPredictions(
    params?: any
  ): Promise<types.PredictionsResponse> {
    return this.retryRequest(async () => {
      // Use /predictions/risk/high endpoint which is reliable and returns high-risk predictions
      const response = await this.client.get<any>(
        '/predictions/risk/high',
        { params }
      );
      const data = response.data;
      
      // Handle array response from /predictions/risk/high
      const predictionsData = Array.isArray(data) ? data : data?.data ?? [];
      
      // Transform backend field names to frontend format
      const transformedPredictions = predictionsData.map((prediction: any) => ({
        id: prediction.company_id,
        empresa: prediction.razon_social,
        riskScore: Math.round((prediction.risk_score ?? 0) * 100),
        probabilidad: prediction.risk_score ?? 0,
        predicción: prediction.prediction === 1 ? 'Churn' : 'Activo',
        fechaPredicción: new Date().toISOString().split('T')[0],
      }));
      
      return {
        data: transformedPredictions,
        total: transformedPredictions.length,
      };
    });
  }

  // =====================================================
  // Model Metrics
  // =====================================================

  async getModelMetrics(): Promise<types.ModelMetrics> {
    return this.retryRequest(async () => {
      // Fetch data from all three endpoints in parallel
      const [metricsResponse, confusionResponse, infoResponse] = await Promise.all([
        this.client.get<any>('/metrics/model').catch(() => ({ data: {} })),
        this.client.get<any>('/metrics/confusion-matrix').catch(() => ({ data: {} })),
        this.client.get<any>('/metrics/model-info').catch(() => ({ data: {} })),
      ]);

      const metrics = metricsResponse.data;
      const confusion = confusionResponse.data;
      const info = infoResponse.data;

      return {
        accuracy: (metrics?.accuracy ?? 0) * 100,
        precision: (metrics?.precision ?? 0) * 100,
        recall: (metrics?.recall ?? 0) * 100,
        f1Score: (metrics?.f1_score ?? 0) * 100,
        rocAuc: (metrics?.roc_auc ?? 0) * 100,
        confusionMatrix: {
          TP: confusion?.true_positive ?? metrics?.true_positive ?? 0,
          TN: confusion?.true_negative ?? metrics?.true_negative ?? 0,
          FP: confusion?.false_positive ?? metrics?.false_positive ?? 0,
          FN: confusion?.false_negative ?? metrics?.false_negative ?? 0,
        },
        model: {
          nombre: info?.nombre ?? 'Unknown',
          versión: info?.versión ?? info?.version ?? '0.0.0',
          algoritmo: info?.algoritmo ?? info?.algorithm ?? 'Unknown',
          fechaEntrenamiento: info?.fecha_entrenamiento ?? info?.fechaEntrenamiento ?? new Date().toISOString(),
          cantidadRegistros: info?.cantidad_registros ?? info?.cantidadRegistros ?? 0,
        },
      };
    });
  }

  // =====================================================
  // Audit Logs
  // =====================================================

  async getAuditLogs(
    params?: any
  ): Promise<types.AuditLogsResponse> {
    return this.retryRequest(async () => {
      const response = await this.client.get<any>(
        '/logs',
        { params }
      );
      const data = response.data;
      
      // Handle case where response is wrapped in { data: {...} }
      const auditData = data?.data ?? data;
      
      return {
        data: Array.isArray(auditData?.data) 
          ? auditData.data 
          : Array.isArray(auditData)
            ? auditData
            : [],
        total: auditData?.total ?? 0,
      };
    });
  }

  // =====================================================
  // Health Check
  // =====================================================

  async checkHealth(): Promise<boolean> {
    try {
      // Se usa Axios directamente para evitar el interceptor
      const response = await axios.get(
        `${API_BASE_URL}/health`,
        {
          timeout: 3000,
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Health Check Error:', error);
      return false;
    }
  }
}

export const apiClient = new ApiClient();