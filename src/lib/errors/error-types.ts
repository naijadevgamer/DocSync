import { ErrorCode } from "./error-codes";

export type AppErrorResponse = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    statusCode: number;
    details?: unknown;
  };
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type ActionResponse<T = unknown> = SuccessResponse<T> | AppErrorResponse;
