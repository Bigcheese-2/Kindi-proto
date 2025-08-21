"use client";

import { useState } from 'react';
import AppHeader from './AppHeader';
import InspectorPanel from './InspectorPanel';
import NetworkGraphPanel from '../visualizations/NetworkGraphPanel';
import TimelinePanel from '../visualizations/TimelinePanel';
import MapPanel from '../visualizations/MapPanel';
import { UIProvider } from '@/app/contexts/UIContext';
import { DataProvider } from '@/app/contexts/DataContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [controlPanelVisible, setControlPanelVisible] = useState(false);
  
  return (
    <UIProvider>
      <DataProvider>
        <div className="flex flex-col h-screen bg-primary text-neutral-light">
          <AppHeader />
          
          <main className="flex-1 overflow-hidden relative">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full p-4">
              <div className="col-span-1 row-span-1">
                <NetworkGraphPanel />
              </div>
              
              <div className="col-span-1 row-span-1 grid grid-rows-2 gap-4">
                <div className="row-span-1">
                  <MapPanel />
                </div>
                <div className="row-span-1">
                  <InspectorPanel />
                </div>
              </div>
              
              <div className="col-span-2 row-span-1">
                <TimelinePanel />
              </div>
            </div>
          </main>
        </div>
      </DataProvider>
    </UIProvider>
  );
}