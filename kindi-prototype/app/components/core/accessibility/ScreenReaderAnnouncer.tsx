"use client";

import React, { useRef, useState, useEffect } from 'react';

interface ScreenReaderAnnouncerProps {
  politeness?: 'polite' | 'assertive';
}

// Create a global message queue
let messageQueue: { message: string; politeness: 'polite' | 'assertive' }[] = [];
let subscribers: ((message: string, politeness: 'polite' | 'assertive') => void)[] = [];

// Function to announce a message
export function announce(message: string, politeness: 'polite' | 'assertive' = 'polite') {
  messageQueue.push({ message, politeness });
  
  // Notify all subscribers
  subscribers.forEach(callback => {
    callback(message, politeness);
  });
}

const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  politeness = 'polite'
}) => {
  const [announcement, setAnnouncement] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Function to process the message queue
    const handleAnnouncement = (message: string, messagePoliteness: 'polite' | 'assertive') => {
      // Only process messages that match our politeness level
      if (messagePoliteness === politeness) {
        setAnnouncement(message);
        
        // Clear the announcement after a delay to ensure it's read
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setAnnouncement('');
        }, 3000);
      }
    };
    
    // Subscribe to announcements
    subscribers.push(handleAnnouncement);
    
    // Process any existing messages in the queue
    messageQueue = messageQueue.filter(item => {
      if (item.politeness === politeness) {
        handleAnnouncement(item.message, item.politeness);
        return false; // Remove from queue
      }
      return true; // Keep in queue
    });
    
    // Clean up
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      subscribers = subscribers.filter(sub => sub !== handleAnnouncement);
    };
  }, [politeness]);
  
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      role={politeness === 'assertive' ? 'alert' : 'status'}
    >
      {announcement}
    </div>
  );
};

export default ScreenReaderAnnouncer;
