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
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === date.toDateString();
    if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="search-history py-1.5 rounded-md overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#2A2F36]">
        <h3 className="text-sm font-semibold text-neutral-light uppercase tracking-wide">Recent Searches</h3>
        <button
          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          onClick={onClearHistory}
        >
          Clear All
        </button>
      </div>
      
      <ul className="divide-y divide-[#2A2F36]">
        {history.map(item => (
          <li key={item.id} className="flex items-center px-4 py-3 hover:bg-[#2A2F36] transition-colors duration-150">
            <button
              className="flex-grow text-left flex items-center"
              onClick={() => {
                onSelectQuery(item.query);
                // No need to manually close dropdown here - the parent will do it when running the search
              }}
            >
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-[#2A2F36] mr-3">
                <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-light">{item.query}</span>
                <span className="text-xs text-blue-400 mt-0.5">
                  {formatTime(item.timestamp)}
                </span>
              </div>
            </button>
            <button
              className="ml-2 p-1.5 text-neutral-medium hover:text-red-400 transition-colors duration-150 rounded-full hover:bg-[#374151]"
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
