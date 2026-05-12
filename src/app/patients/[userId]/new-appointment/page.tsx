import { AppointmentForm } from "@/components/forms/AppointmentForm";
import FullLogo from "@/components/utils/FullLogo";
import { getAuthorizedUser } from "@/lib/actions/auth.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Patient } from "../../../../../types/appwrite.types";

export default async function Appointment({ params }: SearchParamProps) {
  const { userId } = await params;

  const [userResult, patientResult] = await Promise.allSettled([
    getAuthorizedUser(userId),
    getPatient(userId),
  ]);

  if (userResult.status === "rejected") {
    // console.error("Error fetching user:", userResult.reason);
    notFound();
  }

  const user = userResult.value;

  if (patientResult.status === "rejected") {
    // console.error(
    //   "Error fetching patient:",
    //   patientResult.reason?.details || patientResult.reason,
    // );

    if (patientResult.reason?.code === "404") notFound();

    throw new Error(
      patientResult.reason?.message || "Failed to fetch patient data",
    );
  }

  const patientResponse = patientResult.value;

  if (!patientResponse.success) {
    // console.error(
    //   "Error fetching patient:",
    //   patientResponse.error?.details || patientResponse.error,
    // );

    if (patientResponse.error?.code === "404") notFound();

    throw new Error(
      patientResponse.error?.message || "Failed to fetch patient data",
    );
  }

  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <div className="mb-12">
            <FullLogo />
          </div>

          <AppointmentForm
            patient={patientResponse.data?.patient as Patient}
            userId={user.$id}
            userName={user.name}
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
