"use client";

/**
 * Service for managing user preferences
 */
export class PreferenceService {
  private static instance: PreferenceService;
  
  /**
   * Get the singleton instance of PreferenceService
   */
  public static getInstance(): PreferenceService {
    if (!PreferenceService.instance) {
      PreferenceService.instance = new PreferenceService();
    }
    
    return PreferenceService.instance;
  }
  
  /**
   * Save a preference value
   * 
   * @param key The preference key
   * @param value The preference value
   */
  public savePreference<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notifyListeners(key, value);
    } catch (error) {
      console.error(`Error saving preference "${key}":`, error);
    }
  }
  
  /**
   * Get a preference value
   * 
   * @param key The preference key
   * @param defaultValue The default value to return if the preference doesn't exist
   * @returns The preference value or the default value
   */
  public getPreference<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const value = localStorage.getItem(key);
      
      if (value === null) {
        return defaultValue;
      }
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting preference "${key}":`, error);
      return defaultValue;
    }
  }
  
  /**
   * Remove a preference
   * 
   * @param key The preference key
   */
  public removePreference(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
      this.notifyListeners(key, undefined);
    } catch (error) {
      console.error(`Error removing preference "${key}":`, error);
    }
  }
  
  /**
   * Clear all preferences
   */
  public clearAllPreferences(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.clear();
      this.notifyAllListeners();
    } catch (error) {
      console.error('Error clearing all preferences:', error);
    }
  }
  
  // Preference change listeners
  private listeners: Record<string, Array<(value: any) => void>> = {};
  private globalListeners: Array<(key: string, value: any) => void> = [];
  
  /**
   * Add a listener for a specific preference
   * 
   * @param key The preference key
   * @param listener The listener function
   */
  public addListener<T>(key: string, listener: (value: T) => void): void {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    
    this.listeners[key].push(listener);
  }
  
  /**
   * Remove a listener for a specific preference
   * 
   * @param key The preference key
   * @param listener The listener function to remove
   */
  public removeListener<T>(key: string, listener: (value: T) => void): void {
    if (!this.listeners[key]) return;
    
    this.listeners[key] = this.listeners[key].filter(l => l !== listener);
  }
  
  /**
   * Add a global listener that gets notified for all preference changes
   * 
   * @param listener The listener function
   */
  public addGlobalListener<T>(listener: (key: string, value: T) => void): void {
    this.globalListeners.push(listener);
  }
  
  /**
   * Remove a global listener
   * 
   * @param listener The listener function to remove
   */
  public removeGlobalListener<T>(listener: (key: string, value: T) => void): void {
    this.globalListeners = this.globalListeners.filter(l => l !== listener);
  }
  
  /**
   * Notify listeners about a preference change
   * 
   * @param key The preference key
   * @param value The new preference value
   */
  private notifyListeners<T>(key: string, value: T): void {
    // Notify specific listeners
    if (this.listeners[key]) {
      this.listeners[key].forEach(listener => {
        try {
          listener(value);
        } catch (error) {
          console.error(`Error in preference listener for "${key}":`, error);
        }
      });
    }
    
    // Notify global listeners
    this.globalListeners.forEach(listener => {
      try {
        listener(key, value);
      } catch (error) {
        console.error(`Error in global preference listener for "${key}":`, error);
      }
    });
  }
  
  /**
   * Notify all listeners about a potential change
   */
  private notifyAllListeners(): void {
    // Notify all specific listeners with null values
    Object.keys(this.listeners).forEach(key => {
      this.listeners[key].forEach(listener => {
        try {
          listener(null);
        } catch (error) {
          console.error(`Error in preference listener for "${key}":`, error);
        }
      });
    });
    
    // Notify global listeners with null values
    this.globalListeners.forEach(listener => {
      try {
        listener('all', null);
      } catch (error) {
        console.error('Error in global preference listener:', error);
      }
    });
  }
}
