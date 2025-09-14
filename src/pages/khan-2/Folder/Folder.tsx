import { useEffect, useState, useRef } from "react";
import styles from "./Folder.module.scss";

import folder from "~/assets/folder.png";
import tajammolian from "~/assets/tajammolian.png";
import barghMan from "~/assets/bargh_man.png";

import { Draggable } from "~/components/Draggable";
import { Modal } from "~/components/Modal";
import { PasswordInput, PasswordInputRef } from "~/components/ui";

// Folders component that handles all folder-related logic including modal

export const Folders = (props: { password: string }) => {
  // Folder animation state

  const [openSeriFolder, setOpenSeriFolder] = useState(false);
  const [openImagesModal, setOpenImagesModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [, setPassword] = useState<string>("");
  const passwordInputRef = useRef<PasswordInputRef>(null);

  const handleSeriFolderOpen = () => {
    if (isUnlocked) {
      // If already unlocked, skip password and go directly to images
      setOpenImagesModal(true);
    } else {
      // If not unlocked, show password input
      setOpenSeriFolder(true);
      // Focus the password input when modal opens
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100); // Small delay to ensure modal is fully rendered
    }
  };

  const handleChangePassword = (_password: string) => {
    setPassword(_password);

    if (_password === props.password) {
      setOpenSeriFolder(false);
      setOpenImagesModal(true);
      setIsUnlocked(true); // Mark as unlocked for future access
    }
  };

  return (
    <>
      <Draggable
        initialPosition={{ x: 120, y: 20 }}
        className={styles.Folder}
        onDoubleClick={handleSeriFolderOpen}
      >
        <img src={folder} className={styles.FolderImage} />
        <p>سری</p>
      </Draggable>

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
          onChange={handleChangePassword}
          isDark
        />
      </Modal>

      <Modal
        isOpen={openImagesModal}
        onClose={() => setOpenImagesModal(false)}
        title="Secret Images"
        fitContentSize
        modalContentClassName={styles.ImagesContainer}
      >
        <div className={styles.ImagesGrid}>
          <img src={tajammolian} alt="Tajammolian" className={styles.SecretImage} />
          <img src={barghMan} alt="Bargh Man" className={styles.SecretImage} />
        </div>
      </Modal>
    </>
  );
};

