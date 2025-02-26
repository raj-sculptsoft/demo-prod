import clientFetcher from "@/lib/fetcher/client";
import { Payload } from "@/lib/fetcher/types";
import { Asset } from "@/types/assets";
import { PriorityCounts } from "@/types/common";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk actions for API calls
export const getAsset = createAsyncThunk(
  "assets/getAsset",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<Asset>({
        request: `Asset/${id}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getAssetStats = createAsyncThunk(
  "assets/getStats",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<PriorityCounts>({
        request: `Asset/VulnerabilityCounts/${id}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const addOrEditAsset = createAsyncThunk(
  "assets/addOrEditAsset",
  async (payload: Payload, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<Asset>({
        request: "Asset/AddUpdateAsset",
        method: "POST",
        payload,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteAsset = createAsyncThunk(
  "assets/delete",
  async (assetId: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher({
        request: `Asset/${assetId}`,
        method: "DELETE",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
