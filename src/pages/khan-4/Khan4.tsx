import { useEffect, useRef, useState } from "react";
import { Page } from "~/components";
import { PageContent } from "~/components/ui/Page/Page";
import { calculateTypingSpeed } from "~/utils";
import { useConversation } from "~/hooks/useConversation";
import { useAutoResizeTextarea } from "~/hooks/useAutoResizeTextarea";

import styles from "./Khan4.module.scss";
import { TypedText } from "~/components/TypingText/TypingText";

import { Send } from "./Send";

const initialConversation = [
  {
    role: "luigi",
    message:
      "نگران نباش! گویدو اینجاست که کمکت کنه!\nزودتعمیر میشی و آماده حرکت میشی",
  },
  { role: "user", message: "کو پس نیم ساعته منتظرم..." },
  {
    role: "luigi",
    message:
      "باور کن گویدو هر کاری از دستش بر بیاد انجام میده، فقط بهم اعتماد کن.",
  },
  { role: "user", message: "دروغ نگو" },
  { role: "luigi", message: "دروغ چیه الاغ(اسب)، برو خان ۴ رو بخون" },
];

export const Khan4 = () => {
  const [video, setVideo] = useState<
    "luiji" | "remembering" | "cant_remembering"
  >("remembering");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const horseText = "نمیفهمم هنوزم چرا چیزی یادم نمیاد...";

  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [showInitialConversation, setShowInitialConversation] = useState(true);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");
  const [isLuigiTypingComplete, setIsLuigiTypingComplete] = useState(false);

  // Character limit configuration
  const CHARACTER_LIMIT = 128;

  // Use the conversation hook (start with empty message since we handle initial conversation)
  const conversation = useConversation("", () => {
    setIsLuigiTypingComplete(false); // Reset to false when new message arrives so typing can start
  });

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
    }
  };

  const handleLuigiTextComplete = () => {
    // When Luigi finishes talking, stop typing and allow user to input
    conversation.finishLuigiTyping();
    conversation.setConversationPhase("user-input");
    setIsLuigiTypingComplete(true); // Set to true when typing animation completes
  };

  const handleInitialDialogComplete = () => {
    if (currentDialogIndex < initialConversation.length - 1) {
      // Move to next dialog
      setCurrentDialogIndex((prev) => prev + 1);
    } else {
      // All initial conversation completed, show input
      setShowInitialConversation(false);
      conversation.setConversationPhase("user-input");
      setIsLuigiTypingComplete(false); // Set to true when initial conversation completes
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
      {video === "luiji" && (
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

          {/* Luigi Message Display */}
          {video === "luiji" && (
            <div className={styles.LuijiBubble}>
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
                conversation.getCurrentLuigiMessage() ? (
                <TypedText
                  text={conversation.getCurrentLuigiMessage()}
                  onComplete={handleLuigiTextComplete}
                  keepLastText={!conversation.isLuigiTyping}
                  waitingTime={500}
                  storyIsEnded={isLuigiTypingComplete}
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

