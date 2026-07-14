'use client';

import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  progress?: number;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  progress,
  color = 'blue',
}: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  const progressClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {description}
            </p>
          )}
        </div>

        {/* Icon */}
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                progressClasses[color]
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
