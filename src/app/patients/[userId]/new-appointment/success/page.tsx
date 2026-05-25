import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import FullLogo from "@/components/utils/FullLogo";
import { getAppointmentById } from "@/lib/appwrite/actions/appointment.action";
import { requireOwnership } from "@/lib/appwrite/auth/guards";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";
import { Doctors } from "@/lib/constants";
import { ErrorCode } from "@/lib/errors";
import { formatDateTime } from "@/lib/utils/utils";

export default async function RequestSuccess({
  params,
  searchParams,
}: SearchParamProps) {
  const [{ userId }, { appointmentId }] = await Promise.all([
    params,
    searchParams,
  ]);

  const [authorizedUser, appointmentResult] = await Promise.all([
    requireOwnership(userId),
    unwrapAction(() => getAppointmentById(appointmentId as string), {
      onError: {
        [ErrorCode.NOT_FOUND]: "notFound",
      },
    }),
  ]);

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointmentResult.appointment?.primaryPhysician,
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
            priority
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
              {
                formatDateTime(
                  appointmentResult.appointment?.schedule || new Date(),
                ).dateTime
              }
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <Button className="shad-primary-btn" asChild>
            <Link href={`/patients/${authorizedUser.$id}/new-appointment`}>
              New Appointment
            </Link>
          </Button>

          <Button
            variant="outline"
            className="border-dark-500 hover:bg-dark-500"
            asChild
          >
            <Link href={`/patients/${authorizedUser.$id}/dashboard`}>
              Dashboard
            </Link>
          </Button>
        </div>

        <p className="copyright">© {new Date().getFullYear()} DocSync</p>
      </div>
    </div>
  );
}
