'use client';

import React from 'react';

interface GraphControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onFitToView?: () => void;
  className?: string;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToView,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-2 bg-white rounded-lg shadow-md p-2 ${className}`}>
      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Zoom In"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Zoom Out"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
      </button>

      {/* Fit to View */}
      <button
        onClick={onFitToView}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Fit to View"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
          />
        </svg>
      </button>

      {/* Reset View */}
      <button
        onClick={onResetView}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Reset View"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </button>
    </div>
  );
};

export default GraphControls;
