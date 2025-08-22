"use client";

import React from 'react';
import { useKeyboard } from '@/app/contexts/KeyboardContext';

interface KeyboardShortcutsButtonProps {
  className?: string;
  buttonText?: React.ReactNode;
}

const KeyboardShortcutsButton: React.FC<KeyboardShortcutsButtonProps> = ({
  className = '',
  buttonText = 'Keyboard Shortcuts'
}) => {
  const { showShortcutsDialog } = useKeyboard();
  
  return (
    <button
      className={`keyboard-shortcuts-button ${className}`}
      onClick={showShortcutsDialog}
      aria-label="Show keyboard shortcuts"
    >
      {buttonText}
    </button>
  );
};

export default KeyboardShortcutsButton;
