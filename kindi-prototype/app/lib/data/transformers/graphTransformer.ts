import { Entity, Relationship, EntityType } from '../../../models/data-types';

export interface GraphNode {
  id: string;
  name: string;
  type: EntityType;
  val: number;
  color: string;
  attributes?: any;
  metadata?: any;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  directed: boolean;
  strength: number;
  attributes?: any;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Get color for entity type
 * @param entityType The entity type
 * @returns CSS color string
 */
export const getColorForEntityType = (entityType: EntityType): string => {
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

/**
 * Transform entities to graph nodes
 * @param entities Array of entities
 * @returns Array of graph nodes
 */
export const transformEntitiesToNodes = (entities: Entity[]): GraphNode[] => {
  return entities.map(entity => ({
    id: entity.id,
    name: entity.name,
    type: entity.type,
    val: entity.risk || 1, // Use risk for node size if available
    color: getColorForEntityType(entity.type),
    attributes: entity.attributes,
    metadata: entity.metadata,
  }));
};

/**
 * Transform relationships to graph links
 * @param relationships Array of relationships
 * @returns Array of graph links
 */
export const transformRelationshipsToLinks = (relationships: Relationship[]): GraphLink[] => {
  return relationships.map(rel => ({
    source: rel.source,
    target: rel.target,
    type: rel.type,
    directed: rel.directed,
    strength: rel.strength || 1,
    attributes: rel.attributes,
  }));
};

/**
 * Transform entities and relationships to graph data format
 * @param entities Array of entities
 * @param relationships Array of relationships
 * @returns Graph data object for react-force-graph
 */
export const transformForGraph = (entities: Entity[], relationships: Relationship[]): GraphData => {
  return {
    nodes: transformEntitiesToNodes(entities),
    links: transformRelationshipsToLinks(relationships),
  };
};

/**
 * Filter graph data to only include connected components
 * @param graphData Graph data to filter
 * @returns Filtered graph data with only connected nodes
 */
export const filterConnectedComponents = (graphData: GraphData): GraphData => {
  const connectedNodeIds = new Set<string>();

  // Add all nodes that have connections
  graphData.links.forEach(link => {
    connectedNodeIds.add(link.source);
    connectedNodeIds.add(link.target);
  });

  return {
    nodes: graphData.nodes.filter(node => connectedNodeIds.has(node.id)),
    links: graphData.links,
  };
};

/**
 * Create subgraph from selected entities
 * @param graphData Original graph data
 * @param selectedEntityIds Array of selected entity IDs
 * @param includeNeighbors Whether to include direct neighbors of selected entities
 * @returns Subgraph containing only selected entities and their connections
 */
export const createSubgraph = (
  graphData: GraphData,
  selectedEntityIds: string[],
  includeNeighbors: boolean = true
): GraphData => {
  const relevantNodeIds = new Set(selectedEntityIds);

  if (includeNeighbors) {
    // Add direct neighbors
    graphData.links.forEach(link => {
      if (selectedEntityIds.includes(link.source)) {
        relevantNodeIds.add(link.target);
      }
      if (selectedEntityIds.includes(link.target)) {
        relevantNodeIds.add(link.source);
      }
    });
  }

  return {
    nodes: graphData.nodes.filter(node => relevantNodeIds.has(node.id)),
    links: graphData.links.filter(
      link => relevantNodeIds.has(link.source) && relevantNodeIds.has(link.target)
    ),
  };
};

