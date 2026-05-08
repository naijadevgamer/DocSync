import LoginForm from "@/components/forms/LoginForm";
import FullLogo from "@/components/FullLogo";
import Image from "next/image";
import Link from "next/link";

export default async function LoginPage({ searchParams }: SearchParamProps) {
  const { admin, callbackUrl } = await searchParams;
  const isAdminFlow = admin === "true";
  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-124">
          <div className="mb-12">
            <FullLogo />
          </div>

          <LoginForm
            isAdminFlow={isAdminFlow}
            callbackUrl={callbackUrl as string}
          />

          <div className="text-14-regular flex justify-between py-12">
            <p className="text-dark-600 justify-items-end xl:text-left">
              © {new Date().getFullYear()} DocSync
            </p>
            <Link
              href="/login?admin=true"
              className="text-green-500 transition-colors hover:text-green-400"
            >
              Admin
            </Link>
          </div>
        </div>
      </section>

      <div className="side-img relative h-full w-[50%]">
        <Image
          src="/assets/images/onboarding-img.png"
          alt="Healthcare professionals"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="from-dark-300/80 absolute inset-0 bg-linear-to-t to-transparent" />
        <div className="absolute right-12 bottom-12 left-12">
          <blockquote className="space-y-2">
            <q className="text-18-bold block text-white">
              DocSync has transformed how we manage patient care. The efficiency
              gains are remarkable.
            </q>

            <footer className="text-14-regular text-dark-700">
              — Dr. Sarah Johnson, Medical Director
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
