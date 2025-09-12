import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatReducer } from "./chat/chat.slice";
import { generalReducer } from "./general/general.slice";

export const store = configureStore({
  reducer: combineReducers({chat: chatReducer, general: generalReducer})
})

export type RootState = ReturnType<typeof store.getState>