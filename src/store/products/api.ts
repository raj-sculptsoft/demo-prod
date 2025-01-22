import clientFetcher from "@/lib/fetcher/client";
import { Payload } from "@/lib/fetcher/types";
import { PriorityCounts } from "@/types/common";
import { Product } from "@/types/products";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface GetProductParams {
  company_id: string;
  product_id?: string;
}

const buildQueryParams = (params: GetProductParams) => {
  const queryParams = new URLSearchParams({ company_id: params.company_id });

  if (params.product_id) {
    queryParams.append("product_id", params.product_id);
  }

  return queryParams.toString();
};

export const getProducts = createAsyncThunk(
  "products/getAll",
  async (params: GetProductParams, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(params);
      const response = await clientFetcher<Product>({
        request: `Product/List?${queryString}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getProduct = createAsyncThunk(
  "products/getOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<Product>({
        request: `Product/${id}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getProductStats = createAsyncThunk(
  "products/getStats",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<PriorityCounts>({
        request: `Products/VulnerabilityCounts/${id}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const addOrEditProduct = createAsyncThunk(
  "products/addOrEdit",
  async (payload: Payload, { rejectWithValue }) => {
    try {
      const response = await clientFetcher<Product>({
        request: "Product/AddUpdateProduct",
        method: "POST",
        payload,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products//delete",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await clientFetcher({
        request: `Product/${productId}`,
        method: "DELETE",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
