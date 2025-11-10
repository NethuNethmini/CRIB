import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface RequestItem {
  id: string;
  bankName: string;
  bankId: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface RequestState {
  requests: RequestItem[];
}

const initialState: RequestState = {
  requests: [],
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    // Set all requests 
    setRequests: (state, action: PayloadAction<RequestItem[]>) => {
      state.requests = action.payload;
    },

    // Update a single request’s status
    updateRequestStatus: (
      state,
      action: PayloadAction<{ id: string; status: "Pending" | "Approved" | "Rejected" }>
    ) => {
      const { id, status } = action.payload;
      const request = state.requests.find((r) => r.id === id);
      if (request) {
        request.status = status;
      }
    },

    // Optional: clear all requests
    clearRequests: (state) => {
      state.requests = [];
    },
  },
});

export const { setRequests, updateRequestStatus, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;
