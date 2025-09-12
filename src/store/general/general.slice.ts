import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const generalSlice = createSlice({
  name: 'chat',
  initialState: {
	isPowerActive: true
  },
  reducers: {
	togglePower(state, action: PayloadAction<boolean>) {
		state.isPowerActive = action.payload
	}
  }
})

export const { togglePower } = generalSlice.actions;
export const generalReducer = generalSlice.reducer;