import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Chats } from "~/pages/khan-7/messenger/types/Chat";

export const chatSelector = (state: RootState) => state.chat;

export const messagesByChatIdSelector = (id: Chats) => createSelector(chatSelector, (chat) => chat[id].messages);