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
  console.error("Error:", error);

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
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    },
  };
}

function getAppwriteErrorMessage(error: AppwriteException): string {
  switch (error.code) {
    case 401:
      return "Invalid email or password";
    case 409:
      return "User already exists";
    case 404:
      return "Resource not found";
    case 429:
      return "Too many requests. Please try again later";
    default:
      return error.message || "An error occurred";
  }
}
