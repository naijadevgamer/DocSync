import Image from "next/image";
import Link from "next/link";

import FullLogo from "@/components/utils/FullLogo";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointmentById } from "@/lib/actions/appointment.action";
import { formatDateTime } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getAuthorizedUser } from "@/lib/actions/auth.actions";
import { toast } from "sonner";

export default async function RequestSuccess({
  params,
  searchParams,
}: SearchParamProps) {
  const { userId } = await params;

  const { appointmentId } = await searchParams;

  if (!appointmentId || Array.isArray(appointmentId)) {
    throw new Error("Invalid appointment ID");
  }

  const user = await getAuthorizedUser(userId);

  // console.log("Appointment ID from search params:", appointmentId);
  const result = await getAppointmentById(appointmentId);

  if (!result.success) {
    console.error(result.error?.details || result.error);
    if (result.error?.code === "404") notFound();

    toast.error(result.error?.message || "Something went wrong");
  }

  const doctor = Doctors.find(
    (doctor) => doctor.name === result.data?.appointment?.primaryPhysician,
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <FullLogo />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-150 text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={50}
              height={50}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>
              {" "}
              {
                formatDateTime(result.data?.appointment?.schedule || new Date())
                  .dateTime
              }
            </p>
          </div>
        </section>

        <Button className="shad-primary-btn" asChild>
          <Link href={`/patients/${user.$id}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright">© {new Date().getFullYear()} DocSync</p>
      </div>
    </div>
  );
}
