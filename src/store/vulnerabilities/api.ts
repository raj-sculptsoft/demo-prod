import { SelectsEnum } from "@/lib/common";
import clientFetcher from "@/lib/fetcher/client";
import { StaticSelectOptions } from "@/types/common";
import { DashboardStats } from "@/types/dashboard";
import {
  FeedbackGet,
  Vulnerability,
  VulnerabilityCounts,
} from "@/types/vulnerability";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getVulnerability = createAsyncThunk(
  "vulnerability/getOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<Vulnerability>({
        request: `Vulnerability/${id}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getVulnerabilityStats = createAsyncThunk(
  "vulnerability/stats",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<
        VulnerabilityCounts | DashboardStats
      >({
        request: `Vulnerability/VulnerabilityCounts/${id}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getFalsePositivityReasonOptions = createAsyncThunk(
  "synk/getFalsePositivityReasonOptions",
  async () => {
    const response = await clientFetcher<{ list: StaticSelectOptions[] }>({
      request: `Enum/${SelectsEnum.FalsePositivityReason}`,
      method: "GET",
    });
    return response.data.list;
  },
);

export const getTruePositivityReasonOptions = createAsyncThunk(
  "synk/getTruePositivityReasonOptions",
  async () => {
    const response = await clientFetcher<{ list: StaticSelectOptions[] }>({
      request: `Enum/${SelectsEnum.TruePositivityReason}`,
      method: "GET",
    });
    return response.data.list;
  },
);

export const getPositivity = createAsyncThunk(
  "synk/getPositivity",
  async () => {
    const response = await clientFetcher<{ list: StaticSelectOptions[] }>({
      request: `Enum/${SelectsEnum.Positivity}`,
      method: "GET",
    });
    return response.data.list;
  },
);

export const addOrEditFeedback = createAsyncThunk(
  "feedback/addOrEditFeedback",
  async (
    payload: {
      vulnerability_id: string;
      false_positivity: string | null;
      false_positivity_reason: string | null;
      true_positivity: string | null;
      true_positivity_reason: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await clientFetcher({
        request: "Feedback/AddFeedback",
        method: "POST",
        payload,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as { message: string })?.message ?? "An error occurred",
      );
    }
  },
);

export const getFeedbackDetails = createAsyncThunk(
  "feedback/getFeedbackDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<FeedbackGet>({
        request: `Feedback/${id}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as { message: string })?.message ?? "An error occurred",
      );
    }
  },
);
