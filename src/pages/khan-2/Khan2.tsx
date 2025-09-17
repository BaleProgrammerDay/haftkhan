import { useState, useEffect } from "react";
import styles from "./Khan2.module.scss";

import { PageProps } from "~/types";
import { TypingText } from "~/components/TypingText/TypingText";
import { Slider } from "~/components/Slider/Slider";
import { TimeoutModal } from "~/components/TimeoutModal";
import { khan2Facts } from "./facts";

import { Scratch } from "./Scratch";
import { Wires, useWireConnections } from "./Wires";
import { Folders } from "./Folder";
import {
  perQuestionSelector,
  userActions,
  usernameSelector,
} from "~/store/user/slice";
import { API } from "~/api/api";
import { useDispatch, useSelector } from "react-redux";
import { Scoreboard } from "./Scoreboard";
import { MAX_TIMEOUT_ATTEMPTS_Khan2 } from "./Wires/useWireConnections";
import { shouldShowTimeoutModal } from "~/utils/timeoutModal";

// todo: add teams password
const getPassword = (username: string) => {
  switch (username) {
    case "مامور 001":
      return "9872";
    case "قهرمان":
      return "2823";
    case "اکسلنت‌ها":
      return "8218";
    case "بازگشت اصلان":
      return "8201";
    case "سه کله پو":
      return "1738";
    case "هیمالیا":
      return "3827";
    case "وهوش":
      return "2981";
    case "موقت: اینت":
      return "1292";
    case "چای کرک":
      return "2381";
    case "FourSure":
      return "2812";
    case "حسین کبیر":
      return "3193";
    case "پشتیبانی":
      return "2810";
    case "شواهد":
      return "1190";
    case "رادمردان عرصه کد":
      return "3192";
    case "New Folder":
      return "3193";
    case "سنگر":
      return "3810";
    case "فرضی":
      return "3912";
    case "فرضی2":
      return "3859";
    default:
      return "8080";
  }
};

export const Khan2 = (_props: PageProps) => {
  const dispatch = useDispatch();
  const username = useSelector(usernameSelector);
  if (username == "adminadmin") {
    return <Scoreboard />;
  }
  const timeoutAttemptHistory =
    useSelector(perQuestionSelector)?.[-2]?.attempt_history?.length || 0;

  console.log("@#@#", timeoutAttemptHistory);

  const password = getPassword(username || "");

  const texts = [
    "من کجام؟ اینجا کجاست؟",
    "داشتم... با شیر می‌جنگیدم؟",
    "درست یادم نمیاد... آره فکر کنم...",
    "اون مرد... اون مرد کی بود؟",
    "نکنه... حافظه‌مو از دست دادم؟",
  ];

  const [storyIsEnded, setStoryIsEnded] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutTriggeredAt, setTimeoutTriggeredAt] = useState<
    string | undefined
  >();

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
    _attemptHistory,
    resetChances,
  } = useWireConnections();

  console.log("@#@# re", _attemptHistory);

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

  // Check if user should see timeout modal on component mount
  useEffect(() => {
    if (shouldShowTimeoutModal(_attemptHistory, MAX_TIMEOUT_ATTEMPTS_Khan2)) {
      setShowTimeoutModal(true);
      setTimeoutTriggeredAt(new Date().toISOString());
    }
  }, [_attemptHistory]);

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

  // Show timeout modal when remaining chances <= 0
  useEffect(() => {
    if (
      shouldShowTimeoutModal(_attemptHistory, MAX_TIMEOUT_ATTEMPTS_Khan2) &&
      isError
    ) {
      setShowTimeoutModal(true);
      setTimeoutTriggeredAt(new Date().toISOString());
    }
  }, [_attemptHistory, isError]);

  // Handle modal close - reset the wire connections and error state
  const handleTimeoutModalClose = async () => {
    setShowTimeoutModal(false);
    // Submit answer to question -2 to mark that modal was shown and closed
    await API.submitAnswer({
      question_id: -2,
      answer: "modal_completed",
    });
    // Reset the wire connections and error state when modal closes
    resetChances();
  };

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
            {isError && _attemptHistory > 0 && (
              <div className={styles.ErrorMessage}>
                {errorMessage}
                {/* {_attemptHistory > 0 && (
                  <div className={styles.ChancesRemaining}>
                    شانس دیگر برام باقی مانده {_attemptHistory}
                  </div>
                )} */}
              </div>
            )}
          </div>
        )}

        {storyIsEnded ? (
          <Slider items={texts} startIndex={texts.length - 1} />
        ) : (
          <div className={styles.TypingTextContainer}>
            <TypingText
              className={styles.TypingText}
              text={texts}
              waitDelay={1000}
              onComplete={() => {
                setStoryIsEnded(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Folders - only show after horse dialogue ends */}
      {storyIsEnded && <Folders password={password} />}

      {/* Scratch - only show after horse dialogue ends */}
      {storyIsEnded && <Scratch password={password} />}

      {/* Timeout Modal - shows when remaining chances <= 0 */}
      <TimeoutModal
        isOpen={showTimeoutModal}
        onClose={handleTimeoutModalClose}
        timeoutTriggeredAt={timeoutTriggeredAt}
        timeoutAttemptHistory={Math.abs(_attemptHistory)}
        facts={khan2Facts}
        title="مغزمو سوزوندی حالا باید ۲ دقیقه وایسی تا مغزمو درست کنم"
        audioUrl="https://load.filespacer.ir/music/B/Bikalam.Aroom/Loreena.McKennitt.Tango.To.Evora.%5Bsongha.ir%5D.mp3"
      />
    </div>
  );
};

