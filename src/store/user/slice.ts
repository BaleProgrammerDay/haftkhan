import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserResponse } from "~/api/types";
import { RootState } from "../store";

interface UserState extends UserResponse {
  isLoading: boolean;
}

const userState: UserState = {
  last_solved_question: 0,
  per_question: {},
  total_score: 0,
  username: "",
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {
    setUser: (_, action: PayloadAction<UserResponse>) => {
      console.log("@#@#", action.payload);
      return { ...action.payload, isLoading: false };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLastSolvedQuestion: (state, action: PayloadAction<number>) => {
      state.last_solved_question = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;

export const userSelector = (state: RootState) => state.user;

export const lastSolvedQuestionSelector = (state: RootState) =>
  state.user.last_solved_question;

export const perQuestionSelector = (state: RootState) =>
  state.user.per_question;

export const totalScoreSelector = (state: RootState) => state.user.total_score;

export const usernameSelector = (state: RootState) => state.user.username;

export const isLoadingSelector = (state: RootState) => state.user.isLoading;

