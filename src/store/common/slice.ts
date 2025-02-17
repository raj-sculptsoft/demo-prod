import { AssetData } from "@/types/assets";
import { StaticSelectOptions } from "@/types/common";
import { ProductData } from "@/types/products";
import { createSlice } from "@reduxjs/toolkit";
import { deleteAsset } from "../assets/api";
import { deleteProduct } from "../products/api";
import {
  getAllProducts,
  getAssetsByProduct,
  getFormSelectComplianceOptions,
  getFormSelectCustomerOptions,
  getFormSelectDependencyOptions,
  getFormSelectOptions,
  getFormSelectProductOptions,
  getFormSelectRevenueOptions,
  getListForTable,
} from "./api";

export interface ICommonInitialState {
  dataTable: {
    isLoading: boolean;
    page: number;
    rowsPerPage: number;
    totalPages: number;
    sorting: { column: string; direction: "asc" | "desc" };
    data: {
      page_index: number;
      page_size: number;
      total_count: number;
      list: unknown;
    };
    error: string;
  };
  deleteDialog: {
    open: boolean;
    title: string;
    description: string;
    data: unknown;
    loading: boolean;
  };
  products: {
    loading: boolean;
    data: ProductData;
    error: string;
  };
  assets: {
    loading: boolean;
    data: AssetData;
    error: string;
  };
  formSelectOptions: {
    loading: boolean;
    data: { list: StaticSelectOptions[] };
    error: string;
  };
  formSelectProductOptions: {
    loading: boolean;
    data: { list: StaticSelectOptions[] };
    error: string;
  };
  formSelectRevenueOptions: {
    loading: boolean;
    data: { list: StaticSelectOptions[] };
    error: string;
  };
  formSelectCustomerOptions: {
    loading: boolean;
    data: { list: StaticSelectOptions[] };
    error: string;
  };
  formSelectComplianceOptions: {
    loading: boolean;
    data: { list: StaticSelectOptions[] };
    error: string;
  };
  formSelectDependencyOptions: {
    loading: boolean;
    data: { list: StaticSelectOptions[] };
    error: string;
  };
}

const initialState: ICommonInitialState = {
  dataTable: {
    isLoading: true,
    page: 1,
    rowsPerPage: 5,
    totalPages: 0,
    sorting: { column: "created_at", direction: "desc" },
    data: { page_index: 0, page_size: 0, total_count: 0, list: [] },
    error: "",
  },
  deleteDialog: {
    open: false,
    title: "",
    description: "",
    data: {},
    loading: false,
  },
  products: {
    loading: false,
    data: {
      page_index: 0,
      page_size: 0,
      total_count: 0,
      list: [],
    },
    error: "",
  },
  assets: {
    loading: false,
    data: { page_index: 0, page_size: 0, total_count: 0, list: [] },
    error: "",
  },
  formSelectOptions: {
    loading: false,
    data: { list: [] },
    error: "",
  },
  formSelectProductOptions: {
    loading: false,
    data: { list: [] },
    error: "",
  },
  formSelectRevenueOptions: {
    loading: false,
    data: { list: [] },
    error: "",
  },
  formSelectCustomerOptions: {
    loading: false,
    data: { list: [] },
    error: "",
  },
  formSelectComplianceOptions: {
    loading: false,
    data: { list: [] },
    error: "",
  },
  formSelectDependencyOptions: {
    loading: false,
    data: { list: [] },
    error: "",
  },
};

const DefaultsDataTable = {
  page: 1,
  rowsPerPage: 5,
  totalPages: 0,
  sorting: { column: "created_at", direction: "desc" },
  data: { page_index: 0, page_size: 0, total_count: 0, list: [] },
  error: "",
};

