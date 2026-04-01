"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/appwrite/client";

export default function VerifyForm() {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [resending, setResending] = useState(false);

  const userId = params.get("userId");
  const secret = params.get("secret");

  // VERIFY LINK FLOW
  useEffect(() => {
    if (!userId || !secret) return;

    const verify = async () => {
      try {
        setStatus("verifying");

        const { account } = createBrowserClient();

        const updatedUser = await account.updateEmailVerification({
          userId,
          secret,
        });

        setStatus("success");

        setTimeout(() => {
          router.push(`/patients/${updatedUser.userId}/personal-info`);
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    verify();
  }, [userId, secret, router]);

  // RESEND EMAIL
  const resendEmail = async () => {
    try {
      setResending(true);

      const { account } = createBrowserClient();

      await account.createEmailVerification({
        url: `${window.location.origin}/verify`,
      });

      alert("Verification email sent. Check your inbox.");
    } catch (err) {
      console.error(err);
      alert("Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  // VERIFYING STATE
  if (status === "verifying") {
    return <p>Verifying your email...</p>;
  }

  if (status === "success") {
    return (
      <p className="text-green-600">
        Email verified successfully! Redirecting...
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <p className="text-red-600">Verification failed.</p>

        <button onClick={resendEmail} disabled={resending} className="btn">
          {resending ? "Sending..." : "Resend verification email"}
        </button>
      </div>
    );
  }

  // DEFAULT VERIFY PAGE
  return (
    <div className="space-y-4">
      <p>Please check your email and click the verification link.</p>

      <button onClick={resendEmail} disabled={resending} className="btn">
        {resending ? "Sending..." : "Resend verification email"}
      </button>
    </div>
  );
}
