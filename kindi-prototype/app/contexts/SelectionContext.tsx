"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { Entity, Event, GeoLocation, Dataset, EntityType } from '@/app/models/data-types';
import { useData } from './DataContext';

// Visualization types
export type VisualizationType = 'graph' | 'timeline' | 'map';

// Selection types
export type SelectionType = 'entity' | 'event' | 'location';

export interface Selection {
  type: SelectionType;
  ids: string[];
  source: VisualizationType;
}

// Selection context type
export interface SelectionContextType {
  selectedEntityIds: string[];
  selectedEventIds: string[];
  selectedLocationIds: string[];
  source: VisualizationType | null;
  selectEntity: (id: string, exclusive?: boolean, source?: VisualizationType) => void;
  selectEvent: (id: string, exclusive?: boolean, source?: VisualizationType) => void;
  selectLocation: (id: string, exclusive?: boolean, source?: VisualizationType) => void;
  deselectEntity: (id: string) => void;
  deselectEvent: (id: string) => void;
  deselectLocation: (id: string) => void;
  clearSelection: () => void;
  hasSelection: boolean;
}

// Default context value
const defaultContext: SelectionContextType = {
  selectedEntityIds: [],
  selectedEventIds: [],
  selectedLocationIds: [],
  source: null,
  selectEntity: () => {},
  selectEvent: () => {},
  selectLocation: () => {},
  deselectEntity: () => {},
  deselectEvent: () => {},
  deselectLocation: () => {},
  clearSelection: () => {},
  hasSelection: false
};

