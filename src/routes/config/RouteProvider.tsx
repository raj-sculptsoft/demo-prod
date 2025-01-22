import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "../auth/PrivateRoute";
import PublicRoute from "../auth/PublicRoute";
import { getProtectedRoutes, getPublicRoutes, ROUTES } from "./routes";

const RouteProvider = () => {
  const publicRoutes = getPublicRoutes();
  const protectedRoutes = getProtectedRoutes();

  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        {publicRoutes.map((route) => {
          const Component = route.component as React.LazyExoticComponent<
            (props: Record<string, unknown>) => JSX.Element
          >;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Component {...route.componentProps} />}
            />
          );
        })}
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        {protectedRoutes.map((route) => {
          const Component = route.component as React.LazyExoticComponent<
            (props: Record<string, unknown>) => JSX.Element
          >;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Component {...route.componentProps} />}
            />
          );
        })}
      </Route>

      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default RouteProvider;
