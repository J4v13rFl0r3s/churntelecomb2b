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
          Información de la configuración del sistema y del backend.
        </p>
      </div>

      {/* Backend Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Información del Backend
        </h2>

        <div className="space-y-6">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL de la API
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
              Estado
            </label>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              {apiStatus === 'checking' && (
                <>
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Verificando...</span>
                </>
              )}
              {apiStatus === 'online' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    En línea
                  </span>
                </>
              )}
              {apiStatus === 'offline' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-300 font-medium">
                    Desconectado
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Versión de la API
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
          Configuración de la Aplicación
        </h2>

        <div className="space-y-6">
          {/* Application Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la Aplicación
            </label>
            <input
              type="text"
              value="B2B Telecom Churn Prediction Dashboard"
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Versión de la Aplicación
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
              Entorno
            </label>
            <input
              type="text"
              value={process.env.NODE_ENV === 'production' ? 'Producción' : 'Desarrollo'}
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Acerca de Esta Aplicación
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Este es un dashboard profesional de predicción de churn de telecomunicaciones
          construido con Next.js 16, React, TypeScript y TailwindCSS. La
          aplicación se conecta a una API backend alojada en Railway para proporcionar
          análisis en tiempo real, predicciones y registros de auditoría. Cuenta con
          patrones de interfaz de usuario de nivel empresarial, soporte de modo oscuro y diseño
          responsivo para una experiencia óptima del usuario en todos los dispositivos.
        </p>
      </div>

      {/* RBAC Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Control de Acceso Basado en Roles (RBAC)
        </h2>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            El sistema soporta tres niveles de acceso:
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="font-semibold text-blue-900 dark:text-blue-300">👨‍💼 Admin</p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                Acceso completo: ver datos, auditoría, configuración, gestión de usuarios
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="font-semibold text-green-900 dark:text-green-300">👤 Usuario Autenticado</p>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Acceso limitado: ver dashboard, empresas, predicciones y métricas
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="font-semibold text-yellow-900 dark:text-yellow-300">🔒 Anónimo</p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Acceso restringido: solo login. Redirige a /login
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="font-semibold text-amber-900 dark:text-amber-300">💡 Implementación Recomendada:</p>
            <ul className="text-sm text-amber-800 dark:text-amber-200 mt-2 space-y-1 list-disc list-inside">
              <li>Middleware de autenticación y autorización en Next.js</li>
              <li>Almacenar rol del usuario en JWT token</li>
              <li>Componentes ProtectedRoute por rol</li>
              <li>Ocultar elementos UI según permisos</li>
              <li>Auditar acciones de usuarios sensibles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
