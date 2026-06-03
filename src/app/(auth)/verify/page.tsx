import VerifyForm from "@/components/forms/VerifyForm";
import FullLogo from "@/components/utils/FullLogo";
import { verifyEmail } from "@/lib/appwrite/actions/auth.actions";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";
import { createMetadata } from "@/lib/utils/metadata";
import { CheckCircle2, Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata({
  searchParams,
}: SearchParamProps): Promise<Metadata> {
  const { email } = await searchParams;

  return createMetadata({
    title: "Verify Email",
    description: email
      ? `Verify the email address ${email} for your DocSync account.`
      : "Verify your DocSync email address.",
    noIndex: true,
  });
}

export default async function VerifyPage({ searchParams }: SearchParamProps) {
  const [{ email }, result] = await Promise.all([
    searchParams,
    unwrapAction(verifyEmail, {
      onError: {
        AUTH_REQUIRED: "ignore",
      },
    }),
  ]);

  const isVerified = result?.isVerified;

  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <FullLogo />
          </div>

          <div className="bg-dark-400 border-dark-500 rounded-2xl border p-8 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-24-bold mb-2 text-white">Email Verified!</h1>
            <p className="text-dark-600 mb-8">
              Your email has been successfully verified. You can now access all
              features.
            </p>
            <Link
              href="/login"
              className="shad-primary-btn inline-block w-full rounded-lg px-6 py-3 text-center"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Left Side - Verification Form */}
      <section className="remove-scrollbar container mx-auto flex items-center">
        <div className="sub-container min-h-screen max-w-2xl">
          <div className="mx-auto mb-12">
            <Link href="/">
              <FullLogo />
            </Link>
          </div>

          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Mail className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="header text-center">Verify your email</h1>
            <p className="text-dark-600 mt-2 text-center">
              We've sent a verification link to{" "}
              <span className="font-medium text-white">
                {email || "your email address"}
              </span>
            </p>
          </div>

          <Suspense fallback={<VerifySkeleton />}>
            <VerifyForm />
          </Suspense>

          <div className="mt-auto text-center">
            <p className="text-14-regular text-dark-600">
              © {new Date().getFullYear()} DocSync
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function VerifySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-dark-400 h-10 rounded-lg"></div>
      <div className="bg-dark-400 h-10 rounded-lg"></div>
    </div>
  );
}
