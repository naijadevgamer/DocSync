// import { AppwriteException } from "node-appwrite";
// import { z } from "zod";

// export type ActionResult<T = any> = {
//   success: boolean;
//   data?: T;
//   error?: {
//     message: string;
//     code?: string;
//     type?: string;
//     details?: any;
//   };
// };

// export function handleError(error: unknown): ActionResult {
//   console.error("Server Action Error:", error);

//   // Appwrite specific errors
//   if (error instanceof AppwriteException) {
//     if (error.code === 403 && error.type === "project_paused") {
//       return {
//         success: false,
//         error: {
//           message: `DocSync is paused due to inactivity. Please contact support to reactivate.`,
//           code: error.code?.toString(),
//           details:
//             process.env.NODE_ENV === "development" ? error.response : undefined,
//         },
//       };
//     }

//     return {
//       success: false,
//       error: {
//         message: getAppwriteErrorMessage(error),
//         code: error.code?.toString(),
//         type: JSON.parse(error.response).type,
//         details:
//           process.env.NODE_ENV === "development" ? error.response : undefined,
//       },
//     };
//   }

//   // Zod validation errors
//   if (error instanceof z.ZodError) {
//     return {
//       success: false,
//       error: {
//         message: "Validation failed",
//         code: "VALIDATION_ERROR",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//     };
//   }

//   //  Network/Connection errors
//   if (
//     error instanceof Error &&
//     (error.message.includes("fetch failed") ||
//       error.message.includes("Connect Timeout") ||
//       (error as any)?.cause?.code === "UND_ERR_CONNECT_TIMEOUT")
//   ) {
//     return {
//       success: false,
//       error: {
//         message: "Network error. Please check your connection and try again.",
//         code: "NETWORK_ERROR",
//         details:
//           process.env.NODE_ENV === "development"
//             ? error.cause || error
//             : undefined,
//       },
//     };
//   }

//   // Network/Connection errors (like ConnectTimeoutError)
//   if (
//     error &&
//     typeof error === "object" &&
//     "code" in error &&
//     error.code === "UND_ERR_CONNECT_TIMEOUT"
//   ) {
//     return {
//       success: false,
//       error: {
//         message:
//           "Network connection timeout. Please check your internet connection and try again.",
//         code: "NETWORK_TIMEOUT",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//     };
//   }

//   // Fetch errors (network issues)
//   if (error instanceof TypeError && error.message === "fetch failed") {
//     return {
//       success: false,
//       error: {
//         message:
//           "Unable to connect to the server. Please check your internet connection.",
//         code: "NETWORK_ERROR",
//         details:
//           process.env.NODE_ENV === "development"
//             ? error.cause || error
//             : undefined,
//       },
//     };
//   }

//   // Generic errors
//   if (error instanceof Error) {
//     return {
//       success: false,
//       error: {
//         message:
//           process.env.NODE_ENV === "development"
//             ? error.message
//             : "An unexpected error occurred",
//         code: "UNKNOWN_ERROR",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//     };
//   }

//   return {
//     success: false,
//     error: {
//       message: "An unexpected server error occurred",
//       code: "UNKNOWN_ERROR",
//       details: process.env.NODE_ENV === "development" ? error : undefined,
//     },
//   };
// }

// function getAppwriteErrorMessage(error: AppwriteException): string {
//   switch (error.code) {
//     case 400:
//       return "Invalid request";
//     case 401:
//       return "Invalid email or password";
//     case 403:
//       return "You are not authorized to perform this action";
//     case 404:
//       return "Resource not found";
//     case 409:
//       return "A user with the same id, email, or phone already exists";
//     case 429:
//       return "Too many requests. Please try again later";
//     case 500:
//       return "Server error. Please try again later";
//     default:
//       return process.env.NODE_ENV === "development"
//         ? error.message
//         : "Something went wrong";
//   }
// }

import { AppwriteException } from "node-appwrite";
import { z } from "zod";
import { classifyServerError } from "./classifier";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    type?: string;
    details?: any;
  };
};

export function handleError(error: unknown): ActionResult {
  console.error("Server Action Error:", {
    error,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });

  // Appwrite specific errors
  if (error instanceof AppwriteException) {
    if (error.code === 403 && error.type === "project_paused") {
      return {
        success: false,
        error: {
          message: `DocSync is paused due to inactivity. Please contact support to reactivate.`,
          code: error.code?.toString(),
          details:
            process.env.NODE_ENV === "development" ? error.response : undefined,
        },
      };
    }

    // Add classification
    const classification = classifyServerError(error);

    return {
      success: false,
      error: {
        message: classification.userMessage,
        code: error.code?.toString(),
        type: error.type,
        details:
          process.env.NODE_ENV === "development"
            ? {
                originalError: error.message,
                response: error.response,
                classification: classification.type,
              }
            : undefined,
      },
    };
  }

  // Zod validation errors
  if (error instanceof z.ZodError) {
    const classification = classifyServerError(error);

    return {
      success: false,
      error: {
        message: "Please check your information and try again.",
        code: "VALIDATION_ERROR",
        details:
          process.env.NODE_ENV === "development"
            ? {
                issues: error.issues,
                classification: classification.type,
              }
            : undefined,
      },
    };
  }

  // Network/Connection errors
  if (
    error instanceof Error &&
    (error.message.includes("fetch failed") ||
      error.message.includes("Connect Timeout") ||
      (error as any)?.cause?.code === "UND_ERR_CONNECT_TIMEOUT")
  ) {
    const classification = classifyServerError(error);

    return {
      success: false,
      error: {
        message: classification.userMessage,
        code: "NETWORK_ERROR",
        details:
          process.env.NODE_ENV === "development"
            ? {
                cause: (error as any).cause,
                classification: classification.type,
              }
            : undefined,
      },
    };
  }

  // Network/Connection errors (like ConnectTimeoutError)
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "UND_ERR_CONNECT_TIMEOUT"
  ) {
    return {
      success: false,
      error: {
        message:
          "Network connection timeout. Please check your internet connection and try again.",
        code: "NETWORK_TIMEOUT",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
    };
  }

  // Fetch errors (network issues)
  if (error instanceof TypeError && error.message === "fetch failed") {
    return {
      success: false,
      error: {
        message:
          "Unable to connect to the server. Please check your internet connection.",
        code: "NETWORK_ERROR",
        details:
          process.env.NODE_ENV === "development"
            ? error.cause || error
            : undefined,
      },
    };
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
    };
  }

  // For all other errors, use the classifier
  const classification = classifyServerError(error);

  return {
    success: false,
    error: {
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : classification.userMessage,
      code: "UNKNOWN_ERROR",
      details:
        process.env.NODE_ENV === "development"
          ? {
              error:
                error instanceof Error
                  ? {
                      message: error.message,
                      stack: error.stack,
                    }
                  : error,
              classification: classification.type,
            }
          : undefined,
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
      return "A user with the same id, email, or phone already exists";
    case 429:
      return "Too many requests. Please try again later";
    case 500:
      return "Server error. Please try again later";
    default:
      return process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong";
  }
}
