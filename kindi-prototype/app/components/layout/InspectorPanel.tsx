"use client";

import { useState } from 'react';
import { useSelection } from '@/app/contexts/SelectionContext';
import { useUI } from '@/app/contexts/UIContext';
import EntityDetailView from '../inspector/EntityDetailView';
import EventDetailView from '../inspector/EventDetailView';
import LocationDetailView from '../inspector/LocationDetailView';
import EmptyStateView from '../inspector/EmptyStateView';
import AnnotationList from '../annotations/AnnotationList';
import AnnotationCreator from '../annotations/AnnotationCreator';

  
  export default function InspectorPanel() {
    const [activeTab, setActiveTab] = useState<'details' | 'annotations'>('details');
    const [isCreatingAnnotation, setIsCreatingAnnotation] = useState<boolean>(false);
    const { inspectorVisible, setInspectorVisible } = useUI();
    const { 
      selectedEntityIds, 
      selectedEventIds, 
      selectedLocationIds,
      clearSelection
    } = useSelection();
  
  // Mock selected item - in a real implementation, this would come from a selection context
  const selectedItem = {
    id: 'entity-001',
    type: 'entity' as const,
    name: 'Viktor Petrov',
    category: 'Person of Interest'
  };
  
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
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
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
      
      <div className="flex-1 overflow-y-auto">
        {getSelectedView() ? (
          <>
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
                <div>
                  <h3 className="text-neutral-light font-medium">Viktor Petrov</h3>
                  <div className="text-xs text-neutral-medium">Person of Interest</div>
                </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-neutral-light mb-2">RISK LEVEL</h4>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div className="h-full bg-warning rounded-full" style={{ width: '80%' }}></div>
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-warning font-medium">High</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-neutral-light mb-2">LAST ACTIVITY</h4>
                <div className="text-sm text-neutral-medium">Meeting with Alexei Kuznetsov - May 10, 2023</div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-neutral-light mb-2">ATTRIBUTES</h4>
                <div className="bg-primary rounded-md p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-neutral-medium">Age:</div>
                    <div className="text-neutral-light">42</div>
                    <div className="text-neutral-medium">Nationality:</div>
                    <div className="text-neutral-light">Russian</div>
                    <div className="text-neutral-medium">Occupation:</div>
                    <div className="text-neutral-light">Businessman</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-neutral-light mb-2">CONNECTIONS</h4>
                <div className="space-y-2">
                  <div className="bg-primary rounded-md p-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center mr-2">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="text-sm text-neutral-light">Global Solutions Ltd</span>
                    </div>
                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">Owns</span>
                  </div>
                  <div className="bg-primary rounded-md p-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center mr-2">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-sm text-neutral-light">Alexei Kuznetsov</span>
                    </div>
                    <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded">Knows</span>
                  </div>
                </div>
              </div>
          </>
        ) : (
          <div className="annotations-tab">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-secondary font-semibold text-neutral-light">Annotations</h2>
              
              {!isCreatingAnnotation && (
                <button
                  className="px-3 py-1 bg-accent text-white rounded-md hover:bg-blue-700 text-sm"
                  onClick={() => setIsCreatingAnnotation(true)}
                >
                  Add Annotation
                </button>
              )}
            </div>
            
            {isCreatingAnnotation ? (
              <div className="mb-6 bg-primary p-4 rounded-md">
                <h3 className="text-md font-medium text-neutral-light mb-3">New Annotation</h3>
                <AnnotationCreator
                  targetId={selectedItem.id}
                  targetType={selectedItem.type}
                  onComplete={() => setIsCreatingAnnotation(false)}
                />
              </div>
            ) : null}
            
            <AnnotationList
              targetId={selectedItem.id}
              targetType={selectedItem.type}
            />
          </div>
        )}
      </div>
    </div>
  );
}