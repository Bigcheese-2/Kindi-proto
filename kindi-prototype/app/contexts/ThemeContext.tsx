"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'custom';

export interface ThemePreferences {
  mode: ThemeMode;
  accentColor: AccentColor;
  customAccentColor?: string;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface ThemeContextType {
  theme: ThemePreferences;
  currentMode: 'light' | 'dark'; // Resolved mode (accounting for system preference)
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setCustomAccentColor: (color: string) => void;
  toggleHighContrast: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  resetToDefaults: () => void;
}

// Default theme preferences
const defaultThemePreferences: ThemePreferences = {
  mode: 'system',
  accentColor: 'blue',
  highContrast: false,
  fontSize: 'medium'
};

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemePreferences>(() => {
    // Load saved preferences using preference service
    if (typeof window !== 'undefined') {
      try {
        const preferenceService = require('@/app/lib/preferences/preferenceService').PreferenceService.getInstance();
        return preferenceService.getPreference('themePreferences', defaultThemePreferences);
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      }
    }
    return defaultThemePreferences;
  });
  
  // Determine current mode based on system preference
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>(
    theme.mode === 'system' && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.mode as 'light' | 'dark'
  );
  
  // Update theme preferences
  const updateTheme = (updates: Partial<ThemePreferences>) => {
    setTheme(prev => {
      const newTheme = { ...prev, ...updates };
      
      // Save using preference service
      if (typeof window !== 'undefined') {
        try {
          const preferenceService = require('@/app/lib/preferences/preferenceService').PreferenceService.getInstance();
          preferenceService.savePreference('themePreferences', newTheme);
        } catch (error) {
          console.error('Error saving theme preferences:', error);
        }
      }
      
      return newTheme;
    });
  };
  
  // Listen for system theme changes
  useEffect(() => {
    if (theme.mode === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentMode(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      setCurrentMode(theme.mode as 'light' | 'dark');
    }
  }, [theme.mode]);
  
  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Apply theme class to document
      document.documentElement.classList.remove('theme-light', 'theme-dark');
      document.documentElement.classList.add(`theme-${currentMode}`);
      
      // Apply high contrast if enabled
      if (theme.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
      // Apply font size
      document.documentElement.classList.remove('font-small', 'font-medium', 'font-large');
      document.documentElement.classList.add(`font-${theme.fontSize}`);
      
      // Apply accent color
      document.documentElement.style.setProperty(
        '--accent-color',
        theme.accentColor === 'custom' && theme.customAccentColor
          ? theme.customAccentColor
          : `var(--${theme.accentColor})`
      );
    }
  }, [currentMode, theme]);
  
  // Create context value
  const contextValue = useMemo<ThemeContextType>(() => ({
    theme,
    currentMode,
    setThemeMode: (mode) => updateTheme({ mode }),
    setAccentColor: (accentColor) => updateTheme({ accentColor }),
    setCustomAccentColor: (customAccentColor) => 
      updateTheme({ accentColor: 'custom', customAccentColor }),
    toggleHighContrast: () => updateTheme({ highContrast: !theme.highContrast }),
    setFontSize: (fontSize) => updateTheme({ fontSize }),
    resetToDefaults: () => updateTheme(defaultThemePreferences)
  }), [theme, currentMode]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