const SelectionContext = createContext<SelectionContextType>(defaultContext);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const { currentDataset } = useData();
  
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [source, setSource] = useState<VisualizationType | null>(null);

  // Find related items functions
  const findRelatedEvents = useCallback((entityId: string): string[] => {
    if (!currentDataset) return [];
    return currentDataset.events
      .filter(event => event.entities.includes(entityId))
      .map(event => event.id);
  }, [currentDataset]);

  const findRelatedLocations = useCallback((entityId: string): string[] => {
    if (!currentDataset) return [];
    return currentDataset.events
      .filter(event => event.entities.includes(entityId) && event.location)
      .map(event => event.location?.id)
      .filter((id): id is string => id !== undefined);
  }, [currentDataset]);

  const findRelatedEntities = useCallback((eventId: string): string[] => {
    if (!currentDataset) return [];
    const event = currentDataset.events.find(e => e.id === eventId);
    return event ? event.entities : [];
  }, [currentDataset]);

  const findEntitiesAtLocation = useCallback((locationId: string): string[] => {
    if (!currentDataset) return [];
    // Find events at this location
    const eventsAtLocation = currentDataset.events.filter(
      event => event.location?.id === locationId
    );
    
    // Get unique entity IDs from these events
    return [...new Set(eventsAtLocation.flatMap(event => event.entities))];
  }, [currentDataset]);

  const findEventsAtLocation = useCallback((locationId: string): string[] => {
    if (!currentDataset) return [];
    return currentDataset.events
      .filter(event => event.location?.id === locationId)
      .map(event => event.id);
  }, [currentDataset]);

  // Selection actions
  const selectEntity = useCallback((id: string, exclusive = true, source?: VisualizationType) => {
    setSelectedEntityIds(prev => exclusive ? [id] : [...prev, id]);
    if (source) setSource(source);
    
    // Find related events and locations
    const relatedEvents = findRelatedEvents(id);
    const relatedLocations = findRelatedLocations(id);
    
    // Update their selection state
    setSelectedEventIds(relatedEvents);
    setSelectedLocationIds(relatedLocations);
  }, [findRelatedEvents, findRelatedLocations]);
  
  // Select initial entity when data is loaded
  useEffect(() => {
    if (currentDataset?.entities?.length && selectedEntityIds.length === 0) {
      // Find a person entity to select by default (Viktor Petrov)
      const defaultEntity = currentDataset.entities.find(entity => 
        entity.name === "Viktor Petrov" || entity.type === EntityType.PERSON
      );
      
      if (defaultEntity) {
        selectEntity(defaultEntity.id);
      }
    }
  }, [currentDataset, selectedEntityIds.length, selectEntity]);

  const selectEvent = useCallback((id: string, exclusive = true, source?: VisualizationType) => {
    setSelectedEventIds(prev => exclusive ? [id] : [...prev, id]);
    if (source) setSource(source);
    
    // Find related entities
    const relatedEntities = findRelatedEntities(id);
    
    // Find location if exists
    const event = currentDataset?.events.find(e => e.id === id);
    const locationId = event?.location?.id;
    
    // Update their selection state
    setSelectedEntityIds(relatedEntities);
    if (locationId) setSelectedLocationIds([locationId]);
    else setSelectedLocationIds([]);
  }, [currentDataset, findRelatedEntities]);

  const selectLocation = useCallback((id: string, exclusive = true, source?: VisualizationType) => {
    setSelectedLocationIds(prev => exclusive ? [id] : [...prev, id]);
    if (source) setSource(source);
    
    // Find related entities and events
    const entitiesAtLocation = findEntitiesAtLocation(id);
    const eventsAtLocation = findEventsAtLocation(id);
    
    // Update their selection state
    setSelectedEntityIds(entitiesAtLocation);
    setSelectedEventIds(eventsAtLocation);
  }, [findEntitiesAtLocation, findEventsAtLocation]);

  const deselectEntity = useCallback((id: string) => {
    setSelectedEntityIds(prev => prev.filter(entityId => entityId !== id));
  }, []);

  const deselectEvent = useCallback((id: string) => {
    setSelectedEventIds(prev => prev.filter(eventId => eventId !== id));
  }, []);

  const deselectLocation = useCallback((id: string) => {
    setSelectedLocationIds(prev => prev.filter(locationId => locationId !== id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntityIds([]);
    setSelectedEventIds([]);
    setSelectedLocationIds([]);
    setSource(null);
  }, []);

  // Compute whether there is any selection
  const hasSelection = useMemo(() => {
    return (
      selectedEntityIds.length > 0 ||
      selectedEventIds.length > 0 ||
      selectedLocationIds.length > 0
    );
  }, [
    selectedEntityIds,
    selectedEventIds,
    selectedLocationIds
  ]);

  const value = {
    selectedEntityIds,
    selectedEventIds,
    selectedLocationIds,
    source,
    selectEntity,
    selectEvent,
    selectLocation,
    deselectEntity,
    deselectEvent,
    deselectLocation,
    clearSelection,
    hasSelection
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

// Utility hooks for finding related items
export const useRelatedItems = () => {
  const { currentDataset } = useData();
  
  const findRelatedEvents = useCallback((entityId: string): Event[] => {
    if (!currentDataset) return [];
    return currentDataset.events.filter(event => event.entities.includes(entityId));
  }, [currentDataset]);

  const findRelatedLocations = useCallback((entityId: string): GeoLocation[] => {
    if (!currentDataset) return [];
    const locationIds = new Set<string>();
    
    currentDataset.events
      .filter(event => event.entities.includes(entityId) && event.location)
      .forEach(event => {
        if (event.location?.id) locationIds.add(event.location.id);
      });
      
    return currentDataset.locations.filter(location => locationIds.has(location.id));
  }, [currentDataset]);

  const findRelatedEntities = useCallback((eventId: string): Entity[] => {
    if (!currentDataset) return [];
    const event = currentDataset.events.find(e => e.id === eventId);
    if (!event) return [];
    
    return currentDataset.entities.filter(entity => 
      event.entities.includes(entity.id)
    );
  }, [currentDataset]);

  return {
    findRelatedEvents,
    findRelatedLocations,
    findRelatedEntities
  };
};
