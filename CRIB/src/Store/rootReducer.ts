import { combineReducers } from "redux";
import authReducer from "./Slices/AuthSlice";
import walletReducer from "./Slices/WalletSlice"

export const rootReducer = combineReducers({
  auth: authReducer,
  wallet:walletReducer,
  
});

export type RootState = ReturnType<typeof rootReducer>;
