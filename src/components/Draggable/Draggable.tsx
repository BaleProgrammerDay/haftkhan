import React, { useState, useRef, useEffect, ReactNode } from "react";
import styles from "./Draggable.module.scss";

interface DraggableProps {
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  className?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  doubleClickDelay?: number;
  disabled?: boolean;
}

export const Draggable: React.FC<DraggableProps> = ({
  children,
  initialPosition = { x: 0, y: 0 },
  className = "",
  onDragStart,
  onDragEnd,
  onPositionChange,
  onClick,
  onDoubleClick,
  doubleClickDelay = 300,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [hasMoved, setHasMoved] = useState(false);

  const draggableRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const startPositionRef = useRef({ x: 0, y: 0 });
  const dragThreshold = 1; // Minimum pixels to move before considering it a drag

  // Double-click detection
  const clickTimeoutRef = useRef<number | null>(null);
  const [clickCount, setClickCount] = useState(0);

  // Mouse event handlers for drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;

    setHasMoved(false); // Reset hasMoved state
    startPositionRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    onDragStart?.();

    if (draggableRef.current) {
      const rect = draggableRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;

    // Check if mouse has moved significantly (more than threshold)
    const deltaX = Math.abs(e.clientX - startPositionRef.current.x);
    const deltaY = Math.abs(e.clientY - startPositionRef.current.y);

    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      setHasMoved(true); // Set state for cursor change
    }

    e.preventDefault();
    const newPosition = {
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y,
    };

    setPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const wasClick = !hasMoved; // Check if it was a click (no movement)

      setIsDragging(false);
      setHasMoved(false); // Reset hasMoved state
      onDragEnd?.();

      // Only handle clicks if it was truly a click (no movement)
      if (wasClick) {
        handleClick();
      }
    }
  };

  const handleClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;

      // If this is the first click, start the timer
      if (newCount === 1) {
        clickTimeoutRef.current = setTimeout(() => {
          // Timeout reached - not a double click, fire single click
          if (onClick) {
            onClick();
          }
          setClickCount(0);
        }, doubleClickDelay);
      }
      // If this is the second click within the delay period
      else if (newCount === 2) {
        // Clear the timeout
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
        }

        // This is a double click - fire double click handler
        if (onDoubleClick) {
          onDoubleClick();
        }
        return 0;
      }

      return newCount;
    });
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging && !disabled) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, disabled]);

  // Cleanup click timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={draggableRef}
      className={`${styles.Draggable} ${hasMoved ? styles.Dragging : ""} ${
        disabled ? styles.Disabled : ""
      } ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

