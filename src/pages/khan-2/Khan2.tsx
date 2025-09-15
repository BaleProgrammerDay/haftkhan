import { useState, useEffect } from "react";
import styles from "./Khan2.module.scss";

import { PageProps } from "~/types";
import { TypingText } from "~/components/TypingText/TypingText";
import { Slider } from "~/components/Slider/Slider";

import { Scratch } from "./Scratch";
import { Wires, useWireConnections } from "./Wires";
import { Folders } from "./Folder";
import { userActions, usernameSelector } from "~/store/user/slice";
import { useDispatch, useSelector } from "react-redux";

const getPassword = (username: string) => {
  if (username === "منابع انسانی") {
    return "1234";
  } else if (username === "مهندسی نرم افزار") {
    return "5678";
  } else if (username === "تست") {
    return "91011";
  } else {
    return "";
  }
};

export const Khan2 = (_props: PageProps) => {
  const dispatch = useDispatch();
  const username = useSelector(usernameSelector);
  const password = getPassword(username || "");

  const texts = [
    "من کجام؟ اینجا کجاست؟",
    "داشتم... با شیر می‌جنگیدم؟",
    "درست یادم نمیاد... آره فکر کنم...",
    "اون مرد... اون مرد کی بود؟",
    "نکنه... حافظه‌مو از دست دادم؟",
  ];

  const [storyIsEnded, setStoryIsEnded] = useState(false);

  // Wire connection logic
  const {
    connections,
    handleWireButtonClick,
    isButtonConnected,
    isButtonActive,
    isButtonConnectable,
    isCompleted,
    isChecking,
    isError,
    errorMessage,
    remainingChances,
  } = useWireConnections();

  // Wire button colors - paired for left and right sides
  const wireButtonColors = [
    "#b37feb", // Red - Button 0 (left) and 4 (right)
    "#fff3ae", // Teal - Button 1 (left) and 5 (right)
    "#00d1a8", // Blue - Button 2 (left) and 6 (right)
    "#4fc3f7", // Green - Button 3 (left) and 7 (right)
  ];

  // Get the color for a wire button
  const getButtonColor = (buttonId: number) => {
    // Map right-side buttons (4-7) to same colors as left-side siblings (0-3)
    const colorIndex = buttonId >= 4 ? buttonId - 4 : buttonId;
    return wireButtonColors[colorIndex] || "#FF6B6B";
  };

  // Handle step transition when wires are completed
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        console.log("Wires completed! Moving to step 3...");
        dispatch(userActions.setLastSolvedQuestion(3));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  return (
    <div className={styles.Page}>
      <div className={styles.Content}>
        {/* Wire system - only show after horse dialogue ends */}

        <Wires
          connections={connections}
          onButtonClick={handleWireButtonClick}
          isButtonConnected={isButtonConnected}
          isButtonActive={isButtonActive}
          isButtonConnectable={isButtonConnectable}
          getButtonColor={getButtonColor}
          storyIsEnded={storyIsEnded}
        />

        {/* Wire completion status */}
        {storyIsEnded && (
          <div className={styles.WireStatus}>
            {isChecking && (
              <div className={styles.StatusMessage}>
                در حال بررسی اتصالات...
              </div>
            )}
            {isCompleted && (
              <div className={styles.SuccessMessage}>
                ✅ همه سیم‌ها به درستی متصل شدند!
              </div>
            )}
            {isError && (
              <div className={styles.ErrorMessage}>
                {errorMessage}
                {remainingChances > 0 && (
                  <div className={styles.ChancesRemaining}>
                    شانس دیگر برام باقی مانده {remainingChances}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {storyIsEnded ? (
          <Slider items={texts} startIndex={texts.length - 1} />
        ) : (
          <TypingText
            text={texts}
            waitDelay={1000}
            onComplete={() => {
              setStoryIsEnded(true);
            }}
          />
        )}
      </div>

      {/* Folders - only show after horse dialogue ends */}
      {storyIsEnded && <Folders password={password} />}

      {/* Scratch - only show after horse dialogue ends */}
      {storyIsEnded && <Scratch password={password} />}
    </div>
  );
};

