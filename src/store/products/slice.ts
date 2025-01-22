import { PriorityCounts } from "@/types/common";
import { Product } from "@/types/products";
import { createSlice } from "@reduxjs/toolkit";
import {
  addOrEditProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductStats,
} from "./api";

export interface ProductsState {
  list: {
    loading: boolean;
    data: Product | null;
    error: string;
  };
  currentProduct: {
    loading: boolean;
    data: Product | null;
    error: string;
  };
  stats: {
    loading: boolean;
    data: PriorityCounts;
    error: string;
  };
  showProductForm: boolean;
  addOrEditProduct: {
    loading: boolean;
    data: Product | null;
    error: string;
  };
  editDetails: {
    loading: boolean;
    data: Product | null;
    error: string;
  };
  deleteDialog: {
    open: boolean;
    title: string;
    description: string;
    data: unknown;
    loading: boolean;
  };
}

const initialState: ProductsState = {
  list: {
    loading: false,
    data: null,
    error: "",
  },
  currentProduct: {
    loading: false,
    data: null,
    error: "",
  },
  stats: {
    loading: false,
    data: {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    },
    error: "",
  },
  showProductForm: false,
  addOrEditProduct: {
    loading: false,
    data: null,
    error: "",
  },
  editDetails: {
    loading: false,
    data: null,
    error: "",
  },
  deleteDialog: {
    open: false,
    title: "",
    description: "",
    data: {},
    loading: false,
  },
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetList: (state) => {
      state.list = initialState.list;
    },
    resetCurrentProduct: (state) => {
      state.currentProduct = initialState.currentProduct;
    },
    resetStats: (state) => {
      state.stats = initialState.stats;
    },
    resetAddOrEditProduct: (state) => {
      state.addOrEditProduct = initialState.addOrEditProduct;
    },
    resetEditDetails: (state) => {
      state.editDetails = initialState.editDetails;
    },
    resetDeleteDialog: (state) => {
      state.deleteDialog = initialState.deleteDialog;
    },
    setShowProductForm: (state, { payload }) => {
      state.showProductForm = payload;
    },
    setEditDetails: (state, { payload }) => {
      state.editDetails.data = payload;
      state.editDetails.loading = false;
      state.editDetails.error = "";
    },
    clearEditDetails: (state) => {
      state.editDetails = { loading: false, data: null, error: "" };
    },
  },
  extraReducers: (builder) => {
    // Get Products List
    builder
      .addCase(getProducts.pending, (state) => {
        state.list.loading = true;
        state.list.error = "";
      })
      .addCase(getProducts.fulfilled, (state, { payload }) => {
        state.list.loading = false;
        state.list.data = payload.data;
      })
      .addCase(getProducts.rejected, (state, { error }) => {
        state.list.loading = false;
        state.list.error = error.message as string;
      });

    // Get Single Product
    builder
      .addCase(getProduct.pending, (state) => {
        state.currentProduct.loading = true;
        state.currentProduct.error = "";
      })
      .addCase(getProduct.fulfilled, (state, { payload }) => {
        state.currentProduct.loading = false;
        state.currentProduct.data = payload.data;
      })
      .addCase(getProduct.rejected, (state, { error }) => {
        state.currentProduct.loading = false;
        state.currentProduct.error = error.message as string;
      });

    // Get Product Stats
    builder
      .addCase(getProductStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = "";
      })
      .addCase(getProductStats.fulfilled, (state, { payload }) => {
        state.stats.loading = false;
        state.stats.data = payload.data;
      })
      .addCase(getProductStats.rejected, (state, { error }) => {
        state.stats.loading = false;
        state.stats.error = error.message as string;
      });

    // Add or Edit Product
    builder
      .addCase(addOrEditProduct.pending, (state) => {
        state.addOrEditProduct.loading = true;
        state.addOrEditProduct.error = "";
      })
      .addCase(addOrEditProduct.fulfilled, (state, { payload }) => {
        state.addOrEditProduct.loading = false;
        state.addOrEditProduct.data = payload.data;
      })
      .addCase(addOrEditProduct.rejected, (state, { error }) => {
        state.addOrEditProduct.loading = false;
        state.addOrEditProduct.error = error.message as string;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.deleteDialog.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.deleteDialog = {
          open: false,
          title: "",
          description: "",
          data: {},
          loading: false,
        };
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.deleteDialog.loading = false;
      });
  },
});

export const {
  setShowProductForm,
  setEditDetails,
  clearEditDetails,
  resetList,
  resetCurrentProduct,
  resetStats,
  resetAddOrEditProduct,
  resetEditDetails,
  resetDeleteDialog,
} = productsSlice.actions;

export default productsSlice.reducer;
