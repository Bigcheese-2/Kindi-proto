import { Entity, EntityType, Relationship } from '../../../models/data-types';

export interface EntityIndex {
  byId: Map<string, Entity>;
  byType: Map<EntityType, Entity[]>;
  byName: Map<string, Entity[]>;
  relationships: Map<string, Relationship[]>;
}

/**
 * Creates comprehensive indexes for fast entity lookups
 * @param entities Array of entities to index
 * @param relationships Array of relationships to index by entity
 * @returns Entity index object with various lookup maps
 */
export const createEntityIndexes = (
  entities: Entity[],
  relationships: Relationship[] = []
): EntityIndex => {
  // Index by ID for O(1) lookups
  const byId = new Map<string, Entity>();

  // Index by type for filtered lookups
  const byType = new Map<EntityType, Entity[]>();

  // Index by name for search functionality
  const byName = new Map<string, Entity[]>();

  // Index relationships by entity ID
  const relationshipIndex = new Map<string, Relationship[]>();

  // Build entity indexes
  entities.forEach(entity => {
    // By ID index
    byId.set(entity.id, entity);

    // By type index
    if (!byType.has(entity.type)) {
      byType.set(entity.type, []);
    }
    byType.get(entity.type)!.push(entity);

    // By name index (normalized for search)
    const normalizedName = entity.name.toLowerCase().trim();
    if (!byName.has(normalizedName)) {
      byName.set(normalizedName, []);
    }
    byName.get(normalizedName)!.push(entity);

    // Initialize relationship index for this entity
    relationshipIndex.set(entity.id, []);
  });

  // Build relationship indexes
  relationships.forEach(relationship => {
    // Add to source entity's relationships
    if (relationshipIndex.has(relationship.source)) {
      relationshipIndex.get(relationship.source)!.push(relationship);
    }

    // Add to target entity's relationships (if different from source)
    if (relationship.source !== relationship.target && relationshipIndex.has(relationship.target)) {
      relationshipIndex.get(relationship.target)!.push(relationship);
    }
  });

  return {
    byId,
    byType,
    byName,
    relationships: relationshipIndex,
  };
};




