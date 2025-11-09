import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import type {PersistConfig} from "redux-persist"

import authReducer from "../Store/Slices/AuthSlice";
import walletReducer from "../Store/Slices/WalletSlice";

// Combine reducers 
const rootReducer = combineReducers({
  auth: authReducer,
  wallet: walletReducer,
});

// Define RootState type based on the rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// Create a properly typed persist config
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["auth","wallet","requests"], 
};

// Wrap reducer with correct type
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor = persistStore(store);

// Export typed hooks
export type AppDispatch = typeof store.dispatch;
