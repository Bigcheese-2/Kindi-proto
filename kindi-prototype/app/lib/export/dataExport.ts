"use client";

import { Entity, Relationship, Event, GeoLocation } from '@/app/models/data-types';

/**
 * Convert entity data to CSV format
 * @param entities Array of entities
 * @returns CSV string
 */
export const entitiesToCSV = (entities: Entity[]): string => {
  if (!entities || entities.length === 0) {
    return '';
  }
  
  // Define headers based on entity structure
  const headers = ['id', 'name', 'type', 'description'];
  
  // Add attribute headers (collect all unique attribute keys)
  const attributeKeys = new Set<string>();
  entities.forEach(entity => {
    if (entity.attributes) {
      Object.keys(entity.attributes).forEach(key => attributeKeys.add(key));
    }
  });
  
  const allHeaders = [...headers, ...Array.from(attributeKeys).map(key => `attribute_${key}`)];
  
  // Create CSV content
  const csvContent = [
    // Headers row
    allHeaders.join(','),
    // Data rows
    ...entities.map(entity => 
      allHeaders.map(header => {
        if (header.startsWith('attribute_')) {
          const attrKey = header.replace('attribute_', '');
          const value = entity.attributes?.[attrKey];
          return formatCSVValue(value);
        } else {
          const value = entity[header as keyof Entity];
          return formatCSVValue(value);
        }
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

/**
 * Convert relationship data to CSV format
 * @param relationships Array of relationships
 * @returns CSV string
 */
export const relationshipsToCSV = (relationships: Relationship[]): string => {
  if (!relationships || relationships.length === 0) {
    return '';
  }
  
  // Define headers based on relationship structure
  const headers = ['id', 'type', 'sourceId', 'targetId', 'strength', 'description'];
  
  // Add attribute headers (collect all unique attribute keys)
  const attributeKeys = new Set<string>();
  relationships.forEach(rel => {
    if (rel.attributes) {
      Object.keys(rel.attributes).forEach(key => attributeKeys.add(key));
    }
  });
  
  const allHeaders = [...headers, ...Array.from(attributeKeys).map(key => `attribute_${key}`)];
  
  // Create CSV content
  const csvContent = [
    // Headers row
    allHeaders.join(','),
    // Data rows
    ...relationships.map(rel => 
      allHeaders.map(header => {
        if (header.startsWith('attribute_')) {
          const attrKey = header.replace('attribute_', '');
          const value = rel.attributes?.[attrKey];
          return formatCSVValue(value);
        } else {
          const value = rel[header as keyof Relationship];
          return formatCSVValue(value);
        }
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

/**
 * Convert event data to CSV format
 * @param events Array of events
 * @returns CSV string
 */
export const eventsToCSV = (events: Event[]): string => {
  if (!events || events.length === 0) {
    return '';
  }
  
  // Define headers based on event structure
  const headers = ['id', 'title', 'description', 'time', 'endTime', 'relatedEntities'];
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...events.map(event => 
      headers.map(header => {
        if (header === 'relatedEntities') {
          return formatCSVValue(event.relatedEntities?.join(';'));
        } else {
          const value = event[header as keyof Event];
          return formatCSVValue(value);
        }
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

/**
 * Convert location data to CSV format
 * @param locations Array of locations
 * @returns CSV string
 */
export const locationsToCSV = (locations: GeoLocation[]): string => {
  if (!locations || locations.length === 0) {
    return '';
  }
  
  // Define headers based on location structure
  const headers = ['id', 'name', 'latitude', 'longitude', 'description', 'relatedEntities'];
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...locations.map(location => 
      headers.map(header => {
        if (header === 'relatedEntities') {
          return formatCSVValue(location.relatedEntities?.join(';'));
        } else {
          const value = location[header as keyof GeoLocation];
          return formatCSVValue(value);
        }
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

/**
 * Format a value for CSV export
 * @param value Value to format
 * @returns Formatted value
 */
const formatCSVValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  
  if (typeof value === 'string') {
    // Escape quotes and wrap in quotes if contains commas or quotes
    if (value.includes(',') || value.includes('"')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  
  return String(value);
};
