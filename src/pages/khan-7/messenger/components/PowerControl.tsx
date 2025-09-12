import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '~/store/store';

const PowerControl = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isPowerActive = useSelector((state: RootState) => state.general.isPowerActive)
    
  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
  
      if (!isPowerActive) {
        window.addEventListener('mousemove', handleMouseMove);
      }
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
  }, [isPowerActive]);
  
  if (isPowerActive) return null;

  return (
	 <div 
          className="absolute inset-0 z-[9999] pointer-events-none"
          style={{
            background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.98) 100%)`
          }}
        />
  )
}

export default PowerControl