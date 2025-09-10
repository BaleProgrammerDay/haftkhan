import React, { useState, useRef, useEffect, ReactNode } from "react";
import styles from "./Draggable.module.scss";

interface DraggableProps {
    children: ReactNode;
    initialPosition?: { x: number; y: number };
    className?: string;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onPositionChange?: (position: { x: number; y: number }) => void;
    disabled?: boolean;
}

export const Draggable: React.FC<DraggableProps> = ({
    children,
    initialPosition = { x: 0, y: 0 },
    className = "",
    onDragStart,
    onDragEnd,
    onPositionChange,
    disabled = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(initialPosition);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const draggableRef = useRef<HTMLDivElement>(null);

    // Mouse event handlers for drag functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabled) return;
        
        e.preventDefault();
        setIsDragging(true);
        onDragStart?.();

        if (draggableRef.current) {
            const rect = draggableRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || disabled) return;

        e.preventDefault();
        const newPosition = {
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
        };
        
        setPosition(newPosition);
        onPositionChange?.(newPosition);
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            onDragEnd?.();
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
    }, [isDragging, dragOffset, disabled]);

    return (
        <div
            ref={draggableRef}
            className={`${styles.Draggable} ${
                isDragging ? styles.Dragging : ""
            } ${disabled ? styles.Disabled : ""} ${className}`}
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
