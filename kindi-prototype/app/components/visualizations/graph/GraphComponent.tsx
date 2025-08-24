'use client';

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Entity, Relationship, EntityType } from '../../../models/data-types';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent animate-spin mb-2"></div>
        <p className="text-neutral-light text-sm">Loading graph visualization...</p>
      </div>
    </div>
  ),
});

interface GraphNode {
  id: string;
  name: string;
  type: EntityType;
  val: number;
  color: string;
  attributes?: any;
  metadata?: any;
  x?: number;
  y?: number;
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
    [EntityType.PERSON]: '#4285f4', // Blue
    [EntityType.ORGANIZATION]: '#34a853', // Green
    [EntityType.LOCATION]: '#fbbc05', // Yellow
    [EntityType.OBJECT]: '#ea4335', // Red
    [EntityType.DIGITAL]: '#9c27b0', // Purple
    [EntityType.CUSTOM]: '#607d8b', // Gray
  };
  return colorMap[entityType] || colorMap[EntityType.CUSTOM];
};

export const GraphComponent = React.forwardRef<any, GraphComponentProps>(
  (
    { entities, relationships, selectedEntityIds = [], onNodeClick, onLinkClick, className = '' },
    ref
  ) => {
    const fgRef = useRef<any>();

    // Expose the graph ref to parent component
    React.useImperativeHandle(ref, () => fgRef.current);
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [isClientSide, setIsClientSide] = useState(false);

    // Transform data to graph format (moved before useEffects that depend on it)
    const graphData = useMemo((): GraphData => {
      const nodes: GraphNode[] = entities.map((entity, index) => {
        // Create a compact, visible initial layout
        const totalNodes = entities.length;
        let x = 0,
          y = 0;

        if (totalNodes > 1) {
          if (totalNodes <= 3) {
            // For small numbers, use simple positioning with slight offset
            const positions = [
              { x: -10, y: -40 }, // Adjusted for offset positioning
              { x: -60, y: 60 },
              { x: 40, y: 60 },
            ];
            const pos = positions[index] || { x: -10, y: 10 }; // Default also has offset
            x = pos.x;
            y = pos.y;
          } else {
            // For larger groups, use a tighter circular layout with offset
            const angle = (index / totalNodes) * 2 * Math.PI;
            const radius = Math.min(80, totalNodes * 6); // Smaller, more compact radius
            x = Math.cos(angle) * radius - 10; // Slight left offset
            y = Math.sin(angle) * radius + 20; // Slight downward offset
          }
        } else {
          // Single node positioned with offset
          x = -10;
          y = 20;
        }

        return {
          id: entity.id,
          name: entity.name,
          type: entity.type,
          val: Math.max(1.5, entity.risk || 1.2), // Larger minimum size for better visibility
          color: getColorForEntityType(entity.type),
          attributes: entity.attributes,
          metadata: entity.metadata,
          x: x, // Compact initial position
          y: y,
        };
      });

      const links: GraphLink[] = relationships.map(rel => ({
        source: rel.source,
        target: rel.target,
        type: rel.type,
        directed: rel.directed,
        strength: Math.max(0.4, rel.strength || 0.7), // Even stronger link strength
        attributes: rel.attributes,
      }));

      return { nodes, links };
    }, [entities, relationships]);

    // This effect ensures we only render the graph on the client side
    useEffect(() => {
      setIsClientSide(true);
    }, []);

    // Position graph at top of container for immediate visibility
    useEffect(() => {
      if (!fgRef.current || !graphData.nodes.length) return;

      // Quick initial positioning for immediate visibility
      const timer = setTimeout(() => {
        if (fgRef.current) {
          // Get container dimensions to calculate top positioning
          const container = fgRef.current.getCanvas();
          if (container) {
            const containerWidth = container.width;
            const containerHeight = container.height;

            // Position at top center of container for immediate visibility
            const offsetX = 0; // Center horizontally
            const offsetY = -containerHeight * 0.25; // Position at top quarter of container

            // First, fit to view to show all nodes
            fgRef.current.zoomToFit(200, 40);

            // Then position at top for immediate visibility
            setTimeout(() => {
              if (fgRef.current) {
                fgRef.current.centerAt(offsetX, offsetY, 400);
                // Set good zoom level for visibility
                fgRef.current.zoom(1.3);
              }
            }, 100);
          }
        }
      }, 300); // Faster initial display

      return () => clearTimeout(timer);
    }, [graphData.nodes.length, isClientSide]);

    // Handle window resize to ensure the graph updates its dimensions and stays centered
    useEffect(() => {
      if (!fgRef.current) return;

      const handleResize = () => {
        if (fgRef.current) {
          // Force the graph to recalculate its dimensions
          const container = fgRef.current.renderer().domElement.parentElement;
          if (container) {
            fgRef.current.width(container.clientWidth);
            fgRef.current.height(container.clientHeight);

            // Re-position at the top after resize
            setTimeout(() => {
              if (fgRef.current) {
                const canvas = fgRef.current.getCanvas();
                if (canvas) {
                  const containerWidth = canvas.width;
                  const containerHeight = canvas.height;

                  // Position at top center of container
                  const offsetX = 0; // Center horizontally
                  const offsetY = -containerHeight * 0.25; // Position at top quarter

                  fgRef.current.zoomToFit(200, 30);
                  // Re-center at top after resize
                  setTimeout(() => {
                    if (fgRef.current) {
                      fgRef.current.centerAt(offsetX, offsetY, 250);
                    }
                  }, 100);
                }
              }
            }, 100);
          }
        }
      };

      window.addEventListener('resize', handleResize);

      // Initial call to set dimensions
      setTimeout(handleResize, 100);

      return () => window.removeEventListener('resize', handleResize);
    }, [isClientSide]);

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

        const nodeSize = node.val * 6 + (isSelected ? 6 : 2); // Even larger nodes for better visibility
        const nodeColor = isSelected ? '#ff6b6b' : node.color;

        // Draw outer glow for better visibility
        if (isSelected || isHighlighted) {
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, nodeSize + 4, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
        }

        // Draw node circle
        ctx.beginPath();
        ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Add border for all nodes for better definition
        ctx.strokeStyle = isSelected ? '#ff6b6b' : '#ffffff';
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.stroke();

        // Draw label with better visibility
        const label = node.name;
        const fontSize = Math.max(nodeSize / 2, 12); // Larger, more readable font
        ctx.font = `bold ${fontSize}px Arial`; // Bold font for better visibility
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add text shadow for better contrast
        ctx.fillStyle = '#000000';
        ctx.fillText(label, (node.x || 0) + 1, (node.y || 0) + nodeSize + fontSize + 1);

        ctx.fillStyle = '#FFFFFF'; // White text for maximum contrast
        ctx.fillText(label, node.x || 0, (node.y || 0) + nodeSize + fontSize);
      },
      [highlightNodes, selectedEntityIds]
    );

    // Link appearance
    const linkCanvasObject = useCallback(
      (link: GraphLink, ctx: CanvasRenderingContext2D) => {
        const isHighlighted = highlightLinks.has(link);
        const linkWidth = isHighlighted ? 3 : Math.max(1, link.strength);
        const linkColor = isHighlighted ? '#4299e1' : 'rgba(160, 174, 192, 0.6)'; // More subtle lines

        // Get source and target node positions (ensure they're centered)
        const sourceX = link.source.x || 0;
        const sourceY = link.source.y || 0;
        const targetX = link.target.x || 0;
        const targetY = link.target.y || 0;

        // Calculate distance and angle between nodes
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Get node sizes to calculate where link should start and end
        const sourceNode = graphData.nodes.find(n => n.id === link.source);
        const targetNode = graphData.nodes.find(n => n.id === link.target);
        const sourceRadius = sourceNode ? sourceNode.val * 5 : 15;
        const targetRadius = targetNode ? targetNode.val * 5 : 15;

        // Calculate start and end points (from edge of nodes, not center)
        const startX = sourceX + Math.cos(angle) * (sourceRadius + 2);
        const startY = sourceY + Math.sin(angle) * (sourceRadius + 2);
        const endX = targetX - Math.cos(angle) * (targetRadius + 2);
        const endY = targetY - Math.sin(angle) * (targetRadius + 2);

        // Draw the link line
        ctx.strokeStyle = linkColor;
        ctx.lineWidth = linkWidth;
        ctx.setLineDash(link.directed ? [] : [5, 5]); // Dashed for undirected

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw arrow for directed relationships
        if (link.directed && distance > sourceRadius + targetRadius + 10) {
          const arrowLength = 10;
          const arrowAngle = Math.PI / 6;

          // Position arrow slightly before the target node edge
          const arrowX = endX - Math.cos(angle) * 3;
          const arrowY = endY - Math.sin(angle) * 3;

          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - arrowLength * Math.cos(angle - arrowAngle),
            arrowY - arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - arrowLength * Math.cos(angle + arrowAngle),
            arrowY - arrowLength * Math.sin(angle + arrowAngle)
          );
          ctx.stroke();
        }

        ctx.setLineDash([]); // Reset dash
      },
      [highlightLinks, graphData.nodes]
    );

    // Show loading state for SSR or before client-side hydration is complete
    if (typeof window === 'undefined' || !isClientSide) {
      return (
        <div className={`flex items-center justify-center h-full ${className}`}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent animate-spin mb-2"></div>
            <p className="text-neutral-light text-sm">Initializing graph...</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative h-full w-full ${className}`}>
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
            const isSelected = selectedEntityIds.includes(node.id);
            const nodeSize = node.val * 6 + (isSelected ? 6 : 2);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x || 0, node.y || 0, nodeSize + 2, 0, 2 * Math.PI);
            ctx.fill();
          }}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          d3ForceStrength={{
            charge: -200,
            link: 1.0,
            center: 0.6,
            collision: 1,
            forceX: 0.05, // Weaker horizontal centering to allow offset
            forceY: 0.08, // Weaker vertical centering to allow offset
          }}
          cooldownTicks={150}
          warmupTicks={50}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          backgroundColor="#1A1E23" // Dark background to match the design
          width={undefined} // Let it fill the container width
          height={undefined} // Let it fill the container height
          showNavInfo={false} // Hide navigation info
          nodeRelSize={8} // Larger node sizing for better visibility
          linkDirectionalParticles={2} // Visual flow indicators for directed links
          linkDirectionalParticleSpeed={0.006}
        />
      </div>
    );
  }
);

GraphComponent.displayName = 'GraphComponent';

export default GraphComponent;
