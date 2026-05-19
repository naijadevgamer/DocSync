import { ActionResponse } from "./error-types";

export function successResponse<T>(data: T): ActionResponse<T> {
  return {
    success: true,
    data,
  };
}

export function errorResponse(error: {
  code: any;
  message: string;
  statusCode: number;
  details?: unknown;
}): ActionResponse {
  return {
    success: false,
    error,
  };
}
