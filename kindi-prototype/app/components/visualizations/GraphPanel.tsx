'use client';

import React, { useCallback, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import { useSelection } from '../../contexts/SelectionContext';
import GraphComponent from './graph/GraphComponent';
import GraphControls from './graph/GraphControls';
import GraphLegend from './graph/GraphLegend';
import ExportButton from '../core/export/ExportButton';

export default function GraphPanel() {
  const { currentDataset, isLoading, error } = useData();
  const { selectedEntityIds, selectEntity } = useSelection();
  const graphRef = useRef<any>();

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

  if (isLoading) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Network Graph</h2>
        </div>
        <div className="flex-1 bg-primary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-neutral-medium">Loading graph data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Network Graph</h2>
        </div>
        <div className="flex-1 bg-primary flex items-center justify-center">
          <div className="text-center">
            <div className="text-error mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-neutral-medium">Error loading graph: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDataset || !currentDataset.entities || !currentDataset.relationships) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Network Graph</h2>
        </div>
        <div className="flex-1 bg-primary flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-accent mx-auto mb-4"
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
            <p className="text-neutral-medium">Load a dataset to view the network graph</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Network Graph</h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-neutral-medium">
            {currentDataset.entities.length} entities, {currentDataset.relationships.length}{' '}
            relationships
          </div>
          <ExportButton
            exportType="graph"
            elementRef={graphRef}
            className="p-1 rounded hover:bg-gray-600"
            buttonText={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="flex-1 relative bg-primary">
        <GraphComponent
          ref={graphRef}
          entities={currentDataset.entities}
          relationships={currentDataset.relationships}
          selectedEntityIds={selectedEntityIds}
          onNodeClick={handleNodeClick}
          className="h-full"
        />

        {/* Graph Controls */}
        <GraphControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onFitToView={handleFitToView}
          className="absolute top-4 left-4 z-10"
        />

        {/* Graph Legend */}
        <GraphLegend className="absolute bottom-4 left-4 z-10 max-w-xs" />
      </div>
    </div>
  );
}
