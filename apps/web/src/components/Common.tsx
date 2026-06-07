import React from 'react';

export function Loading() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
}

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function Error({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      {message && <p className="text-red-700 mb-4">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
