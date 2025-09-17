import React, { useState, useEffect, useRef } from "react";
import styles from "./TimeoutModal.module.scss";

interface TimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeoutTriggeredAt?: string; // ISO string of when timeout was triggered
  timeoutAttemptHistory?: number; // Number of timeout attempts
  facts: string[][]; // Array of fact arrays to cycle through
  title?: string; // Custom title for the modal
  audioUrl?: string; // Custom audio URL for background music
}

// Default facts for fallback
const defaultFacts = [
  "سیستم قفل شده است. لطفا صبر کنید...",
  "امنیت سیستم در حال بررسی است...",
  "لطفا کمی صبر کنید تا سیستم دوباره فعال شود...",
  "در حال بازگردانی سیستم امنیتی...",
  "لطفا صبر کنید تا قفل سیستم باز شود...",
];

export const TimeoutModal: React.FC<TimeoutModalProps> = ({
  isOpen,
  onClose,
  timeoutTriggeredAt,
  timeoutAttemptHistory = 0,
  facts,
  title = "سیستم قفل شد! ۲ دقیقه صبر کنید تا دوباره فعال شود",
  audioUrl = "https://load.filespacer.ir/music/B/Bikalam.Aroom/Loreena.McKennitt.Tango.To.Evora.%5Bsongha.ir%5D.mp3",
}) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Select facts based on timeoutAttemptHistory % facts.length
  const getFacts = () => {
    if (facts && facts.length > 0) {
      const factSetIndex = timeoutAttemptHistory % facts.length;
      return facts[factSetIndex];
    }

    // Fallback to default facts
    return defaultFacts;
  };

  const displayFacts = getFacts();

  console.log(displayFacts)

  useEffect(() => {
    if (!isOpen) return;

    // Disable all mouse clicks globally except on modal elements
    const disableClicks = (e: Event) => {
      const target = e.target as Element;

      // Allow clicks on modal elements
      if (target.closest("[data-timeout-modal]")) {
        return true; // Allow the click
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Add click blocker to all elements
    const addClickBlockers = () => {
      // Block clicks on document
      document.addEventListener("click", disableClicks, true);
      document.addEventListener("mousedown", disableClicks, true);
      document.addEventListener("mouseup", disableClicks, true);

      // Block clicks on all existing elements
      const allElements = document.querySelectorAll("*");
      allElements.forEach((element) => {
        element.addEventListener("click", disableClicks, true);
        element.addEventListener("mousedown", disableClicks, true);
        element.addEventListener("mouseup", disableClicks, true);
      });
    };

    // Remove click blockers
    const removeClickBlockers = () => {
      document.removeEventListener("click", disableClicks, true);
      document.removeEventListener("mousedown", disableClicks, true);
      document.removeEventListener("mouseup", disableClicks, true);

      const allElements = document.querySelectorAll("*");
      allElements.forEach((element) => {
        element.removeEventListener("click", disableClicks, true);
        element.removeEventListener("mousedown", disableClicks, true);
        element.removeEventListener("mouseup", disableClicks, true);
      });
    };

    // Play background music when modal opens
    const playBackgroundMusic = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3; // Set volume to 30%
      }

      if (audioEnabled) {
        audioRef.current.play().catch((error) => {
          console.log("Audio playback failed:", error);
        });
      }
    };

    // Calculate remaining time based on when timeout was triggered
    const calculateRemainingTime = () => {
      if (timeoutTriggeredAt) {
        const triggeredTime = new Date(timeoutTriggeredAt).getTime();
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - triggeredTime) / 1000);
        const remaining = Math.max(0, 120 - elapsedSeconds);
        return remaining;
      }
      return 120; // Default 2 minutes if no timeout time provided
    };

    const initialTimeLeft = calculateRemainingTime();
    setTimeLeft(initialTimeLeft);
    setCurrentFactIndex(Math.floor(Math.random() * displayFacts.length));

    // Disable all clicks immediately
    addClickBlockers();
    // Add visual indicator that clicks are disabled
    document.body.style.pointerEvents = "none";
    document.body.style.cursor = "not-allowed";

    // Play background music
    playBackgroundMusic();

    // If time is already up, close immediately
    if (initialTimeLeft <= 0) {
      onClose();
      return;
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Re-enable clicks before closing
          removeClickBlockers();
          // Restore visual indicators
          document.body.style.pointerEvents = "auto";
          document.body.style.cursor = "auto";
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Change fact every 6 seconds with random selection
    const factTimer = setInterval(() => {
      setCurrentFactIndex(() =>
        Math.floor(Math.random() * displayFacts.length)
      );
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(factTimer);
      // Re-enable clicks when modal closes
      removeClickBlockers();
      // Restore visual indicators
      document.body.style.pointerEvents = "auto";
      document.body.style.cursor = "auto";
      // Stop audio when modal closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isOpen, onClose, timeoutTriggeredAt, audioEnabled, displayFacts?.length]);

  // Function to enable audio playback
  const enableAudio = () => {
    setAudioEnabled(true);
    if (audioRef.current && isOpen) {
      audioRef.current.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
    }
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((120 - timeLeft) / 120) * 100;

  return (
    <div
      className={styles.overlay}
      style={{ pointerEvents: "auto", cursor: "auto" }}
      data-timeout-modal
    >
      <div
        className={styles.modal}
        style={{ pointerEvents: "auto", cursor: "auto" }}
        data-timeout-modal
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {!audioEnabled && (
            <button
              className={styles.playButton}
              onClick={enableAudio}
              data-timeout-modal
            >
              🎵 پخش موسیقی
            </button>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.timerSection}>
            <div className={styles.timer}>
              <div className={styles.timeDisplay}>
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.factsSection}>
            <h3 className={styles.factsTitle}>آیا می‌دانستید؟</h3>
            <div className={styles.factContainer}>
              <p className={styles.factText}>
                {displayFacts[currentFactIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

