import { LinkAssets, Settings, TargetData, TargetList } from "@/types/settings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addOrEditSynk, addOrEditTargets, getSynk, getTargetList } from "./api";

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
  targetListLoading: boolean;
  targetListError: string | null;
  successMessage: string | null;
}

const initialState: SynkState = {
  data: null,
  loading: false,
  error: null,
  targets: null,
  targetListLoading: false,
  targetListError: null,
  successMessage: null,
};

const synkSlice = createSlice({
  name: "synk",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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

    builder
      .addCase(addOrEditTargets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addOrEditTargets.fulfilled,
        (state, action: PayloadAction<IResponse<LinkAssets>>) => {
          state.loading = false;
          state.successMessage = action.payload.message;
        },
      )
      .addCase(addOrEditTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default synkSlice.reducer;
