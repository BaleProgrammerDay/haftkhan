import { useEffect, useState, useRef } from "react";
import styles from "./Khan3.module.scss";
import { Draggable } from "~/components/Draggable";
import { Modal } from "~/components/Modal";
import { PageProps } from "~/types";
import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";
import clsx from "clsx";
import { detectCollision } from "~/utils/colision";

import antiVirus from "~/assets/anti_virus.png";
import folderIce from "~/assets/frozen_folder.png";
import folder from "~/assets/folder.png";

import FolderWrapperStyles from "~/pages/khan-2/Folder/Folder.module.scss";

export const Khan3 = (props: PageProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showAzhdar, setShowAzhdar] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for collision detection
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);

  // Collision timer ref
  const collisionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setShowAzhdar(true);
    }, 8000);
  }, []);

  // Cleanup collision timer on unmount
  useEffect(() => {
    return () => {
      if (collisionTimerRef.current) {
        clearTimeout(collisionTimerRef.current);
      }
    };
  }, []);

  const [openFolder, setOpenFolder] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "ice" | "breaking" | "folder"
  >("ice");
  // Function to trigger ice breaking animation
  const breakIce = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setAnimationPhase("breaking");

    // Transition to folder after ice breaking
    setTimeout(() => {
      setAnimationPhase("folder");
    }, 800); // Half of the animation duration

    // End animation
    setTimeout(() => {
      setIsAnimating(false);
    }, 1600); // Full animation duration
  };

  const handleFolderOpen = () => {
    setOpenFolder(true);
  };

  // Custom collision detection logic
  const checkCollision = () => {
    if (!videoContainerRef.current || !folderRef.current) return;

    const videoRect = videoContainerRef.current.getBoundingClientRect();

    // Get the actual draggable element (the one with absolute positioning)
    let draggableElement = folderRef.current.querySelector(
      ".Draggable"
    ) as HTMLElement;

    // If not found by class, try to find by style attribute
    if (!draggableElement) {
      draggableElement = folderRef.current.querySelector(
        'div[style*="left"]'
      ) as HTMLElement;
    }

    // If still not found, get all divs and find the one with absolute positioning
    if (!draggableElement) {
      const allDivs = folderRef.current.querySelectorAll("div");
      draggableElement = Array.from(allDivs).find(
        (div) => getComputedStyle(div).position === "absolute"
      ) as HTMLElement;
    }

    if (!draggableElement) {
      console.log("Draggable element not found");
      return;
    }

    const folderRect = draggableElement.getBoundingClientRect();

    // Create a custom collision zone based on requirements:
    // - 20px to 260px from bottom of video
    // - 240px distance from video left edge

    const collisionZone = {
      left: videoRect.left + 240,
      right: videoRect.left + 260,
      top: videoRect.bottom - 220,
      bottom: videoRect.bottom - 20,
    };

    // Check if folder is within the collision zone
    const isInCollisionZone = detectCollision(
      folderRect,
      collisionZone as DOMRect
    );

    // Handle collision timer
    if (isInCollisionZone) {
      // If collision starts and no timer is running, start the timer
      if (!collisionTimerRef.current) {
        collisionTimerRef.current = setTimeout(() => {
          breakIce();
          collisionTimerRef.current = null;
        }, 2000); // 2 seconds
      }
    } else {
      // If collision stops, clear the timer
      if (collisionTimerRef.current) {
        clearTimeout(collisionTimerRef.current);
        collisionTimerRef.current = null;
      }
    }
  };

  // Check collision on folder position change
  const handleFolderPositionChange = () => {
    if (showAzhdar) {
      checkCollision();
    }
  };

  return (
    <Page>
      <PageContent>
        <div className={styles.VideoContainer} ref={videoContainerRef}>
          {!showAzhdar && (
            <video className={styles.Video} muted autoPlay loop>
              <source
                src={"/rakhsh_app/horse_states/remembering_start.mp4"}
                type="video/mp4"
              />
            </video>
          )}

          {showAzhdar && (
            <video className={styles.Video} muted autoPlay loop>
              <source
                src={"/rakhsh_app/horse_states/remembering_glitch.mp4"}
                type="video/mp4"
              />
            </video>
          )}
          <p className={styles.VideoText}>در حال یادآوری...</p>
        </div>
      </PageContent>

      <div ref={folderRef}>
        <Draggable
          initialPosition={{ x: 20, y: 20 }}
          className={FolderWrapperStyles.Folder}
          onDoubleClick={
            animationPhase === "folder" ? handleFolderOpen : undefined
          }
          onPositionChange={handleFolderPositionChange}
        >
          {(animationPhase === "ice" || animationPhase === "breaking") && (
            <img
              src={folderIce}
              className={clsx(
                FolderWrapperStyles.FolderImage,
                animationPhase === "breaking" && FolderWrapperStyles.IceBreaking
              )}
            />
          )}
          {animationPhase === "folder" && (
            <img
              src={folder}
              className={clsx(FolderWrapperStyles.FolderImage, {
                [FolderWrapperStyles.FolderAppearing]: isAnimating,
              })}
            />
          )}
          <p>اژدرکش</p>
        </Draggable>
      </div>

      <Modal
        isOpen={openFolder}
        onClose={() => setOpenFolder(false)}
        title="rakhsh/home/desktop/anti-virus"
      >
        <Draggable
          initialPosition={{ x: 20, y: 60 }}
          className={FolderWrapperStyles.Folder}
          onDoubleClick={handleFolderOpen}
          doubleClickDelay={300}
        >
          <img
            src={antiVirus}
            alt=""
            className={FolderWrapperStyles.FolderImage}
          />
        </Draggable>
      </Modal>
    </Page>
  );
};

