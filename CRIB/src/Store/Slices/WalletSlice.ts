import { createSlice } from "@reduxjs/toolkit";
import type{ PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string;
  mnemonic :string
}

const initialState: WalletState = {
  address: "",
  mnemonic:""
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletAddress: (
  state,
  action: PayloadAction<{ mnemonic: string; address?: string }>
) => {
  state.mnemonic = action.payload.mnemonic;
  if (action.payload.address) {
    state.address = action.payload.address;
  }
},

    clearWalletAddress: (state) => {
      state.address = "";
      state.mnemonic = "";
    },
  },
});

export const { setWalletAddress, clearWalletAddress } = walletSlice.actions;
export default walletSlice.reducer;
