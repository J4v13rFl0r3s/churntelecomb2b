// Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Company Types
export interface Company {
  id: string;
  nombre: string;
  sector: string;
  región: string;
  segmento: string;
  ejecutivoComercial: string;
  riskScore: number;
  predicción: 'Activo' | 'Churn';
  estado: 'Activo' | 'Inactivo';
}

export interface CompaniesResponse {
  data: Company[];
  total: number;
}

// Prediction Types
export interface Prediction {
  id: string;
  empresa: string;
  riskScore: number;
  probabilidad: number;
  predicción: 'Activo' | 'Churn';
  fechaPredicción: string;
}

export interface PredictionsResponse {
  data: Prediction[];
  total: number;
}

// Metrics Types
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: ConfusionMatrix;
  model: ModelInfo;
}

export interface ConfusionMatrix {
  TP: number; // True Positive
  TN: number; // True Negative
  FP: number; // False Positive
  FN: number; // False Negative
}

export interface ModelInfo {
  nombre: string;
  versión: string;
  algoritmo: string;
  fechaEntrenamiento: string;
  cantidadRegistros: number;
}

// Dashboard Types
export interface DashboardKPI {
  totalEmpresas: number;
  empresasActivas: number;
  empresasConRiesgo: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface DashboardData {
  kpis: DashboardKPI;
  riskDistribution: RiskDistributionChart;
  customersByRegion: RegionChart[];
  customersBySector: SectorChart[];
  averageRiskScore: RiskScoreTimeSeriesPoint[];
}

export interface RiskDistributionChart {
  labels: string[];
  values: number[];
}

export interface RegionChart {
  región: string;
  cantidad: number;
}

export interface SectorChart {
  sector: string;
  cantidad: number;
}

export interface RiskScoreTimeSeriesPoint {
  fecha: string;
  riskScore: number;
}

// Audit Types
export interface AuditLog {
  id: string;
  usuario: string;
  acción: string;
  endpoint: string;
  método: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  ip: string;
  fecha: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}
