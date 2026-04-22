import { AppointmentForm } from "@/components/forms/AppointmentForm";
import FullLogo from "@/components/FullLogo";
import { getAuthorizedUser } from "@/lib/actions/auth.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import { toast } from "sonner";

export default async function Appointment({ params }: SearchParamProps) {
  const { userId } = await params;

  const user = await getAuthorizedUser(userId);
  const patientResult = await getPatient(user.$id);

  if (!patientResult.success) {
    console.error(
      "Error fetching patient:",
      patientResult.error?.details || patientResult.error,
    );

    if (patientResult.error?.code === "404") notFound();

    toast.error(patientResult.error?.message || "Failed to fetch patient data");
  }

  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <div className="mb-12">
            <FullLogo />
          </div>

          <AppointmentForm
            patientId={patientResult.data?.patient?.$id || ""}
            userId={user.$id}
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
        />
      </div>
    </div>
  );
}
