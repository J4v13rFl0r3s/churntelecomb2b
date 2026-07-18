'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import type { Company } from '@/lib/types';

interface CompaniesTableProps {
  companies: Company[];
  sortBy: keyof Company;
  sortOrder: 'asc' | 'desc';
  onSort: (field: keyof Company) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function CompaniesTable({
  companies,
  sortBy,
  sortOrder,
  onSort,
  currentPage,
  itemsPerPage,
  onPageChange,
}: CompaniesTableProps) {
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCompanies = companies.slice(startIndex, endIndex);

  const SortIcon = ({ field }: { field: keyof Company }) => {
    if (sortBy !== field) return <div className="w-4 h-4" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const SortHeader = ({ field, label }: { field: keyof Company; label: string }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
    >
      <span>{label}</span>
      <SortIcon field={field} />
    </button>
  );

  const getRiskColor = (score: number) => {
    if (score < 33) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    if (score < 66) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  };

  const getPredictionColor = (pred: string) => {
    return pred === 'Activo'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <SortHeader field="id" label="ID de empresa" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <SortHeader field="nombre" label="Razón social" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <SortHeader field="sector" label="Sector" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <SortHeader field="región" label="Región" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Segmento
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Ejecutivo comercial
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <SortHeader field="predicción" label="Predicción" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <SortHeader field="riskScore" label="Puntaje de riesgo" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayedCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {company.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {company.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.sector}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.región}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.segmento}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.ejecutivoComercial}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPredictionColor(
                        company.predicción
                      )}`}
                    >
                      {company.predicción}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-xs">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${company.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {company.riskScore}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {startIndex + 1} a {Math.min(endIndex, companies.length)} de{' '}
          {companies.length} empresas
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Anterior
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
