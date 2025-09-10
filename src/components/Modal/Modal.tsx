import React, { ReactNode } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showActionBar?: boolean;
  onMinimize?: () => void;
  onFullscreen?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  showActionBar = true,
  onMinimize,
  onFullscreen,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.Modal}>
      <div className={clsx(styles.ModalContainer, className)}>
        {showActionBar && (
          <div className={styles.ModalHeader}>
            <div className={styles.ActionBar}>
              <div
                className={clsx(styles.ActionBarItem, styles.CloseButton)}
                onClick={onClose}
              />
              {onMinimize && (
                <div
                  className={clsx(styles.ActionBarItem, styles.MinimizeButton)}
                  onClick={onMinimize}
                />
              )}
              {onFullscreen && (
                <div
                  className={clsx(styles.ActionBarItem, styles.FullscreenButton)}
                  onClick={onFullscreen}
                />
              )}
            </div>
            {title && <div className={styles.ModalTitle}>{title}</div>}
          </div>
        )}
        <div className={styles.ModalContent}>{children}</div>
      </div>
    </div>
  );
};
