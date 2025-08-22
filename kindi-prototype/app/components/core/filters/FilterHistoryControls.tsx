"use client";

import React from 'react';

interface FilterHistoryControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

const FilterHistoryControls: React.FC<FilterHistoryControlsProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward
}) => {
  return (
    <div className="filter-history-controls flex space-x-1">
      <button
        className={`history-back-button p-1 rounded ${
          canGoBack 
            ? 'text-gray-700 hover:bg-gray-200' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
        onClick={onGoBack}
        disabled={!canGoBack}
        aria-label="Go back to previous filter"
        title="Undo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      <button
        className={`history-forward-button p-1 rounded ${
          canGoForward 
            ? 'text-gray-700 hover:bg-gray-200' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
        onClick={onGoForward}
        disabled={!canGoForward}
        aria-label="Go forward to next filter"
        title="Redo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default FilterHistoryControls;
