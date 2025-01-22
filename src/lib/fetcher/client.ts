import axios from "axios";
import type { FetcherProps, IError, IResponse } from "./types";

interface ClientFetcherProps extends FetcherProps {
  token?: boolean;
  baseURL?: string;
  params?: Record<string, string | number>;
}
const URL = import.meta.env.VITE_PUBLIC_API_URL + "/api/";

const fetcherInstance = axios.create({
  baseURL: URL,
  headers: {
    "ngrok-skip-browser-warning": "69420",
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
    return Promise.reject(
      (error as { response: { data: IError } })?.response?.data ?? {
        message: "Something went wrong",
      },
    );
  }
}
