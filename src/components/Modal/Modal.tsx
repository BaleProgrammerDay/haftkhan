import React, { ReactNode } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import { useNotification } from "~/context/Notification";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showActionBar?: boolean;
  onMinimize?: () => void;
  onFullscreen?: () => void;
  fitContentSize?: boolean;
  modalContentClassName?: string;
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
  fitContentSize = false,
  modalContentClassName = "",
}) => {
  if (!isOpen) return null;

  const { setNotificationText } = useNotification();

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      setNotificationText("دنبال چی شما آقای فردوسی پوررررر");
    }
  };

  const handleFullscreen = () => {
    if (onFullscreen) {
      onFullscreen();
    } else {
      handleMinimize();
    }
  };

  return (
    <div className={styles.Modal}>
      <div
        className={clsx(styles.ModalContainer, className, {
          [styles.FitContentSize]: fitContentSize,
        })}
      >
        {showActionBar && (
          <div className={styles.ModalHeader}>
            <div className={styles.ActionBar}>
              <div
                className={clsx(styles.ActionBarItem, styles.CloseButton)}
                onClick={onClose}
              />
              <div
                className={clsx(styles.ActionBarItem, styles.MinimizeButton)}
                onClick={handleMinimize}
              />
              <div
                className={clsx(styles.ActionBarItem, styles.FullscreenButton)}
                onClick={handleFullscreen}
              />
            </div>
            {title && <div className={styles.ModalTitle}>{title}</div>}
          </div>
        )}
        <div className={clsx(styles.ModalContent, modalContentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};

