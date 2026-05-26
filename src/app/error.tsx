// app/error.tsx
"use client";

import FullLogo from "@/components/utils/FullLogo";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  RefreshCw,
  Home,
  ShieldAlert,
  Clock,
  WifiOff,
  ServerCrash,
  MessageSquare,
  FileX,
  MailX,
  Database,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorCode } from "@/lib/errors"; // Import your error codes

// Map error codes to UI configuration
const errorConfigs: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    userMessage: string;
    color: string;
    bgColor: string;
    borderColor: string;
    action: "retry" | "home" | "login";
  }
> = {
  // Auth errors
  [ErrorCode.AUTH_REQUIRED]: {
    icon: ShieldAlert,
    title: "Authentication Required",
    userMessage: "Please log in to access this page.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    action: "login",
  },
  [ErrorCode.AUTH_SESSION_EXPIRED]: {
    icon: ShieldAlert,
    title: "Session Expired",
    userMessage: "Your session has expired. Please sign in again.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    action: "login",
  },
  [ErrorCode.AUTH_FORBIDDEN]: {
    icon: ShieldAlert,
    title: "Access Denied",
    userMessage: "You don't have permission to access this resource.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    action: "home",
  },

  // Network errors
  [ErrorCode.NETWORK_ERROR]: {
    icon: WifiOff,
    title: "Connection Lost",
    userMessage:
      "Unable to reach our servers. Please check your internet connection.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    action: "retry",
  },
  [ErrorCode.NETWORK_TIMEOUT]: {
    icon: Clock,
    title: "Taking Too Long",
    userMessage:
      "The server is taking longer than expected. This might be temporary.",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    action: "retry",
  },

  // Database errors
  [ErrorCode.DATABASE_ERROR]: {
    icon: Database,
    title: "Database Error",
    userMessage: "We're having trouble with our database. Please try again.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    action: "retry",
  },

  // File errors
  [ErrorCode.FILE_UPLOAD_FAILED]: {
    icon: FileX,
    title: "Upload Failed",
    userMessage: "We couldn't upload your file. Please try again.",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    action: "retry",
  },

  // Email errors
  [ErrorCode.EMAIL_SEND_FAILED]: {
    icon: MailX,
    title: "Email Failed",
    userMessage:
      "We couldn't send the email notification. Our team has been notified.",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    action: "retry",
  },

  // Not found
  [ErrorCode.NOT_FOUND]: {
    icon: AlertCircle,
    title: "Not Found",
    userMessage: "The resource you're looking for doesn't exist.",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    action: "home",
  },

  // Rate limiting
  [ErrorCode.RATE_LIMITED]: {
    icon: Clock,
    title: "Too Many Requests",
    userMessage: "Please wait a moment before trying again.",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    action: "retry",
  },

  // Server error (default)
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    icon: ServerCrash,
    title: "Server Error",
    userMessage:
      "We're experiencing technical difficulties. Our team has been notified.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    action: "retry",
  },

  // Unknown/fallback
  [ErrorCode.UNKNOWN]: {
    icon: AlertTriangle,
    title: "Something Went Wrong",
    userMessage: "An unexpected error occurred. Please try again.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    action: "retry",
  },
};

function classifyError(error: Error & { digest?: string }): ErrorCode {
  // First check if we have a digest (set by our serverQuery)
  if (
    error.digest &&
    Object.values(ErrorCode).includes(error.digest as ErrorCode)
  ) {
    return error.digest as ErrorCode;
  }

  // Fallback to message-based classification
  const message = error.message?.toLowerCase() || "";

  // Try to find error code in message
  for (const code of Object.values(ErrorCode)) {
    if (message.includes(code.toLowerCase())) {
      return code;
    }
  }

  // Legacy message-based classification
  if (
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("connection")
  ) {
    return ErrorCode.NETWORK_ERROR;
  }

  if (message.includes("timeout") || message.includes("timed out")) {
    return ErrorCode.NETWORK_TIMEOUT;
  }

  if (
    message.includes("unauthorized") ||
    message.includes("session") ||
    message.includes("login") ||
    message.includes("401") ||
    message.includes("403")
  ) {
    return ErrorCode.AUTH_REQUIRED;
  }

  if (message.includes("not found") || message.includes("404")) {
    return ErrorCode.NOT_FOUND;
  }

  return ErrorCode.UNKNOWN;
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorCode] = useState(() => classifyError(error));
  const config = errorConfigs[errorCode] || errorConfigs[ErrorCode.UNKNOWN];
  const Icon = config.icon;

  useEffect(() => {
    console.error("Application Error:", {
      message: error.message,
      digest: error.digest,
      errorCode,
      timestamp: new Date().toISOString(),
    });
  }, [error, errorCode]);

  return (
    <div className="bg-dark-300 flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <FullLogo />
        </div>

        {/* Error Card */}
        <div
          className={`bg-dark-400 rounded-2xl border ${config.borderColor} p-4 text-center shadow-xl md:p-8`}
        >
          {/* Error Icon */}
          <div
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${config.bgColor}`}
          >
            <Icon className={`h-10 w-10 ${config.color}`} />
          </div>

          {/* Error Title */}
          <h1 className={`text-24-bold mb-2 ${config.color}`}>
            {config.title}
          </h1>

          {/* User-Friendly Message */}
          <p className="text-dark-600 mb-6 text-sm leading-relaxed">
            {config.userMessage}
          </p>

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-dark-300 mb-6 rounded-lg p-4 text-left">
              <p className="text-12-medium mb-2 text-red-500">
                Developer Information:
              </p>
              <div className="space-y-2">
                <div>
                  <span className="text-12-medium text-dark-500">
                    Error Code:{" "}
                  </span>
                  <span className="text-12-regular text-dark-600 font-mono">
                    {errorCode}
                  </span>
                </div>
                <div>
                  <span className="text-12-medium text-dark-500">
                    Message:{" "}
                  </span>
                  <p className="text-12-regular text-dark-600 mt-1 break-all">
                    {error.message || "Unknown error"}
                  </p>
                </div>
                {error.digest && (
                  <div>
                    <span className="text-12-medium text-dark-500">
                      Digest:{" "}
                    </span>
                    <span className="text-12-regular text-dark-600 font-mono break-all">
                      {error.digest}
                    </span>
                  </div>
                )}
                {error.stack && (
                  <details className="mt-2">
                    <summary className="text-12-medium text-dark-500 cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="text-10-regular text-dark-600 mt-2 overflow-x-auto break-all whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {config.action === "retry" && (
              <Button
                onClick={() => reset()}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}

            {config.action === "login" && (
              <Button asChild className="bg-green-500 hover:bg-green-600">
                <Link href="/login">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}

            {config.action === "home" && (
              <Button asChild className="bg-green-500 hover:bg-green-600">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            )}

            {/* Secondary action */}
            {config.action !== "home" && (
              <Button
                asChild
                variant="outline"
                className="border-dark-500 text-dark-600 hover:bg-dark-500/70"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Error Reference & Support */}
        <div className="mt-6 space-y-3 text-center">
          {error.digest && (
            <p className="text-12-regular text-dark-600">
              Error Reference:{" "}
              <code className="bg-dark-400 text-dark-500 rounded px-2 py-0.5 font-mono">
                {error.digest}
              </code>
            </p>
          )}
          <p className="text-14-regular text-dark-600">
            If the problem persists,{" "}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-green-500 hover:text-green-400"
            >
              <MessageSquare className="h-3 w-3" />
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
