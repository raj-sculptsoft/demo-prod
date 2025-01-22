import clientFetcher from "@/lib/fetcher/client";
import { Payload } from "@/lib/fetcher/types";
import { AssetData } from "@/types/assets";
import {
  PaginatedListCommonResponse,
  StaticSelectOptions,
} from "@/types/common";
import { ProductData } from "@/types/products";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
