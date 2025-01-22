import { RouteObject } from "react-router-dom";
import { VULNERABILITY_DETAILS_SOURCE } from "../common";

export interface IResponse<T> {
  data: T;
  message: string;
  success: number;
}

export interface IError {
  message: string;
  status: "Error";
  data: null;
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Payload = Record<string, unknown> | null | FormData;

export interface FetcherProps {
  request: string;
  method?: RequestMethod;
  payload?: Payload;
  headerOptions?: { [key: string]: string };
  options?: Record<string, unknown>;
}

export type VulnerabilityDetailsProps = {
  source?: VULNERABILITY_DETAILS_SOURCE | undefined;
};

export interface AppRoute<T = Record<string, unknown>>
  extends Omit<RouteObject, "children" | "element"> {
  requireAuth: boolean;
  component?: React.LazyExoticComponent<(props: T) => JSX.Element>;
  componentProps?: T;
  children?: AppRoute[];
}
