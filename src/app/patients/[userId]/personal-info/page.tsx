import PatientForm from "@/components/forms/PatientInfoForm";
import FullLogo from "@/components/utils/FullLogo";
import { getPatient } from "@/lib/appwrite/actions/patient.actions";
import { requireOwnership } from "@/lib/appwrite/auth/guards";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";
import { createMetadata } from "@/lib/utils/metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Complete Your Profile",
  description: "Provide your personal and medical information to continue.",
  noIndex: true,
});

export default async function PersonalInfo({ params }: SearchParamProps) {
  const { userId } = await params;

  const [user, getPatientResult] = await Promise.all([
    requireOwnership(userId),
    unwrapAction(() => getPatient(userId)),
  ]);

  if (getPatientResult.patient)
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <FullLogo />
          </div>
          <div className="bg-dark-400 border-dark-500 rounded-2xl border p-8 text-center shadow-xl">
            <h1 className="text-24-bold mb-2 text-white">
              Profile Already Completed
            </h1>
            <p className="text-dark-600 mb-8">
              It looks like you've already completed your profile. You can
              access your dashboard to view appointments and manage your
              information.
            </p>
            <Link
              href={`/patients/${userId}/dashboard`}
              className="shad-primary-btn inline-block w-full rounded-lg px-6 py-3 text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <div className="mb-12">
            <Link href="/">
              <FullLogo />
            </Link>
          </div>

          <PatientForm user={user} />

          <p className="copyright py-12">
            © {new Date().getFullYear()} DocSync
          </p>
        </div>
      </section>

      <div className="side-img relative h-full w-[30%]">
        <Image
          src="/assets/images/register-img.png"
          alt="patient"
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
