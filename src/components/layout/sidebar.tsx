import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "../../assets/icons/dashboard";
import Logo from "../../assets/icons/logo";
import ProductIcon from "../../assets/icons/product";
import UploadReport from "../../assets/icons/upload-report";
import VulnerabilitiesIcon from "../../assets/icons/vulnerabilities";

import Settings from "@/assets/icons/settings";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { resetStatusId, resetStatusReportState } from "@/store/settings/slice";
import {
  resetReportId,
  resetReportStatusState,
} from "@/store/upload-reports/slice";
import { useEffect, useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Products",
    url: "/products",
    childrenRoutes: [
      "/product/:productId/assets",
      "/product/:productId/asset/:assetId/vulnerabilities",
      "/product/:productId/asset/:assetId/vulnerability/:vulnerabilityId/details",
    ],
    icon: <ProductIcon />,
  },
  {
    title: "Vulnerabilities",
    url: "/vulnerabilities",
    childrenRoutes: [
      "/vulnerability/product/:productId/asset/:assetId/vulnerability/:vulnerabilityId/details",
    ],
    icon: <VulnerabilitiesIcon />,
  },
  {
    title: "Upload Report",
    url: "/upload-report",
    icon: <UploadReport />,
  },
  {
    title: "Settings",
    url: "/settings",
    childrenRoutes: ["/settings/semgrep", "/settings/semgrep/linkAssets"],
    icon: <Settings />,
  },
];

export default function SideBar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isFirstRender = useRef(true);
  const { reportId } = useAppSelector((state) => state.uploadReport);
  const statusId = useAppSelector((state) => state.synk.statusId);

  // Helper function to check if a route pattern matches the current path
  const isRouteMatch = (pattern: string, path: string) => {
    // Convert route pattern to regex
    const regexPattern = pattern
      .replace(/:[^/]+/g, "[^/]+") // Replace :param with regex pattern
      .replace(/\//g, "\\/"); // Escape forward slashes
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  };

  useEffect(() => {
    if (reportId || statusId) {
      if (isFirstRender.current) {
        // Skip the first render
        isFirstRender.current = false;
      } else {
        // Reset report and status-related state when navigating between pages
        dispatch(resetReportId());
        dispatch(resetReportStatusState());

        dispatch(resetStatusReportState());
        dispatch(resetStatusId());

        // Mark as first render again to prevent redundant resets
        isFirstRender.current = true;
      }
    } else {
      isFirstRender.current = true;
    }
  }, [location, dispatch]);

  return (
    <Sidebar variant="floating" collapsible="icon" className="px-4 py-3">
      <SidebarHeader className="items-center pb-0 pt-6">
        <Logo height={40} width={36} className="fill-primary" />
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="items-center gap-3">
              {items.map(({ title, url, icon, childrenRoutes = [] }) => {
                // Replace dynamic segments in child routes with actual params
                const isActive =
                  url === location.pathname ||
                  childrenRoutes.some((route) =>
                    isRouteMatch(route, location.pathname),
                  );

                return (
                  <SidebarMenuItem
                    key={title}
                    className={`cursor-pointer border-b hover:rounded-lg hover:bg-primary hover:text-white ${
                      isActive ? "rounded-lg bg-primary text-white" : ""
                    }`}
                  >
                    <Link to={url} className="block p-3.5">
                      {icon}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
