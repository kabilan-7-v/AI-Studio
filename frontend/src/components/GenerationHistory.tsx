import React from 'react';
import { Generation } from '../types';

interface GenerationHistoryProps {
  history: Generation[];
  onItemClick: (generation: Generation) => void;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  history,
  onItemClick,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Generations</h2>

      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No generations yet</p>
      ) : (
        <div className="space-y-4">
          {history.map((generation) => (
            <div
              key={generation.id}
              onClick={() => onItemClick(generation)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onItemClick(generation);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Load generation: ${generation.prompt}`}
              className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-primary-500 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={generation.imageUrl}
                  alt={generation.prompt}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {generation.prompt}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {generation.style}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(generation.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
