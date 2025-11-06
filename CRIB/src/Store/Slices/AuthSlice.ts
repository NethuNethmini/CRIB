import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  auth: string;
  refresh: string;
  role: string;
  bankName: string;
  bankId: string;
  username: string;
}

const initialState: AuthState = {
  auth: "",
  refresh: "",
  role: "",
  bankName: "",
  bankId: "",
  username: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveAuth: (state, action: PayloadAction<string>) => {
      state.auth = action.payload;
    },
    saveRefresh: (state, action: PayloadAction<string>) => {
      state.refresh = action.payload;
    },
    saveRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    saveBankName: (state, action: PayloadAction<string>) => {
      state.bankName = action.payload;
    },
    saveBankId: (state, action: PayloadAction<string>) => {
      state.bankId = action.payload;
    },
    saveUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    clearAuth: (state) => {
      state.auth = "";
      state.refresh = "";
      state.role = "";
      state.bankName = "";
      state.bankId = "";
      state.username = "";
    },
  },
});

export const {
  saveAuth,
  saveRefresh,
  saveRole,
  saveBankName,
  saveBankId,
  saveUsername,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
