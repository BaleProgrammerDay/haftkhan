import { useState, useCallback, useRef } from "react";
import { API } from "~/api/api";

export interface ConversationMessage {
  id: string;
  role: "user" | "luigi" | "wizard";
  message: string;
  timestamp: number;
}

export interface ConversationState {
  messages: ConversationMessage[];
  isLuigiTyping: boolean;
  isWizardTyping: boolean;
  isUserTyping: boolean;
  currentUserInput: string;
  isWizardRevealed: boolean;
  conversationPhase:
    | "luigi-start"
    | "user-input"
    | "luigi-response"
    | "wizard-transformation"
    | "wizard-response"
    | "conversation-flow";
}

const checkForWizardPhrase = (message: string) => {
  if (message === "Trigger1") return true;

  return false;
};

const checkForWizardAttackPhrase = (message: string) => {
  if (message === "Trigger2") return true;

  return false;
};

export const useConversation = (
  initialLuigiMessage: string,
  onLuigiMessageAdded?: () => void,
  onWizardRevealed?: () => void,
  onWizardDestroyed?: () => void
) => {
  const [state, setState] = useState<ConversationState>({
    messages: [
      {
        id: "luigi-0",
        role: "luigi",
        message: initialLuigiMessage,
        timestamp: Date.now(),
      },
    ],
    isLuigiTyping: true, // Luigi starts typing the initial message
    isWizardTyping: false,
    isUserTyping: false,
    currentUserInput: "",
    isWizardRevealed: false,
    conversationPhase: "luigi-start",
  });

  // Keep a ref to the current state for use in callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  const addMessage = useCallback(
    (message: Omit<ConversationMessage, "id" | "timestamp">) => {
      const newMessage: ConversationMessage = {
        ...message,
        id: `${message.role}-${Date.now()}`,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      // Call callback if it's a Luigi message
      if (message.role === "luigi" && onLuigiMessageAdded) {
        onLuigiMessageAdded();
      }

      // Call callback if it's a wizard message
      if (message.role === "wizard" && onLuigiMessageAdded) {
        onLuigiMessageAdded(); // Reuse the same callback for simplicity
      }

      return newMessage;
    },
    [onLuigiMessageAdded]
  );

  const setUserInput = useCallback((input: string) => {
    setState((prev) => ({
      ...prev,
      currentUserInput: input,
    }));
  }, []);

  const setTypingState = useCallback(
    (
      isLuigiTyping: boolean,
      isUserTyping: boolean,
      isWizardTyping?: boolean
    ) => {
      setState((prev) => ({
        ...prev,
        isLuigiTyping,
        isUserTyping,
        isWizardTyping: isWizardTyping ?? prev.isWizardTyping,
      }));
    },
    []
  );

  const setConversationPhase = useCallback(
    (phase: ConversationState["conversationPhase"]) => {
      setState((prev) => ({
        ...prev,
        conversationPhase: phase,
      }));
    },
    []
  );

  const revealWizard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isWizardRevealed: true,
      conversationPhase: "wizard-transformation",
      isLuigiTyping: false,
      isWizardTyping: true,
    }));

    // Add wizard transformation message
    setTimeout(() => {
      addMessage({
        role: "wizard",
        message:
          "اه چه قدر طول کشید! پیش خودت فکر نکردی که گویدو چه ربطی به هفت خان داره؟ محاله بذارم به حافظت دست پیدا کنی!",
      });
    }, 1000);

    if (onWizardRevealed) {
      onWizardRevealed();
    }
  }, [addMessage, onWizardRevealed]);

  const destroyWizard = useCallback(() => {
    // Add wizard destruction message first
    addMessage({
      role: "wizard",
      message: "آه! نه! ... (جادوگر با درد فرو می‌ریزد و ناپدید می‌شود)",
    });

    // Then update state to ensure wizard typing is active
    setState((prev) => ({
      ...prev,
      conversationPhase: "conversation-flow",
      isWizardTyping: true,
      isLuigiTyping: false,
    }));

    // Delay the wizard destruction callback to allow message to be displayed
    setTimeout(() => {
      if (onWizardDestroyed) {
        onWizardDestroyed();
      }
    }, 3000); // Give 3 seconds for the message to be displayed
  }, [addMessage, onWizardDestroyed]);

  const sendUserMessage = useCallback(async () => {
    const currentState = stateRef.current;

    if (!currentState.currentUserInput.trim()) {
      return;
    }

    const userMessage = currentState.currentUserInput.trim();

    const checkForWizzard = (res: string) => {
      if (!currentState.isWizardRevealed && checkForWizardPhrase(res)) {
        // Add user message
        addMessage({
          role: "user",
          message: "",
        });

        // Clear input
        setState((prevState) => ({
          ...prevState,
          currentUserInput: "",
          isUserTyping: false,
        }));

        // Trigger wizard reveal
        revealWizard();
        return;
      }
    };

    // Check if this message attacks the wizard
    const checkForWizardAttack = (res: string) => {
      if (currentState.isWizardRevealed && checkForWizardAttackPhrase(res)) {
        // Add user message
        addMessage({
          role: "user",
          message: userMessage,
        });

        // Clear input
        setState((prevState) => ({
          ...prevState,
          currentUserInput: "",
          isUserTyping: false,
        }));

        // Trigger wizard destruction
        destroyWizard();
        return true; // Return true to indicate wizard was destroyed
      }
      return false;
    };

    // Add user message
    addMessage({
      role: "user",
      message: userMessage,
    });

    // Clear input and set typing states immediately
    setState((prevState) => {
      const isWizardMode = prevState.isWizardRevealed;
      return {
        ...prevState,
        currentUserInput: "",
        isUserTyping: false,
        isLuigiTyping: !isWizardMode,
        isWizardTyping: isWizardMode,
        conversationPhase: isWizardMode ? "wizard-response" : "luigi-response",
      };
    });

    // Continue with API call after state update
    try {
      // Only send the last message to the model as requested

      const isWizardMode = stateRef.current.isWizardRevealed;

      // Get appropriate response based on current mode
      const response = await API.prompt({
        user_prompt: userMessage,
        system_prompt_id: isWizardMode ? 2 : 1,
      });

      checkForWizzard(response?.result);
      const wizardDestroyed = checkForWizardAttack(response?.result);

      // Only add character response if wizard wasn't destroyed
      if (!wizardDestroyed) {
        // Add appropriate character's response
        addMessage({
          role: isWizardMode ? "wizard" : "luigi",
          message:
            response?.result || "ببخشید مثل اینکه بهم نگفتن الان باید چی بگم",
        });
      }
    } catch (error) {
      console.error("Failed to get character response:", error);

      // Only add fallback message if wizard wasn't destroyed
      if (
        !stateRef.current.isWizardRevealed ||
        !checkForWizardAttackPhrase(userMessage)
      ) {
        const isWizardMode = stateRef.current.isWizardRevealed;
        // Add fallback message
        addMessage({
          role: isWizardMode ? "wizard" : "luigi",
          message: "به نظر میرسه به مشکل خوردیم.",
        });
      }
    }
  }, [addMessage]);

  const getCurrentLuigiMessage = useCallback(() => {
    const lastLuigiMessage = state.messages
      .filter((msg) => msg.role === "luigi")
      .pop();
    return lastLuigiMessage?.message || "";
  }, [state.messages]);

  const getCurrentWizardMessage = useCallback(() => {
    const lastWizardMessage = state.messages
      .filter((msg) => msg.role === "wizard")
      .pop();
    return lastWizardMessage?.message || "";
  }, [state.messages]);

  const getCurrentCharacterMessage = useCallback(() => {
    if (state.isWizardRevealed) {
      return getCurrentWizardMessage();
    }
    return getCurrentLuigiMessage();
  }, [state.isWizardRevealed, getCurrentWizardMessage, getCurrentLuigiMessage]);

  const getCurrentUserMessage = useCallback(() => {
    const lastUserMessage = state.messages
      .filter((msg) => msg.role === "user")
      .pop();
    return lastUserMessage?.message || "";
  }, [state.messages]);

  const finishLuigiTyping = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLuigiTyping: false,
    }));
  }, []);

  const finishWizardTyping = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isWizardTyping: false,
    }));
  }, []);

  const finishCharacterTyping = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLuigiTyping: false,
      isWizardTyping: false,
    }));
  }, []);

  const clearUserInput = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentUserInput: "",
    }));
  }, []);

  return {
    ...state,
    addMessage,
    setUserInput,
    setTypingState,
    setConversationPhase,
    sendUserMessage,
    getCurrentLuigiMessage,
    getCurrentWizardMessage,
    getCurrentCharacterMessage,
    getCurrentUserMessage,
    finishLuigiTyping,
    finishWizardTyping,
    finishCharacterTyping,
    clearUserInput,
    revealWizard,
    destroyWizard,
    checkForWizardPhrase,
    checkForWizardAttackPhrase,
  };
};

