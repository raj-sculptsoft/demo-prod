import { Asset } from "@/types/assets";
import { PriorityCounts } from "@/types/common";
import { createSlice } from "@reduxjs/toolkit";
import { addOrEditAsset, deleteAsset, getAsset, getAssetStats } from "./api";

export interface AssetsState {
  currentAsset: {
    loading: boolean;
    data: Asset | null;
    error: string;
  };
  stats: {
    loading: boolean;
    data: PriorityCounts;
    error: string;
  };
  showAssetForm: boolean;
  addOrEditAsset: {
    loading: boolean;
    data: Asset | null;
    error: string;
  };
  editDetails: {
    loading: boolean;
    data: Asset | null;
    error: string;
  };

  deleteDialog: {
    open: boolean;
    title: string;
    description: string;
    data: unknown;
    loading: boolean;
  };
}

const initialState: AssetsState = {
  currentAsset: {
    loading: false,
    data: null,
    error: "",
  },
  stats: {
    loading: false,
    data: {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    },
    error: "",
  },
  showAssetForm: false,
  addOrEditAsset: {
    loading: false,
    data: null,
    error: "",
  },
  editDetails: {
    loading: false,
    data: null,
    error: "",
  },
  deleteDialog: {
    open: false,
    title: "",
    description: "",
    data: {},
    loading: false,
  },
};

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    // Reset State
    resetCurrentAsset: (state) => {
      state.currentAsset = initialState.currentAsset;
    },
    resetStats: (state) => {
      state.stats = initialState.stats;
    },
    resetAddOrEditAsset: (state) => {
      state.addOrEditAsset = initialState.addOrEditAsset;
    },
    resetEditDetails: (state) => {
      state.editDetails = initialState.editDetails;
    },
    resetDeleteDialog: (state) => {
      state.deleteDialog = initialState.deleteDialog;
    },
    setShowAssetForm: (state, { payload }) => {
      state.showAssetForm = payload;
    },
    setEditDetails: (state, { payload }) => {
      state.editDetails.data = payload;
      state.editDetails.loading = false;
      state.editDetails.error = "";
    },
    clearEditDetails: (state) => {
      state.editDetails = { loading: false, data: null, error: "" };
    },
  },
  extraReducers: (builder) => {
    // Get Asset
    builder
      .addCase(getAsset.pending, (state) => {
        state.currentAsset.loading = true;
        state.currentAsset.error = "";
      })
      .addCase(getAsset.fulfilled, (state, { payload }) => {
        state.currentAsset.loading = false;
        state.currentAsset.data = payload.data;
      })
      .addCase(getAsset.rejected, (state, { error }) => {
        state.currentAsset.loading = false;
        state.currentAsset.error = error.message as string;
      });

    // Get Asset Stats
    builder
      .addCase(getAssetStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = "";
      })
      .addCase(getAssetStats.fulfilled, (state, { payload }) => {
        state.stats.loading = false;
        state.stats.data = payload.data;
      })
      .addCase(getAssetStats.rejected, (state, { error }) => {
        state.stats.loading = false;
        state.stats.error = error.message as string;
      });

    // Add or Edit Asset
    builder
      .addCase(addOrEditAsset.pending, (state) => {
        state.addOrEditAsset.loading = true;
        state.addOrEditAsset.error = "";
      })
      .addCase(addOrEditAsset.fulfilled, (state, { payload }) => {
        state.addOrEditAsset.loading = false;
        state.addOrEditAsset.data = payload.data;
      })
      .addCase(addOrEditAsset.rejected, (state, { error }) => {
        state.addOrEditAsset.loading = false;
        state.addOrEditAsset.error = error.message as string;
      });

    // Delete Asset
    builder
      .addCase(deleteAsset.pending, (state) => {
        state.deleteDialog.loading = true;
      })
      .addCase(deleteAsset.fulfilled, (state) => {
        state.deleteDialog = {
          open: false,
          title: "",
          description: "",
          data: {},
          loading: false,
        };
      })
      .addCase(deleteAsset.rejected, (state) => {
        state.deleteDialog.loading = false;
      });
  },
});

export const {
  setShowAssetForm,
  setEditDetails,
  clearEditDetails,
  resetCurrentAsset,
  resetStats,
  resetAddOrEditAsset,
  resetEditDetails,
  resetDeleteDialog,
} = assetsSlice.actions;

export default assetsSlice.reducer;
