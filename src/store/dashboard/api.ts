import clientFetcher from "@/lib/fetcher/client";
import {
  DashboardRiskMatrix,
  DashboardStats,
  DashboardTopVulnerabilityList,
  DashboardVulnerabilities,
  DashboardVulnerabilitiesDetailsList,
} from "@/types/dashboard";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface GetDashboardParams {
  company_id: string;
  product_id?: string;
  asset_id?: string;
}

const buildQueryParams = (params: GetDashboardParams) => {
  const queryParams = new URLSearchParams({ company_id: params.company_id });

  if (params.product_id) {
    queryParams.append("product_id", params.product_id);
  }

  if (params.asset_id) {
    queryParams.append("asset_id", params.asset_id);
  }

  return queryParams.toString();
};

export const getDashboardStats = createAsyncThunk(
  "dashboard/stats",
  async (params: GetDashboardParams, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(params);

      const response = await clientFetcher<DashboardStats>({
        request: `Dashboard/Counts?${queryString}`,
        method: "GET",
      });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getDashboardVulnerabilities = createAsyncThunk(
  "dashboard/vulnerabilities",
  async (params: GetDashboardParams, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(params);
      const response = await clientFetcher<DashboardVulnerabilities>({
        request: `Dashboard/VulnerabilityCount?${queryString}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getDashboardRiskMatrix = createAsyncThunk(
  "dashboard/riskMatrix",
  async (params: GetDashboardParams, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(params);
      const response = await clientFetcher<DashboardRiskMatrix>({
        request: `Dashboard/Riskmatrix?${queryString}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getDashboardVulnerabilityDetails = createAsyncThunk(
  "dashboard/vulnerabilityDetails",
  async (params: GetDashboardParams, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(params);
      const response = await clientFetcher<DashboardVulnerabilitiesDetailsList>(
        {
          request: `Dashboard/TopVulnerabilityDetail?${queryString}`,
          method: "GET",
        },
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getDashboardTopVulnerability = createAsyncThunk(
  "dashboard/topVulnerability",
  async (params: GetDashboardParams, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(params);
      const response = await clientFetcher<DashboardTopVulnerabilityList>({
        request: `Dashboard/TopVulnerability?${queryString}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getDashboardPopUpTopVulnerability = async (
  params: GetDashboardParams,
) => {
  try {
    const queryString = buildQueryParams(params);
    const response = await clientFetcher<DashboardTopVulnerabilityList>({
      request: `Dashboard/TopVulnerability?${queryString}`,
      method: "GET",
    });
    return response?.data || {};
  } catch (error) {
    return error;
  }
};
