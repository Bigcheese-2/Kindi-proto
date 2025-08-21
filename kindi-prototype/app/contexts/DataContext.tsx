"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dataset, DatasetInfo } from '@/app/models/data-types';
import { dataService } from '@/app/lib/data/DataService';

interface DataContextType {
  currentDataset: Dataset | null;
  availableDatasets: DatasetInfo[];
  loadDataset: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Load available datasets on mount
  useEffect(() => {
    const loadAvailableDatasets = async () => {
      try {
        setIsLoading(true);
        const datasets = await dataService.getDatasets();
        setAvailableDatasets(datasets);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load datasets'));
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableDatasets();
  }, []);

  // Function to load a specific dataset
  const loadDataset = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const dataset = await dataService.loadDataset(id);
      setCurrentDataset(dataset);
      
      // Store the selected dataset ID in session storage
      sessionStorage.setItem('selectedDatasetId', id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to load dataset: ${id}`));
    } finally {
      setIsLoading(false);
    }
  };

  // Load the previously selected dataset from session storage on mount
  useEffect(() => {
    const loadPreviousDataset = async () => {
      const previousDatasetId = sessionStorage.getItem('selectedDatasetId');
      if (previousDatasetId && availableDatasets.length > 0) {
        await loadDataset(previousDatasetId);
      } else if (availableDatasets.length > 0) {
        // Load the first dataset by default
        await loadDataset(availableDatasets[0].id);
      }
    };

    if (availableDatasets.length > 0 && !currentDataset && !isLoading) {
      loadPreviousDataset();
    }
  }, [availableDatasets, currentDataset, isLoading]);

  return (
    <DataContext.Provider
      value={{
        currentDataset,
        availableDatasets,
        loadDataset,
        isLoading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
