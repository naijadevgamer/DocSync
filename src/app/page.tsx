import PatientForm from "@/components/forms/PatientForm";
import FullLogo from "@/components/FullLogo";
import PassKeyModal from "@/components/PassKeyModal";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage({ searchParams }: SearchParamProps) {
  const { admin } = await searchParams;
  const isAdmin = admin === "true";

  return (
    <div className="flex h-screen">
      {isAdmin && <PassKeyModal />}

      <section className="remove-scrollbar container">
        <div className="sub-container max-w-124">
          <div className="mb-12">
            <FullLogo />
          </div>

          <PatientForm />

          <div className="text-14-regular flex justify-between py-12">
            <p className="text-dark-600 justify-items-end xl:text-left">
              © {new Date().getFullYear()} DocSync
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <div className="side-img relative h-full w-[50%]">
        <Image
          src="/assets/images/onboarding-img.png"
          alt="patient"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
