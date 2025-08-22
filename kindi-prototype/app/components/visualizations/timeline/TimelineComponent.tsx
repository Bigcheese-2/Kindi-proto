'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Timeline, DataSet } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import { Event, EventType } from '../../../models/data-types';

interface TimelineItem {
  id: string;
  content: string;
  title: string;
  start: Date;
  end?: Date;
  group: string;
  className: string;
  type?: string;
}

interface TimelineGroup {
  id: string;
  content: string;
  className: string;
}

interface TimelineComponentProps {
  events: Event[];
  selectedEventIds?: string[];
  onEventClick?: (eventId: string) => void;
  onRangeChange?: (start: Date, end: Date) => void;
  className?: string;
}

// Get display label for event type
const getEventTypeLabel = (eventType: EventType): string => {
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

export const TimelineComponent: React.FC<TimelineComponentProps> = ({
  events,
  selectedEventIds = [],
  onEventClick,
  onRangeChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Transform events to timeline format
  const transformEvents = useCallback((): { items: TimelineItem[]; groups: TimelineGroup[] } => {
    const items: TimelineItem[] = events.map(event => ({
      id: event.id,
      content: event.title,
      title: event.description || event.title,
      start: new Date(event.time),
      end: event.endTime ? new Date(event.endTime) : undefined,
      group: event.type,
      className: `event-type-${event.type.toLowerCase()}`,
      type: event.endTime ? 'range' : 'point',
    }));

    const uniqueEventTypes = Array.from(new Set(events.map(event => event.type)));
    const groups: TimelineGroup[] = uniqueEventTypes.map(type => ({
      id: type,
      content: getEventTypeLabel(type),
      className: `group-type-${type.toLowerCase()}`,
    }));

    return { items, groups };
  }, [events]);

  // Initialize timeline
  useEffect(() => {
    if (!containerRef.current || timelineRef.current) return;

    const { items, groups } = transformEvents();

    const itemsDataSet = new DataSet(items);
    const groupsDataSet = new DataSet(groups);

    const options = {
      height: '100%',
      stack: true,
      showCurrentTime: true,
      zoomable: true,
      selectable: true,
      editable: false,
      margin: {
        item: 10,
        axis: 5,
      },
      orientation: 'top',
      groupOrder: 'content',
      tooltip: {
        followMouse: true,
        overflowMethod: 'cap',
      },
      format: {
        minorLabels: {
          millisecond: 'SSS',
          second: 's',
          minute: 'HH:mm',
          hour: 'HH:mm',
          weekday: 'ddd D',
          day: 'D',
          week: 'w',
          month: 'MMM',
          year: 'YYYY',
        },
        majorLabels: {
          millisecond: 'HH:mm:ss',
          second: 'D MMMM HH:mm',
          minute: 'ddd D MMMM',
          hour: 'ddd D MMMM',
          weekday: 'MMMM YYYY',
          day: 'MMMM YYYY',
          week: 'MMMM YYYY',
          month: 'YYYY',
          year: '',
        },
      },
    };

    const timeline = new Timeline(containerRef.current, itemsDataSet, groupsDataSet, options);

    // Event handlers
    timeline.on('select', properties => {
      if (properties.items.length > 0 && onEventClick) {
        onEventClick(properties.items[0]);
      }
    });

    timeline.on('rangechange', properties => {
      if (onRangeChange) {
        onRangeChange(new Date(properties.start), new Date(properties.end));
      }
    });

    timelineRef.current = timeline;
    setIsReady(true);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
        timelineRef.current = null;
      }
    };
  }, [transformEvents, onEventClick, onRangeChange]);

  // Update data when events change
  useEffect(() => {
    if (!timelineRef.current || !isReady) return;

    const { items, groups } = transformEvents();

    const itemsDataSet = new DataSet(items);
    const groupsDataSet = new DataSet(groups);

    timelineRef.current.setData({
      groups: groupsDataSet,
      items: itemsDataSet,
    });
  }, [events, transformEvents, isReady]);

  // Update selection when selectedEventIds change
  useEffect(() => {
    if (!timelineRef.current || !isReady) return;

    timelineRef.current.setSelection(selectedEventIds);
  }, [selectedEventIds, isReady]);

  return (
    <div className={`timeline-container h-full ${className}`}>
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: '200px' }} />

      <style jsx global>{`
        .timeline-container .vis-timeline {
          background: #1f2937;
          border: none;
          font-family:
            system-ui,
            -apple-system,
            sans-serif;
        }

        .timeline-container .vis-item {
          background: #4b5563;
          border: 1px solid #6b7280;
          color: #f9fafb;
          border-radius: 4px;
        }

        .timeline-container .vis-item.vis-selected {
          background: #ef4444;
          border-color: #dc2626;
        }

        .timeline-container .vis-item.event-type-meeting {
          background: #3b82f6;
          border-color: #2563eb;
        }

        .timeline-container .vis-item.event-type-communication {
          background: #10b981;
          border-color: #059669;
        }

        .timeline-container .vis-item.event-type-transaction {
          background: #f59e0b;
          border-color: #d97706;
        }

        .timeline-container .vis-item.event-type-travel {
          background: #8b5cf6;
          border-color: #7c3aed;
        }

        .timeline-container .vis-item.event-type-incident {
          background: #ef4444;
          border-color: #dc2626;
        }

        .timeline-container .vis-group-label {
          background: #374151;
          color: #f9fafb;
          border-right: 1px solid #4b5563;
        }

        .timeline-container .vis-time-axis {
          background: #374151;
          color: #d1d5db;
        }

        .timeline-container .vis-grid.vis-minor {
          border-color: #4b5563;
        }

        .timeline-container .vis-grid.vis-major {
          border-color: #6b7280;
        }

        .timeline-container .vis-current-time {
          background: #f59e0b;
        }
      `}</style>
    </div>
  );
};

export default TimelineComponent;
