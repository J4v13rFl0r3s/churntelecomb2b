import type { TopRiskCompany } from '@/lib/types';
import { SkeletonTable } from '@/components/Common/LoadingSkeleton';

interface TopRiskProps {
  data: TopRiskCompany[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const getRiskScoreColor = (score: number) => {
  if (score < 0.3) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
  }
  if (score < 0.8) {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
  }
  return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
};

const normalizePrediction = (company: TopRiskCompany) => {
  return company['predicción'] ?? company.prediction ?? 'N/A';
};

export function TopRisk({ data, loading, error, refetch }: TopRiskProps) {
  const sortedTopRisk = data ? [...data].sort((a, b) => b.riskScore - a.riskScore) : [];
  const topCompanies = sortedTopRisk.slice(0, 20);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top 20 Empresas con Mayor Riesgo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Las empresas con mayor risk score ordenadas de mayor a menor.
          </p>
        </div>
        {error ? (
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reintentar
          </button>
        ) : null}
      </div>

      {loading ? (
        <SkeletonTable />
      ) : error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
          <p className="font-medium">No se pudo cargar el Top Risk.</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : topCompanies.length === 0 ? (
        <div className="p-6 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
          No hay empresas disponibles para Top Risk.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Sector
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Región
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Prediction
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {company.empresa ?? company.nombre ?? 'N/A'}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskScoreColor(
                        company.riskScore
                      )}`}
                    >
                      {company.riskScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.sector}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.región}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {normalizePrediction(company)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
