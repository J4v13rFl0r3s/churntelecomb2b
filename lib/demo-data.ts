import type * as types from './types';

export const demoDashboardData: types.DashboardData = {
  kpis: {
    totalEmpresas: 1250,
    empresasActivas: 980,
    empresasConRiesgo: 156,
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.88,
    f1Score: 0.885,
  },
  riskDistribution: {
    labels: ['Bajo', 'Medio', 'Alto', 'Crítico'],
    values: [450, 350, 300, 150],
  },
  customersByRegion: [
    { región: 'América del Norte', cantidad: 420 },
    { región: 'Europa', cantidad: 380 },
    { región: 'Asia', cantidad: 350 },
    { región: 'Latinoamérica', cantidad: 100 },
  ],
  customersBySector: [
    { sector: 'Tecnología', cantidad: 380 },
    { sector: 'Finanzas', cantidad: 320 },
    { sector: 'Retail', cantidad: 280 },
    { sector: 'Telecomunicaciones', cantidad: 270 },
  ],
  averageRiskScore: [
    { fecha: 'Ene', riskScore: 35 },
    { fecha: 'Feb', riskScore: 38 },
    { fecha: 'Mar', riskScore: 32 },
    { fecha: 'Abr', riskScore: 41 },
    { fecha: 'May', riskScore: 39 },
    { fecha: 'Jun', riskScore: 36 },
  ],
};

export const demoCompaniesData: types.CompaniesResponse = {
  data: [
    {
      id: '1',
      nombre: 'TechCorp International',
      region: 'América del Norte',
      sector: 'Tecnología',
      riskScore: 78,
      estado: 'Activo',
      clientes: 45,
    },
    {
      id: '2',
      nombre: 'Global Finance Solutions',
      region: 'Europa',
      sector: 'Finanzas',
      riskScore: 45,
      estado: 'Activo',
      clientes: 32,
    },
    {
      id: '3',
      nombre: 'Retail Masters Inc',
      region: 'Asia',
      sector: 'Retail',
      riskScore: 92,
      estado: 'Riesgo Alto',
      clientes: 28,
    },
    {
      id: '4',
      nombre: 'Telecom Solutions Ltd',
      region: 'América del Norte',
      sector: 'Telecomunicaciones',
      riskScore: 35,
      estado: 'Activo',
      clientes: 56,
    },
    {
      id: '5',
      nombre: 'Innovation Labs Europe',
      region: 'Europa',
      sector: 'Tecnología',
      riskScore: 62,
      estado: 'Riesgo Medio',
      clientes: 22,
    },
  ],
  total: 5,
};

export const demoPredictionsData: types.PredictionsResponse = {
  data: [
    {
      id: '1',
      empresa: 'TechCorp International',
      riskScore: 78,
      probabilidad: 0.78,
      predicción: 'Churn',
      fechaPredicción: '2025-07-13',
    },
    {
      id: '2',
      empresa: 'Global Finance Solutions',
      riskScore: 45,
      probabilidad: 0.45,
      predicción: 'Activo',
      fechaPredicción: '2025-07-13',
    },
    {
      id: '3',
      empresa: 'Retail Masters Inc',
      riskScore: 92,
      probabilidad: 0.92,
      predicción: 'Churn',
      fechaPredicción: '2025-07-13',
    },
  ],
  total: 3,
};

export const demoMetricsData: types.ModelMetrics = {
  accuracy: 0.92,
  precision: 0.89,
  recall: 0.88,
  f1Score: 0.885,
  confusionMatrix: {
    TP: 850,
    TN: 1200,
    FP: 120,
    FN: 150,
  },
  model: {
    nombre: 'Churn Prediction Model v2.1',
    versión: '2.1.0',
    algoritmo: 'Random Forest',
    fechaEntrenamiento: '2025-07-01',
    cantidadRegistros: 2320,
  },
};

export const demoAuditData: types.AuditLogsResponse = {
  data: [
    {
      id: '1',
      usuario: 'admin',
      acción: 'LOGIN',
      endpoint: '/auth/login',
      método: 'POST',
      ip: '192.168.1.100',
      fecha: '2025-07-13T15:45:23',
    },
    {
      id: '2',
      usuario: 'admin',
      acción: 'EXPORT',
      endpoint: '/api/predictions/export',
      método: 'GET',
      ip: '192.168.1.100',
      fecha: '2025-07-13T14:30:15',
    },
    {
      id: '3',
      usuario: 'admin',
      acción: 'VIEW',
      endpoint: '/api/companies/1',
      método: 'GET',
      ip: '192.168.1.100',
      fecha: '2025-07-13T13:15:45',
    },
  ],
  total: 3,
};
