'use client';

import React from 'react';

interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitBounds?: () => void;
  onToggleFullscreen?: () => void;
  onLayerChange?: (layer: 'street' | 'satellite' | 'terrain') => void;
  currentLayer?: string;
  className?: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitBounds,
  onToggleFullscreen,
  onLayerChange,
  currentLayer = 'street',
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-md p-2 flex flex-col space-y-1">
        <button
          onClick={onZoomIn}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
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
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Zoom Out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>

        <button
          onClick={onFitBounds}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
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

        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Toggle Fullscreen"
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

      {/* Layer Controls */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="text-xs font-semibold text-gray-700 mb-2">Map Type</div>
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => onLayerChange?.('street')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              currentLayer === 'street' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Street
          </button>
          <button
            onClick={() => onLayerChange?.('satellite')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              currentLayer === 'satellite' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => onLayerChange?.('terrain')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              currentLayer === 'terrain' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapControls;
