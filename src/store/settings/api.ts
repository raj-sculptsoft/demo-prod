import clientFetcher from "@/lib/fetcher/client";
import {
  FetchStatusResponse,
  LinkAssets,
  ProjectLink,
  Settings,
  SyncPayload,
  TargetList,
} from "@/types/settings";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk actions for API calls
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
        request: `Semgrep/ProjectList/${id}`,
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
        projects: {
          project_id: string;
          project_name: string;
          program_language: string[] | null;
        }[];
      }[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await clientFetcher<LinkAssets>({
        request: "Semgrep/LinkProject/AddUpdateProjects",
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

export const getProjectLink = createAsyncThunk(
  "synk/getProjectLink",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<ProjectLink>({
        request: `Semgrep/MappedProject/${id}`,
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

export const fetchStatusById = createAsyncThunk(
  "fetch-status-by-id",
  async (statusId: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<FetchStatusResponse>({
        request: `Semgrep/Status/${statusId}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
