import VerifyForm from "@/components/forms/VerifyForm";
import { Suspense } from "react";

export default function VerifyPage() {
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
