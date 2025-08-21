"use client";

import { useData } from '@/app/contexts/DataContext';

export default function DatasetSelector() {
  const { availableDatasets, currentDataset, loadDataset, isLoading } = useData();

  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const datasetId = e.target.value;
    loadDataset(datasetId);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Dataset Selection</h3>
      <div className="flex items-center">
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={currentDataset?.id || ''}
          onChange={handleDatasetChange}
          disabled={isLoading || availableDatasets.length === 0}
        >
          {availableDatasets.length === 0 && (
            <option value="">No datasets available</option>
          )}
          
          {availableDatasets.map(dataset => (
            <option key={dataset.id} value={dataset.id}>
              {dataset.name}
            </option>
          ))}
        </select>
        
        {isLoading && (
          <div className="ml-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      
      {currentDataset && (
        <div className="mt-2 text-xs text-gray-600">
          <p>{currentDataset.description}</p>
          <div className="mt-1 flex space-x-4">
            <span>{currentDataset.entities.length} Entities</span>
            <span>{currentDataset.relationships.length} Relationships</span>
            <span>{currentDataset.events.length} Events</span>
          </div>
        </div>
      )}
    </div>
  );
}
