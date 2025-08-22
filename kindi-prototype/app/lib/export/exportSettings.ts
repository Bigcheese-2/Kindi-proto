/**
 * Export settings management
 */

// Export settings types
export interface ExportPreferences {
  defaultImageFormat: 'png' | 'jpg' | 'svg';
  defaultDataFormat: 'csv' | 'json';
  defaultDocumentFormat: 'pdf';
  imageQuality: number;
  includeMetadata: boolean;
  defaultNamingPattern: string;
  customExportConfigurations: ExportConfiguration[];
}

export interface ExportConfiguration {
  id: string;
  name: string;
  description?: string;
  type: 'graph' | 'timeline' | 'map' | 'data' | 'report';
  format: string;
  options: Record<string, any>;
}

// Default export preferences
const defaultExportPreferences: ExportPreferences = {
  defaultImageFormat: 'png',
  defaultDataFormat: 'csv',
  defaultDocumentFormat: 'pdf',
  imageQuality: 90,
  includeMetadata: true,
  defaultNamingPattern: '{type}-export-{date}',
  customExportConfigurations: []
};

/**
 * Get export preferences from local storage
 * @returns Export preferences
 */
export const getExportPreferences = (): ExportPreferences => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const preferences = localStorage.getItem('exportPreferences');
      return preferences 
        ? { ...defaultExportPreferences, ...JSON.parse(preferences) }
        : defaultExportPreferences;
    }
    return defaultExportPreferences;
  } catch (error) {
    console.error('Error loading export preferences:', error);
    return defaultExportPreferences;
  }
};

/**
 * Save export preferences to local storage
 * @param preferences Export preferences to save
 */
export const saveExportPreferences = (preferences: Partial<ExportPreferences>): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const currentPreferences = getExportPreferences();
      const updatedPreferences = { ...currentPreferences, ...preferences };
      localStorage.setItem('exportPreferences', JSON.stringify(updatedPreferences));
    }
  } catch (error) {
    console.error('Error saving export preferences:', error);
  }
};

/**
 * Get default format for export type
 * @param type Export type
 * @returns Default format
 */
export const getDefaultFormatForType = (
  type: 'graph' | 'timeline' | 'map' | 'data' | 'report'
): string => {
  const preferences = getExportPreferences();
  
  switch (type) {
    case 'graph':
      return preferences.defaultImageFormat;
    case 'timeline':
    case 'map':
      return preferences.defaultImageFormat;
    case 'data':
      return preferences.defaultDataFormat;
    case 'report':
      return preferences.defaultDocumentFormat;
    default:
      return 'png';
  }
};

/**
 * Get default export options for type
 * @param type Export type
 * @returns Default export options
 */
export const getDefaultOptionsForType = (
  type: 'graph' | 'timeline' | 'map' | 'data' | 'report'
): Record<string, any> => {
  const preferences = getExportPreferences();
  
  const commonOptions = {
    includeMetadata: preferences.includeMetadata
  };
  
  switch (type) {
    case 'graph':
    case 'timeline':
    case 'map':
      return {
        ...commonOptions,
        quality: preferences.imageQuality / 100
      };
    case 'data':
    case 'report':
      return commonOptions;
    default:
      return commonOptions;
  }
};

/**
 * Generate filename based on pattern
 * @param type Export type
 * @param format Export format
 * @returns Generated filename
 */
export const generateFilename = (
  type: string,
  format: string
): string => {
  const preferences = getExportPreferences();
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  
  return preferences.defaultNamingPattern
    .replace('{type}', type)
    .replace('{date}', date)
    .replace('{time}', time)
    + '.' + format;
};

/**
 * Save custom export configuration
 * @param config Export configuration to save
 * @returns Saved configuration with ID
 */
export const saveExportConfiguration = (
  config: Omit<ExportConfiguration, 'id'>
): ExportConfiguration => {
  const preferences = getExportPreferences();
  const id = `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newConfig: ExportConfiguration = {
    ...config,
    id
  };
  
  const updatedConfigs = [...preferences.customExportConfigurations, newConfig];
  
  saveExportPreferences({
    customExportConfigurations: updatedConfigs
  });
  
  return newConfig;
};

/**
 * Delete custom export configuration
 * @param id Configuration ID to delete
 * @returns True if deleted, false if not found
 */
export const deleteExportConfiguration = (id: string): boolean => {
  const preferences = getExportPreferences();
  const initialLength = preferences.customExportConfigurations.length;
  
  const updatedConfigs = preferences.customExportConfigurations.filter(
    config => config.id !== id
  );
  
  if (updatedConfigs.length === initialLength) {
    return false;
  }
  
  saveExportPreferences({
    customExportConfigurations: updatedConfigs
  });
  
  return true;
};

/**
 * Get custom export configurations for type
 * @param type Export type
 * @returns Array of configurations for the type
 */
export const getConfigurationsForType = (
  type: 'graph' | 'timeline' | 'map' | 'data' | 'report'
): ExportConfiguration[] => {
  const preferences = getExportPreferences();
  
  return preferences.customExportConfigurations.filter(
    config => config.type === type
  );
};
