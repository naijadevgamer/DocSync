import { toast } from "sonner";
import { ErrorCode } from "./error-codes";
import { ERROR_MESSAGES } from "./error-messages";
import { createMailtoLink } from "../utils/utils";

interface ActionError {
  code: ErrorCode;
  message: string;
}

// Special cases that need access to the error message
const dynamicMessageCodes = new Set([ErrorCode.VALIDATION_ERROR]);
const contactRequiredCodes = new Set([ErrorCode.PROJECT_PAUSED]);

export function handleActionError(error: ActionError) {
  if (contactRequiredCodes.has(error.code)) {
    toast.error(ERROR_MESSAGES[error.code], {
      duration: Infinity, // Won't auto-dismiss
      actionButtonStyle: {
        backgroundColor: "#007bff",
        color: "#fff",
      },

      dismissible: true,
      closeButton: true,
      action: {
        label: "Contact Support",
        onClick: () => {
          window.location.href = createMailtoLink(error);
        },
      },
    });
    return;
  }
  // Dynamic messages that use error.message

  if (dynamicMessageCodes.has(error.code)) {
    toast.error(error.message || ERROR_MESSAGES.VALIDATION_ERROR);
    return;
  }

  // Static mapped messages
  if (error.code in ERROR_MESSAGES) {
    if (error.message === ERROR_MESSAGES[error.code])
      toast.error(ERROR_MESSAGES[error.code]);
    else toast.error(error.message || ERROR_MESSAGES[error.code]);
    return;
  }

  // Default fallback
  toast.error(
    process.env.NODE_ENV === "development"
      ? error.message
      : ERROR_MESSAGES.UNKNOWN,
  );
}
