"use client";

import { useUI } from '@/app/contexts/UIContext';
import ControlPanel from './ControlPanel';
import GraphPanel from '../visualizations/GraphPanel';
import TimelinePanel from '../visualizations/TimelinePanel';
import MapPanel from '../visualizations/MapPanel';
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
    if (storedSizes.mapPanel) setPanelSize('mapPanel', storedSizes.mapPanel);
    if (storedSizes.timelinePanel) setPanelSize('timelinePanel', storedSizes.timelinePanel);
  }, [setPanelSize]);

  return (
    <div className="flex h-full">
      {controlPanelVisible && <ControlPanel />}
      
      <div className="flex-1 p-4 overflow-hidden">
        {isMobile ? (
          // Mobile layout - stack panels vertically
          <div className="flex flex-col gap-4 h-full overflow-y-auto">
            <div className="h-[calc(33vh-2rem)]">
              <GraphPanel />
            </div>
            <div className="h-[calc(33vh-2rem)]">
              <MapPanel />
            </div>
            <div className="h-[calc(33vh-2rem)]">
              <TimelinePanel />
            </div>
          </div>
        ) : (
          // Desktop layout - grid layout with resizable panels
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
            <ResizablePanel
              id="graphPanel"
              initialSize={panelSizes.graphPanel}
              minSize={30}
              maxSize={70}
              direction="vertical"
              onResize={handlePanelResize}
              className="col-span-1 row-span-1"
            >
              <GraphPanel />
            </ResizablePanel>
            
            <ResizablePanel
              id="mapPanel"
              initialSize={panelSizes.mapPanel}
              minSize={30}
              maxSize={70}
              direction="vertical"
              onResize={handlePanelResize}
              className="col-span-1 row-span-1"
            >
              <MapPanel />
            </ResizablePanel>
            
            <ResizablePanel
              id="timelinePanel"
              initialSize={100 - Math.max(panelSizes.graphPanel, panelSizes.mapPanel)}
              minSize={20}
              maxSize={50}
              direction="vertical"
              onResize={handlePanelResize}
              resizeHandlePosition="start"
              className="col-span-2 row-span-1"
            >
              <TimelinePanel />
            </ResizablePanel>
          </div>
        )}
      </div>
    </div>
  );
}