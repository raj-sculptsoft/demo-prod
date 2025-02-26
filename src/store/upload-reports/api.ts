import clientFetcher from "@/lib/fetcher/client";
import {
  FetchReportResponse,
  UploadReportResponse,
} from "@/types/upload-report";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk actions for API calls
export const uploadReport = createAsyncThunk(
  "upload-report",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<UploadReportResponse>({
        request: "Report/UploadReport",
        method: "POST",
        payload,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchReportById = createAsyncThunk(
  "fetch-report-by-id",
  async (reportId: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<FetchReportResponse>({
        request: `Report/${reportId}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
