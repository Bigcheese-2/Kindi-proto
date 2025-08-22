import {
  Entity,
  Relationship,
  Event,
  GeoLocation,
  Dataset,
  EntityType,
  EventType,
} from '../../../models/data-types';
import { transformForGraph } from '../transformers/graphTransformer';
import { transformForTimeline } from '../transformers/timelineTransformer';
import { transformForMap } from '../transformers/mapTransformer';

export interface DataAccessLayer {
  // Raw data access
  getEntities(): Entity[];
  getRelationships(): Relationship[];
  getEvents(): Event[];
  getLocations(): GeoLocation[];

  // Transformed data for visualizations
  getGraphData(entityTypes?: EntityType[]): any;
  getTimelineData(timeRange?: { start?: Date; end?: Date }): any;
  getMapData(bounds?: any): any;

  // Statistics and metadata
  getStatistics(): any;
  getDatasetInfo(): any;
}

/**
 * Creates a unified data access layer for efficient querying
 * @param dataset The dataset to create access layer for
 * @returns Data access layer instance
 */
export const createDataAccessLayer = (dataset: Dataset): DataAccessLayer => {
  return {
    // Raw data access
    getEntities: () => dataset.entities,
    getRelationships: () => dataset.relationships,
    getEvents: () => dataset.events,
    getLocations: () => dataset.locations,

    // Transformed data for visualizations
    getGraphData: (entityTypes?: EntityType[]) => {
      const entities = entityTypes
        ? dataset.entities.filter(e => entityTypes.includes(e.type))
        : dataset.entities;

      const relationships = entityTypes
        ? dataset.relationships.filter(r => {
            const sourceEntity = dataset.entities.find(e => e.id === r.source);
            const targetEntity = dataset.entities.find(e => e.id === r.target);
            return (
              sourceEntity &&
              targetEntity &&
              entityTypes.includes(sourceEntity.type) &&
              entityTypes.includes(targetEntity.type)
            );
          })
        : dataset.relationships;

      return transformForGraph(entities, relationships);
    },

    getTimelineData: (timeRange?: { start?: Date; end?: Date }) => {
      let events = dataset.events;

      if (timeRange) {
        events = events.filter(event => {
          const eventTime = new Date(event.time);
          const afterStart = !timeRange.start || eventTime >= timeRange.start;
          const beforeEnd = !timeRange.end || eventTime <= timeRange.end;
          return afterStart && beforeEnd;
        });
      }

      return transformForTimeline(events);
    },

    getMapData: (bounds?: any) => {
      let locations = dataset.locations;

      if (bounds) {
        locations = locations.filter(
          location =>
            location.latitude >= bounds.south &&
            location.latitude <= bounds.north &&
            location.longitude >= bounds.west &&
            location.longitude <= bounds.east
        );
      }

      return transformForMap(locations, dataset.entities);
    },

    // Statistics and metadata
    getStatistics: () => {
      const entityStats = new Map<EntityType, number>();
      dataset.entities.forEach(entity => {
        entityStats.set(entity.type, (entityStats.get(entity.type) || 0) + 1);
      });

      const eventStats = new Map<EventType, number>();
      dataset.events.forEach(event => {
        eventStats.set(event.type, (eventStats.get(event.type) || 0) + 1);
      });

      return {
        totalEntities: dataset.entities.length,
        totalRelationships: dataset.relationships.length,
        totalEvents: dataset.events.length,
        totalLocations: dataset.locations.length,
        entityTypeDistribution: Object.fromEntries(entityStats),
        eventTypeDistribution: Object.fromEntries(eventStats),
      };
    },

    getDatasetInfo: () => ({
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      metadata: dataset.metadata,
      createdAt: dataset.createdAt,
      updatedAt: dataset.updatedAt,
    }),
  };
};



