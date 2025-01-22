import {
  DashboardRiskMatrix,
  DashboardStats,
  DashboardTopVulnerabilityList,
  DashboardVulnerabilities,
  DashboardVulnerabilitiesDetailsList,
} from "@/types/dashboard";
import { createSlice } from "@reduxjs/toolkit";
import {
  getDashboardRiskMatrix,
  getDashboardStats,
  getDashboardTopVulnerability,
  getDashboardVulnerabilities,
  getDashboardVulnerabilityDetails,
} from "./api";

export interface DashboardState {
  showAssetsGraph: boolean;
  vulnerabilityData: DashboardTopVulnerabilityList | null;
  stats: { loading: boolean; data: DashboardStats; error: string };
  vulnerabilities: {
    loading: boolean;
    data: DashboardVulnerabilities;
    error: string;
  };
  riskMatrix: {
    loading: boolean;
    data: DashboardRiskMatrix;
    error: string;
  };
  vulnerabilityDetails: {
    loading: boolean;
    data: DashboardVulnerabilitiesDetailsList;
    error: string;
  };
  topVulnerability: {
    loading: boolean;
    data: DashboardTopVulnerabilityList;
    error: string;
  };
}

const initialState: DashboardState = {
  showAssetsGraph: false,
  vulnerabilityData: null,
  stats: {
    loading: true,
    data: {
      total_products: 0,
      total_vulnerabilities: 0,
      total_true_positives: 0,
      total_false_positives: 0,
      total_hours_saved: 0,
      total_files: 0,
      total_assets: 0,
      critical_count: 0,
      high_count: 0,
      medium_count: 0,
      low_count: 0,
    },
    error: "",
  },
  vulnerabilities: {
    loading: true,
    data: {
      total_vulnerabilities: 0,
      critical_count: 0,
      high_count: 0,
      medium_count: 0,
      low_count: 0,
    },
    error: "",
  },
  riskMatrix: {
    loading: true,
    data: {
      risk_matrix: {
        Critical: { Critical: 0, High: 0, Medium: 0, Low: 0 },
        High: { Critical: 0, High: 0, Medium: 0, Low: 0 },
        Medium: { Critical: 0, High: 0, Medium: 0, Low: 0 },
        Low: { Critical: 0, High: 0, Medium: 0, Low: 0 },
      },
    },
    error: "",
  },
  vulnerabilityDetails: {
    loading: true,
    data: { list: [] },
    error: "",
  },
  topVulnerability: {
    loading: true,
    data: { list: [] },
    error: "",
  },
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboardState: () => {
      return initialState;
    },
    setShowAssetsGraph: (state, { payload }) => {
      state.showAssetsGraph = payload;
      if (!payload) {
        state.vulnerabilityData = null;
      }
    },
    setVulnerabilityData: (state, { payload }) => {
      state.vulnerabilityData = payload;
    },
  },
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = "";
      })
      .addCase(getDashboardStats.fulfilled, (state, { payload }) => {
        state.stats.loading = false;
        state.stats.data = payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, { error }) => {
        state.stats.loading = false;
        state.stats.error = error.message as string;
      });

    // Dashboard Vulnerabilities
    builder
      .addCase(getDashboardVulnerabilities.pending, (state) => {
        state.vulnerabilities.loading = true;
        state.vulnerabilities.error = "";
      })
      .addCase(getDashboardVulnerabilities.fulfilled, (state, { payload }) => {
        state.vulnerabilities.loading = false;
        state.vulnerabilities.data = payload.data;
      })
      .addCase(getDashboardVulnerabilities.rejected, (state, { error }) => {
        state.vulnerabilities.loading = false;
        state.vulnerabilities.error = error.message as string;
      });

    // Risk Matrix
    builder
      .addCase(getDashboardRiskMatrix.pending, (state) => {
        state.riskMatrix.loading = true;
        state.riskMatrix.error = "";
      })
      .addCase(getDashboardRiskMatrix.fulfilled, (state, { payload }) => {
        state.riskMatrix.loading = false;
        state.riskMatrix.data = payload.data;
      })
      .addCase(getDashboardRiskMatrix.rejected, (state, { error }) => {
        state.riskMatrix.loading = false;
        state.riskMatrix.error = error.message as string;
      });

    // Vulnerability Details
    builder
      .addCase(getDashboardVulnerabilityDetails.pending, (state) => {
        state.vulnerabilityDetails.loading = true;
        state.vulnerabilityDetails.error = "";
      })
      .addCase(
        getDashboardVulnerabilityDetails.fulfilled,
        (state, { payload }) => {
          state.vulnerabilityDetails.loading = false;
          state.vulnerabilityDetails.data = payload.data;
        },
      )
      .addCase(
        getDashboardVulnerabilityDetails.rejected,
        (state, { error }) => {
          state.vulnerabilityDetails.loading = false;
          state.vulnerabilityDetails.error = error.message as string;
        },
      );

    // Top Vulnerability
    builder
      .addCase(getDashboardTopVulnerability.pending, (state) => {
        state.topVulnerability.loading = true;
        state.topVulnerability.error = "";
      })
      .addCase(getDashboardTopVulnerability.fulfilled, (state, { payload }) => {
        state.topVulnerability.loading = false;
        state.topVulnerability.data = payload.data;
      })
      .addCase(getDashboardTopVulnerability.rejected, (state, { error }) => {
        state.topVulnerability.loading = false;
        state.topVulnerability.error = error.message as string;
      });
  },
});

export const { resetDashboardState, setShowAssetsGraph, setVulnerabilityData } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
