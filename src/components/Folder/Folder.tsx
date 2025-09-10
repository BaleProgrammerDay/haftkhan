import { useRef, useEffect, ReactNode, useState } from "react";
import { Draggable } from "../Draggable";

import styles from "./Folder.module.scss";
import clsx from "clsx";

interface FolderProps {
  children: ReactNode;
  onClick?: () => void;
  doubleClickDelay?: number;
  className?: string;
}

export const Folder: React.FC<FolderProps> = ({
  children,
  doubleClickDelay = 300,
  className = "",
  onClick,
}) => {
  const clickTimeoutRef = useRef<number | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;

      // If this is the first click, start the timer
      if (newCount === 1) {
        clickTimeoutRef.current = setTimeout(() => {
          // Timeout reached - not a double click, reset count
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

        onClick?.();
        return 0;
      }

      return newCount;
    });
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Draggable
      initialPosition={{ x: 20, y: 20 }}
      className={clsx(styles.Folder, className)}
      onClick={handleClick}
    >
      {children}
    </Draggable>
  );
};

