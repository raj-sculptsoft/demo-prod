import config from "@/config/env";
import axios from "axios";
import type { FetcherProps, IError, IResponse } from "./types";

interface ClientFetcherProps extends FetcherProps {
  token?: boolean;
  baseURL?: string;
  params?: Record<string, string | number>;
}

// Base API URL from environment configuration
const URL = config.VITE_PUBLIC_API_URL + "/api/";

// Create an Axios instance with default settings
const fetcherInstance = axios.create({
  baseURL: URL,
  headers: {
    "ngrok-skip-browser-warning": "69420", // Bypass ngrok browser warning
  },
});

export default async function clientFetcher<IReturn>({
  request,
  method = "GET",
  payload = null,
  headerOptions = {},
  options = {},
  baseURL = URL,
  params,
}: ClientFetcherProps): Promise<IResponse<IReturn>> {
  try {
    // Make an API request using the Axios instance
    const response: { data: IResponse<IReturn> } = await fetcherInstance({
      url: request,
      method,
      headers: {
        ...headerOptions,
      },
      ...options,
      data: payload,
      baseURL,
      params,
    });

    return response?.data;
  } catch (error) {
    // Handle API errors and return a rejected Promise with a meaningful error message
    return Promise.reject(
      (error as { response: { data: IError } })?.response?.data ?? {
        message: "Something went wrong",
      },
    );
  }
}
