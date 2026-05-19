// lib/errors/handle-action-error.ts
import { toast } from "sonner";
import { ErrorCode } from "./error-codes";
import { ERROR_MESSAGES } from "./error-messages";

interface ActionError {
  code: ErrorCode | string;
  message: string;
}

export function handleActionError(error: ActionError) {
  // Always use switch on code, not message
  switch (error.code) {
    case ErrorCode.AUTH_INVALID_CREDENTIALS:
      toast.error(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS);
      break;

    case ErrorCode.AUTH_SESSION_EXPIRED:
      toast.error(ERROR_MESSAGES.AUTH_SESSION_EXPIRED);
      break;

    case ErrorCode.AUTH_REQUIRED:
      toast.error(ERROR_MESSAGES.AUTH_REQUIRED);
      break;

    case ErrorCode.AUTH_FORBIDDEN:
      toast.error(ERROR_MESSAGES.AUTH_FORBIDDEN);
      break;

    case ErrorCode.AUTH_ALREADY_AUTHENTICATED:
      toast.error(ERROR_MESSAGES.AUTH_ALREADY_AUTHENTICATED);
      break;

    case ErrorCode.AUTH_EMAIL_NOT_VERIFIED:
      toast.error(ERROR_MESSAGES.AUTH_EMAIL_NOT_VERIFIED);
      break;

    case ErrorCode.NETWORK_ERROR:
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      break;

    case ErrorCode.NETWORK_TIMEOUT:
      toast.error(ERROR_MESSAGES.NETWORK_TIMEOUT);
      break;

    case ErrorCode.RATE_LIMITED:
      toast.error(ERROR_MESSAGES.RATE_LIMITED);
      break;

    case ErrorCode.VALIDATION_ERROR:
      toast.error(error.message || ERROR_MESSAGES.VALIDATION_ERROR);
      break;

    case ErrorCode.NOT_FOUND:
      toast.error(ERROR_MESSAGES.NOT_FOUND);
      break;

    case ErrorCode.FILE_UPLOAD_FAILED:
      toast.error("File upload failed. Please try again");
      break;

    case ErrorCode.FILE_TOO_LARGE:
      toast.error("File is too large. Please select a smaller file");
      break;

    case ErrorCode.FILE_INVALID_TYPE:
      toast.error("File type not allowed. Please select a different file");
      break;

    case ErrorCode.FILE_DELETE_FAILED:
      toast.error("Failed to delete file");
      break;

    case ErrorCode.PATIENT_ALREADY_EXISTS:
      toast.error(ERROR_MESSAGES.PATIENT_ALREADY_EXISTS);
      break;

    case ErrorCode.APPOINTMENT_CONFLICT:
      toast.error("Appointment time conflict detected");
      break;

    case ErrorCode.EMAIL_SEND_FAILED:
      toast.error("Failed to send email. Please try again");
      break;

    case ErrorCode.EMAIL_VERIFICATION_FAILED:
      toast.error("Email verification failed");
      break;

    case ErrorCode.DATABASE_ERROR:
      toast.error("Database error. Please try again");
      break;

    default:
      toast.error(
        process.env.NODE_ENV === "development"
          ? error.message
          : "An unexpected error occurred. Please try again",
      );
      break;
  }
}
