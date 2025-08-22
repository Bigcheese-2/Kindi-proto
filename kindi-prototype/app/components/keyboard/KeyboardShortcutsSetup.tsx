"use client";

import { useEffect } from 'react';
import { useKeyboard } from '@/app/contexts/KeyboardContext';

const KeyboardShortcutsSetup: React.FC = () => {
  const { registerShortcut } = useKeyboard();
  
  // Register default shortcuts
  useEffect(() => {
    // Navigation shortcuts
    registerShortcut({
      id: 'toggle-left-panel',
      keys: ['Alt', '['],
      description: 'Toggle left panel',
      action: () => {
        // Implementation would go here
        console.log('Toggle left panel');
      },
      category: 'navigation'
    });
    
    registerShortcut({
      id: 'toggle-right-panel',
      keys: ['Alt', ']'],
      description: 'Toggle right panel',
      action: () => {
        // Implementation would go here
        console.log('Toggle right panel');
      },
      category: 'navigation'
    });
    
    registerShortcut({
      id: 'toggle-bottom-panel',
      keys: ['Alt', '\\'],
      description: 'Toggle bottom panel',
      action: () => {
        // Implementation would go here
        console.log('Toggle bottom panel');
      },
      category: 'navigation'
    });
    
    // Tool shortcuts
    registerShortcut({
      id: 'search',
      keys: ['Ctrl', 'f'],
      description: 'Search',
      action: () => {
        // Implementation would go here
        console.log('Search');
      },
      category: 'tools'
    });
    
    registerShortcut({
      id: 'export',
      keys: ['Ctrl', 'e'],
      description: 'Export data',
      action: () => {
        // Implementation would go here
        console.log('Export data');
      },
      category: 'tools'
    });
    
    // Visualization shortcuts
    registerShortcut({
      id: 'zoom-in',
      keys: ['Ctrl', '='],
      description: 'Zoom in',
      action: () => {
        // Implementation would go here
        console.log('Zoom in');
      },
      category: 'visualization'
    });
    
    registerShortcut({
      id: 'zoom-out',
      keys: ['Ctrl', '-'],
      description: 'Zoom out',
      action: () => {
        // Implementation would go here
        console.log('Zoom out');
      },
      category: 'visualization'
    });
    
    registerShortcut({
      id: 'reset-view',
      keys: ['Ctrl', '0'],
      description: 'Reset view',
      action: () => {
        // Implementation would go here
        console.log('Reset view');
      },
      category: 'visualization'
    });
    
    // General shortcuts
    registerShortcut({
      id: 'settings',
      keys: ['Ctrl', ','],
      description: 'Open settings',
      action: () => {
        // Implementation would go here
        console.log('Open settings');
      },
      category: 'general'
    });
    
    registerShortcut({
      id: 'help',
      keys: ['F1'],
      description: 'Show help',
      action: () => {
        // Implementation would go here
        console.log('Show help');
      },
      category: 'general'
    });
  }, [registerShortcut]);
  
  // This component doesn't render anything
  return null;
};

export default KeyboardShortcutsSetup;
