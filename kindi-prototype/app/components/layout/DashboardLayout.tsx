"use client";

import { useUI } from '@/app/contexts/UIContext';
import ControlPanel from './ControlPanel';
import GraphPanel from '../visualizations/GraphPanel';
import TimelinePanel from '../visualizations/TimelinePanel';
import MapPanel from '../visualizations/MapPanel';
import InspectorPanel from './InspectorPanel';
import { useEffect, useState } from 'react';
import ResizablePanel from '../core/ResizablePanel';
import '../core/resizable.css';

export default function DashboardLayout() {
  const { controlPanelVisible, panelSizes, setPanelSize } = useUI();
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle panel resize
  const handlePanelResize = (panelId: string, size: number) => {
    setPanelSize(panelId, size);
    
    // Store panel sizes in session storage
    const storedSizes = JSON.parse(sessionStorage.getItem('panelSizes') || '{}');
    sessionStorage.setItem('panelSizes', JSON.stringify({
      ...storedSizes,
      [panelId]: size,
    }));
  };

  // Load panel sizes from session storage on mount
  useEffect(() => {
    const storedSizes = JSON.parse(sessionStorage.getItem('panelSizes') || '{}');
    if (storedSizes.graphPanel) setPanelSize('graphPanel', storedSizes.graphPanel);
    if (storedSizes.timelinePanel) setPanelSize('timelinePanel', storedSizes.timelinePanel);
    if (storedSizes.inspectorPanel) setPanelSize('inspectorPanel', storedSizes.inspectorPanel);
  }, [setPanelSize]);

  return (
    <div className="flex h-full">
      {controlPanelVisible && (
        <div className="w-64 h-full border-r border-secondary">
          <ControlPanel />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          // Mobile layout - stack panels vertically
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="h-[calc(50vh-2rem)]">
              <GraphPanel />
            </div>
            <div className="h-[calc(25vh-2rem)] border-t border-secondary">
              <InspectorPanel />
            </div>
            <div className="h-[calc(25vh-2rem)] border-t border-secondary">
              <TimelinePanel />
            </div>
          </div>
        ) : (
          // Desktop layout - 2x2 grid with left side taking 60%
          <div className="grid grid-cols-5 grid-rows-2 h-full">
            {/* Network Graph - takes 60% width (3/5), full height */}
            <div className="col-span-3 row-span-2 border-r border-secondary">
              <GraphPanel />
            </div>
            
            {/* Geographic View - takes 40% width (2/5), 50% height */}
            <div className="col-span-2 row-span-1 border-b border-secondary">
              <MapPanel />
            </div>
            
            {/* Timeline Analysis - takes 40% width (2/5), 50% height */}
            <div className="col-span-2 row-span-1">
              <TimelinePanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}