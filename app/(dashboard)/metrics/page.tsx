'use client';

import { useMetrics } from '@/hooks/useMetrics';
import { KPICard } from '@/components/Dashboard/KPICard';
import { ConfusionMatrixComponent } from '@/components/Metrics/ConfusionMatrix';
import { SkeletonCard, SkeletonTable } from '@/components/Common/LoadingSkeleton';
import { Target, Zap, Activity, Award } from 'lucide-react';

export default function MetricsPage() {
  const { data, loading, error, refetch } = useMetrics();

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Model Performance
        </h1>
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-300 font-medium mb-4">
            Failed to load metrics: {error}
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
          Model Performance
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Detailed analysis of the churn prediction model performance.
        </p>
      </div>

      {/* Metrics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Accuracy"
              value={`${(data.accuracy * 100).toFixed(1)}%`}
              icon={Target}
              progress={data.accuracy * 100}
              color="blue"
              description="Overall correctness of predictions"
            />
            <KPICard
              title="Precision"
              value={`${(data.precision * 100).toFixed(1)}%`}
              icon={Zap}
              progress={data.precision * 100}
              color="green"
              description="Accuracy of positive predictions"
            />
            <KPICard
              title="Recall"
              value={`${(data.recall * 100).toFixed(1)}%`}
              icon={Activity}
              progress={data.recall * 100}
              color="orange"
              description="Coverage of actual positives"
            />
            <KPICard
              title="F1 Score"
              value={`${(data.f1Score * 100).toFixed(1)}%`}
              icon={Award}
              progress={data.f1Score * 100}
              color="blue"
              description="Harmonic mean of precision & recall"
            />
          </div>

          {/* Confusion Matrix */}
          <ConfusionMatrixComponent
            matrix={data.confusionMatrix}
            accuracy={data.accuracy}
            precision={data.precision}
            recall={data.recall}
            f1Score={data.f1Score}
          />

          {/* Model Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Model Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Model Name
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.model.nombre}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Version
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.model.versión}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Algorithm
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.model.algoritmo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Training Date
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(data.model.fechaEntrenamiento).toLocaleDateString()}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Training Records
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.model.cantidadRegistros.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      )}
    </div>
  );
}
