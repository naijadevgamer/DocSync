import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";

function HomePage() {
  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-124">
          <Image
            src="/assets/icons/logo-full.svg"
            height={38}
            width={164}
            alt="Docsync Logo"
            className="mb-12 h-10 w-fit"
          />

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between pb-10">
            <p className="text-dark-600 justify-items-end xl:text-left">
              © {new Date().getFullYear()} CarePluse
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

export default HomePage;
