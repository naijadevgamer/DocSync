import { AppointmentForm } from "@/components/forms/AppointmentForm";
import FullLogo from "@/components/utils/FullLogo";
import { getPatient } from "@/lib/appwrite/actions/patient.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Patient } from "../../../../types/appwrite.types";
import { requireOwnership } from "@/lib/appwrite/auth/guards";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";
import { ErrorCode } from "@/lib/errors";
import { createMetadata } from "@/lib/utils/metadata";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: SearchParamProps): Promise<Metadata> {
  const { userId } = await params;

  const patientResult = await unwrapAction(() => getPatient(userId), {
    onError: {
      [ErrorCode.NOT_FOUND]: "ignore",
    },
    defaultValue: null,
  });

  return createMetadata({
    title: patientResult?.patient?.name
      ? `Book Appointment - ${patientResult.patient.name}`
      : "Book Appointment",

    description: "Schedule a healthcare appointment with DocSync.",

    noIndex: true,
  });
}

export default async function Appointment({ params }: SearchParamProps) {
  const { userId } = await params;

  const [authorizedUser, patientResult] = await Promise.all([
    requireOwnership(userId),
    unwrapAction(() => getPatient(userId), {
      onError: {
        [ErrorCode.NOT_FOUND]: "redirect",
      },
      redirectTo: `/patients/${userId}/personal-info`,
    }),
  ]);

  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <div className="mb-12">
            <FullLogo />
          </div>

          <AppointmentForm
            patient={patientResult.patient}
            userId={authorizedUser.$id}
            userName={authorizedUser.name}
            type="create"
          />

          <p className="copyright py-12">
            © {new Date().getFullYear()} DocSync
          </p>
        </div>
      </section>

      <div className="side-img relative h-full w-97.5">
        <Image
          src="/assets/images/appointment-img.png"
          alt="patient"
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          className="bg-bottom object-cover"
          priority
        />
      </div>
    </div>
  );
}
