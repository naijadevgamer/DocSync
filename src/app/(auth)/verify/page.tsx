import VerifyForm from "@/components/forms/VerifyForm";
import { verifyEmail } from "@/lib/actions/auth.actions";
import Link from "next/link";
import { Suspense } from "react";

export default async function VerifyPage() {
  // Check verification status
  const { isVerified } = await verifyEmail();

  if (isVerified) {
    // Already verified - show appropriate message
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-green-600">
          Email Already Verified
        </h1>
        <p className="mb-6 text-gray-600">
          Your email has already been verified. You can now access all features.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-10">
      <h1 className="header mb-4">Verify Your Email</h1>
      <p className="text-dark-700 mb-8">
        We've sent a verification link to your email. Please check your inbox.
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
