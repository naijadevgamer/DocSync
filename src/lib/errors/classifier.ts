// export type ErrorClassification = {
//   type:
//     | "NETWORK"
//     | "TIMEOUT"
//     | "AUTH"
//     | "NOT_FOUND"
//     | "FETCH_FAILED"
//     | "VALIDATION"
//     | "SERVER"
//     | "UNKNOWN";
//   userMessage: string;
//   shouldRetry: boolean;
//   severity: "low" | "medium" | "high" | "critical";
//   logLevel: "warn" | "error" | "info";
// };

// export function classifyServerError(error: any): ErrorClassification {
//   // Network errors
//   if (
//     error?.code === "NETWORK_ERROR" ||
//     error?.message?.includes("fetch failed") ||
//     error?.message?.includes("Connect Timeout") ||
//     error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT"
//   ) {
//     return {
//       type: "NETWORK",
//       userMessage:
//         "Unable to connect to the server. Please check your internet connection and try again.",
//       shouldRetry: true,
//       severity: "medium",
//       logLevel: "warn",
//     };
//   }

//   // Timeout errors
//   if (
//     error?.code === "NETWORK_TIMEOUT" ||
//     error?.message?.includes("timeout") ||
//     error?.name === "TimeoutError"
//   ) {
//     return {
//       type: "TIMEOUT",
//       userMessage: "The request took too long. Please try again.",
//       shouldRetry: true,
//       severity: "medium",
//       logLevel: "warn",
//     };
//   }

//   // Auth errors
//   if (
//     error?.code === "401" ||
//     error?.code === "403" ||
//     error?.message?.includes("unauthorized") ||
//     error?.message?.includes("session")
//   ) {
//     return {
//       type: "AUTH",
//       userMessage: "Your session has expired. Please sign in again.",
//       shouldRetry: false,
//       severity: "high",
//       logLevel: "warn",
//     };
//   }

//   if (error?.code === "ENOTFOUND") {
//     return {
//       type: "FETCH_FAILED",
//       userMessage: "fetch failed",
//       shouldRetry: false,
//       severity: "high",
//       logLevel: "warn",
//     };
//   }

//   // Not found
//   if (
//     error?.code === "404" ||
//     error?.code === "NOT_FOUND" ||
//     error?.message?.includes("not found")
//   ) {
//     return {
//       type: "NOT_FOUND",
//       userMessage: "The requested resource was not found.",
//       shouldRetry: false,
//       severity: "low",
//       logLevel: "info",
//     };
//   }

//   // Validation errors
//   if (error?.code === "VALIDATION_ERROR" || error?.code === "422") {
//     return {
//       type: "VALIDATION",
//       userMessage: "Some information is invalid. Please check your input.",
//       shouldRetry: false,
//       severity: "low",
//       logLevel: "warn",
//     };
//   }

//   // Server errors
//   if (error?.code === "500" || error?.code === "SERVER_ERROR") {
//     return {
//       type: "SERVER",
//       userMessage:
//         "We're experiencing technical difficulties. Please try again later.",
//       shouldRetry: true,
//       severity: "critical",
//       logLevel: "error",
//     };
//   }

//   // Unknown errors
//   return {
//     type: "UNKNOWN",
//     userMessage: "Something went wrong. Please try again.",
//     shouldRetry: true,
//     severity: "high",
//     logLevel: "error",
//   };
// }

// lib/errors/classifier.ts
import { AppwriteException } from "node-appwrite";

export type ErrorClassification = {
  type:
    | "NETWORK"
    | "TIMEOUT"
    | "AUTH"
    | "NOT_FOUND"
    | "VALIDATION"
    | "SERVER"
    | "UNKNOWN";
  userMessage: string;
  shouldRetry: boolean;
  severity: "low" | "medium" | "high" | "critical";
  logLevel: "warn" | "error" | "info";
};

export function classifyServerError(error: any): ErrorClassification {
  // Handle Appwrite exceptions with codes
  if (error?.code) {
    const code = String(error.code);

    if (code === "401") {
      return {
        type: "AUTH",
        userMessage: "Your session has expired. Please sign in again.",
        shouldRetry: false,
        severity: "high",
        logLevel: "warn",
      };
    }

    if (code === "403") {
      return {
        type: "AUTH",
        userMessage: "You don't have permission to perform this action.",
        shouldRetry: false,
        severity: "high",
        logLevel: "warn",
      };
    }

    if (code === "404" || code === "NOT_FOUND") {
      return {
        type: "NOT_FOUND",
        userMessage: "The requested resource was not found.",
        shouldRetry: false,
        severity: "low",
        logLevel: "info",
      };
    }

    if (code === "409") {
      return {
        type: "VALIDATION",
        userMessage: "This record already exists.",
        shouldRetry: false,
        severity: "low",
        logLevel: "warn",
      };
    }

    if (code === "429") {
      return {
        type: "SERVER",
        userMessage: "Too many requests. Please try again later.",
        shouldRetry: true,
        severity: "medium",
        logLevel: "warn",
      };
    }

    if (code === "500") {
      return {
        type: "SERVER",
        userMessage:
          "We're experiencing technical difficulties. Please try again later.",
        shouldRetry: true,
        severity: "critical",
        logLevel: "error",
      };
    }
  }

  // Network errors
  if (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("fetch failed") ||
    error?.message?.includes("Connect Timeout") ||
    error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT"
  ) {
    return {
      type: "NETWORK",
      userMessage:
        "Unable to connect to the server. Please check your internet connection and try again.",
      shouldRetry: true,
      severity: "medium",
      logLevel: "warn",
    };
  }

  // Timeout errors
  if (
    error?.code === "NETWORK_TIMEOUT" ||
    error?.message?.includes("timeout") ||
    error?.name === "TimeoutError"
  ) {
    return {
      type: "TIMEOUT",
      userMessage: "The request took too long. Please try again.",
      shouldRetry: true,
      severity: "medium",
      logLevel: "warn",
    };
  }

  // Auth message patterns
  if (
    error?.message?.includes("unauthorized") ||
    error?.message?.includes("session") ||
    error?.message?.includes("login")
  ) {
    return {
      type: "AUTH",
      userMessage: "Your session has expired. Please sign in again.",
      shouldRetry: false,
      severity: "high",
      logLevel: "warn",
    };
  }

  // Not found patterns
  if (
    error?.message?.includes("not found") ||
    error?.message?.includes("doesn't exist")
  ) {
    return {
      type: "NOT_FOUND",
      userMessage: "The requested resource was not found.",
      shouldRetry: false,
      severity: "low",
      logLevel: "info",
    };
  }

  // Validation errors
  if (
    error?.code === "VALIDATION_ERROR" ||
    error?.message?.includes("validation") ||
    error?.message?.includes("invalid")
  ) {
    return {
      type: "VALIDATION",
      userMessage: "Some information is invalid. Please check your input.",
      shouldRetry: false,
      severity: "low",
      logLevel: "warn",
    };
  }

  // Default unknown error
  return {
    type: "UNKNOWN",
    userMessage: "Something went wrong. Please try again.",
    shouldRetry: true,
    severity: "high",
    logLevel: "error",
  };
}
