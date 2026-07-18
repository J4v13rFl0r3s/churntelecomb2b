'use client';

import { useDashboard, useDashboardRegions } from '@/hooks/useDashboard';
import { useTopRisk } from '@/hooks/useTopRisk';
import { KPICard } from '@/components/Dashboard/KPICard';
import { TopRisk } from '@/components/Dashboard/TopRisk';
import { SkeletonCard } from '@/components/Common/LoadingSkeleton';
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
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { CHART_COLORS } from '@/lib/constants';
import { normalizeRegionValue } from '@/lib/utils';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
);

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();
  const {
    data: regionsData,
    loading: regionsLoading,
    error: regionsError,
    refetch: refetchRegions,
  } = useDashboardRegions();
  const {
    data: topRiskData,
    loading: topRiskLoading,
    error: topRiskError,
    refetch: refetchTopRisk,
  } = useTopRisk();

  const riskDistributionData = {
    labels: data?.riskDistribution.labels ?? [],
    datasets: [
      {
        data: data?.riskDistribution.values ?? [],
        backgroundColor: CHART_COLORS,
        borderWidth: 1,
      },
    ],
  };

  const dashboardRegions = regionsData ?? [];
  const customersByRegionData = {
    labels: dashboardRegions.length > 0 ? dashboardRegions : ['Perú'],
    datasets: [
      {
        label: 'Clientes',
        data:
          dashboardRegions.length > 0
            ? Array(dashboardRegions.length).fill(0)
            : [0],
        backgroundColor: '#0066cc',
        borderRadius: 8,
      },
    ],
  };

  const customersBySectorData = {
    labels: data?.customersBySector.map((item) => item.sector ?? 'N/A') ?? [],
    datasets: [
      {
        label: 'Clientes',
        data: data?.customersBySector.map((item) => item.cantidad ?? 0) ?? [],
        backgroundColor: '#1e7145',
        borderRadius: 8,
      },
    ],
  };

  const averageRiskScoreData = {
    labels: data?.averageRiskScore.map((item) => item.fecha) ?? [],
    datasets: [
      {
        label: 'Risk Score',
        data: data?.averageRiskScore.map((item) => item.riskScore) ?? [],
        fill: true,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

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
            <div className="h-72">
              <Doughnut
                data={riskDistributionData}
                options={{
                  ...defaultChartOptions,
                  plugins: {
                    ...defaultChartOptions.plugins,
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        color: '#6b7280',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Customers by Region */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clientes por Región
            </h3>
            <div className="h-72">
              {regionsLoading ? (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Cargando regiones...
                </div>
              ) : regionsError ? (
                <div className="flex h-full items-center justify-center text-red-500">
                  No se pudieron cargar las regiones.
                </div>
              ) : (
                <Bar data={customersByRegionData} options={defaultChartOptions} />
              )}
            </div>
          </div>

          {/* Customers by Sector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clientes por Sector
            </h3>
            <div className="h-72">
              <Bar data={customersBySectorData} options={defaultChartOptions} />
            </div>
          </div>

          {/* Average Risk Score */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Risk Score Promedio
            </h3>
            <div className="h-72">
              <Line data={averageRiskScoreData} options={defaultChartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Top Risk Companies */}
      <div>
        <TopRisk
          data={topRiskData?.data ?? null}
          loading={topRiskLoading}
          error={topRiskError}
          refetch={refetchTopRisk}
        />
      </div>
    </div>
  );
}
