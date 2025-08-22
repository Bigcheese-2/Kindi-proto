"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import KeyboardShortcutsDialog from '../components/accessibility/KeyboardShortcutsDialog';

// Keyboard shortcut types
export interface KeyboardShortcut {
  id: string;
  keys: string[];
  description: string;
  action: () => void;
  category: 'navigation' | 'tools' | 'visualization' | 'data' | 'general';
}

// Keyboard context
interface KeyboardContextType {
  shortcuts: KeyboardShortcut[];
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (id: string) => void;
  showShortcutsDialog: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

// Keyboard provider component
export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  
  // Register a new shortcut
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts(prev => {
      // Remove any existing shortcut with the same ID
      const filtered = prev.filter(s => s.id !== shortcut.id);
      return [...filtered, shortcut];
    });
  }, []);
  
  // Unregister a shortcut
  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  }, []);
  
  // Show shortcuts dialog
  const showShortcutsDialog = useCallback(() => {
    setShowDialog(true);
  }, []);
  
  // Handle keyboard events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      // Check for help dialog shortcut (?)
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setShowDialog(true);
        return;
      }
      
      // Check for registered shortcuts
      for (const shortcut of shortcuts) {
        // Check if all keys in the shortcut are pressed
        const matchesShortcut = shortcut.keys.every(key => {
          if (key === 'Ctrl') return e.ctrlKey;
          if (key === 'Alt') return e.altKey;
          if (key === 'Shift') return e.shiftKey;
          if (key === 'Meta') return e.metaKey;
          return e.key === key;
        });
        
        if (matchesShortcut) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
  
  // Create context value
  const contextValue = useMemo<KeyboardContextType>(() => ({
    shortcuts,
    registerShortcut,
    unregisterShortcut,
    showShortcutsDialog
  }), [shortcuts, registerShortcut, unregisterShortcut, showShortcutsDialog]);
  
  return (
    <KeyboardContext.Provider value={contextValue}>
      {children}
      {showDialog && (
        <KeyboardShortcutsDialog onClose={() => setShowDialog(false)} />
      )}
    </KeyboardContext.Provider>
  );
};

// Custom hook for using keyboard shortcuts
export const useKeyboard = (): KeyboardContextType => {
  const context = useContext(KeyboardContext);
  
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  
  return context;
};
