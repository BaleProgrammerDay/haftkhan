import { useEffect, useState, useRef } from "react";
import styles from "./Folder.module.scss";

import folder from "~/assets/folder.png";

import { Draggable } from "~/components/Draggable";
import { Modal } from "~/components/Modal";
import { PasswordInput, PasswordInputRef } from "~/components/ui";
import { Folder } from "~/components";
import { usernameSelector } from "~/store/user/slice";
import { useSelector } from "react-redux";

import teaImage from "../Scratch/assets/tea.jpg";
import packetImage from "../Scratch/assets/packet.jpg";
import scrissorsImage from "../Scratch/assets/sang.jpg";
import calenderImage from "../Scratch/assets/calender.jpg";

// Folders component that handles all folder-related logic including modal

const getImage = (username: string) => {
  switch (username) {
    case "مامور 001":
      return packetImage;
    case "قهرمان":
      return teaImage;
    case "اکسلنت‌ها":
      return teaImage;
    case "بازگشت اصلان":
      return teaImage;
    case "سه کله پو":
      return packetImage;
    case "هیمالیا":
      return teaImage;
    case "وهوش":
      return scrissorsImage;
    case "موقت: اینت":
      return packetImage;
    case "چای کرک":
      return teaImage;
    case "FourSure":
      return calenderImage;
    case "حسین کبیر":
      return scrissorsImage;
    case "پشتیبانی":
      return packetImage;
    case "شواهد":
      return scrissorsImage;
    case "رادمردان عرصه کد":
      return calenderImage;
    case "New Folder":
      return calenderImage;
    case "سنگر":
      return calenderImage;
    case "فرضی":
      return calenderImage;
    case "فرضی2":
      return calenderImage;
  }
};

export const Folders = (props: { password: string }) => {
  // Folder animation state

  const [openSeriFolder, setOpenSeriFolder] = useState(false);
  const [openImagesModal, setOpenImagesModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [, setPassword] = useState<string>("");
  const passwordInputRef = useRef<PasswordInputRef>(null);
  const username = useSelector(usernameSelector);

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

  const image = getImage(username);

  return (
    <>
      <Folder
        initialPosition={{ x: 120, y: 20 }}
        className={styles.Folder}
        onDoubleClick={handleSeriFolderOpen}
        title="سری"
        folderImage={folder}
      />

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
          <img src={image} alt="Secret Image" className={styles.SecretImage} />
        </div>
      </Modal>
    </>
  );
};

