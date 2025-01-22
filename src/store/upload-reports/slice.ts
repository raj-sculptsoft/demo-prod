import { createSlice } from "@reduxjs/toolkit";
import { fetchReportById, uploadReport } from "./api";

const initialState = {
  uploadReport: { loading: false, data: {}, error: "" },
  reportStatus: { loading: false, data: { status: "" }, error: "" },
  reportId: "",
};

export const uploadReportSlice = createSlice({
  name: "uploadReport",
  initialState,
  reducers: {
    resetUploadReportState: () => {
      return initialState;
    },
    resetReportStatusState: (state) => {
      state.reportStatus = { loading: false, data: { status: "" }, error: "" };
    },
    setReportId: (state, action) => {
      state.reportId = action.payload;
    },
    resetReportId: (state) => {
      state.reportId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadReport.pending, (state) => {
        state.uploadReport.loading = true;
      })
      .addCase(uploadReport.fulfilled, (state, action) => {
        state.uploadReport.loading = false;
        state.uploadReport.data = action.payload;
        state.reportId = action.payload.data.report_id;
      })

      .addCase(uploadReport.rejected, (state, { error }) => {
        state.uploadReport.loading = false;
        state.uploadReport.error = error.message as string;
      });

    builder
      .addCase(fetchReportById.pending, (state) => {
        state.reportStatus.loading = true;
      })
      .addCase(fetchReportById.fulfilled, (state, { payload }) => {
        state.reportStatus.loading = false;
        state.reportStatus.data.status = payload.data.status;
      })
      .addCase(fetchReportById.rejected, (state, { error }) => {
        state.reportStatus.loading = false;
        state.reportStatus.error = error.message as string;
      });
  },
});

export const {
  resetUploadReportState,
  resetReportStatusState,
  setReportId,
  resetReportId,
} = uploadReportSlice.actions;
export default uploadReportSlice.reducer;
