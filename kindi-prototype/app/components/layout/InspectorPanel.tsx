"use client";

import { useState } from 'react';
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

  if (!inspectorVisible) {
    return (
      <div className="h-full flex items-center justify-center">
        <button 
          className="px-4 py-2 bg-gray-700 text-neutral-light rounded hover:bg-gray-600"
          onClick={() => setInspectorVisible(true)}
        >
          Show Inspector
        </button>
      </div>
    );
  }

  return (
    <div className="bg-secondary h-full rounded-md shadow-md flex flex-col overflow-hidden">
      <div className="flex flex-col border-b border-gray-700">
        <div className="flex justify-between items-center p-3">
          <h2 className="text-lg font-secondary font-semibold text-neutral-light">
            {getPanelTitle()}
          </h2>
          <div className="flex space-x-2">
            {(selectedEntityIds.length > 0 || selectedEventIds.length > 0 || selectedLocationIds.length > 0) && (
              <button
                className="p-1.5 text-neutral-medium hover:text-neutral-light"
                onClick={clearSelection}
                title="Clear Selection"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              className="p-1.5 text-neutral-medium hover:text-neutral-light"
              onClick={() => setInspectorVisible(false)}
              title="Hide Inspector"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {(selectedEntityIds.length > 0 || selectedEventIds.length > 0 || selectedLocationIds.length > 0) && (
          <div className="flex px-3 pb-2">
            <div className="w-full flex border-b border-gray-700">
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'details' 
                    ? 'text-accent border-b-2 border-accent' 
                    : 'text-neutral-medium hover:text-neutral-light'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'annotations' 
                    ? 'text-accent border-b-2 border-accent' 
                    : 'text-neutral-medium hover:text-neutral-light'
                }`}
                onClick={() => setActiveTab('annotations')}
              >
                Annotations
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {(selectedEntityIds.length > 0 || selectedEventIds.length > 0 || selectedLocationIds.length > 0) ? (
          activeTab === 'details' ? (
            getSelectedView()
          ) : (
            <div className="annotations-container">
              {isCreatingAnnotation ? (
                <AnnotationCreator
                  targetId={
                    selectedEntityIds[0] || 
                    selectedEventIds[0] || 
                    selectedLocationIds[0]
                  }
                  targetType={
                    selectedEntityIds.length > 0 ? 'entity' :
                    selectedEventIds.length > 0 ? 'event' : 'location'
                  }
                  onComplete={() => setIsCreatingAnnotation(false)}
                />
              ) : (
                <div className="annotation-actions mb-4 flex space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setIsCreatingAnnotation(true)}
                  >
                    Add Annotation
                  </button>
                  
                  <AnnotationExportButton
                    targetId={
                      selectedEntityIds[0] || 
                      selectedEventIds[0] || 
                      selectedLocationIds[0]
                    }
                    targetType={
                      selectedEntityIds.length > 0 ? 'entity' :
                      selectedEventIds.length > 0 ? 'event' : 'location'
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  />
                </div>
              )}
              
              <AnnotationList
                targetId={
                  selectedEntityIds[0] || 
                  selectedEventIds[0] || 
                  selectedLocationIds[0]
                }
                targetType={
                  selectedEntityIds.length > 0 ? 'entity' :
                  selectedEventIds.length > 0 ? 'event' : 'location'
                }
              />
            </div>
          )
        ) : (
          <EmptyStateView />
        )}
      </div>
    </div>
  );
}