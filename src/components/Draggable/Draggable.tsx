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
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [hasMoved, setHasMoved] = useState(false);

  const draggableRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const startPositionRef = useRef({ x: 0, y: 0 });
  const dragThreshold = 1; // Minimum pixels to move before considering it a drag

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

      // Only fire onClick if it was truly a click (no movement)
      if (wasClick && onClick) {
        onClick();
      }
    }
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

