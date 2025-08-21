import { useCallback } from 'react';
import { useSelection, VisualizationType } from '@/app/contexts/SelectionContext';

/**
 * Custom hook for visualization components to use for selection synchronization.
 * 
 * @param visualizationType The type of visualization using this hook
 * @returns Selection state and handlers for the specific visualization
 */
export const useSelectionSync = (visualizationType: VisualizationType) => {
  const { 
    selectedEntityIds, 
    selectedEventIds, 
    selectedLocationIds,
    selectEntity,
    selectEvent,
    selectLocation,
    clearSelection,
    hasSelection
  } = useSelection();

  // Create component-specific selection handlers that include source info
  const handleEntitySelect = useCallback((entityId: string, exclusive = true) => {
    selectEntity(entityId, exclusive, visualizationType);
  }, [selectEntity, visualizationType]);

  const handleEventSelect = useCallback((eventId: string, exclusive = true) => {
    selectEvent(eventId, exclusive, visualizationType);
  }, [selectEvent, visualizationType]);

  const handleLocationSelect = useCallback((locationId: string, exclusive = true) => {
    selectLocation(locationId, exclusive, visualizationType);
  }, [selectLocation, visualizationType]);

  // Determine if this visualization has selected items
  const isEntitySelected = useCallback((entityId: string) => {
    return selectedEntityIds.includes(entityId);
  }, [selectedEntityIds]);

  const isEventSelected = useCallback((eventId: string) => {
    return selectedEventIds.includes(eventId);
  }, [selectedEventIds]);

  const isLocationSelected = useCallback((locationId: string) => {
    return selectedLocationIds.includes(locationId);
  }, [selectedLocationIds]);

  return {
    // Selected IDs
    selectedEntityIds,
    selectedEventIds,
    selectedLocationIds,
    
    // Selection handlers
    selectEntity: handleEntitySelect,
    selectEvent: handleEventSelect,
    selectLocation: handleLocationSelect,
    clearSelection,
    
    // Selection state checkers
    isEntitySelected,
    isEventSelected,
    isLocationSelected,
    hasSelection
  };
};
