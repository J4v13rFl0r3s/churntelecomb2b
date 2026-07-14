// Color Palette
export const COLORS = {
  primary: '#0066cc',
  primaryDark: '#001a4d',
  success: '#1e7145',
  warning: '#f59e0b',
  danger: '#dc2626',
  lightGreen: '#86efac',
  background: '#ffffff',
  backgroundDark: '#0f172a',
  text: '#1e293b',
  textDark: '#f1f5f9',
  border: '#e2e8f0',
  borderDark: '#334155',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
};

// Chart Colors
export const CHART_COLORS = [
  '#0066cc', // Primary blue
  '#0052a3', // Darker blue
  '#003d7a', // Even darker blue
  '#002951', // Very dark blue
  '#001428', // Almost black blue
  '#1e7145', // Green
  '#f59e0b', // Orange
  '#dc2626', // Red
];

// Risk Score Thresholds
export const RISK_THRESHOLDS = {
  low: { min: 0, max: 33, label: 'Bajo', color: '#1e7145' },
  medium: { min: 33, max: 66, label: 'Medio', color: '#f59e0b' },
  high: { min: 66, max: 100, label: 'Alto', color: '#dc2626' },
};

// Confusion Matrix Colors
export const CONFUSION_MATRIX_COLORS = {
  TP: '#1e7145', // True Positive - Dark Green
  TN: '#86efac', // True Negative - Light Green
  FP: '#dc2626', // False Positive - Red
  FN: '#f59e0b', // False Negative - Orange
};

// Navigation Items
export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Empresas', href: '/companies', icon: 'Building2' },
  { label: 'Predicciones', href: '/predictions', icon: 'TrendingDown' },
  { label: 'Model Performance', href: '/metrics', icon: 'BarChart3' },
  { label: 'Auditoría', href: '/audit', icon: 'FileText' },
  { label: 'Configuración', href: '/settings', icon: 'Settings' },
];

// Pagination
export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];
export const DEFAULT_ITEMS_PER_PAGE = 10;
