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
    <div className={`flex flex-col space-y-1 bg-secondary rounded-md p-1 ${className}`}>
      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        className="p-1 hover:bg-primary rounded"
        title="Zoom In"
      >
        <svg className="h-4 w-4 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        className="p-1 hover:bg-primary rounded"
        title="Zoom Out"
      >
        <svg className="h-4 w-4 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
      </button>

      {/* Fit to View */}
      <button
        onClick={onFitToView}
        className="p-1 hover:bg-primary rounded"
        title="Fit to View"
      >
        <svg className="h-4 w-4 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        className="p-1 hover:bg-primary rounded"
        title="Reset View"
      >
        <svg className="h-4 w-4 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
