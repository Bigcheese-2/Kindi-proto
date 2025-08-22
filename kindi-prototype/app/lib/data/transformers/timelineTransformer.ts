import { Event, EventType } from '../../../models/data-types';

export interface TimelineItem {
  id: string;
  content: string;
  title: string;
  start: Date;
  end?: Date;
  group: string;
  className: string;
  itemProps: {
    entities: string[];
    location?: string;
    attributes?: any;
  };
}

export interface TimelineGroup {
  id: string;
  content: string;
  className: string;
}

export interface TimelineData {
  items: TimelineItem[];
  groups: TimelineGroup[];
}

/**
 * Get display label for event type
 * @param eventType The event type
 * @returns Human-readable label
 */
export const getEventTypeLabel = (eventType: EventType): string => {
  const labelMap: Record<EventType, string> = {
    [EventType.MEETING]: 'Meetings',
    [EventType.COMMUNICATION]: 'Communications',
    [EventType.TRANSACTION]: 'Transactions',
    [EventType.TRAVEL]: 'Travel',
    [EventType.INCIDENT]: 'Incidents',
    [EventType.CUSTOM]: 'Other Events',
  };
  return labelMap[eventType] || labelMap[EventType.CUSTOM];
};

/**
 * Transform events to timeline items
 * @param events Array of events
 * @returns Array of timeline items
 */
export const transformEventsToTimelineItems = (events: Event[]): TimelineItem[] => {
  return events.map(event => ({
    id: event.id,
    content: event.title,
    title: event.description || event.title, // For tooltip
    start: new Date(event.time),
    end: event.endTime ? new Date(event.endTime) : undefined,
    group: event.type,
    className: `event-type-${event.type.toLowerCase()}`,
    itemProps: {
      entities: event.entities,
      location: event.location,
      attributes: event.attributes,
    },
  }));
};

/**
 * Create timeline groups from event types
 * @param eventTypes Array of event types present in the data
 * @returns Array of timeline groups
 */
export const createTimelineGroups = (eventTypes: EventType[]): TimelineGroup[] => {
  return eventTypes.map(type => ({
    id: type,
    content: getEventTypeLabel(type),
    className: `group-type-${type.toLowerCase()}`,
  }));
};

/**
 * Transform events to timeline data format
 * @param events Array of events
 * @returns Timeline data object for vis-timeline
 */
export const transformForTimeline = (events: Event[]): TimelineData => {
  const uniqueEventTypes = Array.from(new Set(events.map(event => event.type)));

  return {
    items: transformEventsToTimelineItems(events),
    groups: createTimelineGroups(uniqueEventTypes),
  };
};

