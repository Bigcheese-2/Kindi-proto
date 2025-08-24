'use client';

import { useState } from 'react';
import AppHeader from './AppHeader';
import InspectorPanel from './InspectorPanel';
import GraphPanel from '../visualizations/GraphPanel';
import TimelinePanel from '../visualizations/TimelinePanel';
import MapPanel from '../visualizations/MapPanel';
import { UIProvider } from '@/app/contexts/UIContext';
import { DataProvider } from '@/app/contexts/DataContext';
import { SelectionProvider } from '@/app/contexts/SelectionContext';
import { FilterProvider } from '@/app/contexts/FilterContext';
import { AnnotationProvider } from '@/app/contexts/AnnotationContext';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { KeyboardProvider } from '@/app/contexts/KeyboardContext';
import ControlPanel from './ControlPanel';
import SkipLink from '../core/accessibility/SkipLink';
import ScreenReaderAnnouncer from '../core/accessibility/ScreenReaderAnnouncer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <KeyboardProvider>
        <UIProvider>
          <DataProvider>
            <SelectionProvider>
              <FilterProvider>
                <AnnotationProvider>
                  <div className="flex flex-col h-screen bg-primary text-neutral-light">
                    <SkipLink targetId="main-content" />
                    <ScreenReaderAnnouncer politeness="polite" />
                    <ScreenReaderAnnouncer politeness="assertive" />

                    <AppHeader />

                    <main className="flex-1 overflow-auto relative" id="main-content">
                      <div className="flex h-full">
                        {/* Left sidebar - Control Panel */}
                        <div className="w-64 h-full border-r border-secondary">
                          <ControlPanel />
                        </div>

                        {/* Main content area */}
                        <div className="flex-1 flex">
                          {/* Main visualization area */}
                          <div className="flex-1 relative">
                            <div className="grid grid-cols-3 grid-rows-2 gap-0 h-full">
                              {/* Graph panel - top-left, largest (as per PRD) */}
                              <div className="col-span-2 row-span-1 border-r border-secondary border-b border-secondary">
                                <GraphPanel />
                              </div>

                              {/* Map panel - top-right (as per PRD) */}
                              <div className="col-span-1 row-span-1 border-b border-secondary">
                                <MapPanel />
                              </div>

                              {/* Timeline panel - bottom, spanning full width (as per PRD) */}
                              <div className="col-span-3 row-span-1">
                                <TimelinePanel />
                              </div>
                            </div>
                          </div>

                          {/* Inspector Panel - Right sidebar (no longer overlay) */}
                          <InspectorPanel />
                        </div>
                      </div>
                    </main>
                  </div>
                </AnnotationProvider>
              </FilterProvider>
            </SelectionProvider>
          </DataProvider>
        </UIProvider>
      </KeyboardProvider>
    </ThemeProvider>
  );
}
