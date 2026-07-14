'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { KPICard } from '@/components/Dashboard/KPICard';
import { SkeletonCard, SkeletonTable } from '@/components/Common/LoadingSkeleton';
import {
  BarChart3,
  Building2,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Award,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CHART_COLORS } from '@/lib/constants';

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-300 font-medium mb-4">
            Failed to load dashboard data: {error}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here&apos;s an overview of your churn predictions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </>
        ) : data ? (
          <>
            <KPICard
              title="Total Empresas"
              value={data.kpis.totalEmpresas}
              icon={Building2}
              color="blue"
            />
            <KPICard
              title="Empresas Activas"
              value={data.kpis.empresasActivas}
              icon={CheckCircle}
              color="green"
            />
            <KPICard
              title="Empresas con Riesgo"
              value={data.kpis.empresasConRiesgo}
              icon={TrendingDown}
              color="red"
            />
            <KPICard
              title="Accuracy"
              value={`${(data.kpis.accuracy * 100).toFixed(1)}%`}
              icon={Target}
              progress={data.kpis.accuracy * 100}
              color="blue"
            />
            <KPICard
              title="Precision"
              value={`${(data.kpis.precision * 100).toFixed(1)}%`}
              icon={Zap}
              progress={data.kpis.precision * 100}
              color="green"
            />
            <KPICard
              title="Recall"
              value={`${(data.kpis.recall * 100).toFixed(1)}%`}
              icon={Activity}
              progress={data.kpis.recall * 100}
              color="orange"
            />
            <KPICard
              title="F1 Score"
              value={`${(data.kpis.f1Score * 100).toFixed(1)}%`}
              icon={Award}
              progress={data.kpis.f1Score * 100}
              color="blue"
            />
            <KPICard
              title="Model Status"
              value="Active"
              icon={CheckCircle}
              description="All systems operational"
              color="green"
            />
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        )}
      </div>

      {/* Charts */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribución de Riesgo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.riskDistribution.labels.map((label, i) => ({
                    name: label,
                    value: data.riskDistribution.values[i],
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {CHART_COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Customers by Region */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clientes por Región
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.customersByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="región" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#0066cc" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customers by Sector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clientes por Sector
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.customersBySector}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#1e7145" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Average Risk Score */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Risk Score Promedio
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.averageRiskScore}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#f59e0b"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
