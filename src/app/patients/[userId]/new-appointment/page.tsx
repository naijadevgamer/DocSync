import { AppointmentForm } from "@/components/forms/AppointmentForm";
import RegisterForm from "@/components/forms/RegisterForm";
import FullLogo from "@/components/FullLogo";
import { getPatient, getUserById } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Appointment({ params }: SearchParamProps) {
  const { userId } = await params;
  let patient;

  try {
    patient = await getPatient(userId);
    console.log("Patient is what: ", patient);
  } catch (err: any) {
    console.error("Error fetching user:", err);
    throw err; // Let Next.js handle the error and show the error page
  }

  if (!patient) notFound(); // must be outside the try/catch

  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <div className="mb-12">
            <FullLogo />
          </div>

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
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
