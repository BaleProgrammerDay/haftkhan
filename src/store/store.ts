import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatReducer } from "./chat/chat.slice";
import { generalReducer } from "./general/general.slice";
import { userReducer } from "./user/slice";

export const store = configureStore({
  reducer: combineReducers({
    chat: chatReducer,
    general: generalReducer,
    user: userReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
