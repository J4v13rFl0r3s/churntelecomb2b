'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>(
    'checking'
  );

  useEffect(() => {
    const checkStatus = async () => {
      const isHealthy = await apiClient.checkHealth();
      setApiStatus(isHealthy ? 'online' : 'offline');
    };
    checkStatus();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'NEXT_PUBLIC_API_BASE_URL no configurada';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          System settings and backend information.
        </p>
      </div>

      {/* Backend Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Backend Information
        </h2>

        <div className="space-y-6">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API URL
            </label>
            <input
              type="text"
              value={API_URL}
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              {apiStatus === 'checking' && (
                <>
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Checking...</span>
                </>
              )}
              {apiStatus === 'online' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Online
                  </span>
                </>
              )}
              {apiStatus === 'offline' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-300 font-medium">
                    Offline
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Version
            </label>
            <input
              type="text"
              value="1.0.0"
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Application Settings
        </h2>

        <div className="space-y-6">
          {/* Application Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Application Name
            </label>
            <input
              type="text"
              value="Telecom Churn Prediction Dashboard"
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Application Version
            </label>
            <input
              type="text"
              value="1.0.0"
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Environment
            </label>
            <input
              type="text"
              value={process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          About This Application
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          This is a professional telecommunications churn prediction dashboard
          built with Next.js 16, React, TypeScript, and TailwindCSS. The
          application connects to a Railway-hosted backend API to provide
          real-time analytics, predictions, and audit logs. It features
          enterprise-grade UI patterns, dark mode support, and responsive
          design for optimal user experience across all devices.
        </p>
      </div>
    </div>
  );
}
