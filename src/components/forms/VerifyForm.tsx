// components/forms/VerifyForm.tsx
"use client";

import { createBrowserClient } from "@/lib/appwrite/config/client";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/lib/appwrite/actions/auth.actions";
import { handleActionError } from "@/lib/errors/handle-action-error";

export default function VerifyForm({ isVerified }: { isVerified: boolean }) {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // const userId = params.get("userId");
  // const secret = params.get("secret");

  const hasVerified = useRef(false);
  console.log("VerifyForm rendered with:", { isVerified });

  const userId = params.get("userId");
  const secret = params.get("secret");

  useEffect(() => {
    if (!userId || !secret) return;
    if (hasVerified.current) return;

    hasVerified.current = true;

    (async () => {
      try {
        setStatus("verifying");

        const { account } = createBrowserClient();

        await account.updateEmailVerification({ userId, secret });

        setStatus("success");

        setTimeout(() => router.push("/login"), 3000);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    })();
  }, [userId, secret]);

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

  if (status === "verifying") {
    return (
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-500" />
        <p className="text-16-semibold mt-4 text-white">
          Verifying your email...
        </p>
        <p className="text-14-regular text-dark-600 mt-2">
          This will only take a moment
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <p className="text-16-semibold text-white">
          Email verified successfully!
        </p>
        <p className="text-14-regular text-dark-600 mt-2">Redirecting...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
          <XCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
          <p className="text-14-medium text-red-500">Verification failed</p>
          <p className="text-12-regular text-dark-600 mt-1">
            The link may have expired or is invalid.
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
            "Resend verification email"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-dark-400 border-dark-500 rounded-lg border p-4 text-center">
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
