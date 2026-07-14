'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Moon, Sun, LogOut } from 'lucide-react';
import { apiClient } from '@/lib/api';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('offline');

  // Update time
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check API status
  useEffect(() => {
    const checkStatus = async () => {
      const isHealthy = await apiClient.checkHealth();
      setApiStatus(isHealthy ? 'online' : 'offline');
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    const isDarkMode = theme === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Telecom Churn Prediction
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-6">
        {/* Current time */}
        <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
          {currentTime}
        </div>

        {/* API Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              apiStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            API: {apiStatus === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* User info */}
        {user && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {user.email}
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-400"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
