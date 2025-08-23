"use client";

import { useState, useEffect } from 'react';
import { useSelection } from '@/app/contexts/SelectionContext';
import { useUI } from '@/app/contexts/UIContext';
import EntityDetailView from '../inspector/EntityDetailView';
import EventDetailView from '../inspector/EventDetailView';
import LocationDetailView from '../inspector/LocationDetailView';
import EmptyStateView from '../inspector/EmptyStateView';
import AnnotationList from '../core/annotations/AnnotationList';
import AnnotationCreator from '../core/annotations/AnnotationCreator';
import AnnotationExportButton from '../core/annotations/AnnotationExportButton';

export default function InspectorPanel() {
  const { inspectorVisible, setInspectorVisible } = useUI();
  const { 
    selectedEntityIds, 
    selectedEventIds, 
    selectedLocationIds,
    clearSelection
  } = useSelection();
  const [activeTab, setActiveTab] = useState<'details' | 'annotations'>('details');
  const [isCreatingAnnotation, setIsCreatingAnnotation] = useState<boolean>(false);
  
  // Check if there's any selection
  const hasSelection = selectedEntityIds.length > 0 || selectedEventIds.length > 0 || selectedLocationIds.length > 0;
  
  // Auto-open Inspector when item is selected (PRD requirement)
  useEffect(() => {
    if (hasSelection) {
      setInspectorVisible(true);
    }
  }, [hasSelection, setInspectorVisible]);
  
  // Determine which view to show based on selection
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

  // Get title based on selection
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

  // Determine if panel should show (has selection and is visible)
  const shouldShowPanel = hasSelection && inspectorVisible;

  return (
    <>
      {/* Slide-out Inspector Panel from right side */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-96 bg-primary border-l border-secondary z-50
          transform transition-transform duration-300 ease-in-out shadow-xl
          ${shouldShowPanel ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center p-4 border-b border-secondary">
          <h2 className="text-neutral-light font-medium text-lg">
            {getPanelTitle()}
          </h2>
          <div className="flex space-x-2">
            <button
              className="p-2 text-neutral-medium hover:text-neutral-light hover:bg-secondary rounded transition-colors"
              onClick={clearSelection}
              title="Clear Selection"
              aria-label="Clear Selection"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              className="p-2 text-neutral-medium hover:text-neutral-light hover:bg-secondary rounded transition-colors"
              onClick={() => setInspectorVisible(false)}
              title="Close Inspector"
              aria-label="Close Inspector"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {hasSelection ? (
            getSelectedView()
          ) : (
            <EmptyStateView />
          )}
        </div>
      </div>

      {/* Collapsed state indicator (when there's selection but panel is closed) */}
      {hasSelection && !inspectorVisible && (
        <button
          className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-accent text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors z-40"
          onClick={() => setInspectorVisible(true)}
          title="Open Inspector"
          aria-label="Open Inspector Panel"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </>
  );
}