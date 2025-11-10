import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface StatusState {
  approvalStatus: "not_checked" | "pending" | "approved" | "rejected" | "not_requested";
  lastChecked: string | null;
}

const initialState: StatusState = {
  approvalStatus: "not_checked",
  lastChecked: null,
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setApprovalStatus: (
      state,
      action: PayloadAction<{
        approvalStatus: "not_checked" | "pending" | "approved" | "rejected" | "not_requested";
      }>
    ) => {
      state.approvalStatus = action.payload.approvalStatus;
      state.lastChecked = new Date().toISOString();
    },
    resetApprovalStatus: (state) => {
      state.approvalStatus = "not_checked";
      state.lastChecked = null;
    },
  },
});

export const { setApprovalStatus, resetApprovalStatus } = statusSlice.actions;
export default statusSlice.reducer;