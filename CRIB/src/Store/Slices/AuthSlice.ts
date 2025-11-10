import { createSlice } from "@reduxjs/toolkit";
import type{PayloadAction} from "@reduxjs/toolkit"

// Define the shape of your auth state
interface AuthState {
  auth: string;
  refresh: string;
  role: "bank" | "crib" | null;
  bankName: string;
  bankId: string;
  username: string;
  mnemonic: string;
}

// Initial state
const initialState: AuthState = {
  auth: "",
  refresh: "",
  role: null,
  bankName: "",
  bankId: "",
  username: "",
  mnemonic: "",
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login success stores the JWT and role
    loginSuccess: (
      state,
      action: PayloadAction<{ auth: string; role: "bank" | "crib" }>
    ) => {
      state.auth = action.payload.auth;
      state.role = action.payload.role;
    },

    // Set all auth-related data at once
    setAuthData: (
      state,
      action: PayloadAction<{
        auth: string;
        refresh?: string;
        role?: "bank" | "crib";
        bankName?: string;
        bankId?: string;
        username?: string;
        mnemonic?: string;
      }>
    ) => {
      state.auth = action.payload.auth;
      state.refresh = action.payload.refresh || "";
      state.role = action.payload.role || null;
      state.bankName = action.payload.bankName || "";
      state.bankId = action.payload.bankId || "";
      state.username = action.payload.username || "";
      state.mnemonic = action.payload.mnemonic || "";
    },

    // Individual field updaters
    saveAuth: (state, action: PayloadAction<string>) => {
      state.auth = action.payload;
    },
    saveRefresh: (state, action: PayloadAction<string>) => {
      state.refresh = action.payload;
    },
    saveRole: (state, action: PayloadAction<"bank" | "crib" | null>) => {
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
    saveMnemonic: (state, action: PayloadAction<string>) => {
      state.mnemonic = action.payload;
    },

    // Clear all data on logout
    clearAuth: (state) => {
      state.auth = "";
      state.refresh = "";
      state.role = null;
      state.bankName = "";
      state.bankId = "";
      state.username = "";
      state.mnemonic = "";
    },
  },
});

// Export actions
export const {
  loginSuccess,
  setAuthData,
  saveAuth,
  saveRefresh,
  saveRole,
  saveBankName,
  saveBankId,
  saveUsername,
  saveMnemonic,
  clearAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
