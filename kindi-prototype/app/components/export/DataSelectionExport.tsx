"use client";

import { useState } from 'react';
import { ExportService, ExportOptions, saveExportedContent } from '@/app/lib/export/exportService';
import { entitiesToCSV, relationshipsToCSV, eventsToCSV, locationsToCSV } from '@/app/lib/export/dataExport';
import { Entity, Relationship, Event, GeoLocation } from '@/app/models/data-types';
import ExportButton from './ExportButton';

interface DataSelectionExportProps {
  entities: Entity[];
  relationships: Relationship[];
  events: Event[];
  locations: GeoLocation[];
}

const DataSelectionExport: React.FC<DataSelectionExportProps> = ({
  entities,
  relationships,
  events,
  locations
}) => {
  const [selectedDataType, setSelectedDataType] = useState<'entities' | 'relationships' | 'events' | 'locations'>('entities');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const exportService = new ExportService();
  
  // Get data based on selected type
  const getData = () => {
    switch (selectedDataType) {
      case 'entities':
        return entities.filter(entity => 
          selectedIds.length === 0 || selectedIds.includes(entity.id)
        );
      case 'relationships':
        return relationships.filter(rel => 
          selectedIds.length === 0 || selectedIds.includes(rel.id)
        );
      case 'events':
        return events.filter(event => 
          selectedIds.length === 0 || selectedIds.includes(event.id)
        );
      case 'locations':
        return locations.filter(location => 
          selectedIds.length === 0 || selectedIds.includes(location.id)
        );
    }
  };
  
  // Get CSV data
  const getCSVData = () => {
    const data = getData();
    
    switch (selectedDataType) {
      case 'entities':
        return entitiesToCSV(data as Entity[]);
      case 'relationships':
        return relationshipsToCSV(data as Relationship[]);
      case 'events':
        return eventsToCSV(data as Event[]);
      case 'locations':
        return locationsToCSV(data as GeoLocation[]);
    }
  };
  
  // Handle export
  const handleExport = async (options: ExportOptions) => {
    try {
      const data = getData();
      
      let content: Blob | string;
      
      if (options.format === 'csv') {
        content = getCSVData();
      } else {
        content = await exportService.exportData(data, options);
      }
      
      saveExportedContent(
        content, 
        options.filename || `${selectedDataType}-export.${options.format}`
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };
  
  // Toggle selection of an item
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  // Select all items
  const selectAll = () => {
    switch (selectedDataType) {
      case 'entities':
        setSelectedIds(entities.map(entity => entity.id));
        break;
      case 'relationships':
        setSelectedIds(relationships.map(rel => rel.id));
        break;
      case 'events':
        setSelectedIds(events.map(event => event.id));
        break;
      case 'locations':
        setSelectedIds(locations.map(location => location.id));
        break;
    }
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedIds([]);
  };
  
  // Render data items based on selected type
  const renderDataItems = () => {
    switch (selectedDataType) {
      case 'entities':
        return entities.map(entity => (
          <div 
            key={entity.id}
            className={`border p-2 rounded-md cursor-pointer ${
              selectedIds.includes(entity.id) 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => toggleSelection(entity.id)}
          >
            <div className="font-medium">{entity.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {entity.type} · {entity.id}
            </div>
          </div>
        ));
      case 'relationships':
        return relationships.map(rel => (
          <div 
            key={rel.id}
            className={`border p-2 rounded-md cursor-pointer ${
              selectedIds.includes(rel.id) 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => toggleSelection(rel.id)}
          >
            <div className="font-medium">{rel.type}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {rel.sourceId} → {rel.targetId} · {rel.id}
            </div>
          </div>
        ));
      case 'events':
        return events.map(event => (
          <div 
            key={event.id}
            className={`border p-2 rounded-md cursor-pointer ${
              selectedIds.includes(event.id) 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => toggleSelection(event.id)}
          >
            <div className="font-medium">{event.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(event.time).toLocaleDateString()} · {event.id}
            </div>
          </div>
        ));
      case 'locations':
        return locations.map(location => (
          <div 
            key={location.id}
            className={`border p-2 rounded-md cursor-pointer ${
              selectedIds.includes(location.id) 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => toggleSelection(location.id)}
          >
            <div className="font-medium">{location.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {location.latitude}, {location.longitude} · {location.id}
            </div>
          </div>
        ));
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Export Data</h3>
        <ExportButton exportType="data" onExport={handleExport} />
      </div>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            selectedDataType === 'entities'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
          onClick={() => {
            setSelectedDataType('entities');
            setSelectedIds([]);
          }}
        >
          Entities ({entities.length})
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            selectedDataType === 'relationships'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
          onClick={() => {
            setSelectedDataType('relationships');
            setSelectedIds([]);
          }}
        >
          Relationships ({relationships.length})
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            selectedDataType === 'events'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
          onClick={() => {
            setSelectedDataType('events');
            setSelectedIds([]);
          }}
        >
          Events ({events.length})
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            selectedDataType === 'locations'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
          onClick={() => {
            setSelectedDataType('locations');
            setSelectedIds([]);
          }}
        >
          Locations ({locations.length})
        </button>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <div>
          {selectedIds.length} of {getData().length} selected
        </div>
        <div className="space-x-2">
          <button
            className="text-blue-600 dark:text-blue-400 hover:underline"
            onClick={selectAll}
          >
            Select All
          </button>
          <button
            className="text-blue-600 dark:text-blue-400 hover:underline"
            onClick={clearSelection}
            disabled={selectedIds.length === 0}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="border rounded-md p-2 dark:border-gray-700 max-h-80 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {renderDataItems()}
        </div>
        
        {getData().length === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No data available for this type
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {selectedIds.length === 0 
          ? 'All data will be exported if no items are selected' 
          : 'Only selected items will be exported'}
      </div>
    </div>
  );
};

export default DataSelectionExport;
