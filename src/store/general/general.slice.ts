import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const generalSlice = createSlice({
  name: 'chat',
  initialState: {
	isPowerActive: true
  },
  reducers: {
	togglePower(state, action: PayloadAction<boolean>) {
		state.isPowerActive = action.payload
    if (!state.isPowerActive) {
     document.body.classList.add("flashlight_cursor");
    } else {
      document.body.classList.remove("flashlight_cursor");
    }
	}
  }
})

export const { togglePower } = generalSlice.actions;
export const generalReducer = generalSlice.reducer;