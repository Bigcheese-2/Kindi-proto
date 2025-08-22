"use client";

import { useState } from 'react';
import AppHeader from './AppHeader';
import InspectorPanel from './InspectorPanel';
import NetworkGraphPanel from '../visualizations/NetworkGraphPanel';
import TimelinePanel from '../visualizations/TimelinePanel';
import MapPanel from '../visualizations/MapPanel';
import SkipLink from '../accessibility/SkipLink';
import { UIProvider } from '@/app/contexts/UIContext';
import { DataProvider } from '@/app/contexts/DataContext';
import { AnnotationProvider } from '@/app/contexts/AnnotationContext';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { KeyboardProvider } from '@/app/contexts/KeyboardContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [controlPanelVisible, setControlPanelVisible] = useState(false);
  
  return (
    <ThemeProvider>
      <KeyboardProvider>
        <UIProvider>
          <DataProvider>
            <AnnotationProvider>
              <div className="flex flex-col h-screen bg-primary text-neutral-light">
                <SkipLink />
                <AppHeader />
                
                <main id="main-content" className="flex-1 overflow-hidden relative">
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full p-4">
                    <div className="">
                      <NetworkGraphPanel />
                      <TimelinePanel />
                    </div>
                    
                      <div className="">
                        <MapPanel />
                        <InspectorPanel />

                    </div>
                    
              
                  </div>
                </main>
              </div>
            </AnnotationProvider>
          </DataProvider>
        </UIProvider>
      </KeyboardProvider>
    </ThemeProvider>
  );
}