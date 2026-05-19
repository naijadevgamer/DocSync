import { AppwriteException } from "node-appwrite";
import { z } from "zod";

import { AppError } from "./app-error";
import { ErrorCode } from "./error-codes";
import { ERROR_MESSAGES } from "./error-messages";
import { errorResponse } from "./result";
import { mapAppwriteError } from "./appwrite-error-map";

export function handleServerError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("SERVER ERROR:", error);
  }

  // Already normalized
  if (error instanceof AppError) {
    return errorResponse({
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details:
        process.env.NODE_ENV === "development" ? error.details : undefined,
    });
  }

  // Validation
  if (error instanceof z.ZodError) {
    return errorResponse({
      code: ErrorCode.VALIDATION_ERROR,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      statusCode: 400,
      details:
        process.env.NODE_ENV === "development"
          ? z.treeifyError(error)
          : undefined,
    });
  }

  // Appwrite
  if (error instanceof AppwriteException) {
    return mapAppwriteError(error);
  }

  // Network/Timeout
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Timeout errors
    if (
      (error &&
        typeof error === "object" &&
        "code" in error &&
        (error.code === "UND_ERR_CONNECT_TIMEOUT" ||
          error.code === "ETIMEDOUT")) ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("timed out") ||
      errorMessage.includes("und_err_connect_timeout")
    ) {
      return errorResponse({
        code: ErrorCode.NETWORK_TIMEOUT,
        message: ERROR_MESSAGES.NETWORK_TIMEOUT,
        statusCode: 408,
      });
    }

    // Network errors
    if (
      (error &&
        typeof error === "object" &&
        "code" in error &&
        (error.code === "ECONNREFUSED" || error.code === "ENETUNREACH")) ||
      errorMessage.includes("fetch failed") ||
      errorMessage.includes("network") ||
      errorMessage.includes("econnrefused") ||
      errorMessage.includes("enetunreach")
    ) {
      return errorResponse({
        code: ErrorCode.NETWORK_ERROR,
        message: ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: 503,
      });
    }
  }

  // Generic
  return errorResponse({
    code: ErrorCode.UNKNOWN,
    message:
      process.env.NODE_ENV === "development"
        ? error instanceof Error
          ? error.message
          : ERROR_MESSAGES.UNKNOWN
        : ERROR_MESSAGES.UNKNOWN,
    statusCode: 500,
    details:
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.stack
        : undefined,
  });
}
