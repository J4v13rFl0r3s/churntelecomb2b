'use client';

import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar />

          {/* Page content */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
