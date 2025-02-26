import clientFetcher from "@/lib/fetcher/client";
import { Payload } from "@/lib/fetcher/types";
import { AssetData } from "@/types/assets";
import {
  AddUpdateEnum,
  PaginatedListCommonResponse,
  StaticSelectOptions,
} from "@/types/common";
import { ProductData } from "@/types/products";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk actions for API calls
export const getAllProducts = createAsyncThunk(
  "all-products",
  async (payload: Payload) => {
    return clientFetcher<ProductData>({
      request: "Product/List",
      method: "POST",
      payload,
    });
  },
);

export const getAssetsByProduct = createAsyncThunk(
  "assets-by-product",
  async (payload: Payload) => {
    return clientFetcher<AssetData>({
      request: "Asset/List",
      method: "POST",
      payload,
    });
  },
);

export const getListForTable = createAsyncThunk(
  "get-list-for-table",
  async ({ request, payload }: { request: string; payload: Payload }) => {
    return clientFetcher<PaginatedListCommonResponse & { list: unknown }>({
      request,
      method: "POST",
      payload,
    });
  },
);

export const getFormSelectOptions = createAsyncThunk(
  "get-form-select-options",
  async ({ request }: { request: string }) => {
    return clientFetcher<{ list: StaticSelectOptions[] }>({
      request,
    });
  },
);

export const addFormSelectOptions = createAsyncThunk(
  "add-form-select-options",
  async (payload: {
    master_enum_uuid: null;
    master_enum_type_id: number;
    master_enum_name: string;
  }) => {
    const response = await clientFetcher<AddUpdateEnum>({
      request: "Enum/AddUpdateEnum",
      method: "POST",
      payload,
    });
    return response;
  },
);

export const getFormSelectProductOptions = createAsyncThunk(
  "get-form-select-product-options",
  async ({ request }: { request: string }) => {
    return clientFetcher<{ list: StaticSelectOptions[] }>({
      request,
    });
  },
);

export const getFormSelectRevenueOptions = createAsyncThunk(
  "get-form-select-revenue-options",
  async ({ request }: { request: string }) => {
    return clientFetcher<{ list: StaticSelectOptions[] }>({
      request,
    });
  },
);

export const getFormSelectCustomerOptions = createAsyncThunk(
  "get-form-select-customer-options",
  async ({ request }: { request: string }) => {
    return clientFetcher<{ list: StaticSelectOptions[] }>({
      request,
    });
  },
);

export const getFormSelectComplianceOptions = createAsyncThunk(
  "get-form-select-compliance-options",
  async ({ request }: { request: string }) => {
    return clientFetcher<{ list: StaticSelectOptions[] }>({
      request,
    });
  },
);

export const getFormSelectDependencyOptions = createAsyncThunk(
  "get-form-select-dependency-options",
  async ({ request }: { request: string }) => {
    return clientFetcher<{ list: StaticSelectOptions[] }>({
      request,
    });
  },
);
