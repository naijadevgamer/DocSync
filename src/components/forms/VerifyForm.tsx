// components/forms/VerifyForm.tsx
"use client";

import { createBrowserClient } from "@/lib/appwrite/config/client";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/lib/appwrite/actions/auth.actions";
import { handleActionError } from "@/lib/errors/handle-action-error";

export default function VerifyForm() {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<
    "idle" | "confirming" | "verifying" | "success" | "error"
  >("idle");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const userId = params.get("userId");
  const secret = params.get("secret");

  // Manual verification trigger (replaces auto useEffect)
  const handleVerify = async () => {
    if (!userId || !secret) return;

    try {
      setStatus("verifying");

      const { account } = createBrowserClient();
      await account.updateEmailVerification({ userId, secret });

      setStatus("success");
      toast.success("Email verified successfully!");

      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("error");
      toast.error("Verification failed. The link may be invalid or expired.");
    }
  };

  const resendEmail = async () => {
    setResending(true);

    const result = await resendVerificationEmail();

    if (!result.success) {
      handleActionError(result.error);
      setResending(false);
      return;
    }

    toast.success("Verification email resent!");

    setResending(false);

    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // State: User just arrived from registration (no tokens)
  if (!userId || !secret) {
    return (
      <div className="space-y-6">
        <div className="bg-dark-400 border-dark-500 rounded-lg border p-4 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-green-500" />
          <p className="text-16-regular text-dark-600">
            We sent a verification link to your email.
          </p>
          <p className="text-12-regular text-dark-600 mt-1">
            Check your inbox or spam folder.
          </p>
        </div>

        <Button
          onClick={resendEmail}
          disabled={resending || countdown > 0}
          variant="outline"
          className="border-dark-500 text-dark-600 hover:bg-dark-400 w-full"
        >
          {resending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : countdown > 0 ? (
            `Resend in ${countdown}s`
          ) : (
            "Resend email"
          )}
        </Button>
      </div>
    );
  }

  // State: Has tokens, waiting for user to click verify button
  if (status === "idle" || status === "confirming") {
    return (
      <div className="space-y-6">
        {/* Verification Card */}
        <div className="bg-dark-400 border-dark-500 rounded-lg border p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <ShieldCheck className="h-8 w-8 text-green-500" />
          </div>

          <h3 className="text-18-bold mb-2 text-white">
            Verify Your Email Address
          </h3>

          <p className="text-14-regular text-dark-600 mb-6">
            Click the button below to complete your email verification and
            activate your account.
          </p>

          <Button
            onClick={handleVerify}
            className="shad-primary-btn w-full"
            size="lg"
          >
            <ShieldCheck className="mr-2 h-5 w-5" />
            Verify My Email
          </Button>

          <p className="text-12-regular text-dark-600 mt-3">
            This link is unique to your account and can only be used once.
          </p>
        </div>

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-12-regular text-dark-600 mb-3">
            Didn't receive the email or link expired?
          </p>
          <Button
            onClick={resendEmail}
            disabled={resending || countdown > 0}
            variant="outline"
            className="border-dark-500 text-dark-600 hover:bg-dark-400 w-full"
          >
            {resending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // State: Verifying in progress
  if (status === "verifying") {
    return (
      <div className="text-center">
        <div className="bg-dark-400 border-dark-500 rounded-lg border p-8">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-500" />
          <p className="text-16-semibold mt-4 text-white">
            Verifying your email...
          </p>
          <p className="text-14-regular text-dark-600 mt-2">
            This will only take a moment
          </p>
        </div>
      </div>
    );
  }

  // State: Verification successful
  if (status === "success") {
    return (
      <div className="text-center">
        <div className="bg-dark-400 border-dark-500 rounded-lg border p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <p className="text-16-semibold text-white">
            Email verified successfully!
          </p>
          <p className="text-14-regular text-dark-600 mt-2">
            Redirecting you to complete your profile...
          </p>
        </div>
      </div>
    );
  }

  // State: Verification failed
  if (status === "error") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
          <XCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
          <h3 className="text-16-semibold mb-2 text-red-500">
            Verification Failed
          </h3>
          <p className="text-14-regular text-dark-600">
            The verification link may have expired or is invalid.
          </p>
          <p className="text-12-regular text-dark-600 mt-1">
            Please request a new verification email below.
          </p>
        </div>

        <Button
          onClick={resendEmail}
          disabled={resending || countdown > 0}
          className="shad-primary-btn w-full"
        >
          {resending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : countdown > 0 ? (
            `Resend in ${countdown}s`
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Resend verification email
            </>
          )}
        </Button>
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}
