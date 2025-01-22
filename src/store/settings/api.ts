import {
  LinkAssets,
  Settings,
  SyncPayload,
  TargetList,
} from "@/types/settings";

// API Calls (Redux Toolkit Async Thunks)
import clientFetcher from "@/lib/fetcher/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addOrEditSynk = createAsyncThunk(
  "settings/addOrUpdateSynk",
  async (payload: SyncPayload, { rejectWithValue }) => {
    try {
      const payloadAsRecord: Record<string, unknown> = {
        ...payload,
        integration_data: { ...payload.integration_data },
      };

      const response = await clientFetcher<Settings>({
        request: "ThirdPartyIntegration/AddUpdateThirdPartyIntegration",
        method: "POST",
        payload: payloadAsRecord,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as { message: string })?.message ?? "An error occurred",
      );
    }
  },
);

export const getSynk = createAsyncThunk(
  "settings/getSynk",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<Settings>({
        request: `ThirdPartyIntegrationR/${id}`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as { message: string })?.message ?? "An error occurred",
      );
    }
  },
);

export const getTargetList = createAsyncThunk(
  "synk/getTargetList",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<TargetList>({
        request: `ProjectList/${id}`,
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

export const addOrEditTargets = createAsyncThunk(
  "targets/addOrEditTargets",
  async (
    payload: {
      products: {
        product_id: string;
        targets: {
          target_id: string;
          target_name: string;
        }[];
      }[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await clientFetcher<LinkAssets>({
        request: "LinkProject/AddUpdateTargets",
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
