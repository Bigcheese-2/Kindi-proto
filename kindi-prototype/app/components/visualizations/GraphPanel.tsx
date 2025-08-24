'use client';

import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useSelection } from '../../contexts/SelectionContext';
import { useFilters } from '../../contexts/FilterContext';
import { applyFiltersToDataset } from '../../lib/filter/filterApplicationService';
import GraphComponent from './graph/GraphComponent';
import GraphControls from './graph/GraphControls';
import GraphLegend from './graph/GraphLegend';
import ExportButton from '../core/export/ExportButton';

export default function GraphPanel() {
  const { currentDataset, isLoading, error } = useData();
  const { selectedEntityIds, selectEntity } = useSelection();
  const { filters } = useFilters();
  const graphRef = useRef<any>();
  const [expanded, setExpanded] = useState(false);

  // Apply filters to get filtered dataset
  const filteredDataset = useMemo(() => {
    return applyFiltersToDataset(currentDataset, filters);
  }, [currentDataset, filters]);

  const handleNodeClick = useCallback(
    (node: any) => {
      selectEntity(node.id);
    },
    [selectEntity]
  );

  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.5);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.5);
    }
  }, []);

  const handleResetView = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  }, []);

  const handleFitToView = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  }, []);
  
  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-secondary">
          <h2 className="text-neutral-light text-sm font-medium">Network Graph</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto mb-3"></div>
            <p className="text-neutral-medium text-sm">Loading graph data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-secondary">
          <h2 className="text-neutral-light text-sm font-medium">Network Graph</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-error mb-3">
              <svg className="w-10 h-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-neutral-medium text-sm">Error loading graph: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDataset || !currentDataset.entities || !currentDataset.relationships) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-secondary">
          <h2 className="text-neutral-light text-sm font-medium">Network Graph</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-accent mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="text-neutral-medium text-sm">Load a dataset to view the network graph</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have filtered data to display
  const hasFilteredData = filteredDataset.entities.length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-secondary">
        <div className="flex items-center space-x-2">
          <h2 className="text-neutral-light text-sm font-medium">Network Graph</h2>
          {filters.length > 0 && (
            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">
              {filteredDataset.entities.length} / {currentDataset.entities.length} entities
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="px-2 py-1 rounded text-xs bg-secondary text-neutral-light border border-secondary hover:border-accent transition-colors flex items-center"
            aria-label="Expand"
            onClick={toggleExpand}
          >
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            Expand
          </button>
          <ExportButton
            exportType="graph"
            elementRef={graphRef}
            className="px-2 py-1 rounded text-xs bg-accent text-white hover:bg-blue-700 transition-colors flex items-center"
            buttonText={
              <>
                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </>
            }
          />
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {!hasFilteredData && filters.length > 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="w-12 h-12 text-neutral-medium mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <p className="text-neutral-medium text-sm">No entities match the current filters</p>
              <p className="text-neutral-medium text-xs mt-1">Try adjusting your filter criteria</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <GraphComponent
              ref={graphRef}
              entities={filteredDataset.entities}
              relationships={filteredDataset.relationships}
              selectedEntityIds={selectedEntityIds}
              onNodeClick={handleNodeClick}
              className="h-full w-full"
            />
          </div>
        )}

        {/* Graph Controls */}
        <GraphControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onFitToView={handleFitToView}
          className="absolute top-3 left-3 z-10"
        />

        {/* Graph Legend */}
        <GraphLegend className="absolute bottom-3 right-3 z-10 max-w-xs" />
      </div>
    </div>
  );
}
