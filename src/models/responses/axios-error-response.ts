import { AxiosError } from "axios";

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
}

export type ApiError = AxiosError<ApiErrorResponse>;
