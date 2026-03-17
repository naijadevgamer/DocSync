import { AppwriteException } from "node-appwrite";
import { z } from "zod";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
};

export function handleError(error: unknown): ActionResult {
  console.error("Server Action Error:", error);

  // Appwrite specific errors
  if (error instanceof AppwriteException) {
    return {
      success: false,
      error: {
        message: getAppwriteErrorMessage(error),
        code: error.code?.toString(),
        details: error.response,
      },
    };
  }

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return {
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error,
      },
    };
  }

  //  Network/Connection errors
  if (
    error instanceof Error &&
    (error.message.includes("fetch failed") ||
      error.message.includes("Connect Timeout") ||
      (error as any)?.cause?.code === "UND_ERR_CONNECT_TIMEOUT")
  ) {
    return {
      success: false,
      error: {
        message: "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
        details: error.cause || error,
      },
    };
  }

  // // Network/Connection errors (like ConnectTimeoutError)
  // if (
  //   error &&
  //   typeof error === "object" &&
  //   "code" in error &&
  //   error.code === "UND_ERR_CONNECT_TIMEOUT"
  // ) {
  //   return {
  //     success: false,
  //     error: {
  //       message:
  //         "Network connection timeout. Please check your internet connection and try again.",
  //       code: "NETWORK_TIMEOUT",
  //       details: error,
  //     },
  //   };
  // }

  // // Fetch errors (network issues)
  // if (error instanceof TypeError && error.message === "fetch failed") {
  //   return {
  //     success: false,
  //     error: {
  //       message:
  //         "Unable to connect to the server. Please check your internet connection.",
  //       code: "NETWORK_ERROR",
  //       details: error.cause || error,
  //     },
  //   };
  // }

  // Generic errors
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: "UNKNOWN_ERROR",
      },
    };
  }

  return {
    success: false,
    error: {
      message: "An unexpected server error occurred",
      code: "UNKNOWN_ERROR",
    },
  };
}

function getAppwriteErrorMessage(error: AppwriteException): string {
  switch (error.code) {
    case 400:
      return "Invalid request";
    case 401:
      return "Invalid email or password";
    case 403:
      return "You are not authorized to perform this action";
    case 404:
      return "Resource not found";
    case 409:
      return "User already exists";
    case 429:
      return "Too many requests. Please try again later";
    case 500:
      return "Server error. Please try again later";
    default:
      return error.message || "Something went wrong";
  }
}
