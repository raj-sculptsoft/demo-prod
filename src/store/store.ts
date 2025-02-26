import assetsReducer from "@/store/assets/slice";
import authReducer from "@/store/auth/slice";
import commonReducer from "@/store/common/slice";
import dashboardReducer from "@/store/dashboard/slice";
import productReducer from "@/store/products/slice";
import synkReducer from "@/store/settings/slice"; // Ensure proper path
import uploadReportReducer from "@/store/upload-reports/slice";
import vulnerabilityReducer from "@/store/vulnerabilities/slice";
import { configureStore } from "@reduxjs/toolkit";

const makeStore = () =>
  configureStore({
    reducer: {
      assets: assetsReducer,
      auth: authReducer,
      common: commonReducer,
      dashboard: dashboardReducer,
      products: productReducer,
      uploadReport: uploadReportReducer,
      vulnerability: vulnerabilityReducer,
      synk: synkReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disables serializability check to allow non-serializable data (e.g., Promises, Date objects) in the store
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default makeStore;
