import { ApiError } from "@/models/responses/axios-error-response";
import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const apiError = error as ApiError;
    if (apiError.response?.data?.message) {
      const messages = apiError.response.data.message;

      if (Array.isArray(messages)) {
        return messages[0];
      }

      return messages;
    }
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
