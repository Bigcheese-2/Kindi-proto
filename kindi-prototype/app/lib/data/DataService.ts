import { Dataset, DatasetInfo, DataService } from '@/app/models/data-types';

/**
 * Static data service implementation that loads data from JSON files
 */
export class StaticDataService implements DataService {
  /**
   * Get a list of available datasets
   */
  async getDatasets(): Promise<DatasetInfo[]> {
    try {
      // Add cache: 'no-store' to avoid caching issues during development
      const response = await fetch('/data/index.json', { cache: 'no-store' });
      if (!response.ok) {
        console.error(`Failed to load dataset index: ${response.status}`);
        // Return empty array instead of throwing to avoid breaking the UI
        return [];
      }
      
      const data = await response.json();
      return data.datasets as DatasetInfo[];
    } catch (error) {
      console.error('Error loading datasets:', error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  }

  /**
   * Load a specific dataset by ID
   */
  async loadDataset(id: string): Promise<Dataset> {
    try {
      // Add cache: 'no-store' to avoid caching issues during development
      const response = await fetch(`/data/datasets/${id}.json`, { cache: 'no-store' });
      if (!response.ok) {
        console.error(`Failed to load dataset ${id}: ${response.status}`);
        throw new Error(`Failed to load dataset ${id}: ${response.status}`);
      }
      
      const dataset = await response.json();
      return dataset as Dataset;
    } catch (error) {
      console.error(`Error loading dataset ${id}:`, error);
      throw new Error(`Failed to load dataset: ${id}`);
    }
  }
}

// Create a singleton instance of the data service
export const dataService = new StaticDataService();
