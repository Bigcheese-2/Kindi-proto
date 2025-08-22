"use client";

import React from 'react';

interface SkipLinkProps {
  targetId: string;
  text?: string;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  text = 'Skip to main content',
  className = ''
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    
    if (target) {
      // Focus the target
      target.focus();
      
      // Add tabindex if not present to make it focusable
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
    }
  };
  
  return (
    <a
      href={`#${targetId}`}
      className={`skip-link fixed top-0 left-0 p-3 bg-accent text-white z-50 transform -translate-y-full focus:translate-y-0 transition-transform ${className}`}
      onClick={handleClick}
    >
      {text}
    </a>
  );
};

export default SkipLink;
