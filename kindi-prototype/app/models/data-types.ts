// Entity Types
export enum EntityType {
  PERSON = 'person',
  ORGANIZATION = 'organization',
  OBJECT = 'object',
  LOCATION = 'location',
  DIGITAL = 'digital',
  CUSTOM = 'custom'
}

// Relationship Types
export enum RelationshipType {
  KNOWS = 'knows',
  OWNS = 'owns',
  LOCATED_AT = 'located_at',
  COMMUNICATES = 'communicates',
  TRAVELS_TO = 'travels_to',
  CUSTOM = 'custom'
}

// Event Types
export enum EventType {
  MEETING = 'meeting',
  COMMUNICATION = 'communication',
  TRANSACTION = 'transaction',
  TRAVEL = 'travel',
  INCIDENT = 'incident',
  CUSTOM = 'custom'
}

// Location Types
export enum LocationType {
  CITY = 'city',
  BUILDING = 'building',
  LANDMARK = 'landmark',
  REGION = 'region',
  CUSTOM = 'custom'
}

// Entity Interface
export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  attributes: Record<string, any>;
  risk?: number;
  metadata?: Record<string, any>;
}

// Relationship Interface
export interface Relationship {
  id: string;
  type: RelationshipType;
  source: string; // Entity ID
  target: string; // Entity ID
  directed: boolean;
  strength?: number;
  startTime?: string; // ISO date string
  endTime?: string; // ISO date string
  attributes?: Record<string, any>;
}

// GeoLocation Interface
export interface GeoLocation {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  type?: LocationType;
  address?: string;
  attributes?: Record<string, any>;
}

// Event Interface
export interface Event {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  time: string; // ISO date string
  endTime?: string; // ISO date string for duration events
  location?: GeoLocation;
  entities: string[]; // Array of Entity IDs
  attributes?: Record<string, any>;
}

// Dataset Interface
export interface Dataset {
  id: string;
  name: string;
  description?: string;
  entities: Entity[];
  relationships: Relationship[];
  events: Event[];
  locations: GeoLocation[];
  metadata?: Record<string, any>;
}

// Dataset Info Interface (for dataset selection)
export interface DatasetInfo {
  id: string;
  name: string;
  description?: string;
  entitiesCount: number;
  relationshipsCount: number;
  eventsCount: number;
  locationsCount: number;
  lastUpdated?: string; // ISO date string
}

// Data Service Interface
export interface DataService {
  getDatasets(): Promise<DatasetInfo[]>;
  loadDataset(id: string): Promise<Dataset>;
}
