import { createSlice } from "@reduxjs/toolkit";
import type{ PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string;
}

const initialState: WalletState = {
  address: "",
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    clearWalletAddress: (state) => {
      state.address = "";
    },
  },
});

export const { setWalletAddress, clearWalletAddress } = walletSlice.actions;
export default walletSlice.reducer;
