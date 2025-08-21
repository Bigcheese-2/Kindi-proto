import { useState, useCallback, useEffect } from 'react';

interface UseResizePanelProps {
  panelId: string;
  initialSize: number;
  minSize: number;
  maxSize: number;
  direction: 'horizontal' | 'vertical';
  onResize?: (panelId: string, size: number) => void;
}

interface UseResizePanelReturn {
  size: number;
  isResizing: boolean;
  handleResizeStart: (e: React.MouseEvent | React.TouchEvent) => void;
  handleResizeEnd: () => void;
  resizeHandleProps: {
    className: string;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    style: React.CSSProperties;
  };
}

export default function useResizePanel({
  panelId,
  initialSize,
  minSize,
  maxSize,
  direction,
  onResize,
}: UseResizePanelProps): UseResizePanelReturn {
  const [size, setSize] = useState<number>(initialSize);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<number>(0);
  const [startSize, setStartSize] = useState<number>(initialSize);

  // Handle resize movement
  const handleResize = useCallback(
    (clientPos: number) => {
      if (!isResizing) return;

      const delta = direction === 'horizontal'
        ? clientPos - startPos
        : startPos - clientPos;
      
      const newSize = Math.max(minSize, Math.min(maxSize, startSize + delta));
      setSize(newSize);
      
      if (onResize) {
        onResize(panelId, newSize);
      }
    },
    [direction, isResizing, maxSize, minSize, onResize, panelId, startPos, startSize]
  );

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    const clientPos = 'touches' in e
      ? e.touches[0][direction === 'horizontal' ? 'clientX' : 'clientY']
      : e[direction === 'horizontal' ? 'clientX' : 'clientY'];
    
    setStartPos(clientPos);
    setStartSize(size);
    setIsResizing(true);
  }, [direction, size]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleResize(direction === 'horizontal' ? e.clientX : e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleResize(direction === 'horizontal' ? e.touches[0].clientX : e.touches[0].clientY);
    };

    const handleMouseUp = () => {
      handleResizeEnd();
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [direction, handleResize, handleResizeEnd, isResizing]);

  // Determine handle styles based on direction
  const handleStyle: React.CSSProperties = direction === 'horizontal'
    ? {
        cursor: 'col-resize',
        width: '8px',
        height: '100%',
      }
    : {
        cursor: 'row-resize',
        height: '8px',
        width: '100%',
      };

  // Create resize handle props
  const resizeHandleProps = {
    className: `resize-handle ${direction} ${isResizing ? 'active' : ''}`,
    onMouseDown: handleResizeStart,
    onTouchStart: handleResizeStart,
    style: handleStyle,
  };

  return {
    size,
    isResizing,
    handleResizeStart,
    handleResizeEnd,
    resizeHandleProps,
  };
}
