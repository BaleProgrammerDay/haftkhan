import { useEffect, useState, useRef } from "react";
import styles from "./Folder.module.scss";

import folder from "~/assets/folder.png";

import { Draggable } from "~/components/Draggable";
import { Modal } from "~/components/Modal";
import { PasswordInput, PasswordInputRef } from "~/components/ui";

// Folders component that handles all folder-related logic including modal

export const Folders = () => {
  // Folder animation state

  const [openSeriFolder, setOpenSeriFolder] = useState(false);
  const [, setPassword] = useState("");
  const passwordInputRef = useRef<PasswordInputRef>(null);

  const handleSeriFolderOpen = () => {
    setOpenSeriFolder(true);
    // Focus the password input when modal opens
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 100); // Small delay to ensure modal is fully rendered
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
          onChange={setPassword}
          isDark
        />
      </Modal>
    </>
  );
};

