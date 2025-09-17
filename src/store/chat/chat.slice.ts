import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, Message } from "~/pages/khan-7/messenger/types/Chat";
import { initialChats } from "./chat.constants";
import { Chats } from "~/pages/khan-7/messenger/types/Chat";

const chatSlice = createSlice({
  name: "chat",
  initialState: { current: Chats.Olad, list: initialChats },
  reducers: {
    setCurrentChat(state, action: PayloadAction<Chats>) {
      state.current = action.payload;
      state.list[action.payload].unreadCount = 0;
    },
    deleteMessage(
      state,
      action: PayloadAction<{ chatId: Chats; messageId: string }>
    ) {
      const { chatId, messageId } = action.payload;
      state.list[chatId].messages = state.list[chatId].messages.filter(
        (msg) => msg.id !== messageId
      );
    },
    addMessage(
      state,
      action: PayloadAction<{
        chatId: Chats;
        message: Omit<Message, "id" | "time">;
      }>
    ) {
      const { chatId, message } = action.payload;
      if (!state.list[chatId]) {
        throw new Error(`Chat with id ${chatId} does not exist.`);
      }
      state.list[chatId].messages.push({
        ...message,
        time: new Date().getTime(),
        id: Date.now().toString(),
      });

      if (state.current !== chatId && message.sender !== "me") {
        state.list[chatId].unreadCount += 1;
      }
    },
    toggleSendingFile(
      state,
      action: PayloadAction<{ chatId: Chats; active?: boolean }>
    ) {
      state.list[action.payload.chatId].sendFile = action.payload.active;
    },
    changeChatState(
      state,
      action: PayloadAction<{ chatId: Chats; newState: ChatState }>
    ) {
      const { chatId, newState } = action.payload;
      if (!state.list[chatId]) {
        throw new Error(`Chat with id ${chatId} does not exist.`);
      }
      state.list[chatId].state = newState;
    },
  },
});

export const {
  setCurrentChat,
  deleteMessage,
  addMessage,
  changeChatState,
  toggleSendingFile,
} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
