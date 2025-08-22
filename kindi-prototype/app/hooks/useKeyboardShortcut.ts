"use client";

import { useEffect } from 'react';
import { useKeyboard, KeyboardShortcut } from '@/app/contexts/KeyboardContext';

/**
 * Hook for registering a keyboard shortcut
 * 
 * @param shortcut The keyboard shortcut configuration
 */
export function useKeyboardShortcut(shortcut: Omit<KeyboardShortcut, 'id'> & { id?: string }) {
  const { registerShortcut, unregisterShortcut } = useKeyboard();
  
  useEffect(() => {
    // Generate a unique ID if not provided
    const id = shortcut.id || `shortcut-${Math.random().toString(36).substring(2, 9)}`;
    
    // Register the shortcut
    registerShortcut({
      ...shortcut,
      id
    });
    
    // Unregister the shortcut when the component unmounts
    return () => {
      unregisterShortcut(id);
    };
  }, [shortcut, registerShortcut, unregisterShortcut]);
}

/**
 * Hook for registering multiple keyboard shortcuts
 * 
 * @param shortcuts Array of keyboard shortcut configurations
 */
export function useKeyboardShortcuts(
  shortcuts: Array<Omit<KeyboardShortcut, 'id'> & { id?: string }>
) {
  const { registerShortcut, unregisterShortcut } = useKeyboard();
  
  useEffect(() => {
    // Generate unique IDs and register shortcuts
    const shortcutIds = shortcuts.map(shortcut => {
      const id = shortcut.id || `shortcut-${Math.random().toString(36).substring(2, 9)}`;
      
      registerShortcut({
        ...shortcut,
        id
      });
      
      return id;
    });
    
    // Unregister all shortcuts when the component unmounts
    return () => {
      shortcutIds.forEach(id => {
        unregisterShortcut(id);
      });
    };
  }, [shortcuts, registerShortcut, unregisterShortcut]);
}
