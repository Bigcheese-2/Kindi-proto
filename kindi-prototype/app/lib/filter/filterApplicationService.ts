import { Dataset, Entity, Event, GeoLocation, EntityType } from '@/app/models/data-types';
import { Filter, EntityTypeFilter, TimeRangeFilter, GeographicFilter } from '@/app/contexts/FilterContext';

/**
 * Service for applying filters to dataset in real-time
 * Ensures all visualization panels get consistently filtered data
 */

export interface FilteredDataset {
  entities: Entity[];
  relationships: any[];
  events: Event[];
  locations: GeoLocation[];
}

/**
 * Apply entity type filter to entities
 */
export const applyEntityTypeFilter = (entities: Entity[], filter: EntityTypeFilter): Entity[] => {
  return entities.filter(entity => filter.entityTypes.includes(entity.type));
};

/**
 * Apply time range filter to events
 */
export const applyTimeRangeFilter = (events: Event[], filter: TimeRangeFilter): Event[] => {
  const startTime = filter.startTime ? new Date(filter.startTime) : null;
  const endTime = filter.endTime ? new Date(filter.endTime) : null;

  return events.filter(event => {
    const eventTime = new Date(event.time);
    
    // Check if event is within time range
    if (startTime && eventTime < startTime) return false;
    if (endTime && eventTime > endTime) return false;
    
    return true;
  });
};

/**
 * Apply geographic filter to locations
 */
export const applyGeographicFilter = (locations: GeoLocation[], filter: GeographicFilter): GeoLocation[] => {
  const { region } = filter;
  
  return locations.filter(location => {
    if (region.type === 'bounds' && region.bounds) {
      const { north, south, east, west } = region.bounds;
      return (
        location.latitude >= south &&
        location.latitude <= north &&
        location.longitude >= west &&
        location.longitude <= east
      );
    } else if (region.type === 'radius' && region.center && region.radiusKm) {
      // Calculate distance using Haversine formula
      const { latitude: centerLat, longitude: centerLng } = region.center;
      const R = 6371; // Earth's radius in kilometers
      
      const dLat = (location.latitude - centerLat) * Math.PI / 180;
      const dLng = (location.longitude - centerLng) * Math.PI / 180;
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(centerLat * Math.PI / 180) * Math.cos(location.latitude * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return distance <= region.radiusKm;
    }
    
    return true;
  });
};

/**
 * Filter entities based on related events and locations
 * This ensures entity filtering when time/geographic filters are applied
 */
export const filterEntitiesByRelatedData = (
  entities: Entity[], 
  filteredEvents: Event[], 
  filteredLocations: GeoLocation[]
): Entity[] => {
  const eventEntityIds = new Set(filteredEvents.flatMap(event => event.entityIds || []));
  const locationEntityIds = new Set(
    filteredLocations.flatMap(location => 
      entities
        .filter(entity => entity.attributes?.locationId === location.id)
        .map(entity => entity.id)
    )
  );
  
  // Keep entities that are either:
  // 1. Involved in filtered events, or
  // 2. Located at filtered locations
  const relevantEntityIds = new Set([...eventEntityIds, ...locationEntityIds]);
  
  return entities.filter(entity => relevantEntityIds.has(entity.id));
};

/**
 * Filter relationships based on filtered entities
 */
export const filterRelationshipsByEntities = (relationships: any[], filteredEntities: Entity[]): any[] => {
  const entityIds = new Set(filteredEntities.map(entity => entity.id));
  
  return relationships.filter(rel => 
    entityIds.has(rel.source) && entityIds.has(rel.target)
  );
};

/**
 * Main function to apply all active filters to a dataset
 * Returns a consistently filtered dataset for all visualization panels
 */
export const applyFiltersToDataset = (dataset: Dataset | null, filters: Filter[]): FilteredDataset => {
  if (!dataset) {
    return {
      entities: [],
      relationships: [],
      events: [],
      locations: []
    };
  }

  let filteredEntities = [...dataset.entities];
  let filteredEvents = [...dataset.events];
  let filteredLocations = [...dataset.locations];

  // Apply each filter
  filters.forEach(filter => {
    switch (filter.type) {
      case 'entityType':
        filteredEntities = applyEntityTypeFilter(filteredEntities, filter as EntityTypeFilter);
        break;
      
      case 'timeRange':
        filteredEvents = applyTimeRangeFilter(filteredEvents, filter as TimeRangeFilter);
        break;
      
      case 'geographic':
        filteredLocations = applyGeographicFilter(filteredLocations, filter as GeographicFilter);
        break;
    }
  });

  // Cross-filter entities based on filtered events and locations
  // This ensures that when you filter by time/location, only relevant entities show
  if (filters.some(f => f.type === 'timeRange' || f.type === 'geographic')) {
    filteredEntities = filterEntitiesByRelatedData(filteredEntities, filteredEvents, filteredLocations);
  }

  // Filter relationships to only include those between filtered entities
  const filteredRelationships = filterRelationshipsByEntities(dataset.relationships, filteredEntities);

  return {
    entities: filteredEntities,
    relationships: filteredRelationships,
    events: filteredEvents,
    locations: filteredLocations
  };
};

/**
 * Get filter summary for debugging and user feedback
 */
export const getFilterSummary = (filters: Filter[]): string => {
  if (filters.length === 0) return 'No filters applied';
  
  const summaries = filters.map(filter => {
    switch (filter.type) {
      case 'entityType':
        const entityFilter = filter as EntityTypeFilter;
        return `Entity types: ${entityFilter.entityTypes.join(', ')}`;
      
      case 'timeRange':
        const timeFilter = filter as TimeRangeFilter;
        const start = timeFilter.startTime ? new Date(timeFilter.startTime).toLocaleDateString() : 'any';
        const end = timeFilter.endTime ? new Date(timeFilter.endTime).toLocaleDateString() : 'any';
        return `Time: ${start} - ${end}`;
      
      case 'geographic':
        const geoFilter = filter as GeographicFilter;
        if (geoFilter.region.type === 'bounds') {
          return 'Geographic: Bounded area';
        } else {
          return `Geographic: ${geoFilter.region.radiusKm}km radius`;
        }
      
      default:
        return `${filter.type} filter`;
    }
  });
  
  return summaries.join('; ');
};
