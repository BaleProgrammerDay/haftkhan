import React, { ReactNode, useEffect, useState } from "react";
import { Draggable } from "../Draggable";
import styles from "./Folder.module.scss";
import { Modal } from "../Modal";
import clsx from "clsx";

interface FolderProps {
  children?: ReactNode;
  title?: string;
  initialPosition?: { x: number; y: number };
  className?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  doubleClickDelay?: number;
  disabled?: boolean;
  constrainToParent?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  folderImage?: string;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  path?: string;
  imageClassName?: string;
}

export const Folder: React.FC<FolderProps> = (props) => {
  const handleDoubleClick = () => {
    props.onToggle?.();
    props.onDoubleClick?.();
  };

  const [_isOpen, _setIsOpen] = useState(false);

  const handleSetIsOpen = (isOpen: boolean) => {
    _setIsOpen(isOpen);
    props.setIsOpen?.(isOpen);
  };

  const handleClose = () => {
    handleSetIsOpen(false);
    props.onClose?.();
  };

  return (
    <>
      <Draggable
        initialPosition={props.initialPosition}
        className={`${styles.Folder} ${props.className}`}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        onPositionChange={props.onPositionChange}
        onClick={props.onClick}
        onDoubleClick={handleDoubleClick}
        doubleClickDelay={props.doubleClickDelay}
        disabled={props.disabled}
        constrainToParent={props.constrainToParent}
      >
        {props.folderImage && (
          <img
            src={props.folderImage}
            alt="Folder"
            className={clsx(styles.FolderImage, props.imageClassName)}
          />
        )}
        {props.title}
      </Draggable>
      {_isOpen && (
        <Modal title={props.path} isOpen={_isOpen} onClose={handleClose}>
          {props.children}
        </Modal>
      )}
    </>
  );
};

