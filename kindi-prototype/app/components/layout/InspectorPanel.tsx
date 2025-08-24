"use client";

import { useSelection } from '@/app/contexts/SelectionContext';
import EntityDetailView from '../inspector/EntityDetailView';
import EventDetailView from '../inspector/EventDetailView';
import LocationDetailView from '../inspector/LocationDetailView';
import EmptyStateView from '../inspector/EmptyStateView';

export default function InspectorPanel() {
  const { 
    selectedEntityIds, 
    selectedEventIds, 
    selectedLocationIds,
    clearSelection
  } = useSelection();
  
  const hasSelection = selectedEntityIds.length > 0 || selectedEventIds.length > 0 || selectedLocationIds.length > 0;
  
  const getSelectedView = () => {
    if (selectedEntityIds.length > 0) {
      return <EntityDetailView entityId={selectedEntityIds[0]} />;
    }
    
    if (selectedEventIds.length > 0) {
      return <EventDetailView eventId={selectedEventIds[0]} />;
    }
    
    if (selectedLocationIds.length > 0) {
      return <LocationDetailView locationId={selectedLocationIds[0]} />;
    }
    
    return <EmptyStateView />;
  };

  const getPanelTitle = () => {
    if (selectedEntityIds.length > 0) {
      return 'Entity Inspector';
    }
    if (selectedEventIds.length > 0) {
      return 'Event Inspector';
    }
    if (selectedLocationIds.length > 0) {
      return 'Location Inspector';
    }
    return 'Inspector';
  };

  return (
    <div className="h-full w-full bg-primary flex flex-col overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center p-4 border-b border-secondary">
        <h2 className="text-neutral-light font-medium text-lg">
          {getPanelTitle()}
        </h2>
      </div>
      
      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {hasSelection ? (
          getSelectedView()
        ) : (
          <EmptyStateView />
        )}
      </div>
    </div>
  );
}