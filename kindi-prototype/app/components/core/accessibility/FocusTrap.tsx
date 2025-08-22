"use client";

import React, { useRef, useEffect } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  onEscape?: () => void;
}

const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  onEscape
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Save previous focus and focus the first focusable element
  useEffect(() => {
    if (active && document.activeElement instanceof HTMLElement) {
      previousFocusRef.current = document.activeElement;
    }
    
    if (active && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
    
    return () => {
      if (active && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active]);
  
  // Handle tab key to trap focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!active || !containerRef.current) return;
    
    // Handle escape key
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }
    
    // Handle tab key
    if (e.key === 'Tab') {
      const focusableElements = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled'));
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // Shift + Tab on first element should focus last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // Tab on last element should focus first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  return (
    <div 
      ref={containerRef} 
      onKeyDown={handleKeyDown}
      className="focus-trap"
    >
      {children}
    </div>
  );
};

export default FocusTrap;
