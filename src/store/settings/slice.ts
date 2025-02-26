import {
  DataAsset,
  LinkAssets,
  ProjectLink,
  Settings,
  TargetData,
  TargetList,
} from "@/types/settings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addOrEditSynk,
  addOrEditTargets,
  fetchStatusById,
  getProjectLink,
  getSynk,
  getTargetList,
} from "./api";

// Assuming IResponse is the response structure returned from the backend
interface IResponse<T> {
  success: number;
  message: string;
  data: T;
}

export interface SynkState {
  data: Settings | null;
  loading: boolean;
  error: string | null;
  targets: TargetData | null;
  linkProject: ProjectLink | null;
  listAsset: DataAsset | null;
  targetListLoading: boolean;
  targetListError: string | null;
  statusId: string | null;
  statusReport: { data: { status: string }; message: string };
}

const initialState: SynkState = {
  data: null,
  loading: false,
  error: null,
  targets: null,
  linkProject: null,
  listAsset: null,
  targetListLoading: false,
  targetListError: null,
  statusId: "",
  statusReport: { data: { status: "" }, message: "" },
};

const synkSlice = createSlice({
  name: "synk",
  initialState,
  reducers: {
    // Reset State
    resetLinkProjectState: (state) => {
      state.linkProject = null;
    },
    setStatusId: (state, action) => {
      state.statusId = action.payload;
    },
    resetStatusId: (state) => {
      state.statusId = "";
    },
    resetStatusReportState: (state) => {
      state.statusReport = { data: { status: "" }, message: "" };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Synk
    builder
      .addCase(getSynk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSynk.fulfilled, (state, action: PayloadAction<Settings>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getSynk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Target List
    builder
      .addCase(addOrEditSynk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addOrEditSynk.fulfilled,
        (state, action: PayloadAction<IResponse<Settings>>) => {
          state.loading = false;
          state.data = action.payload.data;
        },
      )
      .addCase(addOrEditSynk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Target List
    builder
      .addCase(getTargetList.pending, (state) => {
        state.targetListLoading = true;
        state.targetListError = null;
      })
      .addCase(
        getTargetList.fulfilled,
        (state, action: PayloadAction<IResponse<TargetList>>) => {
          state.targetListLoading = false;
          state.targets = action.payload.data;
        },
      )
      .addCase(getTargetList.rejected, (state, action) => {
        state.targetListLoading = false;
        state.targetListError = action.payload as string;
      });

    // Add or Edit Targets
    builder
      .addCase(addOrEditTargets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addOrEditTargets.fulfilled,
        (state, action: PayloadAction<IResponse<LinkAssets>>) => {
          state.loading = false;
          state.listAsset = action.payload.data;
        },
      )
      .addCase(addOrEditTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Project Link
    builder
      .addCase(getProjectLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProjectLink.fulfilled,
        (state, action: PayloadAction<IResponse<ProjectLink>>) => {
          state.loading = false;
          state.linkProject = action.payload.data;
        },
      )
      .addCase(getProjectLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Status By Id
    builder
      .addCase(fetchStatusById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatusById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.statusReport.data.status = payload.data.status;
        state.statusReport.message = payload.message;
      })
      .addCase(fetchStatusById.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      });
  },
});

export const {
  resetLinkProjectState,
  setStatusId,
  resetStatusId,
  resetStatusReportState,
} = synkSlice.actions;
export default synkSlice.reducer;
