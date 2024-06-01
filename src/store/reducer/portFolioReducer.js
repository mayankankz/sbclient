import { createSlice } from "@reduxjs/toolkit";
import products from "../../api/products";
import { act } from "@testing-library/react";
import portFolioItems from "../../api/portFolioItems";
const portFolioSlice = createSlice({
  name: "portFolio",
  initialState: {
    portFolioItems: portFolioItems,
    selectedPortFolio: "",
  },
  reducers: {
    setSelectedPortFolio(state, action) {
      state.selectedPortFolio = action.payload;
    },
    logout(state,action){
      state = undefined;
    }
  },
});

export const { setSelectedPortFolio ,logout} = portFolioSlice.actions;

export default portFolioSlice.reducer;
