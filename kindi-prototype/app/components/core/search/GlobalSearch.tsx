"use client";

import { useState, useEffect, useRef } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import SearchHistory from './SearchHistory';
import { useData } from '@/app/contexts/DataContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import { 
  SearchResult, 
  SearchResults as SearchResultsType,
  globalSearch 
} from '@/app/lib/search/searchService';
import { 
  getSearchHistory, 
  saveSearchToHistory, 
  clearSearchHistory,
  SearchHistoryItem 
} from '@/app/lib/search/searchHistory';

export default function GlobalSearch() {
  const { currentDataset } = useData();
  const { 
    selectEntity, 
    selectEvent, 
    selectLocation 
  } = useSelection();
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResultsType>({
    entities: [],
    events: [],
    locations: [],
    totalCount: 0
  });
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  
  // Load search history on mount
  useEffect(() => {
    const loadHistory = () => {
      const searchHistory = getSearchHistory();
      setHistory(searchHistory);
    };
    
    loadHistory();
    
    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadHistory();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Handle clicks outside of the search component to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearch = (searchQuery: string) => {
    if (!currentDataset) return;
    
    setQuery(searchQuery);
    setIsLoading(true);
    setShowResults(true);
    
    // Delay search for better UX
    setTimeout(() => {
      const searchResults = globalSearch(searchQuery, currentDataset);
      setResults(searchResults);
      setIsLoading(false);
      
      // Save to history if we got results or if it's a substantive query
      if (searchResults.totalCount > 0 || searchQuery.length > 2) {
        const updatedHistory = saveSearchToHistory(searchQuery);
        setHistory(updatedHistory);
      }
    }, 300);
  };
  
  const handleSelectResult = (result: SearchResult) => {
    switch (result.type) {
      case 'entity':
        selectEntity(result.id);
        break;
      case 'event':
        selectEvent(result.id);
        break;
      case 'location':
        selectLocation(result.id);
        break;
    }
    setShowResults(false);
  };
  
  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };
  
  return (
    <div className="relative" ref={searchContainerRef}>
      <SearchBar 
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      
      {showResults && (query || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-[#1A1E23] border border-[#2A2F36] rounded-md shadow-lg z-10">
          <SearchResults
            results={results}
            onSelectResult={handleSelectResult}
            isLoading={isLoading}
          />
        </div>
      )}
      
      {!showResults && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-[#1A1E23] border border-[#2A2F36] rounded-md shadow-lg z-10">
          <SearchHistory
            history={history}
            onSelectQuery={(query) => {
              handleSearch(query);
              // The search will show results, so we don't need to manually close here
            }}
            onClearHistory={handleClearHistory}
          />
        </div>
      )}
    </div>
  );
}
