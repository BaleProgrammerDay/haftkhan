import { useEffect, useState, useRef } from "react";
import styles from "./Khan2.module.scss";

import { PageProps } from "~/types";
import { TypingText } from "~/components/TypingText/TypingText";
import { Slider } from "~/components/Slider/Slider";
import folder from "./folder.png";
import antiVirus from "./anti_virus.png";

import folderIce from "./frozen_folder.png";
import clsx from "clsx";
import { Draggable } from "~/components/Draggable";
import { Modal } from "~/components/Modal";
import { PasswordInput, PasswordInputRef } from "~/components/ui";

// Folders component that handles all folder-related logic including modal
interface FoldersProps {
  storyIsEnded: boolean;
}

const Folders: React.FC<FoldersProps> = ({ storyIsEnded }) => {
  // Folder animation state
  const [animationPhase, setAnimationPhase] = useState<
    "ice" | "breaking" | "folder"
  >("ice");
  const [isAnimating, setIsAnimating] = useState(false);

  const [openFolder, setOpenFolder] = useState(false);
  const [openSeriFolder, setOpenSeriFolder] = useState(false);
  const [password, setPassword] = useState("");
  const passwordInputRef = useRef<PasswordInputRef>(null);

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

  const handleFolderOpen = () => {
    setOpenFolder(true);
  };

  const handleSeriFolderOpen = () => {
    setOpenSeriFolder(true);
    // Focus the password input when modal opens
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 100); // Small delay to ensure modal is fully rendered
  };

  return (
    <>
      {/* Main folder with ice animation */}
      <Draggable
        initialPosition={{ x: 20, y: 20 }}
        className={styles.Folder}
        onDoubleClick={handleFolderOpen}
      >
        {(animationPhase === "ice" || animationPhase === "breaking") && (
          <img
            src={folderIce}
            className={clsx(
              styles.FolderImage,
              animationPhase === "breaking" && styles.IceBreaking
            )}
          />
        )}
        {animationPhase === "folder" && (
          <img
            src={folder}
            className={clsx(styles.FolderImage, {
              [styles.FolderAppearing]: isAnimating,
            })}
          />
        )}
        <p>اژدرکش</p>
      </Draggable>

      {/* Second folder */}
      <Draggable
        initialPosition={{ x: 120, y: 20 }}
        className={styles.Folder}
        onDoubleClick={handleSeriFolderOpen}
      >
        <img src={folder} className={styles.FolderImage} />
        <p>سری</p>
      </Draggable>

      {/* Modal */}
      <Modal
        isOpen={openFolder}
        onClose={() => setOpenFolder(false)}
        title="rakhsh/home/desktop/anti-virus"
      >
        <Draggable
          initialPosition={{ x: 20, y: 60 }}
          className={styles.Folder}
          onDoubleClick={handleFolderOpen}
          doubleClickDelay={300}
        >
          <img src={antiVirus} alt="" className={styles.FolderImage} />
        </Draggable>
      </Modal>

      {/* Modal */}
      <Modal
        isOpen={openSeriFolder}
        onClose={() => setOpenSeriFolder(false)}
        title="rakhsh/home/desktop/seri"
        fitContentSize
        modalContentClassName={styles.PasswordInputContainer}
      >
        <PasswordInput
          ref={passwordInputRef}
          length={4}
          onChange={setPassword}
          isDark
        />
      </Modal>
    </>
  );
};

export const Khan2 = (props: PageProps) => {
  const texts = [
    "یه چیزایی یادمه...اون...همون دیگه...",
    "درست یادم نمیاد...شاید حافظمو ...حافظمو...",
  ];

  const [storyIsEnded, setStoryIsEnded] = useState(false);

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

      <Folders storyIsEnded={storyIsEnded} />
    </div>
  );
};

