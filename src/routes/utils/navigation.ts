import { NavigateOptions, To, useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToHome: (options?: NavigateOptions) =>
      navigate(ROUTES.DASHBOARD, options),
    goToProducts: (options?: NavigateOptions) =>
      navigate(ROUTES.PRODUCTS.INDEX, options),
    // Add more navigation helpers as needed

    // Generic navigation method
    navigateTo: (to: To, options?: NavigateOptions) => navigate(to, options),
  };
};

// Constants for query parameters
export const QUERY_PARAMS = {
  REDIRECT: "redirect",
  // Add more query parameters as needed
} as const;
