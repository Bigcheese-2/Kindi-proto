"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type ViewType = 'default' | 'graph' | 'timeline' | 'map';

export interface UIContextType {
  panelSizes: {
    graphPanel: number; // Left panel (full height)
    timelinePanel: number; // Bottom Right panel size
    inspectorPanel: number; // Top Right panel size
  };
  setPanelSize: (panel: string, size: number) => void;
  inspectorVisible: boolean; // Right sidebar visibility
  setInspectorVisible: (visible: boolean) => void;
  controlPanelVisible: boolean; // Left sidebar visibility
  setControlPanelVisible: (visible: boolean) => void;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [panelSizes, setPanelSizes] = useState({
    graphPanel: 50, // Percentage of available space
    timelinePanel: 50, // Percentage of available space
    inspectorPanel: 50, // Percentage of available space
  });

  const [inspectorVisible, setInspectorVisible] = useState(false); // Collapsed by default per PRD
  const [controlPanelVisible, setControlPanelVisible] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('default');

  const setPanelSize = (panel: string, size: number) => {
    setPanelSizes(prev => ({
      ...prev,
      [panel]: size,
    }));
  };

  return (
    <UIContext.Provider
      value={{
        panelSizes,
        setPanelSize,
        inspectorVisible,
        setInspectorVisible,
        controlPanelVisible,
        setControlPanelVisible,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
