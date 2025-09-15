import { useEffect, useRef, useState } from "react";
import { Page } from "~/components";
import { PageContent } from "~/components/ui/Page/Page";
import { calculateTypingSpeed } from "~/utils";
import { useConversation } from "~/hooks/useConversation";
import { useAutoResizeTextarea } from "~/hooks/useAutoResizeTextarea";

import styles from "./Khan4.module.scss";
import { TypedText } from "~/components/TypingText/TypingText";

import { Send } from "./Send";
import { API } from "~/api/api";
import { useDispatch, useSelector } from "react-redux";
import { userActions, userSelector } from "~/store/user/slice";

const initialConversation = [
  {
    role: "luigi",
    message:
      "سلام! می‌بینم که به مشکل برخوردی. گویدو، تعمیرکار حافظه، در خدمت شماست.",
  },
  {
    role: "luigi",
    message: "!\nزود تعمیر میشی و همه چی یادت میاد و آمادۀ حرکت میشی",
  },
  { role: "user", message: "کو پس نیم ساعته منتظرم..." },
  {
    role: "luigi",
    message:
      "باور کن گویدو هر کاری از دستش بر بیاد انجام میده، فقط بهم اعتماد کن.",
  },
  { role: "user", message: "دروغ که تو کارت نیست؟" },
  { role: "luigi", message: "دروغ چیه الاغ (اسب)، برو خان ۴ رو بخون" },
];

// todo: add random id for each team

const getRandomId = (username: string) => {
  switch (username) {
    case "team1":
      return "team1";
    case "team2":
      return "team2";
    case "team3":
      return "team3";
    default:
      return "team1";
  }
};

