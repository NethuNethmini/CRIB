import { combineReducers } from "redux";
import authReducer from "./Slices/AuthSlice";
import walletReducer from "./Slices/WalletSlice"
import statusReducer from "./Slices/StatusSlice"

export const rootReducer = combineReducers({
  auth: authReducer,
  wallet:walletReducer,
  status: statusReducer, 
  
});

export type RootState = ReturnType<typeof rootReducer>;
