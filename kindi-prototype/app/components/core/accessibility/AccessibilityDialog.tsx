"use client";

import React from 'react';
import AccessibilityPreferences from './AccessibilityPreferences';
import FocusTrap from './FocusTrap';

interface AccessibilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityDialog: React.FC<AccessibilityDialogProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-dialog-title"
    >
      <FocusTrap active={isOpen} onEscape={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
          <div id="accessibility-dialog-title" className="sr-only">Accessibility Preferences</div>
          <AccessibilityPreferences onClose={onClose} />
        </div>
      </FocusTrap>
    </div>
  );
};

export default AccessibilityDialog;
