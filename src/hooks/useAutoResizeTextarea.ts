import { useCallback, useEffect, useRef } from 'react';

interface UseAutoResizeTextareaOptions {
  maxHeight?: number;
  minHeight?: number;
  value?: string; // Add value prop to watch for external changes
}

export const useAutoResizeTextarea = (options: UseAutoResizeTextareaOptions = {}) => {
  const { maxHeight = 300, minHeight = 40, value } = options;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate the new height
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    // Set the new height
    textarea.style.height = `${newHeight}px`;
    
    // Enable/disable scrolling based on whether content exceeds maxHeight
    if (scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }, [maxHeight, minHeight]);

  const handleInput = useCallback(() => {
    adjustHeight();
  }, [adjustHeight]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Enter key for auto-resize
    if (e.key === 'Enter' && !e.shiftKey) {
      // Let the parent handle the Enter key logic
      return;
    }
    
    // For other keys, adjust height after a short delay to allow the value to update
    setTimeout(adjustHeight, 0);
  }, [adjustHeight]);

  // Adjust height when value changes externally
  useEffect(() => {
    if (value !== undefined) {
      // Use a small timeout to ensure the DOM has updated
      const timeoutId = setTimeout(() => {
        adjustHeight();
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [adjustHeight, value]); // Watch for value changes

  const resetHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset to minimum height
    textarea.style.height = `${minHeight}px`;
    textarea.style.overflowY = 'hidden';
  }, [minHeight]);

  return {
    textareaRef,
    handleInput,
    handleKeyDown,
    adjustHeight,
    resetHeight,
  };
};
