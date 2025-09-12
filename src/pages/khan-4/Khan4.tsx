import { useEffect, useRef, useState } from "react";
import { Page, ConversationInput } from "~/components";
import { PageContent } from "~/components/ui/Page/Page";
import { calculateTypingSpeed } from "~/utils";
import { useConversation } from "~/hooks/useConversation";

import styles from "./Khan4.module.scss";
import {
  ManualTypingText,
  ManualTypingTextRef,
  TypedText,
  TypingText,
} from "~/components/TypingText/TypingText";

const initialConversation = [
  { role: "luigi", message: "نگران نباش! گویدو اینجاست که کمکت کنه!\nزودتعمیر میشی و آماده حرکت میشی" },
  { role: "user", message: "کو پس نیم ساعته منتظرم..." },
  { role: "luigi", message: "باور کن گویدو هر کاری از دستش بر بیاد انجام میده، فقط بهم اعتماد کن." },
  { role: "user", message: "دروغ نگو، به نام ایزد منان" },
  { role: "luigi", message: "عهههههههه" }
];

export const Khan4 = () => {
  const [video, setVideo] = useState<
    "azhdar" | "luiji" | "remembering" | "cant_remembering"
  >("luiji");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const horseText = "نمیفهمم هنوزم چرا چیزی یادم نمیاد...";
  
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [showInitialConversation, setShowInitialConversation] = useState(true);

  // Use the conversation hook (start with empty message since we handle initial conversation)
  const conversation = useConversation("");

  // Initialize input with last sent message
  useEffect(() => {
    if (
      !conversation.currentUserInput &&
      conversation.getCurrentUserMessage()
    ) {
      conversation.setUserInput(conversation.getCurrentUserMessage());
    }
  }, [conversation]);

  // useEffect(() => {
  //   timerRef.current = setTimeout(() => {
  //     setVideo("azhdar");
  //     timerRef.current = setTimeout(() => {
  //       setVideo("cant_remembering");
  //       timerRef.current = setTimeout(() => {
  //         setVideo("luiji");
  //       }, 8000);
  //     }, 7000);
  //   }, 8000);

  //   return () => {
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }
  //   };
  // }, []);

  // Handle conversation phase changes
  useEffect(() => {
    if (conversation.conversationPhase === "luigi-start") {
      // Luigi starts talking, show luiji video
      setVideo("luiji");
    } else if (conversation.conversationPhase === "user-input") {
      // User can input, keep luiji video
      setVideo("luiji");
    } else if (conversation.conversationPhase === "luigi-response") {
      // Luigi is responding, show luiji video
      setVideo("luiji");
    }
  }, [conversation.conversationPhase]);
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
      case "azhdar":
        return (
          <video
            src="/rakhsh_app/horse_states/remembering_glitch.mp4"
            autoPlay
            loop
            muted
            className={styles.Video}
          />
        );
      case "cant_remembering":
        return (
          <video
            src="/rakhsh_app/horse_states/confused_idle.mp4"
            autoPlay
            loop
            muted
            className={styles.Video}
          />
        );
      case "luiji":
        return (
          <video
            src="/rakhsh_app/horse_states/asleep.mp4"
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
  };

  const handleUserTextComplete = () => {
    // User text display is complete, no automatic sending
    // User must manually send via button or Enter key
  };

  const handleInitialDialogComplete = () => {
    if (currentDialogIndex < initialConversation.length - 1) {
      // Move to next dialog
      setCurrentDialogIndex(prev => prev + 1);
    } else {
      // All initial conversation completed, show input
      setShowInitialConversation(false);
      conversation.setConversationPhase("user-input");
    }
  };

  console.log("@#@#", conversation.isLuigiTyping);

  return (
    <Page className={styles.Khan4Page}>
      {/* User Message Display - Show initial conversation or input */}
      <div className={styles.UserBubble}>
        {showInitialConversation && initialConversation[currentDialogIndex]?.role === "user" ? (
          <TypedText
            text={initialConversation[currentDialogIndex].message}
            onComplete={handleInitialDialogComplete}
            keepLastText={false}
            waitingTime={2000}
            storyIsEnded={false}
          />
        ) : !showInitialConversation ? (
          <div className={styles.UserInputContainer}>
            <input
              type="text"
              value={conversation.currentUserInput}
              onChange={(e) => conversation.setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && conversation.currentUserInput.trim()) {
                  conversation.sendUserMessage();
                }
              }}
              placeholder="پاسخ خود را بنویسید..."
              className={styles.UserInput}
              autoFocus
              dir="rtl"
            />
            <button
              className={styles.SendButton}
              onClick={conversation.sendUserMessage}
              disabled={!conversation.currentUserInput.trim()}
            >
              ارسال
            </button>
          </div>
        ) : null}
      </div>

      <PageContent>
        <div className={styles.VideoContainer}>
          {videoContent()}

          {/* Luigi Message Display */}
          {video === "luiji" && (
            <div className={styles.LuijiBubble}>
              {/* <img src="" alt="" /> */}
              {showInitialConversation && initialConversation[currentDialogIndex]?.role === "luigi" ? (
                <TypedText
                  text={initialConversation[currentDialogIndex].message}
                  onComplete={handleInitialDialogComplete}
                  keepLastText={false}
                  waitingTime={2000}
                  storyIsEnded={false}
                />
              ) : !showInitialConversation && conversation.getCurrentLuigiMessage() ? (
                <TypedText
                  text={conversation.getCurrentLuigiMessage()}
                  onComplete={handleLuigiTextComplete}
                  keepLastText={!conversation.isLuigiTyping}
                  waitingTime={500}
                  storyIsEnded={false}
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

