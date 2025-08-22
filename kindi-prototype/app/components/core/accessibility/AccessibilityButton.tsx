"use client";

import React, { useState } from 'react';
import AccessibilityDialog from './AccessibilityDialog';

interface AccessibilityButtonProps {
  className?: string;
  buttonText?: React.ReactNode;
}

const AccessibilityButton: React.FC<AccessibilityButtonProps> = ({
  className = '',
  buttonText = 'Accessibility'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <button
        className={`accessibility-button ${className}`}
        onClick={() => setIsDialogOpen(true)}
        aria-label="Open accessibility preferences"
      >
        {buttonText}
      </button>
      
      <AccessibilityDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default AccessibilityButton;
