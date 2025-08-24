"use client";

import { SearchResult, SearchResults as SearchResultsType } from '@/app/lib/search/searchService';

interface SearchResultItemProps {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}

function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
  // Icon based on result type
  const getIcon = () => {
    switch (result.type) {
      case 'entity':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'event':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'location':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <li>
      <button
        className="w-full text-left px-4 py-2 hover:bg-[#2A2F36] focus:outline-none focus:bg-[#2A2F36]"
        onClick={() => onSelect(result)}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-[#2A2F36] rounded-full flex items-center justify-center mr-3">
            {getIcon()}
          </div>
          <div>
            <div className="text-neutral-light font-medium">{result.title}</div>
            {result.subtitle && (
              <div className="text-xs text-neutral-medium">{result.subtitle}</div>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}

interface SearchResultsProps {
  results: SearchResultsType;
  onSelectResult: (result: SearchResult) => void;
  isLoading?: boolean;
}

export default function SearchResults({
  results,
  onSelectResult,
  isLoading = false
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
        <p className="mt-2 text-neutral-medium">Searching...</p>
      </div>
    );
  }
  
  if (results.totalCount === 0) {
    return (
      <div className="p-4 text-center text-neutral-medium">
        No results found
      </div>
    );
  }
  
  return (
    <div className="search-results">
      {results.entities.length > 0 && (
        <div className="result-category">
          <h3 className="text-xs font-medium text-neutral-medium uppercase px-4 py-2 border-b border-[#2A2F36]">
            Entities ({results.entities.length})
          </h3>
          <ul className="divide-y divide-gray-800">
            {results.entities.map(result => (
              <SearchResultItem
                key={result.id}
                result={result}
                onSelect={onSelectResult}
              />
            ))}
          </ul>
        </div>
      )}
      
      {results.events.length > 0 && (
        <div className="result-category mt-2">
          <h3 className="text-xs font-medium text-neutral-medium uppercase px-4 py-2 border-b border-[#2A2F36]">
            Events ({results.events.length})
          </h3>
          <ul className="divide-y divide-gray-800">
            {results.events.map(result => (
              <SearchResultItem
                key={result.id}
                result={result}
                onSelect={onSelectResult}
              />
            ))}
          </ul>
        </div>
      )}
      
      {results.locations.length > 0 && (
        <div className="result-category mt-2">
          <h3 className="text-xs font-medium text-neutral-medium uppercase px-4 py-2 border-b border-[#2A2F36]">
            Locations ({results.locations.length})
          </h3>
          <ul className="divide-y divide-gray-800">
            {results.locations.map(result => (
              <SearchResultItem
                key={result.id}
                result={result}
                onSelect={onSelectResult}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
