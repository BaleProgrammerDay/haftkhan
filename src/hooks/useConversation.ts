import { useState, useCallback } from "react";
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

export const useConversation = (initialLuigiMessage: string) => {
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

      return newMessage;
    },
    []
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
    if (!state.currentUserInput.trim()) return;

    const userMessage = state.currentUserInput.trim();

    // Add user message
    addMessage({
      role: "user",
      message: userMessage,
    });

    // Keep input value and set typing states
    setState((prev) => ({
      ...prev,
      isUserTyping: false,
      isLuigiTyping: true,
      conversationPhase: "luigi-response",
    }));

    try {
      // Prepare conversation history for API
      const conversationHistory = state.messages.map((msg) => ({
        role: msg.role,
        message: msg.message,
      }));

      // Get Luigi's response
      const response = await API.getLuigiResponse(
        userMessage,
        conversationHistory
      );

      // Add Luigi's response
      addMessage({
        role: "luigi",
        message:
          response.message || response.text || "Sorry, I could not respond.",
      });

      setState((prev) => ({
        ...prev,
        isLuigiTyping: false,
        conversationPhase: "user-input",
      }));
    } catch (error) {
      console.error("Failed to get Luigi response:", error);

      // Add fallback message
      addMessage({
        role: "luigi",
        message: "Sorry, I had trouble responding. Please try again.",
      });

      setState((prev) => ({
        ...prev,
        isLuigiTyping: false,
        conversationPhase: "user-input",
      }));
    }
  }, [state.currentUserInput, state.messages, addMessage]);

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

