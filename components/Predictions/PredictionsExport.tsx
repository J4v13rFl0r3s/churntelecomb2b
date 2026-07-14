'use client';

import { Download } from 'lucide-react';
import type { Prediction } from '@/lib/types';

interface PredictionsExportProps {
  predictions: Prediction[];
}

export function PredictionsExport({ predictions }: PredictionsExportProps) {
  const handleExport = () => {
    // Create CSV content
    const headers = [
      'Empresa',
      'Risk Score',
      'Probabilidad',
      'Predicción',
      'Fecha de Predicción',
    ];
    const rows = predictions.map((p) => [
      p.empresa,
      p.riskScore.toString(),
      p.probabilidad.toString(),
      p.predicción,
      p.fechaPredicción,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === 'string' && cell.includes(',')
              ? `"${cell}"`
              : cell
          )
          .join(',')
      ),
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
    >
      <Download className="w-4 h-4" />
      <span>Export CSV</span>
    </button>
  );
}
