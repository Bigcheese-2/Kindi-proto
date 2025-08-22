'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SelectionContextType {
  // Entity selection
  selectedEntityIds: string[];
  selectEntity: (entityId: string) => void;
  deselectEntity: (entityId: string) => void;
  toggleEntitySelection: (entityId: string) => void;
  clearEntitySelection: () => void;

  // Event selection
  selectedEventIds: string[];
  selectEvent: (eventId: string) => void;
  deselectEvent: (eventId: string) => void;
  toggleEventSelection: (eventId: string) => void;
  clearEventSelection: () => void;

  // Location selection
  selectedLocationIds: string[];
  selectLocation: (locationId: string) => void;
  deselectLocation: (locationId: string) => void;
  toggleLocationSelection: (locationId: string) => void;
  clearLocationSelection: () => void;

  // Global selection
  clearAllSelections: () => void;
  hasSelections: boolean;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

  // Entity selection methods
  const selectEntity = useCallback((entityId: string) => {
    setSelectedEntityIds(prev => (prev.includes(entityId) ? prev : [...prev, entityId]));
  }, []);

  const deselectEntity = useCallback((entityId: string) => {
    setSelectedEntityIds(prev => prev.filter(id => id !== entityId));
  }, []);

  const toggleEntitySelection = useCallback((entityId: string) => {
    setSelectedEntityIds(prev =>
      prev.includes(entityId) ? prev.filter(id => id !== entityId) : [...prev, entityId]
    );
  }, []);

  const clearEntitySelection = useCallback(() => {
    setSelectedEntityIds([]);
  }, []);

  // Event selection methods
  const selectEvent = useCallback((eventId: string) => {
    setSelectedEventIds(prev => (prev.includes(eventId) ? prev : [...prev, eventId]));
  }, []);

  const deselectEvent = useCallback((eventId: string) => {
    setSelectedEventIds(prev => prev.filter(id => id !== eventId));
  }, []);

  const toggleEventSelection = useCallback((eventId: string) => {
    setSelectedEventIds(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  }, []);

  const clearEventSelection = useCallback(() => {
    setSelectedEventIds([]);
  }, []);

  // Location selection methods
  const selectLocation = useCallback((locationId: string) => {
    setSelectedLocationIds(prev => (prev.includes(locationId) ? prev : [...prev, locationId]));
  }, []);

  const deselectLocation = useCallback((locationId: string) => {
    setSelectedLocationIds(prev => prev.filter(id => id !== locationId));
  }, []);

  const toggleLocationSelection = useCallback((locationId: string) => {
    setSelectedLocationIds(prev =>
      prev.includes(locationId) ? prev.filter(id => id !== locationId) : [...prev, locationId]
    );
  }, []);

  const clearLocationSelection = useCallback(() => {
    setSelectedLocationIds([]);
  }, []);

  // Global selection methods
  const clearAllSelections = useCallback(() => {
    setSelectedEntityIds([]);
    setSelectedEventIds([]);
    setSelectedLocationIds([]);
  }, []);

  const hasSelections =
    selectedEntityIds.length > 0 || selectedEventIds.length > 0 || selectedLocationIds.length > 0;

  const value: SelectionContextType = {
    // Entity selection
    selectedEntityIds,
    selectEntity,
    deselectEntity,
    toggleEntitySelection,
    clearEntitySelection,

    // Event selection
    selectedEventIds,
    selectEvent,
    deselectEvent,
    toggleEventSelection,
    clearEventSelection,

    // Location selection
    selectedLocationIds,
    selectLocation,
    deselectLocation,
    toggleLocationSelection,
    clearLocationSelection,

    // Global selection
    clearAllSelections,
    hasSelections,
  };

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

