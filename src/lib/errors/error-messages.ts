import { ErrorCode } from "./error-codes";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UNKNOWN: "An unexpected error occurred. Please try again later.",
  INTERNAL_SERVER_ERROR: "Internal server error",

  VALIDATION_ERROR: "Invalid form data",

  AUTH_REQUIRED: "Please log in to continue",
  AUTH_INVALID_CREDENTIALS: "Invalid email or password",
  AUTH_SESSION_EXPIRED: "Your session has expired",
  AUTH_UNAUTHORIZED: "Unauthorized",
  AUTH_FORBIDDEN: "You are not allowed to perform this action",
  AUTH_ALREADY_AUTHENTICATED: "You are already logged in",
  AUTH_EMAIL_NOT_VERIFIED: "Please verify your email",
  AUTH_TOKEN_EXPIRED: "Your authentication token has expired",
  AUTH_TOKEN_INVALID: "Your authentication token is invalid",

  NOT_FOUND: "Resource not found",
  CONFLICT: "Resource already exists",
  PROJECT_PAUSED:
    "Project is paused due to inactivity. Contact the developer to reactivate it",

  NETWORK_ERROR: "Check network and retry.",
  NETWORK_TIMEOUT: "Connection timeout",

  RATE_LIMITED: "Too many requests. Please try again later",

  DATABASE_ERROR: "Database operation failed",

  FILE_UPLOAD_FAILED: "File upload failed - please try again",
  FILE_TOO_LARGE: "File size exceeds the maximum limit of 5MB",
  FILE_INVALID_TYPE: "File type is not supported",
  FILE_DELETE_FAILED: "File deletion failed",

  USER_ALREADY_EXISTS:
    "A user with the same id, email, or phone already exists",

  APPOINTMENT_CONFLICT: "Appointment conflict detected",
  APPOINTMENT_NOT_AVAILABLE: "The selected appointment slot is not available",

  EMAIL_SEND_FAILED: "Failed to send email notification",
  EMAIL_VERIFICATION_FAILED: "Email verification failed",
};
