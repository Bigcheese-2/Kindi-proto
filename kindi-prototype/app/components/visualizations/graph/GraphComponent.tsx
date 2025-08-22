'use client';

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Entity, Relationship, EntityType } from '../../../models/data-types';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface GraphNode {
  id: string;
  name: string;
  type: EntityType;
  val: number;
  color: string;
  attributes?: any;
  metadata?: any;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  directed: boolean;
  strength: number;
  attributes?: any;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface GraphComponentProps {
  entities: Entity[];
  relationships: Relationship[];
  selectedEntityIds?: string[];
  onNodeClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphLink) => void;
  className?: string;
}

// Color mapping for entity types
const getColorForEntityType = (entityType: EntityType): string => {
  const colorMap: Record<EntityType, string> = {
    [EntityType.PERSON]: '#4285f4',
    [EntityType.ORGANIZATION]: '#34a853',
    [EntityType.LOCATION]: '#fbbc05',
    [EntityType.OBJECT]: '#ea4335',
    [EntityType.DIGITAL]: '#9c27b0',
    [EntityType.CUSTOM]: '#607d8b',
  };
  return colorMap[entityType] || colorMap[EntityType.CUSTOM];
};

export const GraphComponent: React.FC<GraphComponentProps> = ({
  entities,
  relationships,
  selectedEntityIds = [],
  onNodeClick,
  onLinkClick,
  className = '',
}) => {
  const fgRef = useRef<any>();
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  // Transform data to graph format
  const graphData = useMemo((): GraphData => {
    const nodes: GraphNode[] = entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      val: entity.risk || 1,
      color: getColorForEntityType(entity.type),
      attributes: entity.attributes,
      metadata: entity.metadata,
    }));

    const links: GraphLink[] = relationships.map(rel => ({
      source: rel.source,
      target: rel.target,
      type: rel.type,
      directed: rel.directed,
      strength: rel.strength || 1,
      attributes: rel.attributes,
    }));

    return { nodes, links };
  }, [entities, relationships]);

  // Handle node hover
  const handleNodeHover = useCallback(
    (node: GraphNode | null) => {
      if (!node) {
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
        return;
      }

      const neighbors = new Set();
      const links = new Set();

      graphData.links.forEach(link => {
        if (link.source === node.id || link.target === node.id) {
          neighbors.add(link.source);
          neighbors.add(link.target);
          links.add(link);
        }
      });

      setHighlightNodes(neighbors);
      setHighlightLinks(links);
    },
    [graphData.links]
  );

  // Handle node click
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (onNodeClick) {
        onNodeClick(node);
      }
    },
    [onNodeClick]
  );

  // Handle link click
  const handleLinkClick = useCallback(
    (link: GraphLink) => {
      if (onLinkClick) {
        onLinkClick(link);
      }
    },
    [onLinkClick]
  );

  // Node appearance
  const nodeCanvasObject = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D) => {
      const isHighlighted = highlightNodes.has(node.id);
      const isSelected = selectedEntityIds.includes(node.id);

      const nodeSize = node.val * 4 + (isSelected ? 4 : 0);
      const nodeColor = isSelected ? '#ff6b6b' : node.color;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Add border for highlighted/selected nodes
      if (isHighlighted || isSelected) {
        ctx.strokeStyle = isSelected ? '#ff6b6b' : '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw label
      const label = node.name;
      const fontSize = Math.max(nodeSize / 2, 8);
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';
      ctx.fillText(label, node.x || 0, (node.y || 0) + nodeSize + fontSize);
    },
    [highlightNodes, selectedEntityIds]
  );

  // Link appearance
  const linkCanvasObject = useCallback(
    (link: GraphLink, ctx: CanvasRenderingContext2D) => {
      const isHighlighted = highlightLinks.has(link);
      const linkWidth = isHighlighted ? 4 : Math.max(1, link.strength);
      const linkColor = isHighlighted ? '#ff6b6b' : '#999';

      ctx.strokeStyle = linkColor;
      ctx.lineWidth = linkWidth;
      ctx.setLineDash(link.directed ? [] : [5, 5]); // Dashed for undirected

      ctx.beginPath();
      ctx.moveTo(link.source.x || 0, link.source.y || 0);
      ctx.lineTo(link.target.x || 0, link.target.y || 0);
      ctx.stroke();

      // Draw arrow for directed relationships
      if (link.directed) {
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;

        const dx = (link.target.x || 0) - (link.source.x || 0);
        const dy = (link.target.y || 0) - (link.source.y || 0);
        const angle = Math.atan2(dy, dx);

        const targetX = link.target.x || 0;
        const targetY = link.target.y || 0;

        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
          targetX - arrowLength * Math.cos(angle - arrowAngle),
          targetY - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
          targetX - arrowLength * Math.cos(angle + arrowAngle),
          targetY - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
      }

      ctx.setLineDash([]); // Reset dash
    },
    [highlightLinks]
  );

  // Show loading state for SSR
  if (typeof window === 'undefined') {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={(node: GraphNode) => `${node.name} (${node.type})`}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        onNodeClick={handleNodeClick}
        onLinkClick={handleLinkClick}
        onNodeHover={handleNodeHover}
        linkHoverPrecision={10}
        nodePointerAreaPaint={(node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, node.val * 4 + 2, 0, 2 * Math.PI);
          ctx.fill();
        }}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTicks={100}
        warmupTicks={100}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        backgroundColor="#f8f9fa"
      />
    </div>
  );
};

export default GraphComponent;