export const Khan4 = () => {
  const [video, setVideo] = useState<
    | "luiji"
    | "remembering"
    | "cant_remembering"
    | "wizard_break"
    | "wizard_idle"
    | "transforming"
  >("remembering");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const horseText =
    "نمیفهمم مگه آنتی ویروس رو نصب نکردیم؟ پس چرا هنوزم چیزی یادم نمیاد!!";

  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [showInitialConversation, setShowInitialConversation] = useState(true);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");
  const [isCharacterTypingComplete, setIsCharacterTypingComplete] =
    useState(false);

  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  // Character limit configuration
  const CHARACTER_LIMIT = 128;

  // Handle wizard reveal with fade animation
  const handleWizardRevealed = () => {
    setVideo("transforming");

    // After fade animation completes, show wizard
    setTimeout(() => {
      setVideo("wizard_idle");
    }, 2000); // 2 second transformation
  };

  // Handle wizard destruction when attacked
  const handleWizardDestruction = () => {
    setVideo("wizard_break");
    setTimeout(() => {
      const goNext = async () => {
        await API.submitAnswer({
          question_id: 4,
          answer: getRandomId(user.username || ""),
        });

        dispatch(userActions.setLastSolvedQuestion(4));
      };
      goNext();
    }, 8000);
  };

  // Use the conversation hook (start with empty message since we handle initial conversation)
  const conversation = useConversation(
    "",
    () => {
      setIsCharacterTypingComplete(false); // Reset to false when new message arrives so typing can start
    },
    handleWizardRevealed,
    handleWizardDestruction
  );

  // Auto-resize textarea hook
  const { textareaRef, handleInput, handleKeyDown, resetHeight } =
    useAutoResizeTextarea({
      maxHeight: 300,
      minHeight: 40,
      value: conversation.currentUserInput, // Pass the current input value
    });

  // Initialize input with last sent message (only on first load, not after sending)
  // Removed this useEffect as it was causing infinite loops

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setVideo("cant_remembering");
      timerRef.current = setTimeout(() => {
        setVideo("luiji");
      }, 9000);
    }, 7000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const videoContent = () => {
    switch (video) {
      case "remembering":
        return (
          <video
            src="/rakhsh_app/horse_states/remembering_start.mp4"
            autoPlay
            loop
            muted
            className={styles.Video}
          />
        );
      case "cant_remembering":
        return (
          <video
            src="/rakhsh_app/horse_states/wondering.mp4"
            autoPlay
            loop
            muted
            className={styles.Video}
          />
        );
      case "luiji":
        return (
          <video
            src="/rakhsh_app/horse_states/guido.mp4"
            autoPlay
            loop
            muted
            className={styles.Video}
          />
        );
      case "transforming":
        return (
          <div className={styles.TransformationContainer}>
            <video
              src="/rakhsh_app/horse_states/guido.mp4"
              autoPlay
              loop
              muted
              className={`${styles.Video} ${styles.FadeOut}`}
            />
            <video
              src="/rakhsh_app/horse_states/wizard_idle.mp4"
              autoPlay
              loop
              muted
              className={`${styles.Video} ${styles.FadeIn}`}
            />
          </div>
        );
      case "wizard_break":
        return (
          <video
            src="/rakhsh_app/horse_states/wizard_break.mp4"
            autoPlay
            muted
            className={styles.Video}
            onEnded={() => {
              // Only transition to wizard_idle if this is not a destruction
              // (destruction will be handled by setStep(6) timeout)
            }}
          />
        );
      case "wizard_idle":
        return (
          <video
            src="/rakhsh_app/horse_states/wizard_idle.mp4"
            autoPlay
            loop
            muted
            className={styles.Video}
          />
        );
    }
  };

  const handleCharacterTextComplete = () => {
    // When character finishes talking, stop typing and allow user to input
    conversation.finishCharacterTyping();
    conversation.setConversationPhase("user-input");
    setIsCharacterTypingComplete(true); // Set to true when typing animation completes
  };

  const handleInitialDialogComplete = () => {
    if (currentDialogIndex < initialConversation.length - 1) {
      // Move to next dialog
      setCurrentDialogIndex((prev) => prev + 1);
    } else {
      // All initial conversation completed, show input
      setShowInitialConversation(false);
      conversation.setConversationPhase("user-input");
      setIsCharacterTypingComplete(false); // Set to true when initial conversation completes
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= CHARACTER_LIMIT) {
      conversation.setUserInput(value);
      handleInput();
    }
  };

  const handleSendMessage = () => {
    if (conversation.currentUserInput.trim()) {
      // Save the current message before sending
      setLastUserMessage(conversation.currentUserInput.trim());

      // Manually clear the textarea first
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "40px";
      }

      conversation.sendUserMessage();

      // Reset textarea height after sending
      setTimeout(() => {
        resetHeight();
      }, 0);
    }
  };

  return (
    <Page className={styles.Khan4Page}>
      {/* Last User Message Display - Show on left side */}
      {lastUserMessage && (
        <div className={styles.LastUserMessageBubble}>
          <div className={styles.LastUserMessageText}>{lastUserMessage}</div>
        </div>
      )}

      {/* User Message Display - Show initial conversation or input */}
      {(video === "luiji" ||
        video === "wizard_idle" ||
        video === "wizard_break" ||
        video === "transforming") && (
        <div className={styles.UserBubble}>
          {showInitialConversation &&
          initialConversation[currentDialogIndex]?.role === "user" ? (
            <TypedText
              text={initialConversation[currentDialogIndex].message}
              onComplete={handleInitialDialogComplete}
              keepLastText={false}
              waitingTime={2000}
              storyIsEnded={false}
            />
          ) : !showInitialConversation ? (
            <div className={styles.UserInputContainer}>
              <textarea
                ref={textareaRef}
                value={conversation.currentUserInput}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                  if (
                    e.key === "Enter" &&
                    conversation.currentUserInput.trim()
                  ) {
                    handleSendMessage();
                  }
                }}
                placeholder="هرچی دل تنگت میخواهد بگو..."
                className={styles.UserInput}
                autoFocus
                dir="rtl"
              />
              <button
                className={styles.SendButton}
                onClick={handleSendMessage}
                disabled={!conversation.currentUserInput.trim()}
              >
                <Send />
              </button>
            </div>
          ) : null}

          {/* Character count display */}
          {!showInitialConversation && (
            <div className={styles.CharacterCount}>
              <span className={styles.CharacterCountText}>
                {conversation.currentUserInput.length}/{CHARACTER_LIMIT}
              </span>
            </div>
          )}
        </div>
      )}

      <PageContent>
        <div className={styles.VideoContainer}>
          {videoContent()}

          {/* Character Message Display (Luigi or Wizard) */}
          {(video === "luiji" ||
            video === "wizard_idle" ||
            video === "wizard_break" ||
            video === "transforming") && (
            <div
              className={
                conversation.isWizardRevealed
                  ? styles.WizardBubble
                  : styles.LuijiBubble
              }
            >
              {showInitialConversation &&
              initialConversation[currentDialogIndex]?.role === "luigi" ? (
                <TypedText
                  text={initialConversation[currentDialogIndex].message}
                  onComplete={handleInitialDialogComplete}
                  keepLastText={false}
                  waitingTime={2000}
                  storyIsEnded={false}
                />
              ) : !showInitialConversation &&
                conversation.getCurrentCharacterMessage() ? (
                <TypedText
                  text={conversation.getCurrentCharacterMessage()}
                  onComplete={handleCharacterTextComplete}
                  keepLastText={
                    !(conversation.isLuigiTyping || conversation.isWizardTyping)
                  }
                  waitingTime={500}
                  storyIsEnded={isCharacterTypingComplete}
                />
              ) : null}
            </div>
          )}

          {/* Horse Message Display */}
          {video === "cant_remembering" && (
            <TypedText
              text={horseText}
              onComplete={() => {}}
              waitingTime={1000}
              storyIsEnded={false}
              speed={calculateTypingSpeed(horseText, 8000)}
            />
          )}
        </div>
      </PageContent>
    </Page>
  );
};

