import { Dataset, Entity, Event, GeoLocation } from '@/app/models/data-types';

// Search result types
export interface SearchResult {
  id: string;
  type: 'entity' | 'event' | 'location';
  title: string;
  subtitle?: string;
  matchedField: string;
  matchedText: string;
  score: number;
}

export interface SearchResults {
  entities: SearchResult[];
  events: SearchResult[];
  locations: SearchResult[];
  totalCount: number;
}

// Search options
export interface SearchOptions {
  caseSensitive?: boolean;
  fuzzyMatch?: boolean;
  maxResults?: number;
  searchFields?: {
    entityFields?: string[];
    eventFields?: string[];
    locationFields?: string[];
  };
}

// Default search options
export const defaultSearchOptions: SearchOptions = {
  caseSensitive: false,
  fuzzyMatch: true,
  maxResults: 50,
  searchFields: {
    entityFields: ['name', 'attributes.alias', 'attributes.description'],
    eventFields: ['title', 'description'],
    locationFields: ['name', 'address']
  }
};

/**
 * Simple fuzzy matching algorithm
 * Returns a score between 0 (no match) and 1 (exact match)
 */
export const fuzzyMatch = (query: string, text: string): number => {
  if (!text) return 0;
  
  // Normalize for case insensitive matching
  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  
  // Exact match gets highest score
  if (normalizedText === normalizedQuery) {
    return 1;
  }
  
  // Contains the whole query as substring
  if (normalizedText.includes(normalizedQuery)) {
    // Score based on how much of the text is matched
    return normalizedQuery.length / normalizedText.length * 0.9;
  }
  
  // Check for partial word matches
  const queryWords = normalizedQuery.split(/\s+/);
  let matchedWords = 0;
  
  for (const word of queryWords) {
    if (word.length > 1 && normalizedText.includes(word)) {
      matchedWords++;
    }
  }
  
  if (matchedWords > 0) {
    return matchedWords / queryWords.length * 0.7;
  }
  
  // Check for individual character matches
  let lastMatchIndex = -1;
  let matchCount = 0;
  
  for (let i = 0; i < normalizedQuery.length; i++) {
    const char = normalizedQuery[i];
    const index = normalizedText.indexOf(char, lastMatchIndex + 1);
    
    if (index > -1) {
      matchCount++;
      lastMatchIndex = index;
    }
  }
  
  if (matchCount > 0) {
    return matchCount / normalizedQuery.length * 0.5;
  }
  
  return 0;
};

/**
 * Search entities by name and attributes
 */
export const searchEntities = (
  query: string,
  entities: Entity[],
  options: SearchOptions = defaultSearchOptions
): SearchResult[] => {
  const results: SearchResult[] = [];
  const processedQuery = options.caseSensitive 
    ? query 
    : query.toLowerCase();
  
  // Get fields to search
  const searchFields = options.searchFields?.entityFields || ['name'];
  
  for (const entity of entities) {
    // Search in name
    if (searchFields.includes('name')) {
      const name = options.caseSensitive ? entity.name : entity.name.toLowerCase();
      
      if (options.fuzzyMatch) {
        const score = fuzzyMatch(processedQuery, name);
        if (score > 0.6) { // Threshold for fuzzy matching
          results.push({
            id: entity.id,
            type: 'entity',
            title: entity.name,
            subtitle: entity.type,
            matchedField: 'name',
            matchedText: entity.name,
            score
          });
          continue; // Skip further checks for this entity
        }
      } else if (name.includes(processedQuery)) {
        results.push({
          id: entity.id,
          type: 'entity',
          title: entity.name,
          subtitle: entity.type,
          matchedField: 'name',
          matchedText: entity.name,
          score: 1.0
        });
        continue; // Skip further checks for this entity
      }
    }
    
    // Search in attributes
    if (entity.attributes) {
      for (const [key, value] of Object.entries(entity.attributes)) {
        // Only search in string attributes
        if (typeof value === 'string') {
          const fieldName = `attributes.${key}`;
          
          // Check if this attribute should be searched
          if (searchFields.includes(fieldName)) {
            const attrValue = options.caseSensitive 
              ? value 
              : value.toLowerCase();
            
            if (options.fuzzyMatch) {
              const score = fuzzyMatch(processedQuery, attrValue);
              if (score > 0.6) { // Threshold for fuzzy matching
                results.push({
                  id: entity.id,
                  type: 'entity',
                  title: entity.name,
                  subtitle: `${key}: ${value}`,
                  matchedField: fieldName,
                  matchedText: value,
                  score: score * 0.9 // Slightly lower priority than name matches
                });
                break; // Skip further attribute checks for this entity
              }
            } else if (attrValue.includes(processedQuery)) {
              results.push({
                id: entity.id,
                type: 'entity',
                title: entity.name,
                subtitle: `${key}: ${value}`,
                matchedField: fieldName,
                matchedText: value,
                score: 0.9 // Slightly lower priority than name matches
              });
              break; // Skip further attribute checks for this entity
            }
          }
        }
      }
    }
  }
  
  // Sort results by score (descending)
  results.sort((a, b) => b.score - a.score);
  
  // Limit results if maxResults is specified
  if (options.maxResults && results.length > options.maxResults) {
    return results.slice(0, options.maxResults);
  }
  
  return results;
};

/**
 * Search events by title and description
 */
