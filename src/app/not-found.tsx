import { Button } from "@/components/ui/button";
import FullLogo from "@/components/utils/FullLogo";
import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-dark-200 flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <FullLogo />
        </div>

        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[120px] font-bold text-green-500/10 select-none lg:text-[180px]">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className="h-24 w-24 text-green-500/30 lg:h-32 lg:w-32" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-32-bold lg:text-36-bold mb-4 text-white">
          Page Not Found
        </h1>
        <p className="text-dark-600 mx-auto mb-8 max-w-md text-lg">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/">
            <Button className="shad-primary-btn px-8 py-6">
              {/* <Home className="mr-2 h-5 w-5" /> */}
              Go Home
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-12-regular border-dark-500 text-dark-600 mt-12 border-t pt-6">
          © {new Date().getFullYear()} DocSync. All rights reserved.
        </p>
      </div>
    </div>
  );
}
