"use client";

import { useData } from '@/app/contexts/DataContext';
import DashboardLayout from './DashboardLayout';
import LoadingOverlay from '../core/LoadingOverlay';
import ErrorMessage from '../core/ErrorMessage';

export default function DashboardContent() {
  const { isLoading, error, loadDataset, currentDataset } = useData();

  const handleRetry = () => {
    if (currentDataset) {
      loadDataset(currentDataset.id);
    } else {
      // Try to load the first dataset if available
      const previousDatasetId = sessionStorage.getItem('selectedDatasetId');
      if (previousDatasetId) {
        loadDataset(previousDatasetId);
      }
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      {error && (
        <div className="p-4">
          <ErrorMessage error={error} onRetry={handleRetry} />
        </div>
      )}
      <DashboardLayout />
    </>
  );
}
