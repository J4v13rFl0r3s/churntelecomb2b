'use client';

import type { ConfusionMatrix } from '@/lib/types';
import { CONFUSION_MATRIX_COLORS } from '@/lib/constants';

interface ConfusionMatrixProps {
  matrix: ConfusionMatrix;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export function ConfusionMatrixComponent({
  matrix,
  accuracy,
  precision,
  recall,
  f1Score,
}: ConfusionMatrixProps) {
  const total = matrix.TP + matrix.TN + matrix.FP + matrix.FN;
  const accuracy_pct = ((matrix.TP + matrix.TN) / total) * 100;
  const recall_pct = (matrix.TP / (matrix.TP + matrix.FN)) * 100;
  const precision_pct = (matrix.TP / (matrix.TP + matrix.FP)) * 100;

  return (
    <div className="space-y-6">
      {/* Matrix Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Confusion Matrix
        </h3>

        {/* Matrix Table */}
        <div className="overflow-x-auto mb-8">
          <div className="inline-block">
            {/* Header Row */}
            <div className="flex mb-4">
              <div className="w-32" />
              <div className="w-40 text-center font-semibold text-gray-700 dark:text-gray-300">
                Predicted: Negative
              </div>
              <div className="w-40 text-center font-semibold text-gray-700 dark:text-gray-300">
                Predicted: Positive
              </div>
            </div>

            {/* Actual Negative Row */}
            <div className="flex mb-2">
              <div className="w-32 font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                Actual: Negative
              </div>
              {/* TN */}
              <div
                className={`w-40 h-32 flex flex-col items-center justify-center rounded-lg border-2 ${CONFUSION_MATRIX_COLORS.TN} bg-opacity-20`}
                style={{
                  backgroundColor: `${CONFUSION_MATRIX_COLORS.TN}20`,
                  borderColor: CONFUSION_MATRIX_COLORS.TN,
                }}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {matrix.TN}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  True Negative
                </div>
              </div>
              {/* FP */}
              <div
                className={`w-40 h-32 flex flex-col items-center justify-center rounded-lg border-2`}
                style={{
                  backgroundColor: `${CONFUSION_MATRIX_COLORS.FP}20`,
                  borderColor: CONFUSION_MATRIX_COLORS.FP,
                }}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {matrix.FP}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  False Positive
                </div>
              </div>
            </div>

            {/* Actual Positive Row */}
            <div className="flex">
              <div className="w-32 font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                Actual: Positive
              </div>
              {/* FN */}
              <div
                className={`w-40 h-32 flex flex-col items-center justify-center rounded-lg border-2`}
                style={{
                  backgroundColor: `${CONFUSION_MATRIX_COLORS.FN}20`,
                  borderColor: CONFUSION_MATRIX_COLORS.FN,
                }}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {matrix.FN}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  False Negative
                </div>
              </div>
              {/* TP */}
              <div
                className={`w-40 h-32 flex flex-col items-center justify-center rounded-lg border-2`}
                style={{
                  backgroundColor: `${CONFUSION_MATRIX_COLORS.TP}20`,
                  borderColor: CONFUSION_MATRIX_COLORS.TP,
                }}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {matrix.TP}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  True Positive
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Accuracy
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(accuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Precision
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(precision * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Recall
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(recall * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              F1 Score
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(f1Score * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <strong>Note:</strong> The confusion matrix shows the performance of
          the model. True Positives (TP) and True Negatives (TN) are correct
          predictions. False Positives (FP) and False Negatives (FN) are
          incorrect predictions.
        </p>
      </div>
    </div>
  );
}
