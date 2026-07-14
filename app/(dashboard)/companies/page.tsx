'use client';

import { useState, useMemo } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { CompaniesFilters } from '@/components/Companies/CompaniesFilters';
import { CompaniesTable } from '@/components/Companies/CompaniesTable';
import { SkeletonTable } from '@/components/Common/LoadingSkeleton';
import type { Company } from '@/lib/types';

export default function CompaniesPage() {
  const { data, loading, error, refetch } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedCompanies = useMemo(() => {
    if (!data?.data) return [];

    let filtered = [...data.data];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (region) {
      filtered = filtered.filter((c) => c.región === region);
    }
    if (sector) {
      filtered = filtered.filter((c) => c.sector === sector);
    }
    if (riskLevel) {
      filtered = filtered.filter((c) => {
        const score = c.riskScore;
        if (riskLevel === 'Bajo') return score < 33;
        if (riskLevel === 'Medio') return score >= 33 && score < 66;
        if (riskLevel === 'Alto') return score >= 66;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Company];
      let bVal: any = b[sortBy as keyof Company];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data?.data, searchTerm, region, sector, riskLevel, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setRegion('');
    setSector('');
    setRiskLevel('');
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Empresas
        </h1>
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-300 font-medium mb-4">
            Failed to load companies: {error}
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Empresas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and monitor all companies in the system.
        </p>
      </div>

      {/* Filters */}
      <CompaniesFilters
        searchTerm={searchTerm}
        region={region}
        sector={sector}
        riskLevel={riskLevel}
        onSearchChange={setSearchTerm}
        onRegionChange={setRegion}
        onSectorChange={setSector}
        onRiskLevelChange={setRiskLevel}
        onReset={handleReset}
      />

      {/* Table */}
      {loading ? (
        <SkeletonTable />
      ) : filteredAndSortedCompanies.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No companies found matching your filters.
          </p>
        </div>
      ) : (
        <CompaniesTable
          companies={filteredAndSortedCompanies}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
