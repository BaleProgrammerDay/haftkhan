import { useEffect, useState } from "react";
import styles from "./Khan2.module.scss";

import { PageProps } from "~/types";
import { TypingText } from "~/components/TypingText/TypingText";
import { Slider } from "~/components/Slider/Slider";
import folder from "./folder.png";
import antiVirus from "./anti_virus.png";

import folderIce from "./frozen_folder.png";
import clsx from "clsx";
import { Draggable } from "~/components/Draggable";

export const Khan2 = (props: PageProps) => {
  const texts = [
    "یه چیزایی یادمه...اون...همون دیگه...",
    "درست یادم نمیاد...شاید حافظمو ...حافظمو...",
  ];

  const [storyIsEnded, setStoryIsEnded] = useState(false);

  // Optimized state management - only 2 states instead of 4
  const [animationPhase, setAnimationPhase] = useState<
    "ice" | "breaking" | "folder"
  >("ice");
  const [isAnimating, setIsAnimating] = useState(false);
  const [openFolder, setOpenFolder] = useState(false);

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

  useEffect(() => {
    if (storyIsEnded) {
      breakIce();
    }
  }, [storyIsEnded]);

  const handleFolderClick = () => {
    setOpenFolder(true);
  };

  return (
    <div className={styles.Page}>
      <div className={styles.Content}>
        <video
          src="/rakhsh_app/horse_states/confused_idle.mp4"
          autoPlay
          loop
          muted
          width={480}
          height={480}
        />

        {storyIsEnded ? (
          <Slider items={texts} startIndex={texts.length - 1} />
        ) : (
          <TypingText
            text={texts}
            waitDelay={1000}
            onComplete={() => setStoryIsEnded(true)}
          />
        )}
      </div>

      <Draggable
        initialPosition={{ x: 20, y: 20 }}
        className={clsx(styles.FolderIce)}
        onDoubleClick={handleFolderClick}
        doubleClickDelay={300}
      >
        {(animationPhase === "ice" || animationPhase === "breaking") && (
          <img
            src={folderIce}
            className={clsx(
              styles.FolderIceImage,
              animationPhase === "breaking" && styles.IceBreaking
            )}
          />
        )}
        {animationPhase === "folder" && (
          <img
            src={folder}
            className={clsx(
              styles.FolderImage,
              isAnimating && styles.FolderAppearing
            )}
          />
        )}
      </Draggable>

      {openFolder && (
        <div className={styles.ViewFolder}>
          <div className={styles.ViewFolderContainer}>
            <div className={styles.FolderHeader}>
              <div className={styles.FolderActionBar}>
                <div
                  className={clsx(styles.ActionBarItem, styles.CloseFolder)}
                />
                <div
                  className={clsx(styles.ActionBarItem, styles.MinimizeFolder)}
                />
                <div
                  className={clsx(
                    styles.ActionBarItem,
                    styles.FullscreenFolder
                  )}
                />
              </div>
              <div className={styles.FolderTitle}>
                rakhsh/home/desktop/anti-virus
              </div>
            </div>
            <img src={antiVirus} alt="" />
          </div>
        </div>
      )}
    </div>
  );
};

