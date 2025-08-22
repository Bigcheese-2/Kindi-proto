'use client';

import React from 'react';

interface TimelineControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitToData?: () => void;
  onToday?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onTimePeriod?: (period: 'day' | 'week' | 'month' | 'year') => void;
  className?: string;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitToData,
  onToday,
  onPrevious,
  onNext,
  onTimePeriod,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-2 bg-white rounded-lg shadow-md p-2 ${className}`}>
      {/* Navigation Controls */}
      <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
        <button
          onClick={onPrevious}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Previous"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={onNext}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Next"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
        <button
          onClick={onZoomIn}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Zoom In"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>

        <button
          onClick={onZoomOut}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Zoom Out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>

        <button
          onClick={onFitToData}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Fit to Data"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
            />
          </svg>
        </button>
      </div>

      {/* Time Period Buttons */}
      <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
        <button
          onClick={() => onTimePeriod?.('day')}
          className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
        >
          Day
        </button>
        <button
          onClick={() => onTimePeriod?.('week')}
          className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
        >
          Week
        </button>
        <button
          onClick={() => onTimePeriod?.('month')}
          className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
        >
          Month
        </button>
        <button
          onClick={() => onTimePeriod?.('year')}
          className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
        >
          Year
        </button>
      </div>

      {/* Today Button */}
      <button
        onClick={onToday}
        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Today
      </button>
    </div>
  );
};

export default TimelineControls;
