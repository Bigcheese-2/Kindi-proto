"use client";

import React, { useState, useEffect } from 'react';

// Define accessibility preferences
export interface AccessibilityPrefs {
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

// Default preferences
const defaultPrefs: AccessibilityPrefs = {
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: false
};

// Load preferences using preference service
const loadPreferences = (): AccessibilityPrefs => {
  if (typeof window === 'undefined') return defaultPrefs;
  
  try {
    const preferenceService = require('@/app/lib/preferences/preferenceService').PreferenceService.getInstance();
    return preferenceService.getPreference('accessibilityPreferences', defaultPrefs);
  } catch (error) {
    console.error('Error loading accessibility preferences:', error);
    return defaultPrefs;
  }
};

// Save preferences using preference service
const savePreferences = (prefs: AccessibilityPrefs): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const preferenceService = require('@/app/lib/preferences/preferenceService').PreferenceService.getInstance();
    preferenceService.savePreference('accessibilityPreferences', prefs);
  } catch (error) {
    console.error('Error saving accessibility preferences:', error);
  }
};

// Detect system preferences
const detectSystemPreferences = (): Partial<AccessibilityPrefs> => {
  const prefs: Partial<AccessibilityPrefs> = {};
  
  if (typeof window !== 'undefined') {
    // Detect reduced motion preference
    prefs.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  return prefs;
};

interface AccessibilityPreferencesProps {
  onClose?: () => void;
}

const AccessibilityPreferences: React.FC<AccessibilityPreferencesProps> = ({ onClose }) => {
  const [preferences, setPreferences] = useState<AccessibilityPrefs>(defaultPrefs);
  
  // Load preferences on mount
  useEffect(() => {
    const savedPrefs = loadPreferences();
    const systemPrefs = detectSystemPreferences();
    
    setPreferences({
      ...savedPrefs,
      ...systemPrefs
    });
  }, []);
  
  // Update a preference
  const updatePreference = (key: keyof AccessibilityPrefs, value: boolean) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: value };
      savePreferences(newPrefs);
      
      // Apply preferences to the document
      applyPreferences(newPrefs);
      
      return newPrefs;
    });
  };
  
  // Apply preferences to the document
  const applyPreferences = (prefs: AccessibilityPrefs) => {
    if (typeof document !== 'undefined') {
      // Apply reduced motion
      if (prefs.reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
      
      // Apply screen reader optimizations
      if (prefs.screenReader) {
        document.documentElement.classList.add('screen-reader-optimized');
      } else {
        document.documentElement.classList.remove('screen-reader-optimized');
      }
      
      // Apply keyboard navigation
      if (prefs.keyboardNavigation) {
        document.documentElement.classList.add('keyboard-navigation');
      } else {
        document.documentElement.classList.remove('keyboard-navigation');
      }
    }
  };
  
  // Apply preferences on mount and when preferences change
  useEffect(() => {
    applyPreferences(preferences);
  }, [preferences]);
  
  return (
    <div className="accessibility-preferences">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Accessibility Preferences</h2>
        {onClose && (
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="preference-item">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={e => updatePreference('reducedMotion', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Reduced Motion</span>
          </label>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            Minimize animations and transitions throughout the interface.
          </p>
        </div>
        
        <div className="preference-item">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.screenReader}
              onChange={e => updatePreference('screenReader', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Screen Reader Optimizations</span>
          </label>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            Enhance compatibility with screen readers and other assistive technologies.
          </p>
        </div>
        
        <div className="preference-item">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.keyboardNavigation}
              onChange={e => updatePreference('keyboardNavigation', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Enhanced Keyboard Navigation</span>
          </label>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            Improve focus indicators and keyboard shortcuts for navigating without a mouse.
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            const systemPrefs = detectSystemPreferences();
            const newPrefs = { ...defaultPrefs, ...systemPrefs };
            setPreferences(newPrefs);
            savePreferences(newPrefs);
            applyPreferences(newPrefs);
          }}
          className="px-4 py-2 text-red-600 hover:text-red-800"
        >
          Reset to System Defaults
        </button>
      </div>
    </div>
  );
};

export default AccessibilityPreferences;
