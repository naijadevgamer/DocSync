// app/error.tsx
"use client";

import FullLogo from "@/components/FullLogo";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="bg-dark-300 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <FullLogo />
        </div>

        {/* Error Card */}
        <div className="bg-dark-400 rounded-2xl border border-red-500/30 p-8 text-center shadow-xl">
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>

          {/* Error Message */}
          <h1 className="text-24-bold mb-2 text-white">Something Went Wrong</h1>
          <p className="text-dark-600 mb-2">
            We encountered an unexpected error while processing your request.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-dark-300 mb-6 rounded-lg p-4 text-left">
              <p className="text-12-medium mb-2 text-red-500">Error Details:</p>
              <p className="text-12-regular text-dark-600 break-all">
                {error.message || "Unknown error occurred"}
              </p>
              {error.digest && (
                <p className="text-12-regular text-dark-500 mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={reset} className="shad-primary-btn">
              {/* <RefreshCw className="mr-2 h-4 w-4" /> */}
              Try Again
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="border-dark-500 text-dark-600 hover:bg-dark-500/70 w-full sm:w-auto"
              >
                {/* <Home className="mr-2 h-4 w-4" /> */}
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-14-regular text-dark-500">
            If the problem persists, please contact{" "}
            <Link href="/support" className="text-blue-500 hover:text-blue-400">
              support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
