"use client";

import { ReactNode } from 'react';
import useResizePanel from '@/app/hooks/useResizePanel';

interface ResizablePanelProps {
  id: string;
  children: ReactNode;
  initialSize: number;
  minSize: number;
  maxSize: number;
  direction: 'horizontal' | 'vertical';
  onResize?: (id: string, size: number) => void;
  className?: string;
  style?: React.CSSProperties;
  resizeHandlePosition?: 'start' | 'end';
}

export default function ResizablePanel({
  id,
  children,
  initialSize,
  minSize,
  maxSize,
  direction,
  onResize,
  className = '',
  style = {},
  resizeHandlePosition = 'end',
}: ResizablePanelProps) {
  const { size, resizeHandleProps } = useResizePanel({
    panelId: id,
    initialSize,
    minSize,
    maxSize,
    direction,
    onResize,
  });

  // Determine panel size style based on direction
  const sizeStyle = direction === 'horizontal'
    ? { width: `${size}%` }
    : { height: `${size}%` };

  // Combine styles
  const combinedStyle = {
    ...style,
    ...sizeStyle,
    position: 'relative' as const,
  };

  // Determine resize handle position styles
  const handlePositionStyle = resizeHandlePosition === 'end'
    ? direction === 'horizontal'
      ? { right: '-4px' }
      : { bottom: '-4px' }
    : direction === 'horizontal'
      ? { left: '-4px' }
      : { top: '-4px' };

  // Combine resize handle styles
  const handleStyle = {
    ...resizeHandleProps.style,
    ...handlePositionStyle,
    position: 'absolute' as const,
    zIndex: 10,
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <div className={`resizable-panel ${className}`} style={combinedStyle}>
      {children}
      <div
        {...resizeHandleProps}
        style={handleStyle}
        className={`${resizeHandleProps.className} hover:bg-gray-300`}
      />
    </div>
  );
}
