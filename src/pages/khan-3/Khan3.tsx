import { useEffect, useState, useRef } from "react";
import styles from "./Khan3.module.scss";
import { Draggable } from "~/components/Draggable";
import { Modal } from "~/components/Modal";
import { AntivirusInstallModal } from "~/components/AntivirusInstallModal";
import { PageProps } from "~/types";
import { Page, PasswordInput } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";
import clsx from "clsx";
import { detectCollision } from "~/utils/colision";

import antiVirus from "~/assets/anti_virus.png";
import folderIce from "~/assets/frozen_folder.png";
import folder from "~/assets/folder.png";

import FolderWrapperStyles from "~/pages/khan-2/Folder/Folder.module.scss";
import { API } from "~/api/api";
import { useDispatch } from "react-redux";
import { userActions } from "~/store/user/slice";
import { useNotification } from "~/context/Notification";

// todo: add api

export const Khan3 = (props: PageProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showAzhdar, setShowAzhdar] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for collision detection
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);

  // Collision timer ref
  const collisionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatch = useDispatch();

  const { setNotificationText } = useNotification();

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

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Test mode - set to true to automatically start table cycling animation
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);

  const handleAntiVirusClick = () => {
    console.log("anti virus clicked");

    setIsInstallModalOpen(true);

    setOpenFolder(false);
  };

  const handleInstallComplete = () => {
    setIsInstallModalOpen(false);
    setIsActivationModalOpen(true);
  };

  const [password, setPassword] = useState("");
  const [currentTableIndex, setCurrentTableIndex] = useState(0);
  const [isTableAnimating, setIsTableAnimating] = useState(false);

  // 3 different tables to cycle through
  const tableDataSets = [
    // Table 1
    [
      ["0921", "0211"],
      ["0722", "0412"],
      ["0923", "0113"],
      ["1124", "0414"],
      ["?", "0415"],
      ["0725", "0516"],
      ["1027", "0317"],
      ["0928", "0518"],
      ["1229", "0119"],
    ],
    // Table 2
    [
      ["1", "7"],
      ["3", "11"],
      ["2", "8"],
      ["4", "8"],
      ["1", "9"],
      ["?", "6"],
      ["1", "11"],
      ["0", "12"],
      ["0", "10"],
    ],
    // Table 3
    [
      ["4", "5"],
      ["5", "3"],
      ["5", "4"],
      ["4", "6"],
      ["6", "?"],
      ["4", "4"],
      ["5", "4"],
      ["5", "5"],
      ["6", "5"],
    ],
  ];

  const currentTableData = tableDataSets[currentTableIndex];

  // Cycle through tables every 3 seconds when activation modal is open
  useEffect(() => {
    if (isActivationModalOpen) {
      const interval = setInterval(() => {
        setCurrentTableIndex(
          (prevIndex) => (prevIndex + 1) % tableDataSets.length
        );
      }, 5000); // 3 seconds

      return () => clearInterval(interval);
    }
  }, [isActivationModalOpen, tableDataSets.length]);

  const handleActivate = () => {
    const callAPI = async () => {
      const data = await API.submitAnswer({
        question_id: 3,
        answer: password,
      });

        dispatch(userActions.setLastSolvedQuestion(3));
        if (data.ok) {
        dispatch(userActions.setLastSolvedQuestion(3));
      } else {
        setNotificationText("رمز عبور اشتباه است. دوباره تلاش کنید. ❌");
      }
    };

    callAPI();
  };

  const handleChangePassword = (password: string) => {
    setPassword(password);
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
          {/* todo: اول بنویسه حافظه متصل شد بعد در حال یادآوری بیاد */}
          <p className={styles.VideoText}>در حال یادآوری...</p>
        </div>
      </PageContent>

      <div ref={folderRef}>
        <Draggable
          initialPosition={{ x: 20, y: 20 }}
          className={FolderWrapperStyles.Folder}
          onDoubleClick={
            // handleFolderOpen
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
          onDoubleClick={handleAntiVirusClick}
          doubleClickDelay={300}
        >
          <img src={antiVirus} alt="" onClick={handleAntiVirusClick} />
        </Draggable>
      </Modal>

      <AntivirusInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstallComplete={handleInstallComplete}
      />

      {/* //isActivationModalOpen */}
      <Modal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        title="Antivirus Activation"
        modalContentClassName={styles.ActivateContent}
      >
        <div className={styles.activate}>
          {/* You can add your activation code content here */}
          <div>
            <h3>Activation Required</h3>
            <p>
              Please enter your activation code to complete the antivirus setup.
            </p>
          </div>

          <div className={styles.ActivateCodeSection}>
            <div className={styles.table}>
              {currentTableData.map((row, rowIndex) => (
                <div
                  key={`${currentTableIndex}-${rowIndex}`}
                  className={styles.tableRow}
                >
                  {row.map((cell, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={clsx(
                        styles.tableCell,
                        cell === "?" && styles.questionMark
                      )}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <PasswordInput
              length={6}
              onChange={handleChangePassword}
              template="**** * *"
              direction="ltr"
              justEnglish
              ignoreSpaces
            />
          </div>

          <button
            onClick={handleActivate}
            disabled={password.length !== 6}
            className={styles.installButton}
          >
            Activate
          </button>
        </div>
      </Modal>
    </Page>
  );
};

