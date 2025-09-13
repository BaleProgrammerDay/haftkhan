import { useState, useCallback, useRef } from "react";
import { API } from "~/api/api";

export interface ConversationMessage {
  id: string;
  role: "user" | "luigi";
  message: string;
  timestamp: number;
}

export interface ConversationState {
  messages: ConversationMessage[];
  isLuigiTyping: boolean;
  isUserTyping: boolean;
  currentUserInput: string;
  conversationPhase:
    | "luigi-start"
    | "user-input"
    | "luigi-response"
    | "conversation-flow";
}

export const useConversation = (initialLuigiMessage: string, onLuigiMessageAdded?: () => void) => {
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
    isUserTyping: false,
    currentUserInput: "",
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
    (isLuigiTyping: boolean, isUserTyping: boolean) => {
      setState((prev) => ({
        ...prev,
        isLuigiTyping,
        isUserTyping,
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

  const sendUserMessage = useCallback(async () => {
    const currentState = stateRef.current;

    if (!currentState.currentUserInput.trim()) {
      return;
    }

    const userMessage = currentState.currentUserInput.trim();

    // Add user message
    addMessage({
      role: "user",
      message: userMessage,
    });

    // Clear input and set typing states immediately
    setState((prevState) => {
      return {
        ...prevState,
        currentUserInput: "",
        isUserTyping: false,
        isLuigiTyping: true,
        conversationPhase: "luigi-response" as const,
      };
    });

    // Continue with API call after state update
    try {
      // Only send the last message to the model as requested
      const openAIMessages = [
        {
          role: "user" as const,
          content: userMessage,
        },
      ];

      // Get Luigi's response
      const response = await API.getLuigiResponse(userMessage, openAIMessages);

      console.log("response", response);
      // Add Luigi's response
      addMessage({
        role: "luigi",
        message:
          response.message || response.text || "Sorry, I could not respond.",
      });
    } catch (error) {
      console.error("Failed to get Luigi response:", error);

      // Add fallback message
      addMessage({
        role: "luigi",
        message: "Sorry, I had trouble responding. Please try again.",
      });
    }
  }, [addMessage]);

  const getCurrentLuigiMessage = useCallback(() => {
    const lastLuigiMessage = state.messages
      .filter((msg) => msg.role === "luigi")
      .pop();
    return lastLuigiMessage?.message || "";
  }, [state.messages]);

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
    getCurrentUserMessage,
    finishLuigiTyping,
    clearUserInput,
  };
};

