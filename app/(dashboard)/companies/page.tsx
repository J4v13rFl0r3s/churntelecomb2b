'use client';

import { useState, useMemo } from 'react';
import { useCompanies, useCompaniesByRegion } from '@/hooks/useCompanies';
import { CompaniesFilters } from '@/components/Companies/CompaniesFilters';
import { CompaniesTable } from '@/components/Companies/CompaniesTable';
import { SkeletonTable } from '@/components/Common/LoadingSkeleton';
import type { Company } from '@/lib/types';
import { normalizeRegionValue } from '@/lib/utils';

export default function CompaniesPage() {
  const {
    data: companiesData,
    loading: loadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useCompanies();
  const {
    data: regionCompaniesData,
    loading: loadingByRegion,
    error: errorByRegion,
    refetch: refetchByRegion,
  } = useCompaniesByRegion(region);
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [segmento, setSegmento] = useState('');
  const [ejecutivo, setEjecutivo] = useState('');
  const [prediction, setPrediction] = useState('');
  const [sortBy, setSortBy] = useState<keyof Company>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loading = region ? loadingByRegion : loadingAll;
  const error = region ? errorByRegion : errorAll;
  const refetch = () => (region ? refetchByRegion() : refetchAll());

  const companyOptions = useMemo(() => {
    const companies = region
      ? (regionCompaniesData?.data ?? [])
      : (companiesData?.data ?? []);

    return companies.filter((company) => {
      const regionValue = (company as any).región ?? (company as any).region;
      return normalizeRegionValue(regionValue) !== null;
    });
  }, [region, companiesData?.data, regionCompaniesData?.data]);

  const regionOptions = useMemo(
    () => [
      ...new Set(
        (companiesData?.data ?? [])
          .map((company) => (company as any).región ?? (company as any).region)
          .filter((value): value is string => Boolean(value) && normalizeRegionValue(value) !== null)
      ),
    ],
    [companiesData?.data]
  );

  const sectorOptions = useMemo(
    () => [...new Set(companyOptions.map((company) => company.sector).filter(Boolean))],
    [companyOptions]
  );

  const segmentoOptions = useMemo(
    () => [...new Set(companyOptions.map((company) => company.segmento).filter(Boolean))],
    [companyOptions]
  );

  const ejecutivoOptions = useMemo(
    () => [...new Set(companyOptions.map((company) => company.ejecutivoComercial).filter(Boolean))],
    [companyOptions]
  );

  const predictionOptions = useMemo(
    () => [...new Set(companyOptions.map((company) => company.predicción).filter(Boolean))],
    [companyOptions]
  );

  const filteredAndSortedCompanies = useMemo(() => {
    if (!companyOptions.length) return [];

    let filtered = [...companyOptions];

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter((company) =>
        [
          company.id,
          company.nombre,
          company.ejecutivoComercial,
          company.sector,
          company.segmento,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      );
    }

    if (sector) {
      filtered = filtered.filter((company) => company.sector === sector);
    }

    if (segmento) {
      filtered = filtered.filter((company) => company.segmento === segmento);
    }

    if (ejecutivo) {
      filtered = filtered.filter(
        (company) => company.ejecutivoComercial === ejecutivo
      );
    }

    if (prediction) {
      filtered = filtered.filter(
        (company) => company.predicción === prediction
      );
    }

    filtered.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
      }
      if (typeof bVal === 'string') {
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [companyOptions, searchTerm, region, sector, segmento, ejecutivo, prediction, sortBy, sortOrder]);

  const handleSort = (field: keyof Company) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRegion('');
    setSector('');
    setSegmento('');
    setEjecutivo('');
    setPrediction('');
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setCurrentPage(1);
  };

  const handleSectorChange = (value: string) => {
    setSector(value);
    setCurrentPage(1);
  };

  const handleSegmentoChange = (value: string) => {
    setSegmento(value);
    setCurrentPage(1);
  };

  const handleEjecutivoChange = (value: string) => {
    setEjecutivo(value);
    setCurrentPage(1);
  };

  const handlePredictionChange = (value: string) => {
    setPrediction(value);
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
            Reintentar
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
          Gestiona y supervisa todas las empresas en el sistema.
        </p>
      </div>

      {/* Filters */}
      <CompaniesFilters
        searchTerm={searchTerm}
        region={region}
        sector={sector}
        segmento={segmento}
        ejecutivo={ejecutivo}
        prediction={prediction}
        regionOptions={regionOptions}
        sectorOptions={sectorOptions}
        segmentoOptions={segmentoOptions}
        ejecutivoOptions={ejecutivoOptions}
        predictionOptions={predictionOptions}
        onSearchChange={handleSearchChange}
        onRegionChange={handleRegionChange}
        onSectorChange={handleSectorChange}
        onSegmentoChange={handleSegmentoChange}
        onEjecutivoChange={handleEjecutivoChange}
        onPredictionChange={handlePredictionChange}
        onReset={resetFilters}
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
