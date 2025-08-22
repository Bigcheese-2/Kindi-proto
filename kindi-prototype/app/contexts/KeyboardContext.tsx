"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

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
export const KeyboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
        <KeyboardShortcutsDialog onClose={() => setShowDialog(false)} shortcuts={shortcuts} />
      )}
    </KeyboardContext.Provider>
  );
};

// Keyboard shortcuts dialog component
const KeyboardShortcutsDialog: React.FC<{ 
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}> = ({ onClose, shortcuts }) => {
  // Group shortcuts by category
  const shortcutsByCategory = shortcuts.reduce<Record<string, KeyboardShortcut[]>>(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {}
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
            <div key={category} className="shortcut-category">
              <h3 className="text-lg font-medium mb-2 capitalize">{category}</h3>
              
              <table className="w-full border-collapse">
                <tbody>
                  {shortcuts.map(shortcut => (
                    <tr key={shortcut.id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="py-2 pr-4">
                        <div className="shortcut-keys flex space-x-1">
                          {shortcut.keys.map((key, index) => (
                            <React.Fragment key={key}>
                              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm">
                                {key}
                              </kbd>
                              {index < shortcut.keys.length - 1 && (
                                <span className="flex items-center">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 pl-4">
                        {shortcut.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          
          {shortcuts.length === 0 && (
            <p className="text-center text-gray-500">
              No keyboard shortcuts registered.
            </p>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm">?</kbd> at any time to show this dialog.
          </p>
        </div>
      </div>
    </div>
  );
};

// Custom hook for using keyboard shortcuts
export const useKeyboard = (): KeyboardContextType => {
  const context = useContext(KeyboardContext);
  
  if (context === undefined) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  
  return context;
};
