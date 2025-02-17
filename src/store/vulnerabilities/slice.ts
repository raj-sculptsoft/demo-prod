import { StaticSelectOptions } from "@/types/common";
import { DashboardStats } from "@/types/dashboard";
import {
  FeedbackGet,
  Vulnerability,
  VulnerabilityCounts,
} from "@/types/vulnerability";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addOrEditFeedback,
  getFalsePositivityReasonOptions,
  getFeedbackDetails,
  getPositivity,
  getTruePositivityReasonOptions,
  getVulnerability,
  getVulnerabilityStats,
} from "./api";

export interface VulnerabilitiesState {
  loading: boolean;
  error: string | null;
  message: string | null;
  currentVulnerability: {
    loading: boolean;
    data: Vulnerability | null;
    error: string;
  };
  stats: {
    loading: boolean;
    data: VulnerabilityCounts | DashboardStats;
    error: string;
  };
  reasons: {
    list: StaticSelectOptions[];
  };
  positivity: {
    list: StaticSelectOptions[];
  };
  details: FeedbackGet | null;
}

const initialState: VulnerabilitiesState = {
  loading: false,
  error: null,
  message: null,
  currentVulnerability: {
    loading: false,
    data: null,
    error: "",
  },
  stats: {
    loading: false,
    data: {
      Total_True: 0,
      Total_False: 0,
      Critical_True: 0,
      Critical_False: 0,
      High_True: 0,
      High_False: 0,
      Medium_True: 0,
      Medium_False: 0,
      Low_True: 0,
      Low_False: 0,
    },
    error: "",
  },
  reasons: {
    list: [],
  },
  positivity: {
    list: [],
  },
  details: null,
};

export const vulnerabilitySlice = createSlice({
  name: "vulnerability",
  initialState,
  reducers: {
    // Reset State
    resetVulnerabilityState: (state) => {
      state.currentVulnerability = initialState.currentVulnerability;
      state.stats = initialState.stats;
      state.reasons = initialState.reasons;
      state.positivity = initialState.positivity;
      state.details = initialState.details;
    },
  },
  extraReducers: (builder) => {
    // Get Single Vulnerability
    builder
      .addCase(getVulnerability.pending, (state) => {
        state.currentVulnerability.loading = true;
        state.currentVulnerability.error = "";
      })
      .addCase(getVulnerability.fulfilled, (state, { payload }) => {
        state.currentVulnerability.loading = false;
        state.currentVulnerability.data = payload.data;
      })
      .addCase(getVulnerability.rejected, (state, { error }) => {
        state.currentVulnerability.loading = false;
        state.currentVulnerability.error = error.message as string;
      });

    // Get Vulnerabilities Stats
    builder
      .addCase(getVulnerabilityStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = "";
      })
      .addCase(getVulnerabilityStats.fulfilled, (state, { payload }) => {
        state.stats.loading = false;
        state.stats.data = payload.data;
      })
      .addCase(getVulnerabilityStats.rejected, (state, { error }) => {
        state.stats.loading = false;
        state.stats.error = error.message as string;
      });

    // Get False Positivity Reason Options
    builder
      .addCase(getFalsePositivityReasonOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFalsePositivityReasonOptions.fulfilled,
        (state, action: PayloadAction<StaticSelectOptions[]>) => {
          state.loading = false;
          state.reasons.list = action.payload;
        },
      )
      .addCase(getFalsePositivityReasonOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch reasons";
      });

    // Get True Positivity Reason Options
    builder
      .addCase(getTruePositivityReasonOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTruePositivityReasonOptions.fulfilled,
        (state, action: PayloadAction<StaticSelectOptions[]>) => {
          state.loading = false;
          state.reasons.list = action.payload;
        },
      )
      .addCase(getTruePositivityReasonOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch reasons";
      });

    // Get Positivity Options
    builder
      .addCase(getPositivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPositivity.fulfilled,
        (state, action: PayloadAction<StaticSelectOptions[]>) => {
          state.loading = false;
          state.positivity.list = action.payload;
        },
      )
      .addCase(getPositivity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Failed to fetch positivity options";
      });

    // Add or Edit Feedback
    builder
      .addCase(addOrEditFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrEditFeedback.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload.message;
      })
      .addCase(addOrEditFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Feedback Details
    builder
      .addCase(getFeedbackDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedbackDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.data;
      })
      .addCase(getFeedbackDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetVulnerabilityState } = vulnerabilitySlice.actions;
export default vulnerabilitySlice.reducer;
