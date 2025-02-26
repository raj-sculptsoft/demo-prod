import { VULNERABILITY_DETAILS_SOURCE } from "@/lib/common";
import { AppRoute, VulnerabilityDetailsProps } from "@/lib/fetcher/types";
import { lazy } from "react";

// Lazy load components
const Dashboard = lazy(() => import("./../../components/dashboard/page"));
const Products = lazy(() => import("./../../components/products/page"));
const AssetsList = lazy(
  () => import("./../../components/products/assets/page"),
);
const VulnerabilitiesList = lazy(
  () => import("./../../components/products/assetDetails/vulnerabilities/page"),
);
const VulnerabilityDetails = lazy(
  () =>
    import(
      "./../../components/products/assetDetails/vulnerabilityDetails/page"
    ),
);
const Vulnerabilities = lazy(
  () => import("./../../components/vulnerabilities/page"),
);
const UploadReport = lazy(
  () => import("./../../components/upload-report/page"),
);
const Settings = lazy(() => import("../../components/settings/page"));
const Synk = lazy(() => import("../../components/settings/snyk/page"));
const LinkAssets = lazy(
  () => import("../../components/settings/snyk/linkAssets/page"),
);

// Route path constants
const ROUTES = {
  DASHBOARD: "/dashboard",
  PRODUCTS: {
    INDEX: "/products",
    PRODUCTS_DETAILS: "/product/:productId/assets",
    PRODUCT_VULNERABILITIES:
      "/product/:productId/asset/:assetId/vulnerabilities",
    PRODUCT_VULNERABILITY_DETAILS:
      "/product/:productId/asset/:assetId/vulnerability/:vulnerabilityId/details",
  },
  VULNERABILITIES: {
    INDEX: "/vulnerabilities",
    VULNERABILITY_DETAILS:
      "/vulnerability/product/:productId/asset/:assetId/vulnerability/:vulnerabilityId/details",
  },
  UPLOAD_REPORT: {
    INDEX: "/upload-report",
  },
  SETTINGS: {
    INDEX: "/settings",
    SEMGREP_DETAILS: "/settings/semgrep",
    LINK_ASSETS: "/settings/semgrep/linkAssets",
  },
} as const;

// Define the route configurations with specific types
const routeConfig: (AppRoute<VulnerabilityDetailsProps> | AppRoute)[] = [
  {
    path: ROUTES.DASHBOARD,
    component: Dashboard,
    requireAuth: true,
  },
  {
    path: ROUTES.PRODUCTS.INDEX,
    component: Products,
    requireAuth: true,
  },
  {
    path: ROUTES.PRODUCTS.PRODUCTS_DETAILS,
    component: AssetsList,
    requireAuth: true,
  },
  {
    path: ROUTES.PRODUCTS.PRODUCT_VULNERABILITIES,
    component: VulnerabilitiesList as React.LazyExoticComponent<
      (props: VulnerabilityDetailsProps) => JSX.Element
    >,
    componentProps: { source: VULNERABILITY_DETAILS_SOURCE.PRODUCT },
    requireAuth: true,
  },
  {
    path: ROUTES.PRODUCTS.PRODUCT_VULNERABILITY_DETAILS,
    component: VulnerabilityDetails as React.LazyExoticComponent<
      (props: VulnerabilityDetailsProps) => JSX.Element
    >,
    componentProps: { source: VULNERABILITY_DETAILS_SOURCE.PRODUCT },
    requireAuth: true,
  },
  {
    path: ROUTES.VULNERABILITIES.INDEX,
    component: Vulnerabilities,
    requireAuth: true,
  },
  {
    path: ROUTES.VULNERABILITIES.VULNERABILITY_DETAILS,
    component: VulnerabilityDetails as React.LazyExoticComponent<
      (props: VulnerabilityDetailsProps) => JSX.Element
    >,
    componentProps: { source: VULNERABILITY_DETAILS_SOURCE.VULNERABILITY },
    requireAuth: true,
  },
  {
    path: ROUTES.UPLOAD_REPORT.INDEX,
    component: UploadReport,
    requireAuth: true,
  },
  {
    path: ROUTES.SETTINGS.INDEX,
    component: Settings,
    requireAuth: true,
  },
  {
    path: ROUTES.SETTINGS.SEMGREP_DETAILS,
    component: Synk,
    requireAuth: true,
  },
  {
    path: ROUTES.SETTINGS.LINK_ASSETS,
    component: LinkAssets,
    requireAuth: true,
  },
];

// Helper function to get public routes
const getPublicRoutes = () => routeConfig.filter((route) => !route.requireAuth);

// Helper function to get protected routes
const getProtectedRoutes = () =>
  routeConfig.filter((route) => route.requireAuth);

// Helper function to find route by path
const findRouteByPath = (path: string) =>
  routeConfig.find((route) => route.path === path);

export type { AppRoute };

export {
  findRouteByPath,
  getProtectedRoutes,
  getPublicRoutes,
  routeConfig,
  ROUTES,
};