export const searchEvents = (
  query: string,
  events: Event[],
  options: SearchOptions = defaultSearchOptions
): SearchResult[] => {
  const results: SearchResult[] = [];
  const processedQuery = options.caseSensitive 
    ? query 
    : query.toLowerCase();
  
  // Get fields to search
  const searchFields = options.searchFields?.eventFields || ['title', 'description'];
  
  for (const event of events) {
    // Search in title
    if (searchFields.includes('title')) {
      const title = options.caseSensitive ? event.title : event.title.toLowerCase();
      
      if (options.fuzzyMatch) {
        const score = fuzzyMatch(processedQuery, title);
        if (score > 0.6) { // Threshold for fuzzy matching
          results.push({
            id: event.id,
            type: 'event',
            title: event.title,
            subtitle: new Date(event.time).toLocaleDateString(),
            matchedField: 'title',
            matchedText: event.title,
            score
          });
          continue; // Skip further checks for this event
        }
      } else if (title.includes(processedQuery)) {
        results.push({
          id: event.id,
          type: 'event',
          title: event.title,
          subtitle: new Date(event.time).toLocaleDateString(),
          matchedField: 'title',
          matchedText: event.title,
          score: 1.0
        });
        continue; // Skip further checks for this event
      }
    }
    
    // Search in description
    if (searchFields.includes('description') && event.description) {
      const description = options.caseSensitive 
        ? event.description 
        : event.description.toLowerCase();
      
      if (options.fuzzyMatch) {
        const score = fuzzyMatch(processedQuery, description);
        if (score > 0.6) { // Threshold for fuzzy matching
          results.push({
            id: event.id,
            type: 'event',
            title: event.title,
            subtitle: description.substring(0, 50) + (description.length > 50 ? '...' : ''),
            matchedField: 'description',
            matchedText: event.description,
            score: score * 0.9 // Slightly lower priority than title matches
          });
        }
      } else if (description.includes(processedQuery)) {
        results.push({
          id: event.id,
          type: 'event',
          title: event.title,
          subtitle: description.substring(0, 50) + (description.length > 50 ? '...' : ''),
          matchedField: 'description',
          matchedText: event.description,
          score: 0.9 // Slightly lower priority than title matches
        });
      }
    }
  }
  
  // Sort results by score (descending)
  results.sort((a, b) => b.score - a.score);
  
  // Limit results if maxResults is specified
  if (options.maxResults && results.length > options.maxResults) {
    return results.slice(0, options.maxResults);
  }
  
  return results;
};

/**
 * Search locations by name and address
 */
export const searchLocations = (
  query: string,
  locations: GeoLocation[],
  options: SearchOptions = defaultSearchOptions
): SearchResult[] => {
  const results: SearchResult[] = [];
  const processedQuery = options.caseSensitive 
    ? query 
    : query.toLowerCase();
  
  // Get fields to search
  const searchFields = options.searchFields?.locationFields || ['name', 'address'];
  
  for (const location of locations) {
    // Search in name
    if (searchFields.includes('name') && location.name) {
      const name = options.caseSensitive 
        ? location.name 
        : location.name.toLowerCase();
      
      if (options.fuzzyMatch) {
        const score = fuzzyMatch(processedQuery, name);
        if (score > 0.6) { // Threshold for fuzzy matching
          results.push({
            id: location.id,
            type: 'location',
            title: location.name || 'Unnamed location',
            subtitle: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
            matchedField: 'name',
            matchedText: location.name || '',
            score
          });
          continue; // Skip further checks for this location
        }
      } else if (name.includes(processedQuery)) {
        results.push({
          id: location.id,
          type: 'location',
          title: location.name,
          subtitle: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
          matchedField: 'name',
          matchedText: location.name,
          score: 1.0
        });
        continue; // Skip further checks for this location
      }
    }
    
    // Search in address
    if (searchFields.includes('address') && location.address) {
      const address = options.caseSensitive 
        ? location.address 
        : location.address.toLowerCase();
      
      if (options.fuzzyMatch) {
        const score = fuzzyMatch(processedQuery, address);
        if (score > 0.6) { // Threshold for fuzzy matching
          results.push({
            id: location.id,
            type: 'location',
            title: location.name || 'Unnamed location',
            subtitle: location.address,
            matchedField: 'address',
            matchedText: location.address,
            score: score * 0.9 // Slightly lower priority than name matches
          });
        }
      } else if (address.includes(processedQuery)) {
        results.push({
          id: location.id,
          type: 'location',
          title: location.name || 'Unnamed location',
          subtitle: location.address,
          matchedField: 'address',
          matchedText: location.address,
          score: 0.9 // Slightly lower priority than name matches
        });
      }
    }
  }
  
  // Sort results by score (descending)
  results.sort((a, b) => b.score - a.score);
  
  // Limit results if maxResults is specified
  if (options.maxResults && results.length > options.maxResults) {
    return results.slice(0, options.maxResults);
  }
  
  return results;
};

/**
 * Global search across all data dimensions
 */
export const globalSearch = (
  query: string,
  dataset: Dataset,
  options: SearchOptions = defaultSearchOptions
): SearchResults => {
  if (!query || query.trim() === '') {
    return {
      entities: [],
      events: [],
      locations: [],
      totalCount: 0
    };
  }
  
  // Search entities
  const entityResults = searchEntities(
    query,
    dataset.entities,
    options
  );
  
  // Search events
  const eventResults = searchEvents(
    query,
    dataset.events,
    options
  );
  
  // Search locations
  const locationResults = searchLocations(
    query,
    dataset.locations,
    options
  );
  
  // Calculate total count
  const totalCount = 
    entityResults.length + 
    eventResults.length + 
    locationResults.length;
  
  return {
    entities: entityResults,
    events: eventResults,
    locations: locationResults,
    totalCount
  };
};
