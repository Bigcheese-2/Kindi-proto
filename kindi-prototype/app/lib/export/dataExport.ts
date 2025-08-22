/**
 * Utility functions for exporting data
 */

/**
 * Convert data to CSV format
 * @param data Data to convert (array of objects)
 * @param options Optional configuration
 * @returns CSV string
 */
export const dataToCSV = (
  data: any[],
  options: {
    delimiter?: string;
    includeHeaders?: boolean;
    headers?: string[];
    dateFormat?: string;
  } = {}
): string => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  const {
    delimiter = ',',
    includeHeaders = true,
    headers = Object.keys(data[0]),
    dateFormat = 'YYYY-MM-DD HH:mm:ss'
  } = options;
  
  // Format a value for CSV
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (value instanceof Date) {
      // Format date according to dateFormat
      // This is a simple implementation, a real one would use a proper date library
      return value.toISOString();
    }
    
    const stringValue = String(value);
    
    // Escape quotes and wrap in quotes if contains delimiter or quotes
    if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };
  
  // Build CSV content
  const rows: string[] = [];
  
  // Add headers if requested
  if (includeHeaders) {
    rows.push(headers.map(formatValue).join(delimiter));
  }
  
  // Add data rows
  for (const item of data) {
    const row = headers.map(header => formatValue(item[header])).join(delimiter);
    rows.push(row);
  }
  
  return rows.join('\n');
};

/**
 * Convert data to JSON format
 * @param data Data to convert
 * @param options Optional configuration
 * @returns JSON string
 */
export const dataToJSON = (
  data: any,
  options: {
    pretty?: boolean;
    indent?: number;
    includeMetadata?: boolean;
    metadata?: Record<string, any>;
  } = {}
): string => {
  const {
    pretty = true,
    indent = 2,
    includeMetadata = false,
    metadata = {}
  } = options;
  
  // Add metadata if requested
  const exportData = includeMetadata
    ? {
        metadata: {
          exportedAt: new Date().toISOString(),
          ...metadata
        },
        data
      }
    : data;
  
  return JSON.stringify(exportData, null, pretty ? indent : 0);
};

/**
 * Filter data for export based on selection
 * @param data Data to filter
 * @param selection Array of IDs to include
 * @param idField Field name for ID
 * @returns Filtered data
 */
export const filterDataForExport = (
  data: any[],
  selection: string[],
  idField: string = 'id'
): any[] => {
  if (!selection || selection.length === 0) {
    return data;
  }
  
  return data.filter(item => selection.includes(item[idField]));
};

/**
 * Extract fields from data for export
 * @param data Data to process
 * @param fields Fields to include
 * @returns Processed data with only selected fields
 */
export const extractFieldsForExport = (
  data: any[],
  fields: string[]
): any[] => {
  if (!fields || fields.length === 0) {
    return data;
  }
  
  return data.map(item => {
    const result: Record<string, any> = {};
    
    for (const field of fields) {
      result[field] = item[field];
    }
    
    return result;
  });
};
