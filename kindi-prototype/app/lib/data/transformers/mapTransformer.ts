import { GeoLocation, Entity, EntityType } from '../../../models/data-types';

export interface MarkerData {
  id: string;
  position: [number, number];
  name: string;
  type: string;
  address?: string;
  entities: string[];
  primaryEntityType: EntityType;
  attributes?: any;
}

export interface MapData {
  markers: MarkerData[];
}

/**
 * Transform locations to map markers
 * @param locations Array of locations
 * @param entities Array of entities to find related entities
 * @returns Array of marker data
 */
export const transformLocationsToMarkers = (
  locations: GeoLocation[],
  entities: Entity[]
): MarkerData[] => {
  return locations.map(location => {
    // Find entities associated with this location
    const relatedEntities = entities.filter(
      entity => entity.attributes?.locationId === location.id
    );

    return {
      id: location.id,
      position: [location.latitude, location.longitude],
      name: location.name || 'Unnamed Location',
      type: location.type || 'CUSTOM',
      address: location.address,
      entities: relatedEntities.map(e => e.id),
      primaryEntityType: relatedEntities[0]?.type || EntityType.LOCATION,
      attributes: location.attributes,
    };
  });
};

/**
 * Transform locations and entities to map data format
 * @param locations Array of locations
 * @param entities Array of entities
 * @returns Map data object for react-leaflet
 */
export const transformForMap = (locations: GeoLocation[], entities: Entity[]): MapData => {
  return {
    markers: transformLocationsToMarkers(locations, entities),
  };
};



