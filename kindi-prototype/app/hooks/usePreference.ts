"use client";

import { useState, useEffect, useCallback } from 'react';
import { PreferenceService } from '@/app/lib/preferences/preferenceService';

/**
 * Hook for using a persistent preference
 * 
 * @param key The preference key
 * @param defaultValue The default value to use if the preference doesn't exist
 * @returns A tuple containing the preference value and a function to update it
 */
export function usePreference<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Get the preference service
  const preferenceService = PreferenceService.getInstance();
  
  // Initialize state with the current preference value
  const [value, setValue] = useState<T>(() => {
    return preferenceService.getPreference<T>(key, defaultValue);
  });
  
  // Update the preference when the value changes
  const updatePreference = useCallback((newValue: T) => {
    setValue(newValue);
    preferenceService.savePreference(key, newValue);
  }, [key, preferenceService]);
  
  // Listen for changes to the preference
  useEffect(() => {
    const handlePreferenceChange = (newValue: T) => {
      setValue(newValue);
    };
    
    preferenceService.addListener<T>(key, handlePreferenceChange);
    
    return () => {
      preferenceService.removeListener<T>(key, handlePreferenceChange);
    };
  }, [key, preferenceService]);
  
  return [value, updatePreference];
}

/**
 * Hook for using multiple preferences
 * 
 * @param preferences An object mapping preference keys to default values
 * @returns An object containing the preference values and a function to update them
 */
export function usePreferences<T extends Record<string, any>>(
  preferences: T
): [T, (key: keyof T, value: any) => void] {
  // Get the preference service
  const preferenceService = PreferenceService.getInstance();
  
  // Initialize state with the current preference values
  const [values, setValues] = useState<T>(() => {
    const initialValues = { ...preferences };
    
    // Load each preference
    Object.keys(preferences).forEach(key => {
      initialValues[key] = preferenceService.getPreference(key, preferences[key]);
    });
    
    return initialValues;
  });
  
  // Update a preference
  const updatePreference = useCallback((key: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
    preferenceService.savePreference(key.toString(), value);
  }, [preferenceService]);
  
  // Listen for changes to preferences
  useEffect(() => {
    const handleGlobalPreferenceChange = (changedKey: string, newValue: any) => {
      if (changedKey in preferences) {
        setValues(prev => ({ ...prev, [changedKey]: newValue }));
      }
    };
    
    preferenceService.addGlobalListener(handleGlobalPreferenceChange);
    
    return () => {
      preferenceService.removeGlobalListener(handleGlobalPreferenceChange);
    };
  }, [preferences, preferenceService]);
  
  return [values, updatePreference];
}
