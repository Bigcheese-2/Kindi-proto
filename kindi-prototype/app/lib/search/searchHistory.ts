export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

// Local storage key
const SEARCH_HISTORY_KEY = 'kindi_search_history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Save search query to history
 * @param query Search query string
 * @returns Updated search history
 */
export const saveSearchToHistory = (query: string): SearchHistoryItem[] => {
  // Generate unique ID for this search
  const id = `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create new history item
  const newItem: SearchHistoryItem = {
    id,
    query,
    timestamp: Date.now()
  };
  
  // Get existing history from local storage
  const existingHistory = getSearchHistory();
  
  // Check if this query already exists in history
  const existingIndex = existingHistory.findIndex(
    item => item.query.toLowerCase() === query.toLowerCase()
  );
  
  let updatedHistory: SearchHistoryItem[];
  
  if (existingIndex >= 0) {
    // Remove existing entry and add the updated one at the beginning
    updatedHistory = [
      newItem,
      ...existingHistory.slice(0, existingIndex),
      ...existingHistory.slice(existingIndex + 1)
    ];
  } else {
    // Add new item at the beginning
    updatedHistory = [newItem, ...existingHistory];
  }
  
  // Limit history to MAX_HISTORY_ITEMS items
  if (updatedHistory.length > MAX_HISTORY_ITEMS) {
    updatedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
  }
  
  // Save to local storage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error('Error saving search history:', error);
  }
  
  return updatedHistory;
};

/**
 * Get search history from local storage
 * @returns Array of search history items
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const history = localStorage.getItem(SEARCH_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    }
    return [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
};

/**
 * Clear search history
 */
export const clearSearchHistory = (): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    }
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

/**
 * Delete a specific search history item
 * @param id ID of the search history item to delete
 * @returns Updated search history
 */
export const deleteSearchHistoryItem = (id: string): SearchHistoryItem[] => {
  const existingHistory = getSearchHistory();
  const updatedHistory = existingHistory.filter(item => item.id !== id);
  
  // Save to local storage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error('Error saving search history:', error);
  }
  
  return updatedHistory;
};
