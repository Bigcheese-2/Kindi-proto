'use client';

import React, { useEffect, useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data/peer';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import { Event } from '@/app/models/data-types';
import './timeline-custom.css';

interface TimelineComponentProps {
  events: Event[];
  onEventClick?: (eventId: string) => void;
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ events, onEventClick }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstance = useRef<Timeline | null>(null);

  // Helper function to ensure dates are properly formatted
  const ensureValidDate = (dateStr: string): Date => {
    try {
      // If it's just a date (YYYY-MM-DD), add time
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(`${dateStr}T00:00:00Z`);
      }
      
      // Otherwise try to parse it normally
      const date = new Date(dateStr);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date: ${dateStr}, using current date instead`);
        return new Date(); // Fallback to current date if invalid
      }
      
      return date;
    } catch (e) {
      console.warn(`Error parsing date: ${dateStr}`, e);
      return new Date(); // Fallback to current date on error
    }
  };

  useEffect(() => {
    if (!timelineRef.current || !events || events.length === 0) return;

    // Clean up any existing instance
    if (timelineInstance.current) {
      timelineInstance.current.destroy();
    }

    try {
      // Prepare data for the timeline with proper date handling
      const items = events.map(event => {
        // Ensure valid dates
        const start = ensureValidDate(event.time);
        const end = event.endTime ? ensureValidDate(event.endTime) : undefined;
        
        // Format the date to display on the right side (DD/MM/YYYY) - matching image format
        const dateObj = new Date(event.time);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        
        // Create HTML content with the date on the right side
        const content = `
          <div class="timeline-item-content">
            <div class="timeline-item-title">${event.title}</div>
            <div class="timeline-item-description">${event.description || ''}</div>
            <div class="timeline-item-date">${formattedDate}</div>
          </div>
        `;
        
        return {
          id: event.id,
          content: content,
          start: start,
          end: end,
          className: `event-type-${event.type.toLowerCase()}`,
          title: event.description || event.title, // Tooltip on hover
        };
      });

      // No grouping - all events in one list
      
      // Create dataset (without groups)
      const itemsDataSet = new DataSet(items);

      // Configuration options for the timeline
      const options = {
        stack: true, // Stack items to prevent overlap
        width: '100%',
        height: '100%',
        margin: {
          item: 20, // More vertical space between items
          axis: 5,
        },
        orientation: {
          axis: 'top',
        },
        showCurrentTime: false, // Hide current time indicator
        zoomable: false, // Disable zooming to maintain visibility of all events
        moveable: false, // Disable moving/panning to keep all events visible
        editable: false,
        
        // Format date/time labels at top to match the mockup
        format: {
          minorLabels: {
            day: '',        // Hide day labels
            month: 'MMM',   // Short month name (Jan, Feb, etc.)
            year: 'YYYY'    // Full year
          },
          majorLabels: {
            day: 'MMM',     // Show month above days
            month: '',      // Don't show anything above months
            year: ''        // Don't show anything above years
          }
        },
        
        // Allow full range to show all events
        // start and end are not set so timeline will show all events
      };

      // Create a new timeline instance (without groups)
      timelineInstance.current = new Timeline(timelineRef.current, itemsDataSet, options as any);

      // Add event listener for clicks with error handling
      if (onEventClick) {
        timelineInstance.current.on('select', function(properties) {
          try {
            if (properties.items && properties.items.length > 0) {
              onEventClick(properties.items[0] as string);
            }
          } catch (err) {
            console.error('Error handling event click:', err);
          }
        });
      }

      // Prevent auto-fit which can cause NaN errors
      setTimeout(() => {
        if (timelineInstance.current) {
          // Fit all items at once
          timelineInstance.current.fit({animation: false});
        }
      }, 100);
    } catch (err) {
      console.error('Error initializing timeline:', err);
    }

    return () => {
      // Clean up the timeline instance on component unmount
      if (timelineInstance.current) {
        try {
          timelineInstance.current.destroy();
          timelineInstance.current = null;
        } catch (err) {
          console.error('Error destroying timeline:', err);
        }
      }
    };
  }, [events, onEventClick]);

  // No group labels needed

  return <div ref={timelineRef} className="h-full w-full" />;
};

export default TimelineComponent;