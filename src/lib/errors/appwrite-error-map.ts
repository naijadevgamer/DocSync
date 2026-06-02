import { AppwriteException } from "node-appwrite";

import { ErrorCode } from "./error-codes";
import { ERROR_MESSAGES } from "./error-messages";
import { errorResponse } from "./result";

export function mapAppwriteError(error: AppwriteException) {
  const type = safeParseType(error);

  switch (type) {
    case "user_invalid_credentials":
      return errorResponse({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS,
        statusCode: 401,
      });

    case "user_session_already_exists":
      return errorResponse({
        code: ErrorCode.AUTH_ALREADY_AUTHENTICATED,
        message: ERROR_MESSAGES.AUTH_ALREADY_AUTHENTICATED,
        statusCode: 409,
      });

    case "user_unauthorized":
    case "user_jwt_invalid":
      return errorResponse({
        code: ErrorCode.AUTH_SESSION_EXPIRED,
        message: ERROR_MESSAGES.AUTH_SESSION_EXPIRED,
        statusCode: 401,
      });

    case "user_not_found":
      return errorResponse({
        code: ErrorCode.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
        statusCode: 404,
      });

    case "user_email_not_verified":
      return errorResponse({
        code: ErrorCode.AUTH_EMAIL_NOT_VERIFIED,
        message: ERROR_MESSAGES.AUTH_EMAIL_NOT_VERIFIED,
        statusCode: 403,
      });

    case "user_already_exists":
      return errorResponse({
        code: ErrorCode.USER_ALREADY_EXISTS,
        message: ERROR_MESSAGES.USER_ALREADY_EXISTS,
        statusCode: 409,
      });

    case "general_rate_limit_exceeded":
      return errorResponse({
        code: ErrorCode.RATE_LIMITED,
        message: ERROR_MESSAGES.RATE_LIMITED,
        statusCode: 429,
      });

    case "document_not_found":
      return errorResponse({
        code: ErrorCode.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
        statusCode: 404,
      });

    case "storage_file_not_found":
      return errorResponse({
        code: ErrorCode.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
        statusCode: 404,
      });

    case "project_paused":
      return errorResponse({
        code: ErrorCode.PROJECT_PAUSED,
        message: ERROR_MESSAGES.PROJECT_PAUSED,
        statusCode: 403,
      });

    case "storage_device_not_found":
    case "storage_bucket_not_found":
      return errorResponse({
        code: ErrorCode.FILE_UPLOAD_FAILED,
        message: ERROR_MESSAGES.FILE_UPLOAD_FAILED,
        statusCode: 404,
      });

    default:
      // Log unknown types in development for future mapping
      if (process.env.NODE_ENV === "development") {
        console.warn("Unmapped Appwrite error type:", type);
        console.error("Full Appwrite error:", error);
      }

      return errorResponse({
        code: ErrorCode.UNKNOWN,
        message:
          process.env.NODE_ENV === "production"
            ? error.message
            : ERROR_MESSAGES.UNKNOWN,
        statusCode: error.code || 500,
        details:
          process.env.NODE_ENV === "production" ? error.response : undefined,
      });
  }
}

function safeParseType(error: AppwriteException): string | undefined {
  try {
    const parsed = JSON.parse(error.response);
    return parsed.type;
  } catch {
    return undefined;
  }
}
