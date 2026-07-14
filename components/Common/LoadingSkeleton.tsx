'use client';

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="animate-shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
      <div className="animate-shimmer h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3">
      <div className="animate-shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="animate-shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-2">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <SkeletonRow key={i} />
        ))}
    </div>
  );
}
