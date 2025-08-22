'use client';

import React, { useState } from 'react';
import { useData } from '@/app/contexts/DataContext';
import { ExportService, ExportFormat } from '@/app/lib/export/exportService';
import { filterDataForExport, extractFieldsForExport } from '@/app/lib/export/dataExport';
import { downloadContent, getMimeType } from '@/app/lib/export/visualExport';
import ExportDialog from './ExportDialog';

interface DataExportPanelProps {
  onClose: () => void;
}

const DataExportPanel: React.FC<DataExportPanelProps> = ({ onClose }) => {
  const { currentDataset } = useData();
  const [dataType, setDataType] = useState<'entities' | 'events' | 'locations'>('entities');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const exportService = new ExportService();

  // Get data based on selected type
  const getData = () => {
    if (!currentDataset) return [];

    switch (dataType) {
      case 'entities':
        return currentDataset.entities || [];
      case 'events':
        return currentDataset.events || [];
      case 'locations':
        return currentDataset.locations || [];
      default:
        return [];
    }
  };

  // Get available fields for selected data type
  const getAvailableFields = () => {
    const data = getData();
    if (data.length === 0) return [];

    // Get all unique fields from the data
    const allFields = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => allFields.add(key));
    });

    return Array.from(allFields).sort();
  };

  // Handle field selection change
  const handleFieldChange = (field: string) => {
    setSelectedFields(prev => {
      if (prev.includes(field)) {
        return prev.filter(f => f !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  // Handle select all fields
  const handleSelectAllFields = () => {
    const fields = getAvailableFields();
    setSelectedFields(fields);
  };

  // Handle clear all fields
  const handleClearFields = () => {
    setSelectedFields([]);
  };

  // Handle item selection change
  const handleItemSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all items
  const handleSelectAllItems = () => {
    const data = getData();
    setSelectedIds(data.map(item => item.id));
  };

  // Handle clear all items
  const handleClearItems = () => {
    setSelectedIds([]);
  };

  // Handle export
  const handleExport = async (options: {
    format: ExportFormat;
    includeMetadata?: boolean;
    filename?: string;
  }) => {
    // For data export, only support csv and json formats
    if (options.format !== 'csv' && options.format !== 'json') {
      console.error('Data export only supports CSV and JSON formats');
      alert('Data export only supports CSV and JSON formats');
      return;
    }
    try {
      // Get data to export
      let data = getData();

      // Filter by selected IDs if any
      if (selectedIds.length > 0) {
        data = filterDataForExport(data, selectedIds);
      }

      // Filter by selected fields if any
      if (selectedFields.length > 0) {
        data = extractFieldsForExport(data, selectedFields);
      }

      // Add metadata if requested
      const exportData = options.includeMetadata
        ? {
            metadata: {
              exportedAt: new Date().toISOString(),
              dataType,
              totalItems: data.length,
              datasetName: currentDataset?.name || 'Unknown',
            },
            data,
          }
        : data;

      // Export data
      const result = await exportService.exportData(exportData, {
        format: options.format,
        filename: options.filename,
        includeMetadata: options.includeMetadata,
      });

      // Download the result
      downloadContent(
        result,
        options.filename || `${dataType}-export.${options.format}`,
        getMimeType(options.format)
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data');
    }
  };

  const availableFields = getAvailableFields();
  const data = getData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Export Data</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Data Type</h3>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${
                dataType === 'entities'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setDataType('entities')}
            >
              Entities
            </button>
            <button
              className={`px-4 py-2 rounded ${
                dataType === 'events'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setDataType('events')}
            >
              Events
            </button>
            <button
              className={`px-4 py-2 rounded ${
                dataType === 'locations'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setDataType('locations')}
            >
              Locations
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Select Fields</h3>
              <div className="space-x-2">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={handleSelectAllFields}
                >
                  Select All
                </button>
                <button
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={handleClearFields}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="border rounded-md p-4 h-64 overflow-y-auto">
              {availableFields.length === 0 ? (
                <div className="text-gray-500">No fields available</div>
              ) : (
                <div className="space-y-2">
                  {availableFields.map(field => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field)}
                        onChange={() => handleFieldChange(field)}
                        className="mr-2"
                      />
                      <span>{field}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Select Items</h3>
              <div className="space-x-2">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={handleSelectAllItems}
                >
                  Select All
                </button>
                <button
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={handleClearItems}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="border rounded-md p-4 h-64 overflow-y-auto">
              {data.length === 0 ? (
                <div className="text-gray-500">No items available</div>
              ) : (
                <div className="space-y-2">
                  {data.map(item => (
                    <label key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleItemSelection(item.id)}
                        className="mr-2"
                      />
                      <span>
                        {'name' in item && item.name
                          ? item.name
                          : 'title' in item && item.title
                            ? item.title
                            : `ID: ${item.id.substring(0, 8)}`}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setIsDialogOpen(true)}
            disabled={data.length === 0}
          >
            Export
          </button>
        </div>

        {isDialogOpen && (
          <ExportDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            exportType="data"
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
};

export default DataExportPanel;