export const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    resetCommonState: () => {
      return initialState;
    },
    setPage: (state, { payload }) => {
      state.dataTable.page = payload;
    },
    setRowsPerPage: (state, { payload }) => {
      state.dataTable.rowsPerPage = payload;
    },
    setSorting: (state, { payload }) => {
      state.dataTable.sorting = payload;
    },
    setTableData: (state, { payload }) => {
      state.dataTable.data.list = payload;
    },
    setIsLoading: (state, { payload }) => {
      state.dataTable.isLoading = payload;
    },
    setDeleteDialogOptions: (state, { payload }) => {
      state.deleteDialog = { ...state.deleteDialog, ...payload };
    },
    resetTableData: (state) => {
      state.dataTable = initialState.dataTable;
    },
    clearAsset: (state) => {
      state.assets = initialState.assets;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.products.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, { payload }) => {
        state.products.loading = false;
        state.products.data = payload.data ?? {};
      })
      .addCase(getAllProducts.rejected, (state, { error }) => {
        state.products.loading = false;
        state.products.error = error.message as string;
      })

      .addCase(getAssetsByProduct.pending, (state) => {
        state.assets.loading = true;
      })
      .addCase(getAssetsByProduct.fulfilled, (state, { payload }) => {
        state.assets.loading = false;
        state.assets.data = payload.data ?? {};
      })
      .addCase(getAssetsByProduct.rejected, (state, { error }) => {
        state.assets.loading = false;
        state.assets.error = error.message as string;
      })

      .addCase(getListForTable.pending, (state) => {
        state.dataTable.isLoading = true;
      })
      .addCase(getListForTable.fulfilled, (state, { payload }) => {
        state.dataTable.isLoading = false;
        state.dataTable.data = payload.data ?? {
          page_index: 0,
          page_size: 0,
          total_count: 0,
          list: [],
        };
        state.dataTable.totalPages = Math.ceil(
          (payload?.data?.total_count ?? 0) / payload?.data?.page_size,
        );
      })
      .addCase(getListForTable.rejected, (state, { error }) => {
        state.dataTable.isLoading = false;
        state.dataTable.data = DefaultsDataTable.data;
        state.dataTable.error = error.message as string;
      })

      .addCase(getFormSelectOptions.pending, (state) => {
        state.formSelectOptions.loading = true;
      })
      .addCase(getFormSelectOptions.fulfilled, (state, { payload }) => {
        state.formSelectOptions.loading = false;
        state.formSelectOptions.data.list = payload.data.list ?? [];
      })
      .addCase(getFormSelectOptions.rejected, (state, { error }) => {
        state.formSelectOptions.loading = false;
        state.formSelectOptions.error = error.message as string;
      })

      .addCase(getFormSelectProductOptions.pending, (state) => {
        state.formSelectProductOptions.loading = true;
      })
      .addCase(getFormSelectProductOptions.fulfilled, (state, { payload }) => {
        state.formSelectProductOptions.loading = false;
        state.formSelectProductOptions.data.list = payload.data.list ?? [];
      })
      .addCase(getFormSelectProductOptions.rejected, (state, { error }) => {
        state.formSelectProductOptions.loading = false;
        state.formSelectProductOptions.error = error.message as string;
      })

      .addCase(getFormSelectRevenueOptions.pending, (state) => {
        state.formSelectRevenueOptions.loading = true;
      })
      .addCase(getFormSelectRevenueOptions.fulfilled, (state, { payload }) => {
        state.formSelectRevenueOptions.loading = false;
        state.formSelectRevenueOptions.data.list = payload.data.list ?? [];
      })
      .addCase(getFormSelectRevenueOptions.rejected, (state, { error }) => {
        state.formSelectRevenueOptions.loading = false;
        state.formSelectRevenueOptions.error = error.message as string;
      })

      .addCase(getFormSelectCustomerOptions.pending, (state) => {
        state.formSelectCustomerOptions.loading = true;
      })
      .addCase(getFormSelectCustomerOptions.fulfilled, (state, { payload }) => {
        state.formSelectCustomerOptions.loading = false;
        state.formSelectCustomerOptions.data.list = payload.data.list ?? [];
      })
      .addCase(getFormSelectCustomerOptions.rejected, (state, { error }) => {
        state.formSelectCustomerOptions.loading = false;
        state.formSelectCustomerOptions.error = error.message as string;
      })

      .addCase(getFormSelectComplianceOptions.pending, (state) => {
        state.formSelectComplianceOptions.loading = true;
      })
      .addCase(
        getFormSelectComplianceOptions.fulfilled,
        (state, { payload }) => {
          state.formSelectComplianceOptions.loading = false;
          state.formSelectComplianceOptions.data.list = payload.data.list ?? [];
        },
      )
      .addCase(getFormSelectComplianceOptions.rejected, (state, { error }) => {
        state.formSelectComplianceOptions.loading = false;
        state.formSelectComplianceOptions.error = error.message as string;
      })

      .addCase(getFormSelectDependencyOptions.pending, (state) => {
        state.formSelectDependencyOptions.loading = true;
      })
      .addCase(
        getFormSelectDependencyOptions.fulfilled,
        (state, { payload }) => {
          state.formSelectDependencyOptions.loading = false;
          state.formSelectDependencyOptions.data.list = payload.data.list ?? [];
        },
      )
      .addCase(getFormSelectDependencyOptions.rejected, (state, { error }) => {
        state.formSelectDependencyOptions.loading = false;
        state.formSelectDependencyOptions.error = error.message as string;
      })

      .addCase(deleteProduct.rejected, (state, { error }) => {
        state.dataTable.error = error.message as string;
      })
      .addCase(deleteAsset.rejected, (state, { error }) => {
        state.dataTable.error = error.message as string;
      });
  },
});

export const {
  setPage,
  setRowsPerPage,
  setSorting,
  setTableData,
  setIsLoading,
  setDeleteDialogOptions,
  resetTableData,
  clearAsset,
  resetCommonState,
} = commonSlice.actions;

export default commonSlice.reducer;
