"use client";

import { useRef, useEffect } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  onEscape?: () => void;
}

const FocusTrap: React.FC<FocusTrapProps> = ({ children, active, onEscape }) => {
  const trapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!active) return;
    
    const trapElement = trapRef.current;
    if (!trapElement) return;
    
    // Find all focusable elements
    const focusableElements = trapElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Focus the first element
    firstElement.focus();
    
    // Handle tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }
      
      if (e.key !== 'Tab') return;
      
      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    trapElement.addEventListener('keydown', handleKeyDown);
    
    // Save previous active element
    const previousActiveElement = document.activeElement as HTMLElement;
    
    return () => {
      trapElement.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus when unmounted
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [active, onEscape]);
  
  return (
    <div ref={trapRef} className="focus-trap">
      {children}
    </div>
  );
};

export default FocusTrap;
