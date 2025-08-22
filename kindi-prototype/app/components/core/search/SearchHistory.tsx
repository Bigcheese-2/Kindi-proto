"use client";

import { SearchHistoryItem, deleteSearchHistoryItem } from '@/app/lib/search/searchHistory';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelectQuery: (query: string) => void;
  onClearHistory: () => void;
}

export default function SearchHistory({
  history,
  onSelectQuery,
  onClearHistory
}: SearchHistoryProps) {
  if (history.length === 0) {
    return null;
  }
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="search-history">
      <div className="flex justify-between items-center px-4 py-2">
        <h3 className="text-xs font-medium text-neutral-medium uppercase">Recent Searches</h3>
        <button
          className="text-xs text-neutral-medium hover:text-neutral-light"
          onClick={onClearHistory}
        >
          Clear All
        </button>
      </div>
      
      <ul className="divide-y divide-gray-800">
        {history.map(item => (
          <li key={item.id} className="flex items-center px-4 py-2 hover:bg-gray-700">
            <button
              className="flex-grow text-left flex items-center"
              onClick={() => onSelectQuery(item.query)}
            >
              <svg className="h-4 w-4 text-neutral-medium mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-neutral-light">{item.query}</span>
              <span className="ml-auto text-xs text-neutral-medium">
                {formatTime(item.timestamp)}
              </span>
            </button>
            <button
              className="ml-2 p-1 text-neutral-medium hover:text-neutral-light"
              onClick={() => deleteSearchHistoryItem(item.id)}
              aria-label="Delete search history item"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
