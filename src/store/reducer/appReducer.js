import { createSlice } from "@reduxjs/toolkit";
import { act } from "@testing-library/react";
import blogList from "../../api/blogList";
const appSlice = createSlice({
  name: "app",
  initialState: {
    appState: {
        auth: {},
        schools:[],
    },
  },
  reducers: {
    setSchools(state, action) {
      state.schools = action.payload;
    },
  },
});

export const { setSchools } = appSlice.actions;

export default appSlice.reducer;
